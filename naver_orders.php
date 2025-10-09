<?php
/**
 * Naver Commerce API: 주문 조회 (조건형) - PHP 단일 스크립트
 * - 인증: OAuth2 Client Credentials (전자서명: bcrypt + base64)
 * - 주문 조회: GET /v1/pay-order/seller/product-orders
 * - 날짜 범위: from~to 최대 24시간 (여러 일자 루프)
 *
 * Docs:
 *  - Auth: https://api.commerce.naver.com/external/v1/oauth2/token (Client Credentials) 
 *  - Orders (조건형): GET /v1/pay-order/seller/product-orders
 */

date_default_timezone_set('Asia/Seoul');

// ───────────────────────────────────────────────────────────────────────────────
// 0) 환경설정
// ───────────────────────────────────────────────────────────────────────────────
const TOKEN_URL  = 'https://api.commerce.naver.com/external/v1/oauth2/token';
const ORDERS_URL = 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders';

// ▼ 여기에 본인 애플리케이션 정보 입력
$CLIENT_ID     = '23laTILmdv5p5VvQU65SXm';
$CLIENT_SECRET = '$2a$04$KLzHaPaO0d6xn2FM0P5tGO';

// ▼ 조회 시작일(YYYY-MM-DD). 예: 2025-10-01
$fromDate = '2025-10-01';

// ▼ 조회 기준 유형: 결제일시 기준
$rangeType = 'PAYED_DATETIME'; // Docs: rangeType.pay-order-seller

// ───────────────────────────────────────────────────────────────────────────────
// 공용 cURL 함수
// ───────────────────────────────────────────────────────────────────────────────
function httpPostJson(string $url, array $data): array {
    $ch = curl_init($url);
    $payload = json_encode($data, JSON_UNESCAPED_UNICODE);

    curl_setopt_array($ch, [
        CURLOPT_POST            => true,
        CURLOPT_RETURNTRANSFER  => true,
        CURLOPT_HTTPHEADER      => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS      => $payload,
        CURLOPT_TIMEOUT         => 30,
    ]);

    $resp = curl_exec($ch);
    if ($resp === false) {
        $err = curl_error($ch);
        curl_close($ch);
        throw new Exception("HTTP POST error: $err");
    }
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    $json = json_decode($resp, true);
    if ($status >= 400) {
        throw new Exception("HTTP $status: " . $resp);
    }
    return is_array($json) ? $json : [];
}

function httpGet(string $url, array $headers = []): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_TIMEOUT        => 30,
    ]);
    $resp = curl_exec($ch);
    if ($resp === false) {
        $err = curl_error($ch);
        curl_close($ch);
        throw new Exception("HTTP GET error: $err");
    }
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    $json = json_decode($resp, true);
    if ($status >= 400) {
        throw new Exception("HTTP $status: " . $resp);
    }
    return is_array($json) ? $json : [];
}

// ───────────────────────────────────────────────────────────────────────────────
// 1) 전자서명 생성 (bcrypt → base64)
//    password = client_id + "_" + timestamp(ms)
//    salt = client_secret
// ───────────────────────────────────────────────────────────────────────────────
function generateSignature(string $clientId, string $clientSecret, int $timestampMs): string {
    $password = $clientId . '_' . $timestampMs;

    // bcrypt 해시 (salt 에 client_secret 사용)
    // PHP의 password_hash는 솔트를 내부에서 생성하므로 crypt()를 사용해 명시 솔트 지정
    // 네이버 측 예시는 bcrypt + salt=client_secret → crypt의 salt 형식("$2y$12$...")이 필요
    // client_secret이 바로 bcrypt salt 형식이 아니라면, 아래처럼 22자 base64 variant로 맞춰야 함.
    // 간편화를 위해 네이버 문서/예시대로 crypt를 호출하되, client_secret이 bcrypt 솔트 포맷인 전제.
    // 만약 애플리케이션 시크릿이 일반 문자열이라면, 서버에서 제공하는 예시대로 변환 로직 추가 필요.
    $hashed = crypt($password, $clientSecret); // 서버 가이드: bcrypt + salt=client_secret

    return base64_encode($hashed);
}

