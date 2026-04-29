import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export function warningEmailHtml(opts: {
  renterName: string;
  property?: string | null;
  endDate: string;
  daysLeft: number;
  audience: "admin" | "renter";
}) {
  const { renterName, property, endDate, daysLeft, audience } = opts;
  const headerColor = daysLeft <= 7 ? "#a3331f" : daysLeft <= 14 ? "#b56a1d" : "#c89134";
  const greeting =
    audience === "admin"
      ? `<p style="margin:0 0 12px 0">An internal notice. The tenancy below requires renewal action.</p>`
      : `<p style="margin:0 0 12px 0">Dear ${renterName},</p>
         <p style="margin:0 0 12px 0">We write to advise that your rental contract with <strong>Elite Venture Properties</strong> is approaching its end date. Kindly contact our office at your earliest convenience to discuss renewal terms.</p>`;

  return `<!doctype html>
<html><body style="margin:0;padding:32px;background:#efe5cc;font-family:Georgia,'Times New Roman',serif;color:#2a1f10">
  <div style="max-width:600px;margin:0 auto;background:#fbf7ec;border:1px solid #d9cca8;border-radius:6px;overflow:hidden;box-shadow:0 8px 32px -12px rgba(60,40,15,0.25)">

    <!-- Header band -->
    <div style="background:linear-gradient(180deg,#2b1d12 0%,#1c130a 100%);padding:28px 32px;text-align:center;border-bottom:2px solid #c9a45c">
      <div style="font-family:Georgia,serif;color:#e6cf95;font-size:11px;letter-spacing:5px;text-transform:uppercase">Elite Venture</div>
      <div style="color:#a07e3a;font-size:9px;letter-spacing:6px;text-transform:uppercase;margin-top:4px">Properties</div>
    </div>

    <!-- Warning ribbon -->
    <div style="background:${headerColor};color:#fbf7ec;padding:14px 32px;text-align:center;font-family:Georgia,serif;letter-spacing:2px;text-transform:uppercase;font-size:12px">
      Notice of Renewal · ${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining
    </div>

    <!-- Body -->
    <div style="padding:32px;font-size:14px;line-height:1.7;color:#2a1f10">
      <h1 style="font-family:Georgia,'Playfair Display',serif;font-size:26px;font-weight:500;margin:0 0 8px 0;color:#1c130a">
        ${audience === "admin" ? "Action Required" : "Contract Expiring Soon"}
      </h1>
      <div style="height:1px;background:linear-gradient(90deg,transparent,#c9a45c,transparent);margin:0 0 20px 0"></div>

      ${greeting}

      <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#f6efde;border:1px solid #d9cca8;border-radius:4px">
        <tr>
          <td style="padding:12px 18px;color:#6b5a3e;font-size:10px;letter-spacing:2px;text-transform:uppercase;width:40%;border-bottom:1px solid #e6dcc0">Renter</td>
          <td style="padding:12px 18px;font-family:Georgia,serif;font-size:15px;color:#1c130a;border-bottom:1px solid #e6dcc0">${renterName}</td>
        </tr>
        ${
          property
            ? `<tr>
          <td style="padding:12px 18px;color:#6b5a3e;font-size:10px;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #e6dcc0">Property</td>
          <td style="padding:12px 18px;font-family:Georgia,serif;font-size:15px;color:#1c130a;border-bottom:1px solid #e6dcc0">${property}</td>
        </tr>`
            : ""
        }
        <tr>
          <td style="padding:12px 18px;color:#6b5a3e;font-size:10px;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #e6dcc0">End Date</td>
          <td style="padding:12px 18px;font-family:Georgia,serif;font-size:15px;color:#1c130a;border-bottom:1px solid #e6dcc0">${endDate}</td>
        </tr>
        <tr>
          <td style="padding:12px 18px;color:#6b5a3e;font-size:10px;letter-spacing:2px;text-transform:uppercase">Days Remaining</td>
          <td style="padding:12px 18px;font-family:Georgia,serif;font-size:18px;color:${headerColor};font-weight:700">${daysLeft}</td>
        </tr>
      </table>

      ${
        audience === "renter"
          ? `<p style="margin:18px 0 0 0">We value your tenancy and look forward to continuing our relationship.</p>
             <p style="margin:18px 0 4px 0;font-family:Georgia,serif;font-style:italic;color:#5a4128">Warm regards,</p>
             <p style="margin:0;font-family:Georgia,serif;font-size:15px;color:#1c130a">The Elite Venture Properties Team</p>`
          : `<p style="margin:18px 0 0 0;color:#5a4128">Please coordinate with the renter to confirm renewal terms or arrange handover.</p>`
      }
    </div>

    <!-- Footer -->
    <div style="background:#1c130a;color:#8a7754;padding:18px 32px;text-align:center;font-size:10px;letter-spacing:3px;text-transform:uppercase;border-top:2px solid #c9a45c">
      Elite Venture Properties · Renewals
    </div>

  </div>
</body></html>`;
}
