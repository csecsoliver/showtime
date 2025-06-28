import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "showtime.coe@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export default function provideEmailTransporter() {
  console.log(process.env.GOOGLE_APP_PASSWORD);
  return transporter;
}
