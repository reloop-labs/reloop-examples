require 'net/smtp'
require 'openssl'
require 'dotenv'

Dotenv.load

api_key = ENV['RELOOP_API_KEY']

if api_key.nil? || api_key.empty?
  puts "Error: RELOOP_API_KEY environment variable is required."
  exit 1
end

message = <<~MESSAGE_END
From: onboarding@yourdomain.com
To: recipient@example.com
MIME-Version: 1.0
Content-type: text/html
Subject: Hello from Reloop SMTP

<p>Congrats on sending your first email via Reloop SMTP!</p>
MESSAGE_END

begin
  smtp = Net::SMTP.new('smtp.reloop.sh', 465)
  smtp.enable_tls(OpenSSL::SSL::SSLContext.new)
  smtp.start('smtp.reloop.sh', 'reloop', api_key, :plain) do |s|
    s.send_message message, 'onboarding@yourdomain.com', 'recipient@example.com'
  end
  puts "Email sent successfully!"
rescue => e
  puts "Error: #{e.message}"
end