// ───────────────────────────────────────────────────────────────────────────────
// 2) 액세스 토큰 발급 (Client Credentials)
//    필드: client_id, timestamp, client_secret_sign, grant_type=client_credentials, type=SELF
// ───────────────────────────────────────────────────────────────────────────────
function getAccessToken(string $clientId, string $clientSecret): string {
    $timestamp = (int)(microtime(true) * 1000);
    $sign = generateSignature($clientId, $clientSecret, $timestamp);

    $payload = [
        'client_id'         => $clientId,
        'timestamp'         => $timestamp,
        'client_secret_sign'=> $sign,
        'grant_type'        => 'client_credentials',
        'type'              => 'SELF', // 내 스토어 기준이면 SELF
    ];

    $resp = httpPostJson(TOKEN_URL, $payload);
    if (empty($resp['access_token'])) {
        throw new Exception('토큰 발급 실패: access_token 없음');
    }
    return $resp['access_token'];
}

// ───────────────────────────────────────────────────────────────────────────────
// 3) 조건형 주문 조회 (GET /v1/pay-order/seller/product-orders)
//    - from/to는 최대 24시간 범위
//    - rangeType=PAYED_DATETIME (결제 시각 기준)
//    - 여러 일자 루프 지원
// ───────────────────────────────────────────────────────────────────────────────
function getOrdersByDayRange(string $accessToken, string $rangeType, string $fromDateYmd, string $toDateYmd = null): array {
    $results = [];

    $start = new DateTime($fromDateYmd . ' 00:00:00', new DateTimeZone('Asia/Seoul'));
    $end   = $toDateYmd ? new DateTime($toDateYmd . ' 00:00:00', new DateTimeZone('Asia/Seoul'))
                        : clone $start;

    // inclusive 루프: 시작일부터 종료일까지 하루씩
    for ($d = clone $start; $d <= $end; $d->modify('+1 day')) {
        $fromIso = $d->format('Y-m-d') . 'T00:00:00.000+09:00';
        // 문서상 to 미지정 시 from + 24h로 자동 지정되지만, 여기선 명시적으로 지정
        $toIso   = $d->format('Y-m-d') . 'T23:59:59.999+09:00';

        $qs = http_build_query([
            'from'      => $fromIso,
            'to'        => $toIso,
            'rangeType' => $rangeType,
            // 필요 시 status, page 등 추가 파라미터
        ]);

        $url = ORDERS_URL . '?' . $qs;
        $headers = ['Authorization: Bearer ' . $accessToken];

        $resp = httpGet($url, $headers);

        // 예: 응답 구조에서 실제 주문 배열 필드명은 문서/응답에 따라 다를 수 있음
        // 공식 문서(current) 기준 필드명을 확인해 맞추세요.
        // 여기서는 $resp 전체를 results에 합치고, 후처리는 print_r로 구조를 보고 맞추는 방식.
        $results[] = [
            'date'   => $d->format('Y-m-d'),
            'raw'    => $resp,
        ];
    }
    return $results;
}

// ───────────────────────────────────────────────────────────────────────────────
// 실행부
// ───────────────────────────────────────────────────────────────────────────────
try {
    // 1) 토큰
    $token = getAccessToken($CLIENT_ID, $CLIENT_SECRET);

    // 2) (옵션) 종료일 지정 가능: $toDate = '2025-10-03';
    $toDate = null;

    // 3) 날짜별(최대 24h) 주문 조회
    $all = getOrdersByDayRange($token, $rangeType, $fromDate, $toDate);

    // 4) 구조 확인 (원하는 값만 골라 쓰기)
    foreach ($all as $day) {
        echo "=== " . $day['date'] . " ===\n";
        print_r($day['raw']); // 구조를 직접 보고 필요한 필드만 뽑아 쓰세요.
        echo "\n";
    }

} catch (Exception $e) {
    fwrite(STDERR, "ERROR: " . $e->getMessage() . PHP_EOL);
    exit(1);
}