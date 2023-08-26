import nodemailer, {
  Transporter,
  SendMailOptions,
  SentMessageInfo,
} from "nodemailer";

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "mahenkhan83@gmail.com",
    pass: "wvcgmfxgksbzhhaj",
  },
});

interface MailData {
  email: string;
  subject: string;
  html: string;
}

const sendEmail = async (mailData: MailData): Promise<void> => {
  console.log(mailData);

  try {
    const mailOptions: SendMailOptions = {
      from: "mahenkhan83@gmail.com",
      to: mailData.email,
      subject: mailData.subject,
      html: mailData.html,
    };

    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.response);
  } catch (error) {
    throw error;
  }
};

export default sendEmail;
