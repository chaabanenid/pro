const nodemailer = require("nodemailer");
var aws = require("aws-sdk");
var hbs = require("nodemailer-express-handlebars");
const path = require("path");
const { nextTick } = require("process");
const sendEmail = async (email, subject, text, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      secure: process.env.secure,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    // load AWS SES
    var ses = new aws.SES({ apiVersion: "latest" });

    const handlebarOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("src/api/Views"),
        defaultLayout: false,
      },
      viewPath: path.resolve("src/api/Views"),
      extName: ".handlebars",
    };

    transporter.use("compile", hbs(handlebarOptions));
    console.log(transporter.auth);

    var params = {
      Destination: {
        ToAddresses: [email],
      },
      // Message: {
      //   Body: {
      //     Html: {
      //       Charset: "UTF-8",
      //       Data: '',
      //     },
      //     Text: {
      //       Charset: "UTF-8",
      //       Data: "This is the message body in text format.",
      //     },
      //   },
      //   Subject: {
      //     Charset: "UTF-8",
      //     Data: "Test email",
      //   },
      // },

      Template: "AWS-SES-HTML-DEMO-TEMPLATE",
      TemplateData: '{"url":"' + text + '"}' /* required */,
      Source: "duetodata123@gmail.com",
    };
    ses.sendTemplatedEmail(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data); // successful response
      /*
       data = {
        MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
       }
       */
    });

    console.log("email sent successfully");
  } catch (error) {
    console.log(error);
  }
};
module.exports = { sendEmail };
