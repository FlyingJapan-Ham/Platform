<?php
declare(strict_types=1);

/**
 * Simple HTML report page for Naver Commerce orders of the current day.
 * - When executed via PHP, it renders an HTML table in the response.
 * - It also saves the exact HTML markup to orders_result.html for static viewing.
 */

if (!extension_loaded('curl')) {
    http_response_code(500);
    echo 'cURL extension is required.';
    exit;
}

// When running via a web server, ensure browsers render this page instead of downloading it.
if (PHP_SAPI !== 'cli') {
    header('Content-Type: text/html; charset=UTF-8');
    header('Content-Disposition: inline; filename="orders_today.html"');
    header('X-Content-Type-Options: nosniff');
}

date_default_timezone_set('Asia/Seoul');

const TOKEN_URL  = 'https://api.commerce.naver.com/external/v1/oauth2/token';
const ORDERS_URL = 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders';
const OUTPUT_HTML_FILE = __DIR__ . '/orders_result.html';

const OPTION_COLUMN_CONFIG = [
    [
        'title'    => '출국일/시간 렌탈 (체크박스)',
        'keys'     => ['출국일/시간', '대여시작일/시간', '대여일/시간', '대여일', '출국일'],
        'checkbox' => true,
    ],
    [
        'title'    => '귀국일/시간',
        'keys'     => ['귀국일/시간', '반납일/시간', '반납일', '귀국일'],
        'checkbox' => false,
    ],
    [
        'title'    => '반납일 (체크박스)',
        'keys'     => ['반납일/시간', '귀국일/시간'],
        'checkbox' => true,
    ],
    [
        'title'    => '파손 확인 (체크박스)',
        'keys'     => [],
        'checkbox' => true,
    ],
    [
        'title'    => '상세페이지 내용확인/약관 동의',
        'keys'     => ['상세페이지 내용확인/약관 동의', '상세페이지 내용확인/약관동의', '상세페이지 내용확인', '약관동의'],
        'checkbox' => false,
    ],
    [
        'title'    => '상품선택',
        'keys'     => ['상품선택', '상품 선택'],
        'checkbox' => false,
    ],
];

const CATEGORY_COLUMN_CONFIG = [
    '마리오파워업밴드'       => ['마리오파워업밴드', '마리오 파워업밴드', '마리오파워업댄드'],
    '해리포터지팡이'         => ['해리포터', '지팡이'],
    '다이슨-1) 에어랩'        => [],
    '다이슨-2) 슈퍼소닉뉴럴샤인 드라이기' => [],
    '다이슨-3) 슈퍼소닉r 드라이기'      => [],
    '다이슨-4) 에어스트레이트 고데기'   => [],
    '트라이크'             => ['트라이크'],
    '라파'                 => ['라파', '라운지 키', '라운지키'],
];

const CLIENT_ID     = '23laTILmdv5p5VvQU65SXm';
const CLIENT_SECRET = '$2a$04$KLzHaPaO0d6xn2FM0P5tGO';
const RANGE_TYPE    = 'PAYED_DATETIME';

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

    return is_array($decoded) ? $decoded : [];
}

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

    return is_array($decoded) ? $decoded : [];
}

function generateSignature(string $clientId, string $clientSecret, int $timestampMs): string
{
    $password = $clientId . '_' . $timestampMs;
    $hashed = crypt($password, $clientSecret);

    if ($hashed === false || $hashed === '') {
        throw new RuntimeException('Failed to generate bcrypt signature.');
    }

    return base64_encode($hashed);
}

function requestAccessToken(string $clientId, string $clientSecret): string
{
    $timestamp = (int) floor(microtime(true) * 1000);
    $signature = generateSignature($clientId, $clientSecret, $timestamp);

    $payload = [
        'client_id'         => $clientId,
        'timestamp'         => (string) $timestamp,
        'grant_type'        => 'client_credentials',
        'client_secret_sign'=> $signature,
        'type'              => 'SELF',
    ];

    $response = httpPostForm(TOKEN_URL, $payload);
    if (empty($response['access_token'])) {
        throw new RuntimeException('Token response missing access_token.');
    }

    return $response['access_token'];
}

