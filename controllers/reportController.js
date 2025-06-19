const nodemailer = require("nodemailer");


exports.checkingUserData = (req, res) => {
    try{
        const {name, phone, email, company} = req.body;
        if(!name || !phone || !email || !company) {
            return res.status(404).json({ error:"חלק מהנתונים חסרים" });
        }
        if(phone.length < 10) {
            return res.status(400).json({ error:"מספר הטלפון חייב להיות באורך 10 תווים" });
        }
        if(!email.includes('@')) {
            return res.status(400).json({ error:"כתובת האימייל לא תקינה" });
        }
        return res.status(200).json({ message: "הנתונים התקבלו בהצלחה" });
    }
    catch (error) {
        console.error("Error in userData:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

exports.checkingFieldsData = (req, res) => {
    try{
        const { problemProperties } = req.body;
        if(
            !problemProperties ||
            !problemProperties.title ||
            !problemProperties.recruitment_sentence ||
            !problemProperties.customers ||
            !problemProperties.kpis ||
            !problemProperties.summary ||
            !problemProperties.description
        ) {
            return res.status(404).json({ error: "חלק מהנתונים חסרים" });
        }
        if(problemProperties.title.length < 5) {
            return res.status(400).json({ error: "כותרת הבעיה חייבת להיות באורך של לפחות 5 תווים" });
        }
        if(problemProperties.recruitment_sentence.length < 10) {
            return res.status(400).json({ error: "משפט הגיוס חייב להיות באורך של לפחות 10 תווים" });
        }
        if(!Array.isArray(problemProperties.customers) || problemProperties.customers.length < 1 || problemProperties.customers[0] === "") {
            return res.status(400).json({ error: "יש למלא לפחות לקוח אחד" });
        }
        if(!Array.isArray(problemProperties.kpis) || problemProperties.kpis.length < 1 || problemProperties.kpis[0] === "") {
            return res.status(400).json({ error: "יש למלא לפחות מדד הצלחה אחד" });
        }
        if(problemProperties.summary.length < 50) {
            return res.status(400).json({ error: "סיכום הבעיה חייב להיות באורך של לפחות 50 תווים" });
        }
        if(problemProperties.description.length < 100) {
            return res.status(400).json({ error: "תיאור הבעיה חייב להיות באורך של לפחות 100 תווים" });
        }
        return res.status(200).json({ message: "הנתונים התקבלו בהצלחה" });
    }
    catch (error) {
        console.error("Error in userData:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

exports.sendEmail = async (req, res) => {
  try {
    const { user, problemProperties } = req.body;

    if (!user || !problemProperties) {
      return res.status(400).json({ error: "חלק מהנתונים חסרים" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.mailersend.net",
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: `${process.env.EMAIL_USERNAME}`,
        pass: `${process.env.EMAIL_PASSWORD}`
      }
    });

    const emailBodyToUser = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
      <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/aa3b34_image.png" alt="SYNAPS Logo" style="height: 40px;">
      </div>
      <h1 style="color: #333; font-size: 22px; text-align: center; margin-bottom: 15px;">סיכום הגדרת האתגר: ${problemProperties.title}</h1>

      <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom:15px;">
          <h2 style="font-size: 18px; color: #1A1A1A; margin:0 0 5px;">תקציר:</h2>
          <p style="color: #555; margin:0; white-space: pre-wrap;">${problemProperties.summary || "לא צוין"}</p>
      </div>

      <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom:15px;">
          <h2 style="font-size: 18px; color: #1A1A1A; margin:0 0 5px;">תיאור מורחב:</h2>
          <p style="color: #555; margin:0; white-space: pre-wrap;">${problemProperties.description || "לא צוין"}</p>
      </div>

      ${problemProperties.kpis && Array.isArray(problemProperties.kpis) && problemProperties.kpis.length > 0 ? `
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom:15px;">
            <h2 style="font-size: 18px; color: #1A1A1A; margin:0 0 5px;">מדדי הצלחה (KPIs):</h2>
            <ul style="color: #555; padding-right: 20px; margin:0;">
              ${problemProperties.kpis.map(kpi => `<li>${kpi}</li>`).join('')}
            </ul>
        </div>` : ''}

      ${problemProperties.customers && Array.isArray(problemProperties.customers) && problemProperties.customers.length > 0 ? `
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom:15px;">
            <h2 style="font-size: 18px; color: #1A1A1A; margin:0 0 5px;">קהל יעד:</h2>
            <ul style="color: #555; padding-right: 20px; margin:0;">
              ${problemProperties.customers.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </div>` : ''}

      <p style="text-align: center; font-size: 12px; color: #888; margin-top:30px;">
          דוח זה נוצר על ידי AI Houston מבית Synaps.
      </p>
    </div>
    `;

    const emailBodyToAdmin = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fdfdfd;">
      <h2 style="color: #333;">אתגר חדש נוצר במערכת AI Houston</h2>
      <p><strong>פרטי המשתמש:</strong></p>
      <ul>
        <li>שם: ${user.name}</li>
        <li>אימייל: ${user.email}</li>
        <li>טלפון: ${user.phone || 'לא נמסר'}</li>
        <li>חברה: ${user.company}</li>
      </ul>
      <p><strong>פרטי האתגר:</strong></p>
      <ul>
        <li>שם האתגר: ${problemProperties.title}</li>
        <li>תקציר: ${problemProperties.summary}</li>
      </ul>
    </div>
    `;

    await transporter.sendMail({
      from: `"AI Houston" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: `סיכום האתגר שלך: ${problemProperties.title}`,
      html: emailBodyToUser
    });

    await transporter.sendMail({
      from: `"AI Houston" <${process.env.EMAIL_USERNAME}>`,
      to: process.env.OWNER_EMAIL,
      subject: `[עותק] אתגר חדש: ${problemProperties.title} (מאת ${user.email})`,
      html: emailBodyToAdmin
    });

    return res.status(200).json({ message: "האימיילים נשלחו בהצלחה" });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "שליחת המייל נכשלה" });
  }
};
