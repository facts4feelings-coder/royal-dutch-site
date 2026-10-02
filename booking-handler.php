<?php
// Royal Horizon Voyages — booking form handler
// Receives POST from the booking popup modal (js/booking-modal.js).
// ajax=1 -> JSON response {ok, ref|error}; otherwise redirects back to the
// referring page with ?booking=success|error (modal shows a toast).

$AGENCY_EMAIL = 'info@royalhorizonvoyages.com';
$AGENCY_NAME  = 'Royal Horizon Voyages';

$isAjax = (($_POST['ajax'] ?? '') === '1')
    || (strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false);

// Redirect target for non-AJAX posts: same-host referer, else site root.
function back_url($status) {
    $ref  = $_SERVER['HTTP_REFERER'] ?? '';
    $path = '/';
    if ($ref !== '') {
        $p    = parse_url($ref);
        $host = $_SERVER['HTTP_HOST'] ?? '';
        if (($p['host'] ?? '') === $host && !empty($p['path'])) {
            $path = $p['path'];
        }
    }
    return $path . '?booking=' . $status;
}

function respond($ok, $ref = '') {
    global $isAjax;
    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($ok ? ['ok' => true, 'ref' => $ref]
                             : ['ok' => false, 'error' => $ref]);
        exit;
    }
    header('Location: ' . back_url($ok ? 'success' : 'error'));
    exit;
}

function fail($msg = 'Please check the form and try again.') { respond(false, $msg); }

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { fail(); }

// Honeypot: bots fill this hidden field — pretend success, send nothing
if (!empty($_POST['website'])) { respond(true, ''); }

function clean($v) {
    $v = is_array($v) ? '' : (string)$v;
    $v = trim(strip_tags($v));
    return mb_substr($v, 0, 2000, 'UTF-8');
}
function esc($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); }

$name     = clean($_POST['full_name'] ?? '');
$phone    = clean($_POST['phone'] ?? '');
$email    = clean($_POST['email'] ?? '');
$city     = clean($_POST['city'] ?? '');
$package  = clean($_POST['package'] ?? '');
$depart   = clean($_POST['departure'] ?? '');
$ret      = clean($_POST['return_date'] ?? '');
$flexible = isset($_POST['flexible']) ? 'Yes' : 'No';
$adults   = max(1, min(20, (int)($_POST['adults'] ?? 1)));
$children = max(0, min(10, (int)($_POST['children'] ?? 0)));
$infants  = max(0, min(10, (int)($_POST['infants'] ?? 0)));
$hotel    = clean($_POST['hotel'] ?? 'Any');
$room     = clean($_POST['room'] ?? '');
$requests = clean($_POST['requests'] ?? '');
$services = [];
if (!empty($_POST['services']) && is_array($_POST['services'])) {
    foreach ($_POST['services'] as $s) { $services[] = clean($s); }
}

// Validation
if ($name === '' || $phone === '' || $email === '' || $package === '') { fail('Please fill in all required fields.'); }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { fail('Please enter a valid email address.'); }
if (!preg_match('/^[+\d][\d\s\-()]{6,20}$/', $phone)) { fail(); }
$d1 = $d2 = null;
if ($flexible === 'Yes') {
    $depart = $ret = '';
} else {
    if ($depart === '' || $ret === '') { fail('Please choose your travel dates.'); }
    $d1 = DateTime::createFromFormat('Y-m-d', $depart);
    $d2 = DateTime::createFromFormat('Y-m-d', $ret);
    $today = new DateTime('today');
    if (!$d1 || !$d2 || $d1 < $today || $d2 < $d1) { fail('Please choose valid departure and return dates.'); }
}

$total_travelers = $adults + $children + $infants;
$ref = 'RHV-' . date('Ymd') . '-' . strtoupper(substr(md5($email . microtime(true)), 0, 6));
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

