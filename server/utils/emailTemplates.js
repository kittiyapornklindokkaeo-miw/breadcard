const fs = require('fs')
const path = require('path')

const logoBase64 = fs.readFileSync(
    path.join(__dirname, '../assets/logo.svg')
).toString

exports.resetPasswordTemplate = (userName, resetUrl) => `
    <!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
</head>
<body style="margin:0;padding:40px 20px;background:#f0ebe8;font-family:sans-serif;">
  <div style="max-width:520px;margin:0 auto;">
    <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <div style="background:#1a1a1a;padding:32px 40px;text-align:center;">
        <img src="data:image/svg+xml;base64,${logoBase64}" style="width: 70px; heigth: 70px"/>
      </div>

      <div style="padding:40px 48px 36px;">
        <p style="font-size:13px;color:#999;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 8px;text-align:center;">Password Reset</p>
        <h2 style="font-size:26px;color:#1a1a1a;margin:0 0 20px;text-align:center;font-weight:normal;">สวัสดี <em>${userName}</em></h2>
        <div style="width:40px;height:2px;background:#CB3535;margin:0 auto 24px;border-radius:2px;"></div>

        <p style="font-size:15px;color:#444;line-height:1.8;margin:0 0 12px;text-align:center;">
          เราได้รับคำขอรีเซ็ตรหัสผ่านของคุณ<br>กดปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่
        </p>
        <p style="font-size:13px;color:#aaa;margin:0 0 32px;text-align:center;">
          ลิงก์นี้จะหมดอายุภายใน <strong style="color:#888;">1 ชั่วโมง</strong>
        </p>

        <div style="text-align:center;margin-bottom:32px;">
          <a href="${resetUrl}" style="display:inline-block;background:#CB3535;color:#fff;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:8px;">
            Reset Password
          </a>
        </div>

        <div style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:16px 20px;">
          <p style="font-size:12px;color:#999;margin:0;line-height:1.7;text-align:center;">
            หากคุณไม่ได้เป็นผู้ร้องขอ โปรดเพิกเฉยต่ออีเมลนี้<br>
            รหัสผ่านของคุณจะไม่มีการเปลี่ยนแปลงใดๆ
          </p>
        </div>
      </div>

      <div style="border-top:1px solid #f0f0f0;padding:20px 40px;text-align:center;background:#fafafa;">
        <div style="margin-bottom:8px;">
          <a href="#" style="font-size:11px;color:#aaa;text-decoration:none;margin:0 8px;">Privacy Policy</a>
          <span style="color:#ddd;">|</span>
          <a href="#" style="font-size:11px;color:#aaa;text-decoration:none;margin:0 8px;">Terms of Service</a>
        </div>
        <p style="font-size:11px;color:#ccc;margin:0;">Copyright © 2026 Breadcard. All rights reserved.</p>
      </div>

    </div>
  </div>
</body>
</html>
`

