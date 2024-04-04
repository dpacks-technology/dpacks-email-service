const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const validateSend = require("../validation/validateSend");

// config
const Keys = require("../config/Keys");

router.route('/send').post((req, res, next) => {

    console.log(req.body);

    if (req.body.api_key === Keys.API_KEY) {

        let to = req.body.to;
        let subject = req.body.subject;
        let message = req.body.message;
        let size = req.body.size;

        const {errors, isValid} = validateSend(req.body);

        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // email
        const FROM_EMAIL = Keys.GOOGLE_API_USER;
        const CLIENT_ID = Keys.GOOGLE_API_CLIENT_ID;
        const CLIENT_SECRET = Keys.GOOGLE_API_CLIENT_SECRET;
        const REDIRECT_URL = Keys.GOOGLE_API_REDIRECT_URL;
        const REFRESH_TOKEN = Keys.GOOGLE_API_REFRESH_TOKEN;
        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
        oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

        async function sendEmail(to, subject, message, size) {
            // Transporter
            const accessToken = await oAuth2Client.getAccessToken()
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: FROM_EMAIL,
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                }
            });

            let mailOptions = {
                from: FROM_EMAIL,
                to: to,
                subject: 'DPacks - ' + subject,
                html:
                    size === "sm" ?
                        '<div>' +
                        '<div style="width: 90%; height:100%; background-color: rgb(224,224,224); font-family: Arial; border-radius: 30px; text-align: center; color: #000; padding: 60px 20px 60px;">' +
                        '<h1 style="margin-bottom: 10px">DPacks</h3>' +
                        '<p style="font-size: 14px">' + message + '</p>' +
                        '<p style="margin-top: 20px; font-size: 8px">©' + new Date().getFullYear() + ' DPacks</p>' +
                        '</div>' +
                        '</div>' :
                        size === "md" ?
                            '<div>' +
                            '<div style="width: 90%; height:100%; background-color: rgb(224,224,224); font-family: Arial; border-radius: 30px; text-align: center; color: #000; padding: 60px 20px 60px;">' +
                            '<h1 style="margin-bottom: 10px">DPacks</h3>' +
                            '<p style="font-size: 24px">' + message + '</p>' +
                            '<p style="margin-top: 20px; font-size: 8px">©' + new Date().getFullYear() + ' DPacks</p>' +
                            '</div>' +
                            '</div>' :
                            '<div>' +
                            '<div style="width: 90%; height:100%; background-color: rgb(224,224,224); font-family: Arial; border-radius: 30px; text-align: center; color: #000; padding: 60px 20px 60px;">' +
                            '<h1 style="margin-bottom: 10px">DPacks</h3>' +
                            '<p style="font-size: 32px">' + message + '</p>' +
                            '<p style="margin-top: 20px; font-size: 8px">©' + new Date().getFullYear() + ' DPacks</p>' +
                            '</div>' +
                            '</div>'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error.message);
                    return res.status(500).json(error.message);
                }
                console.log(info);
                return res.status(200).json(info);
            });
        }

        sendEmail(to, subject, message, size).catch(console.error);

    } else {
        console.log("Unauthorized");
        res.status(403).json({server: "Unauthorized"})
    }
})


module.exports = router;