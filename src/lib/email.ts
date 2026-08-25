import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.EMAIL_FROM || "Waitlist <onboarding@resend.dev>";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Waitlist";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendWaitlistEmail(params: {
  to: string;
  name: string;
  position: number;
  id: string;
}) {
  const { to, name, position, id } = params;

  const subject = `You're on the list — Welcome to ${appName} (#${position})`;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#0a0a0a;color:#ededed;padding:32px">
      <div style="max-width:560px;margin:0 auto;background:#171717;border:1px solid #27272a;border-radius:16px;overflow:hidden">
        <div style="padding:28px">
          <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:20px">
            <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#8b5cf6,#06b6d4)"></div>
            <span style="font-weight:700;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#a1a1aa">${appName}</span>
          </div>
          <h1 style="margin:0 0 12px;font-size:22px;line-height:1.2;color:#fff">You're in, ${escapeHtml(
            name
          )}!</h1>
          <p style="margin:0 0 20px;color:#a1a1aa;line-height:1.6;font-size:14px">
            Thanks for joining the waitlist. We've secured your spot and you're officially on the list.
          </p>

          <div style="background:#0a0a0a;border:1px solid #27272a;border-radius:12px;padding:18px;margin:20px 0;display:flex;justify-content:space-between;gap:16px">
            <div>
              <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#71717a;margin-bottom:6px">Your Position</div>
              <div style="font-size:28px;font-weight:800;color:#fff;line-height:1">#${position}</div>
              <div style="font-size:12px;color:#71717a;margin-top:4px">Queue position · first come, first served</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#71717a;margin-bottom:6px">Waitlist ID</div>
              <div style="font-family:monospace;font-size:13px;color:#fff;background:#27272a;padding:6px 10px;border-radius:8px;display:inline-block">${id.slice(
                0,
                8
              )}</div>
              <div style="font-size:11px;color:#52525b;margin-top:6px;word-break:break-all">${id}</div>
            </div>
          </div>

          <p style="margin:0 0 14px;color:#a1a1aa;line-height:1.6;font-size:13px">
            We'll notify you at <strong style="color:#e4e4e7">${escapeHtml(
              to
            )}</strong> when we open early access. Keep an eye on your inbox.
          </p>
          <p style="margin:0;color:#52525b;font-size:12px;line-height:1.5">
            You can reply to this email if you have any questions. No spam — just one update when you're invited in.
          </p>
        </div>
        <div style="padding:16px 28px;background:#0a0a0a;border-top:1px solid #27272a;text-align:center">
          <p style="margin:0;color:#52525b;font-size:11px">© ${new Date().getFullYear()} ${escapeHtml(
            appName
          )} · <a href="${appUrl}" style="color:#71717a;text-decoration:none">${appUrl}</a></p>
        </div>
      </div>
    </div>
  `;

  // If no API key, mock log and return success (so dev doesn't block)
  if (!resendApiKey) {
    console.log(
      `[email:mock] To: ${to} | Subject: ${subject} | Position: #${position} | ID: ${id}`
    );
    console.log(`[email:mock] HTML preview length ${html.length}`);
    return { mocked: true, id: `mock_${Date.now()}` };
  }

  const resend = new Resend(resendApiKey);
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[email] Resend error", error);
    throw new Error(error.message || "Failed to send email");
  }

  return data;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
