import { Router, Request, Response } from "express";
import { Reloop } from "reloop-email";

export const mailRouter = Router();

const getClient = (): Reloop => {
	const apiKey = process.env.RELOOP_API_KEY || "rl_prod_S1P7dA_7zHsfSxaFNM3gv5tGchg";
	return new Reloop({ apiKey });
};

// 1. POST /api/mail/send - Basic Plain Text & HTML Email
mailRouter.post("/send", async (req: Request, res: Response) => {
	try {
		const client = getClient();
		const { from, to, subject, text, html } = req.body;

		const result = await client.mail.send({
			from: from || "onboarding@reloop.sh",
			to: to || "twinkalp1525@gmail.com",
			subject: subject || "Hello from Reloop Node.js SDK!",
			text: text || "Welcome to Reloop! This email was sent using the official Node.js SDK.",
			html: html || "<h1>Welcome to Reloop!</h1><p>This email was sent using the official <strong>Node.js SDK</strong>.</p>",
		});

		return res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		return res.status(400).json({ success: false, error: error.message || error });
	}
});

// 2. POST /api/mail/send-multiple - To, CC, and BCC Recipients
mailRouter.post("/send-multiple", async (req: Request, res: Response) => {
	try {
		const client = getClient();
		const { from, to, cc, bcc, subject, text } = req.body;

		const result = await client.mail.send({
			from: from || "onboarding@reloop.sh",
			to: to || ["twinkalp1525@gmail.com"],
			cc: cc || ["reloop.sh@gmail.com"],
			bcc: bcc,
			subject: subject || "Multi-recipient Email Test",
			text: text || "Testing CC and BCC parameters via Reloop Node.js SDK.",
		});

		return res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		return res.status(400).json({ success: false, error: error.message || error });
	}
});

// 3. POST /api/mail/send-custom-headers - Reply-To & Custom Headers
mailRouter.post("/send-custom-headers", async (req: Request, res: Response) => {
	try {
		const client = getClient();
		const { from, to, subject, reply_to, headers } = req.body;

		const result = await client.mail.send({
			from: from || "support@reloop.sh",
			to: to || "twinkalp1525@gmail.com",
			subject: subject || "Custom Headers & Reply-To Test",
			text: "This email includes custom headers and a reply-to address.",
			reply_to: reply_to || "support-reply@reloop.sh",
			headers: headers || {
				"X-Client-Platform": "Node.js-Express",
				"X-Custom-Campaign": "Summer-2026",
			},
		});

		return res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		return res.status(400).json({ success: false, error: error.message || error });
	}
});

// 4. POST /api/mail/send-scheduled - Scheduled Email Delivery
mailRouter.post("/send-scheduled", async (req: Request, res: Response) => {
	try {
		const client = getClient();
		const { from, to, subject, scheduled_at } = req.body;

		// Default schedule: 10 minutes from now
		const defaultSchedule = new Date(Date.now() + 10 * 60 * 1000).toISOString();

		const result = await client.mail.send({
			from: from || "onboarding@reloop.sh",
			to: to || "twinkalp1525@gmail.com",
			subject: subject || "Scheduled Email Test",
			text: `This email is scheduled for delivery at ${scheduled_at || defaultSchedule}.`,
			scheduled_at: scheduled_at || defaultSchedule,
		});

		return res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		return res.status(400).json({ success: false, error: error.message || error });
	}
});

// 5. POST /api/mail/send-attachments - Email with File Attachments
mailRouter.post("/send-attachments", async (req: Request, res: Response) => {
	try {
		const client = getClient();
		const { from, to, subject } = req.body;

		const result = await client.mail.send({
			from: from || "invoices@reloop.sh",
			to: to || "twinkalp1525@gmail.com",
			subject: subject || "Invoice Attachment Test",
			text: "Please find your attached invoice document.",
			attachments: [
				{
					filename: "invoice_2026.txt",
					content: "Invoice ID: #INV-2026-001\nTotal: $150.00\nStatus: Paid",
					content_type: "text/plain",
				},
			],
		});

		return res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		return res.status(400).json({ success: false, error: error.message || error });
	}
});

// 6. POST /api/mail/send-tagged - Categorization Tags
mailRouter.post("/send-tagged", async (req: Request, res: Response) => {
	try {
		const client = getClient();
		const { from, to, subject, tags } = req.body;

		const result = await client.mail.send({
			from: from || "marketing@reloop.sh",
			to: to || "twinkalp1525@gmail.com",
			subject: subject || "Tagged Email Test",
			text: "This email includes tracking tags.",
			tags: tags || [
				{ name: "category", value: "onboarding" },
				{ name: "environment", value: "production" },
			],
		});

		return res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		return res.status(400).json({ success: false, error: error.message || error });
	}
});
