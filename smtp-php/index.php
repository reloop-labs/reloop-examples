<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

$apiKey = $_ENV['RELOOP_API_KEY'] ?? getenv('RELOOP_API_KEY');

if (!$apiKey) {
    echo "Error: RELOOP_API_KEY environment variable is required.\n";
    exit(1);
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.reloop.sh';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'reloop';
    $mail->Password   = $apiKey;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('onboarding@yourdomain.com', 'Reloop');
    $mail->addAddress('recipient@example.com');

    $mail->isHTML(true);
    $mail->Subject = 'Hello from Reloop SMTP';
    $mail->Body    = '<p>Congrats on sending your first email via Reloop SMTP!</p>';

    $mail->send();
    echo "Message has been sent successfully!\n";
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}\n";
}
