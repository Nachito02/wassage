import nodemailer from 'nodemailer';

export const emailRegister = async (data) =>  {
    const {email, name, token} = data;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });


    //email info 

    const info = await transport.sendMail({
        from : 'Chat WithMe',
        to: email,
        subject: 'ChatWithMe | Verify Account',
        text: 'Verify your account in ChatWithMe',
        html: `<p> Hi! ${name} Verify your account in ChatWithMe to start sending funny messages</p>
                <a href="${process.env.FRONTEND_URL}/confirm/${token}"> Click here to verify </a>
        `
    })
}