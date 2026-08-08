use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use std::env;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    let api_key = match env::var("RELOOP_API_KEY") {
        Ok(val) => val,
        Err(_) => {
            eprintln!("Error: RELOOP_API_KEY environment variable is required.");
            std::process::exit(1);
        }
    };

    let email = Message::builder()
        .from("onboarding@yourdomain.com".parse()?)
        .to("recipient@example.com".parse()?)
        .subject("Hello from Reloop SMTP")
        .header(lettre::message::header::ContentType::TEXT_HTML)
        .body(String::from(
            "<p>Congrats on sending your first email via Reloop SMTP!</p>",
        ))?;

    let creds = Credentials::new("reloop".to_string(), api_key);

    let mailer = SmtpTransport::relay("smtp.reloop.sh")?
        .port(465)
        .credentials(creds)
        .build();

    match mailer.send(&email) {
        Ok(_) => println!("Email sent successfully!"),
        Err(e) => panic!("Could not send email: {e:?}"),
    }

    Ok(())
}