$rows = [
    'Booking Ref'   => esc($ref),
    'Package'       => esc($package),
    'Departure'     => $d1 ? $d1->format('d M Y') : 'Flexible',
    'Return'        => $d2 ? $d2->format('d M Y') : 'Flexible',
    'Flexible Dates'=> $flexible,
    'Travelers'     => "$total_travelers (Adults: $adults, Children: $children, Infants: $infants)",
    'Hotel'         => esc($hotel),
    'Room Type'     => esc($room),
    'Extra Services'=> $services ? esc(implode(', ', $services)) : '—',
    'Name'          => esc($name),
    'Phone'         => esc($phone),
    'Email'         => esc($email),
    'City'          => $city !== '' ? esc($city) : '—',
    'Special Requests' => $requests !== '' ? nl2br(esc($requests)) : '—',
];

$table = '';
foreach ($rows as $k => $v) {
    $table .= "<tr><td style=\"padding:10px 14px;border:1px solid #e2e8f0;font-weight:600;color:#0a1e5e;width:180px;vertical-align:top;\">$k</td>"
            . "<td style=\"padding:10px 14px;border:1px solid #e2e8f0;color:#1a1a1a;\">$v</td></tr>";
}

$agency_body = '<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">'
    . '<div style="background:#0a1e5e;color:#fff;padding:20px 24px;border-radius:10px 10px 0 0;">'
    . '<h2 style="margin:0;font-size:20px;">New Booking Request <span style="color:#e6a817;">' . esc($ref) . '</span></h2>'
    . '<p style="margin:6px 0 0;font-size:13px;opacity:.85;">Received ' . date('d M Y, h:i A') . ' from royalhorizontravel.com</p></div>'
    . '<table style="border-collapse:collapse;width:100%;font-size:14px;background:#fff;" cellpadding="0" cellspacing="0">' . $table . '</table>'
    . '<p style="font-size:12px;color:#888;">Sender IP: ' . esc($ip) . '</p></div>';

$subject = "New Booking [$ref]: $package — $name ($total_travelers travelers)";
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: $AGENCY_NAME <$AGENCY_EMAIL>\r\n";
$safe_name = str_replace(["\r", "\n"], '', $name); // block header injection
$headers .= "Reply-To: $safe_name <$email>\r\n";

$sent = mail($AGENCY_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $agency_body, $headers, "-f$AGENCY_EMAIL");

// Auto-reply to the customer (best effort — never blocks the redirect)
if ($sent) {
    $cust_subject = "We received your booking request [$ref] — $AGENCY_NAME";
    $cust_body = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">'
        . '<h2 style="color:#0a1e5e;">Assalam-o-Alaikum ' . esc($name) . ',</h2>'
        . '<p>Thank you for choosing <b>Royal Horizon Voyages</b>. We have received your booking request:</p>'
        . '<ul><li><b>Reference:</b> ' . esc($ref) . '</li>'
        . '<li><b>Package:</b> ' . esc($package) . '</li>'
        . '<li><b>Dates:</b> ' . ($d1 ? $d1->format('d M Y') . ' → ' . $d2->format('d M Y') : 'Flexible') . '</li>'
        . '<li><b>Travelers:</b> ' . $total_travelers . '</li></ul>'
        . '<p>Our team will contact you within <b>24 hours</b> with your quote.</p>'
        . '<p>For urgent queries: <b>0334 9873000</b> or <a href="https://wa.me/923349873000">WhatsApp</a>.</p>'
        . '<p style="color:#888;font-size:12px;">Royal Horizon Voyages — Your Journey, Our Priority.</p></div>';
    $cheaders  = "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n";
    $cheaders .= "From: $AGENCY_NAME <$AGENCY_EMAIL>\r\n";
    @mail($email, '=?UTF-8?B?' . base64_encode($cust_subject) . '?=', $cust_body, $cheaders, "-f$AGENCY_EMAIL");
}

respond($sent, $sent ? $ref : 'The message could not be sent. Please try again or WhatsApp us at 0334 9873000.');