function fetchOrdersForRange(string $accessToken, string $fromIso, string $toIso): array
{
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

            if (!isset($response['data']['contents']) || !is_array($response['data']['contents'])) {
                return [];
            }

            return $response['data']['contents'];
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

function mapOrderRow(array $entry): array
{
    $order      = $entry['content']['order'] ?? [];
    $product    = $entry['content']['productOrder'] ?? [];
    $delivery   = $entry['content']['delivery'] ?? [];
    $optionRaw  = $product['productOption'] ?? '';
    $optionParsed = parseProductOption($optionRaw);

    $optionColumns = [];
    foreach (OPTION_COLUMN_CONFIG as $config) {
        $value = '';
        foreach ($config['keys'] as $key) {
            $normalizedKey = normalizeOptionLabel($key);
            if ($normalizedKey !== '' && isset($optionParsed['by_label'][$normalizedKey])) {
                $value = $optionParsed['by_label'][$normalizedKey];
                break;
            }
        }
        $optionColumns[$config['title']] = $value;
    }

    $optionFields = [
        'departure'          => $optionColumns['출국일/시간 렌탈 (체크박스)'] ?? '',
        'return'             => $optionColumns['귀국일/시간'] ?? '',
        'returnCheckbox'     => $optionColumns['반납일 (체크박스)'] ?? '',
        'damageCheckbox'     => $optionColumns['파손 확인 (체크박스)'] ?? '',
        'detailConfirmation' => $optionColumns['상세페이지 내용확인/약관 동의'] ?? '',
        'productChoice'      => $optionColumns['상품선택'] ?? '',
    ];

    $categoryColumns = computeCategoryColumns(
        $product,
        $optionFields,
        $optionParsed['display'],
        (int)($product['quantity'] ?? 0)
    );


    return [
        'productOrderId' => $product['productOrderId'] ?? $entry['productOrderId'] ?? '',
        'productId'      => (string)($product['productId'] ?? ''),
        'orderId'        => $order['orderId'] ?? '',
        'buyer'          => $order['ordererName'] ?? '',
        'buyerId'        => (string)($order['ordererId'] ?? ''),
        'buyerNo'        => (string)($order['ordererNo'] ?? ''),
        'buyerTel'       => $order['ordererTel'] ?? '',
        'productName'    => $product['productName'] ?? '',
        'productOption'  => $optionRaw,
        'optionColumns'  => $optionColumns,
        'optionDetails'  => $optionParsed['display'],
        'optionFields'   => $optionFields,
        'categoryColumns'=> $categoryColumns,
        'mallId'         => $product['mallId'] ?? '',
        'status'         => $product['productOrderStatus'] ?? '',
        'quantity'       => $product['quantity'] ?? 0,
        'amount'         => $product['totalPaymentAmount'] ?? 0,
        'paymentDate'    => $order['paymentDate'] ?? '',
        'paymentDateRaw' => $order['paymentDate'] ?? '',
        'deliveredDate'  => $delivery['deliveredDate'] ?? '',
    ];
}

function formatDate(?string $iso): string
{
    if (!$iso) {
        return '';
    }
    try {
        return (new DateTime($iso))->format('Y-m-d H:i');
    } catch (Exception $e) {
        return $iso;
    }
}

function normalizeOptionLabel(string $label): string
{
    $stripped = preg_replace('/\s*\(.*?\)/u', '', $label);
    if (is_string($stripped)) {
        $label = $stripped;
    }

    return trim($label);
}

/**
 * Parse option string such as "라벨: 값 / 라벨2: 값2" into structures for display and lookup.
 * @return array{
 *     display: array<string,string>,
 *     by_label: array<string,string>
 * }
 */
function parseProductOption(?string $option): array
{
    if ($option === null) {
        return ['display' => [], 'by_label' => []];
    }

    $segments = preg_split('/\s+\/\s+/u', trim($option)) ?: [];
    $display = [];
    $byLabel = [];

    foreach ($segments as $segment) {
        if ($segment === '') {
            continue;
        }

        $pos = strrpos($segment, ':');
        if ($pos !== false) {
            $label = trim(substr($segment, 0, $pos));
            $value = trim(substr($segment, $pos + 1));
            if ($label !== '') {
                $display[$label] = $value;
                $normalized = normalizeOptionLabel($label);
                if ($normalized !== '') {
                    $byLabel[$normalized] = $value;
                    $withoutSpaces = preg_replace('/\s+/u', '', $normalized);
                    if (is_string($withoutSpaces) && $withoutSpaces !== '') {
                        $byLabel[$withoutSpaces] = $value;
                    }
                }
                continue;
            }
        }

        $display[$segment] = '';
    }

    return ['display' => $display, 'by_label' => $byLabel];
}

function shouldExcludeStatus(string $status): bool
{
    if ($status === '') {
        return false;
    }

    $statusUpper = strtoupper($status);
    return str_contains($statusUpper, 'CANCEL') || str_contains($statusUpper, 'RETURN');
}

/**
 * @param array<string,mixed> $product
 * @param array<string,string> $optionFields
 * @param array<string,string> $optionDisplay
 * @return array<string,string>
 */
function computeCategoryColumns(array $product, array $optionFields, array $optionDisplay, int $quantity): array
{
    $productId = (string)($product['productId'] ?? '');
    $productName = (string)($product['productName'] ?? '');
    $productNameLower = mb_strtolower($productName, 'UTF-8');
    $normalizedChoice = mb_strtolower($optionFields['productChoice'] ?? '', 'UTF-8');
    $result = array_fill_keys(array_keys(CATEGORY_COLUMN_CONFIG), '');
    $qtyValue = $quantity > 0 ? (string)$quantity : '1';

    $set = static function (&$result, string $key, string $value) {
        if ($value === '') {
            return;
        }
        if (isset($result[$key]) && $result[$key] === '') {
            $result[$key] = $value;
        }
    };

    if ($productId === '12325205237') { // 해리포터 & 마리오 콤보
        if ($normalizedChoice !== '') {
            if (mb_strpos($normalizedChoice, '마리오') !== false) {
                $set($result, '마리오파워업밴드', $qtyValue);
            }
            if (mb_strpos($normalizedChoice, '해리포터') !== false || mb_strpos($normalizedChoice, '지팡이') !== false) {
                $set($result, '해리포터지팡이', $qtyValue);
            }
        } else {
            if (mb_strpos($productNameLower, '마리오') !== false) {
                $set($result, '마리오파워업밴드', $qtyValue);
            }
            if (mb_strpos($productNameLower, '해리포터') !== false || mb_strpos($productNameLower, '지팡이') !== false) {
                $set($result, '해리포터지팡이', $qtyValue);
            }
        }
    } elseif ($productId === '12418009319') { // 다이슨 제품군
        $dysonItem = '';
        foreach ($optionDisplay as $label => $value) {
            if (mb_strpos($label, '다이슨 대여품목') !== false) {
                $dysonItem = mb_strtolower($value, 'UTF-8');
                break;
            }
        }

        if ($dysonItem !== '') {
            if (str_contains($dysonItem, '1)') && mb_strpos($dysonItem, '에어랩') !== false) {
                $set($result, '다이슨-1) 에어랩', $qtyValue);
            }
            if (str_contains($dysonItem, '2)') && (mb_strpos($dysonItem, '슈퍼소닉') !== false || mb_strpos($dysonItem, '드라이기') !== false)) {
                $set($result, '다이슨-2) 슈퍼소닉뉴럴샤인 드라이기', $qtyValue);
            }
            if (str_contains($dysonItem, '3)') && (mb_strpos($dysonItem, '슈퍼소닉') !== false || mb_strpos($dysonItem, '드라이기') !== false)) {
                $set($result, '다이슨-3) 슈퍼소닉r 드라이기', $qtyValue);
            }
            if (str_contains($dysonItem, '4)') && (mb_strpos($dysonItem, '에어스트레이트') !== false || mb_strpos($dysonItem, '고데기') !== false)) {
                $set($result, '다이슨-4) 에어스트레이트 고데기', $qtyValue);
            }
        }
    } elseif ($productId === '12418025840') { // 트라이크
        $set($result, '트라이크', $qtyValue);
    } else {
        $haystack = mb_strtolower($productName . ' ' . $normalizedChoice, 'UTF-8');
        foreach (CATEGORY_COLUMN_CONFIG as $title => $keywords) {
            foreach ($keywords as $keyword) {
                if ($keyword === '') {
                    continue;
                }
                $keywordLower = mb_strtolower($keyword, 'UTF-8');
                if ($keywordLower !== '' && mb_strpos($haystack, $keywordLower) !== false) {
                    $set($result, $title, $qtyValue);
                }
            }
        }

        if (($result['마리오파워업밴드'] ?? '') === '' && mb_strpos($haystack, '파워업밴드') !== false) {
            $set($result, '마리오파워업밴드', $qtyValue);
        }

        if (($result['해리포터지팡이'] ?? '') === '' && (mb_strpos($haystack, '해리포터지팡이') !== false || mb_strpos($haystack, '해리포터 지팡이') !== false || mb_strpos($haystack, '지팡이') !== false)) {
            $set($result, '해리포터지팡이', $qtyValue);
        }
    }

    return $result;
}

$timeZone = new DateTimeZone('Asia/Seoul');
$today = new DateTime('now', $timeZone);

$cliArgs = [];
if (PHP_SAPI === 'cli' && isset($_SERVER['argv'])) {
    foreach (array_slice($_SERVER['argv'], 1) as $arg) {
        if (strncmp($arg, '--', 2) === 0) {
            $arg = substr($arg, 2);
        }
        $parts = explode('=', $arg, 2);
        if (count($parts) === 2) {
            $cliArgs[$parts[0]] = $parts[1];
        }
    }
}

$fromParam = $cliArgs['from'] ?? ($_GET['from'] ?? $today->format('Y-m-d'));
$toParam   = $cliArgs['to'] ?? ($_GET['to'] ?? $fromParam);

$fromDate = null;
$toDate   = null;
$error    = null;

try {
    $fromDate = DateTime::createFromFormat('Y-m-d', $fromParam, $timeZone);
    if ($fromDate === false || $fromDate->format('Y-m-d') !== $fromParam) {
        throw new InvalidArgumentException('from 날짜 형식이 잘못되었습니다. (YYYY-MM-DD)');
    }

    $toDate = DateTime::createFromFormat('Y-m-d', $toParam, $timeZone);
    if ($toDate === false || $toDate->format('Y-m-d') !== $toParam) {
        throw new InvalidArgumentException('to 날짜 형식이 잘못되었습니다. (YYYY-MM-DD)');
    }

    if ($toDate < $fromDate) {
        throw new InvalidArgumentException('to 날짜는 from 보다 빠를 수 없습니다.');
    }
} catch (Throwable $dateError) {
    $error = $dateError->getMessage();
}

$orders = [];

if ($error === null) {
    try {
        $token  = requestAccessToken(CLIENT_ID, CLIENT_SECRET);

        for ($cursor = clone $fromDate; $cursor <= $toDate; $cursor->modify('+1 day')) {
            $fromIso = $cursor->format('Y-m-d') . 'T00:00:00.000+09:00';
            $toIso   = $cursor->format('Y-m-d') . 'T23:59:59.999+09:00';
        $raw     = fetchOrdersForRange($token, $fromIso, $toIso);
        foreach ($raw as $entry) {
            $product    = $entry['content']['productOrder'] ?? [];
            $status     = (string)($product['productOrderStatus'] ?? '');
            if (shouldExcludeStatus($status)) {
                continue;
            }

            $mapped = mapOrderRow($entry);
            $mapped['rangeDate'] = $cursor->format('Y-m-d');
            $orders[] = $mapped;
        }
        }
    } catch (Throwable $apiError) {
        $error = $apiError->getMessage();
    }
}

$categoryTitles = array_keys(CATEGORY_COLUMN_CONFIG);

$totalOrderCount = count($orders);
$groupedRows = [];

if ($error === null) {
    $grouped = [];

    foreach ($orders as $row) {
        $buyerName = trim((string)($row['buyer'] ?? ''));
        if ($buyerName === '') {
            $buyerName = '미확인 구매자';
        }

        $buyerId    = trim((string)($row['buyerId'] ?? $row['buyerNo'] ?? ''));
        $productName = trim((string)($row['productName'] ?? ''));
        $orderId   = trim((string)($row['orderId'] ?? ''));
        $paymentRaw = trim((string)($row['paymentDateRaw'] ?? ''));
        $orderRef   = (string)($row['productOrderId'] ?? uniqid('ord_', true));

        $buyerKey = $buyerId !== '' ? $buyerId : $buyerName;
        $timeKey  = $paymentRaw !== '' ? $paymentRaw : ($orderId !== '' ? $orderId : $orderRef);
        $groupKey = $buyerKey . '|' . $timeKey;

        if (!isset($grouped[$groupKey])) {
            $grouped[$groupKey] = [
                'buyer'                  => $buyerName,
                'buyerNames'             => [],
                'buyerIds'               => [],
                'productNames'           => [],
                'orderIds'               => [],
                'productOrderIds'        => [],
                'departures'             => [],
                'departureCheckboxValues'=> [],
                'returns'                => [],
                'returnCheckboxValues'   => [],
                'damageCheckedCount'     => 0,
                'detailConfirmation'     => [],
                'statuses'               => [],
                'paymentDates'           => [],
                'deliveredDates'         => [],
                'amounts'                => [],
                'categories'             => array_fill_keys($categoryTitles, 0),
            ];
        }

        $group = $grouped[$groupKey];

        $amountValue = (int) round((float) ($row['amount'] ?? 0));
        if ($amountValue > 0) {
            $group['amounts'][] = $amountValue;
        }

        $group['buyerNames'][]  = $buyerName;
        $group['buyerIds'][]    = $buyerId;
        $group['productNames'][] = $productName;
        if ($orderId !== '') {
            $group['orderIds'][] = $orderId;
        }
        if ($orderRef !== '') {
            $group['productOrderIds'][] = $orderRef;
        }

        $fields = $row['optionFields'];

        if (($fields['departure'] ?? '') !== '') {
            $group['departures'][] = $fields['departure'];
            $group['departureCheckboxValues'][] = $fields['departure'];
        }

        if (($fields['return'] ?? '') !== '') {
            $group['returns'][] = $fields['return'];
        }

        if (($fields['returnCheckbox'] ?? '') !== '') {
            $group['returnCheckboxValues'][] = $fields['returnCheckbox'];
        }

        if (($fields['damageCheckbox'] ?? '') !== '') {
            $group['damageCheckedCount']++;
        }

        if (($fields['detailConfirmation'] ?? '') !== '') {
            $group['detailConfirmation'][] = $fields['detailConfirmation'];
        }

        $group['statuses'][]       = (string)($row['status'] ?? '');
        $group['paymentDates'][]   = (string)($row['paymentDate'] ?? '');
        $group['deliveredDates'][] = (string)($row['deliveredDate'] ?? '');

        foreach ($categoryTitles as $title) {
            $value = (int)($row['categoryColumns'][$title] ?? 0);
            if ($value > 0) {
                $group['categories'][$title] += $value;
            }
        }

        $grouped[$groupKey] = $group;
    }

    foreach ($grouped as $groupKey => $group) {
        $uniqueDepartures = array_values(array_unique(array_filter($group['departures'], static fn($v) => $v !== '')));
        $uniqueReturn     = array_values(array_unique(array_filter($group['returns'], static fn($v) => $v !== '')));
        $uniqueReturnCheckbox = array_values(array_unique(array_filter($group['returnCheckboxValues'], static fn($v) => $v !== '')));

        $departureDisplay = implode(', ', $uniqueDepartures);
        $departureChecked = !empty($group['departureCheckboxValues']);
        $departureMismatch = count($uniqueDepartures) > 1;

        $returnDisplay = implode(', ', $uniqueReturn);
        $returnChecked = !empty($group['returnCheckboxValues']);
        $returnMismatch = count($uniqueReturn) > 1 || count($uniqueReturnCheckbox) > 1;

        $detailDisplay = implode(', ', array_unique(array_filter($group['detailConfirmation'], static fn($v) => $v !== '')));

        $buyerNameUnique  = array_values(array_unique(array_filter($group['buyerNames'], static fn($v) => $v !== '')));
        $buyerIdUnique    = array_values(array_unique(array_filter($group['buyerIds'], static fn($v) => $v !== '')));
        $productNameUnique = array_values(array_unique(array_filter($group['productNames'], static fn($v) => $v !== '')));

        $buyerNameDisplay = implode(', ', $buyerNameUnique);
        $buyerIdDisplay   = implode(', ', $buyerIdUnique);
        $productNameDisplay = implode("\n", $productNameUnique);
        $buyerNameMismatch = count($buyerNameUnique) > 1;
        $buyerIdMismatch   = count($buyerIdUnique) > 1;
        $productNameMismatch = false;

        $categoriesDisplay = [];
        foreach ($group['categories'] as $title => $value) {
            $categoriesDisplay[$title] = $value > 0 ? (string)$value : '';
        }

        $paymentUnique   = array_values(array_unique(array_filter($group['paymentDates'], static fn($v) => $v !== '')));
        $paymentDisplay  = implode(', ', $paymentUnique);
        $paymentMismatch = count($paymentUnique) > 1;
        $paymentMonthDayValues = [];
        foreach ($paymentUnique as $paymentIso) {
            if ($paymentIso === '') {
                continue;
            }
            try {
                $dt = new DateTime($paymentIso);
                $paymentMonthDayValues[] = $dt->format('m/d');
            } catch (Throwable $e) {
                $paymentMonthDayValues[] = $paymentIso;
            }
        }
        $paymentMonthDayDisplay = implode(', ', array_values(array_unique($paymentMonthDayValues)));

        $orderIdsUnique = array_values(array_unique(array_filter($group['orderIds'], static fn($v) => $v !== '')));
        $productOrderIdsUnique = array_values(array_unique(array_filter($group['productOrderIds'], static fn($v) => $v !== '')));

        $orderCount = count($productOrderIdsUnique);
        if ($orderCount === 0) {
            $orderCount = count($orderIdsUnique);
        }
        if ($orderCount === 0) {
            $orderCount = count($group['amounts']);
        }

        $amountValues = $group['amounts'];
        $amountSum    = array_sum($amountValues);
        $amountDisplay = $amountSum > 0 ? (string) $amountSum : '';

        $groupedRows[] = [
            'groupKey'           => $groupKey,
            'buyer'              => $buyerNameDisplay,
            'buyerId'            => $buyerIdDisplay,
            'productName'        => $productNameDisplay,
            'memoValue'          => '',
            'buyerNameMismatch'  => $buyerNameMismatch,
            'buyerIdMismatch'    => $buyerIdMismatch,
            'productNameMismatch'=> $productNameMismatch,
            'departureDisplay'   => $departureDisplay,
            'departureChecked'   => $departureChecked,
            'departureMismatch'  => $departureMismatch,
            'returnDisplay'      => $returnDisplay,
            'returnChecked'      => $returnChecked,
            'returnMismatch'     => $returnMismatch,
            'damageChecked'      => $group['damageCheckedCount'] > 0,
            'detailConfirmation' => $detailDisplay,
            'categories'         => $categoriesDisplay,
            'statusDisplay'      => implode(', ', array_unique(array_filter($group['statuses'], static fn($v) => $v !== ''))),
            'paymentDisplay'     => $paymentDisplay,
            'paymentMonthDay'    => $paymentMonthDayDisplay,
            'paymentMismatch'    => $paymentMismatch,
            'deliveredDisplay'   => implode(', ', array_unique(array_filter($group['deliveredDates'], static fn($v) => $v !== ''))),
            'amountDisplay'      => $amountDisplay,
            'amountSum'          => $amountSum,
            'orderIds'           => $orderIdsUnique,
            'productOrderIds'    => $productOrderIdsUnique,
        ];
    }

    usort($groupedRows, static function (array $a, array $b): int {
        return strcmp($a['buyer'], $b['buyer']);
    });
}

$fromIsoDisplay = $fromDate?->format('Y-m-d') . 'T00:00:00.000+09:00';
$toIsoDisplay   = $toDate?->format('Y-m-d') . 'T23:59:59.999+09:00';
// Date input values for HTML date pickers
$fromDateValue  = $fromDate?->format('Y-m-d') ?? '';
$toDateValue    = $toDate?->format('Y-m-d') ?? '';
// Form action: point to PHP script so static saved HTML can also navigate correctly
$formAction = 'orders_today.php';
if (!empty($_SERVER['PHP_SELF']) && PHP_SAPI !== 'cli') {
    $formAction = (string) $_SERVER['PHP_SELF'];
}

$groupedCount = count($groupedRows);
$totalAmount = array_sum(array_map(static fn($row) => (float) $row['amount'], $orders));

$outputFormat = $cliArgs['format'] ?? 'html';
if ($outputFormat === 'json') {
    $payload = [
        'from'            => $fromIsoDisplay,
        'to'              => $toIsoDisplay,
        'totalOrderCount' => $totalOrderCount,
        'groupedCount'    => $groupedCount,
        'totalAmount'     => $totalAmount,
        'orders'          => $orders,
        'groupedRows'     => $groupedRows,
        'error'           => $error,
    ];
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$saveStatusPlaceholder = '%%SAVE_STATUS_PLACEHOLDER%%';
ob_start();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>오늘의 주문 목록</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 2rem; background: #fafafa; color: #222; }
        h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .meta { margin-bottom: 1rem; color: #555; }
        table { width: 100%; border-collapse: collapse; background: #fff; }
        th, td { padding: 0.6rem 0.8rem; border: 1px solid #ddd; text-align: left; font-size: 0.95rem; }
        th { background: #f2f2f2; font-weight: 600; }
        tr:nth-child(even) { background: #fbfbfb; }
        .error { color: #b00020; margin-bottom: 1rem; }
        .notice { color: #00695c; margin-bottom: 1rem; }
        .option-checkbox { display: inline-flex; align-items: center; gap: 0.3rem; }
        .option-checkbox input { margin: 0; }
        .mismatch { color: #d32f2f; font-size: 0.85rem; margin-left: 0.35rem; }
        .amount-cell { text-align: right; white-space: nowrap; }
    </style>
</head>
<body>
    <h1>오늘의 주문 목록</h1>
    <form method="get" action="<?= htmlspecialchars($formAction, ENT_QUOTES, 'UTF-8') ?>" style="margin-bottom: 1rem; display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
        <label>시작일
            <input type="date" name="from" value="<?= htmlspecialchars($fromDateValue, ENT_QUOTES, 'UTF-8') ?>">
        </label>
        <label>종료일
            <input type="date" name="to" value="<?= htmlspecialchars($toDateValue, ENT_QUOTES, 'UTF-8') ?>">
        </label>
        <button type="submit">조회</button>
    </form>
    <div class="meta">
        조회 기간: <?= htmlspecialchars($fromIsoDisplay ?? '', ENT_QUOTES, 'UTF-8') ?> ~ <?= htmlspecialchars($toIsoDisplay ?? '', ENT_QUOTES, 'UTF-8') ?><br>
        총 주문 수: <?= $totalOrderCount ?>건, 구매자 수: <?= $groupedCount ?>명, 결제 금액 합계: <?= number_format((float) $totalAmount) ?>원<br>
        PHP에서 실행될 때 동일한 내용이 orders_result.html 파일로 저장됩니다.
    </div>

    <?= $saveStatusPlaceholder ?>

    <script>
    // If this page is opened as a saved static HTML (orders_result.html),
    // ensure the form posts to the PHP endpoint for live querying.
    (function(){
        try {
            var form = document.querySelector('form[method="get"]');
            if (!form) return;
            var action = (form.getAttribute('action')||'').toLowerCase();
            if (!action.endsWith('orders_today.php')) {
                form.setAttribute('action','orders_today.php');
            }
            // If opened via file://, prevent submitting to a local .php (which downloads) and guide the user.
            if (location.protocol === 'file:') {
                form.addEventListener('submit', function(ev){
                    ev.preventDefault();
                    alert('이 페이지는 정적 파일(orders_result.html)로 열렸습니다. 조회하려면 웹 서버 주소(예: http://127.0.0.1:8000/orders_today.php)로 접속한 후 이용해 주세요.');
                });
            }
        } catch (e) {}
    })();
    </script>

    <?php if ($error !== null): ?>
        <p class="error">오류: <?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
    <?php elseif ($groupedCount === 0): ?>
        <p>오늘 수집된 주문 데이터가 없습니다.</p>
    <?php else: ?>
        <table>
            <thead>
                <tr>
                    <th>구매자명</th>
                    <th>로그인 ID</th>
                    <th>상품명</th>
                    <th>출국일/시간 렌탈</th>
                    <th>렌탈(체크박스)</th>
                    <th>귀국일/시간</th>
                    <th>반납(체크박스)</th>
                    <th>파손 확인 (체크박스)</th>
                    <?php foreach ($categoryTitles as $categoryTitle): ?>
                        <th><?= htmlspecialchars($categoryTitle, ENT_QUOTES, 'UTF-8') ?></th>
                    <?php endforeach; ?>
                    <th>비고</th>
                    <th>상세페이지 내용 확인</th>
                    <th>주문상태</th>
                    <th>결제일시</th>
                    <th>결제(월/일)</th>
                    <th>배송완료일</th>
                    <th>결제금액</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach ($groupedRows as $group): ?>
                <tr>
                    <td>
                        <?= htmlspecialchars($group['buyer'], ENT_QUOTES, 'UTF-8') ?>
                        <?php if (!empty($group['buyerNameMismatch'])): ?><span class="mismatch">※ 불일치</span><?php endif; ?>
                    </td>
                    <td>
                        <?= htmlspecialchars($group['buyerId'], ENT_QUOTES, 'UTF-8') ?>
                        <?php if (!empty($group['buyerIdMismatch'])): ?><span class="mismatch">※ 불일치</span><?php endif; ?>
                    </td>
                    <td><?= nl2br(htmlspecialchars($group['productName'], ENT_QUOTES, 'UTF-8'), false) ?></td>
                    <td><?= htmlspecialchars($group['departureDisplay'], ENT_QUOTES, 'UTF-8') ?></td>
                    <td>
                        <label class="option-checkbox">
                            <input type="checkbox" disabled <?= $group['departureChecked'] ? 'checked' : '' ?>>
                        </label>
                        <?php if ($group['departureMismatch']): ?><span class="mismatch">※ 불일치</span><?php endif; ?>
                    </td>
                    <td><?= htmlspecialchars($group['returnDisplay'], ENT_QUOTES, 'UTF-8') ?></td>
                    <td>
                        <label class="option-checkbox">
                            <input type="checkbox" disabled <?= $group['returnChecked'] ? 'checked' : '' ?>>
                        </label>
                        <?php if ($group['returnMismatch']): ?><span class="mismatch">※ 불일치</span><?php endif; ?>
                    </td>
                    <td>
                        <label class="option-checkbox">
                            <input type="checkbox" disabled <?= $group['damageChecked'] ? 'checked' : '' ?>>
                        </label>
                    </td>
                    <?php foreach ($categoryTitles as $categoryTitle): ?>
                        <td><?= htmlspecialchars($group['categories'][$categoryTitle] ?? '', ENT_QUOTES, 'UTF-8') ?></td>
                    <?php endforeach; ?>
                    <td><?= htmlspecialchars($group['memoValue'], ENT_QUOTES, 'UTF-8') ?></td>
                    <td><?= htmlspecialchars($group['detailConfirmation'], ENT_QUOTES, 'UTF-8') ?></td>
                    <td><?= htmlspecialchars($group['statusDisplay'], ENT_QUOTES, 'UTF-8') ?></td>
                    <td>
                        <?= htmlspecialchars($group['paymentDisplay'], ENT_QUOTES, 'UTF-8') ?>
                        <?php if (!empty($group['paymentMismatch'])): ?><span class="mismatch">※ 불일치</span><?php endif; ?>
                    </td>
                    <td><?= htmlspecialchars($group['paymentMonthDay'], ENT_QUOTES, 'UTF-8') ?></td>
                    <td><?= htmlspecialchars($group['deliveredDisplay'], ENT_QUOTES, 'UTF-8') ?></td>
                    <td class="amount-cell"><?= htmlspecialchars($group['amountDisplay'], ENT_QUOTES, 'UTF-8') ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</body>
</html>
<?php
$htmlBase = ob_get_clean();

$successMarkup = '<p class="notice">정적 HTML을 orders_result.html 파일로 저장했습니다. (이 파일은 스냅샷입니다. 조회 버튼을 누르면 라이브 페이지로 이동합니다.)</p>';
$failureMarkup = '<p class="error">정적 HTML 저장에 실패했습니다. 파일 권한을 확인하세요.</p>';

$finalHtml = str_replace($saveStatusPlaceholder, $successMarkup, $htmlBase);
$writeResult = false;
if ($error === null) {
    $writeResult = @file_put_contents(OUTPUT_HTML_FILE, $finalHtml) !== false;
}

if ($error !== null || !$writeResult) {
    $finalHtml = str_replace($saveStatusPlaceholder, $failureMarkup, $htmlBase);
}

echo $finalHtml;
