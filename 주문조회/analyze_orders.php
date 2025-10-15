<?php

declare(strict_types=1);

date_default_timezone_set('Asia/Seoul');

const TOKEN_URL  = 'https://api.commerce.naver.com/external/v1/oauth2/token';
const ORDERS_URL = 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders';
const RANGE_TYPE = 'PAYED_DATETIME';

const CLIENT_ID     = '23laTILmdv5p5VvQU65SXm';
const CLIENT_SECRET = '$2a$04$KLzHaPaO0d6xn2FM0P5tGO';

if (!function_exists('httpPostForm')) {
function httpPostForm(string $url, array $data): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json',
        ],
        CURLOPT_POSTFIELDS     => http_build_query($data, '', '&'),
        CURLOPT_TIMEOUT        => 30,
    ]);

    $body = curl_exec($ch);
    if ($body === false) {
        $err = curl_error($ch);
        curl_close($ch);
        throw new RuntimeException('HTTP POST failed: ' . $err);
    }
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    $decoded = json_decode($body, true);
    if ($status >= 400) {
        $message = is_array($decoded) ? json_encode($decoded, JSON_UNESCAPED_UNICODE) : $body;
        throw new RuntimeException('HTTP ' . $status . ': ' . $message);
    }

    return $decoded ?: [];
}
}

if (!function_exists('httpGetJson')) {
function httpGetJson(string $url, array $headers = []): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_TIMEOUT        => 30,
    ]);

    $body = curl_exec($ch);
    if ($body === false) {
        $err = curl_error($ch);
        curl_close($ch);
        throw new RuntimeException('HTTP GET failed: ' . $err);
    }
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    $decoded = json_decode($body, true);
    if ($status >= 400) {
        $message = is_array($decoded) ? json_encode($decoded, JSON_UNESCAPED_UNICODE) : $body;
        throw new RuntimeException('HTTP ' . $status . ': ' . $message);
    }

    return $decoded ?: [];
}
}

if (!function_exists('generateSignature')) {
function generateSignature(string $clientId, string $clientSecret, int $timestampMs): string
{
    $password = $clientId . '_' . $timestampMs;
    $hashed = crypt($password, $clientSecret);

    if ($hashed === false || $hashed === '') {
        throw new RuntimeException('Failed to generate signature.');
    }

    return base64_encode($hashed);
}
}

function requestAccessToken(): string
{
    $timestamp = (int) floor(microtime(true) * 1000);
    $payload = [
        'client_id'         => CLIENT_ID,
        'timestamp'         => (string) $timestamp,
        'grant_type'        => 'client_credentials',
        'client_secret_sign'=> generateSignature(CLIENT_ID, CLIENT_SECRET, $timestamp),
        'type'              => 'SELF',
    ];

    $response = httpPostForm(TOKEN_URL, $payload);
    if (empty($response['access_token'])) {
        throw new RuntimeException('Token response missing access_token.');
    }

    return $response['access_token'];
}

function fetchDay(string $accessToken, DateTimeImmutable $date): array
{
    $fromIso = $date->format('Y-m-d') . 'T00:00:00.000+09:00';
    $toIso   = $date->format('Y-m-d') . 'T23:59:59.999+09:00';

    $query = http_build_query([
        'from'      => $fromIso,
        'to'        => $toIso,
        'rangeType' => RANGE_TYPE,
        'size'      => 300,
    ]);

    $attempts = 0;
    $maxAttempts = 5;
    $backoffSeconds = 2;

    while (true) {
        try {
            $response = httpGetJson(
                ORDERS_URL . '?' . $query,
                ['Authorization: Bearer ' . $accessToken]
            );
            return $response['data']['contents'] ?? [];
        } catch (RuntimeException $e) {
            $attempts++;
            $message = $e->getMessage();
            $isRateLimit = str_contains($message, 'HTTP 429') || str_contains($message, 'GW.RATE_LIMIT');

            if ($isRateLimit && $attempts < $maxAttempts) {
                sleep($backoffSeconds);
                $backoffSeconds *= 2;
                continue;
            }

            throw $e;
        }
    }
}

function parseOptionString(?string $option): array
{
    if ($option === null) {
        return [];
    }

    $segments = preg_split('/\s+\/\s+/u', trim($option)) ?: [];
    $result = [];

    foreach ($segments as $segment) {
        if ($segment === '') {
            continue;
        }

        $pos = strrpos($segment, ':');
        if ($pos !== false) {
            $label = trim(substr($segment, 0, $pos));
            $value = trim(substr($segment, $pos + 1));
            if ($label !== '') {
                $result[$label] = $value;
                continue;
            }
        }

        $result[$segment] = '';
    }

    return $result;
}

function fetchOrders(DateTimeImmutable $from, DateTimeImmutable $to): array
{
    $orders = [];
    $token = requestAccessToken();

    for ($cursor = $from; $cursor <= $to; $cursor = $cursor->modify('+1 day')) {
        $dayContents = fetchDay($token, $cursor);
        foreach ($dayContents as $entry) {
            $orders[] = $entry;
        }
    }

    return $orders;
}

if ($argc < 3) {
    fwrite(STDERR, "Usage: php analyze_orders.php FROM(YYYY-MM-DD) TO(YYYY-MM-DD)\n");
    exit(1);
}

$from = DateTimeImmutable::createFromFormat('Y-m-d', $argv[1], new DateTimeZone('Asia/Seoul'));
$to   = DateTimeImmutable::createFromFormat('Y-m-d', $argv[2], new DateTimeZone('Asia/Seoul'));

if (!$from || !$to) {
    fwrite(STDERR, "Invalid date format. Use YYYY-MM-DD.\n");
    exit(1);
}

if ($to < $from) {
    fwrite(STDERR, "TO date must not be earlier than FROM date.\n");
    exit(1);
}

$orders = fetchOrders($from, $to);

$summary = [];
foreach ($orders as $entry) {
    $content = $entry['content'] ?? [];
    $order   = $content['order'] ?? [];
    $product = $content['productOrder'] ?? [];

    $optionRaw = $product['productOption'] ?? '';
    $parsedOption = parseOptionString($optionRaw);

    $productId   = $product['productId'] ?? '';
    $productName = $product['productName'] ?? '';
    $optionCode  = $product['optionCode'] ?? '';

    ksort($parsedOption);
    $optionSignature = json_encode($parsedOption, JSON_UNESCAPED_UNICODE);

    $key = implode(' | ', [
        (string)$productId,
        (string)$productName,
        (string)$optionCode,
        $optionSignature,
    ]);

    if (!isset($summary[$key])) {
        $summary[$key] = [
            'productId'   => $productId,
            'productName' => $productName,
            'optionCode'  => $optionCode,
            'parsedOption'=> $parsedOption,
            'optionRaw'   => $optionRaw,
            'count'       => 0,
        ];
    }

    $summary[$key]['count']++;
}

usort($summary, static function (array $a, array $b): int {
    return $b['count'] <=> $a['count'];
});

foreach ($summary as $row) {
    echo 'COUNT: ' . $row['count'] . PHP_EOL;
    echo 'productId: ' . $row['productId'] . PHP_EOL;
    echo 'productName: ' . $row['productName'] . PHP_EOL;
    echo 'optionCode: ' . $row['optionCode'] . PHP_EOL;
    echo 'parsedOption: ' . json_encode($row['parsedOption'], JSON_UNESCAPED_UNICODE) . PHP_EOL;
    echo 'optionRaw: ' . $row['optionRaw'] . PHP_EOL;
    echo str_repeat('-', 60) . PHP_EOL;
}
