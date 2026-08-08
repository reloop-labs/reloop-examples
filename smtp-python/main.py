import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("RELOOP_API_KEY")

if not api_key:
    print("Error: RELOOP_API_KEY environment variable is required.")
    exit(1)

msg = MIMEMultipart()
msg["From"] = "onboarding@yourdomain.com"
msg["To"] = "recipient@example.com"
msg["Subject"] = "Hello from Reloop SMTP"

body = "<p>Congrats on sending your first email via Reloop SMTP!</p>"
msg.attach(MIMEText(body, "html"))

try:
    with smtplib.SMTP_SSL("smtp.reloop.sh", 465) as server:
        server.login("reloop", api_key)
        server.sendmail(msg["From"], [msg["To"]], msg.as_string())

    print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")
