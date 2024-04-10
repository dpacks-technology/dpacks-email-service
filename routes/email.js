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
        let template = req.body.template || "default";

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
                from: '"DPacks Notifications" <' + FROM_EMAIL + '>',
                to: to,
                subject: 'DPacks - ' + subject,
                html:
                    template === "reset" ?
                        '<table width=\"100%\" height=\"100%\" style=\"min-width:348px; background-color:#18181b;border-radius:24px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" lang=\"en\"> <style>@import url(' + "'" + 'https://fonts.googleapis.com/css2?family=Roboto&display=swap' + "'" + '); @import url(' + "'" + 'https://fonts.googleapis.com/css2?family=Koulen&display=swap' + "'" + '); </style> <tbody> <tr height=\"32\" style=\"height:32px\"> <td></td></tr><tr align=\"center\"> <td> <div> <div></div></div><table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"padding-bottom:20px;max-width:516px;min-width:220px\"> <tbody> <tr> <td width=\"8\" style=\"width:8px\"></td><td> <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"> <tbody> <tr> <td width=\"13\" style=\"width:13px\"></td><td style=\"direction:ltr\"> <span></span> </td></tr></tbody> </table> </div><div style=\"color:#fff;border-radius:30px;padding:60px 30px;background-color:#27272a;\" align=\"center\" class=\"m_-6525566929677609204mdv2rw\"><img src=\"https://cdn.jsdelivr.net/gh/dpacks-technology/dpacks-connector-js/dpacks-logo-w.png\" width=\"200\" aria-hidden=\"true\" style=\"margin-bottom:30px\" alt=\"DPacks\" class=\"CToWUd\"> <div style=\"font-family:' + "'" + 'Radio Canada' + "'" + ', sans-serif;border-bottom:1px solid #4b4b4b;color:rgba(255,255,255,1);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word\"> <div style=\"font-size:20px;font-family: ' + "'" + 'Radio Canada' + "'" + ', sans-serif;\"> Password Reset </div><div style=\"width:100%;text-align:center;margin: 0px 0px 10px 0;font-family: ' + "'" + 'Radio Canada' + "'" + ', sans-serif;\"> <span style=\"padding:5px 10px;border-radius:5px;color:#006FEE;text-decoration:none;font-size:13px;\"><strong><a style=\"color:#006FEE;text-decoration:none;\">' + to + '</a></strong></span> </div></div><div style=\"text-align:center;font-family:' + "'" + 'Radio Canada' + "'" + ', sans-serif;font-size:14px;color:rgba(255,255,255,1);line-height:20px;padding-top:20px;\"> <br>Click below to reset your DPacks account password<div style=\"padding-top:32px;text-align:center\"><a href=\"http://localhost:3006/reset/' + message + '\" style=\"font-family:' + "'" + 'Radio Canada' + "'" + ', sans-serif;line-height:16px;color:#ffffff;font-weight:400;text-decoration:none;font-size:14px;display:inline-block;padding:10px 24px;background-color:#006FEE;box-shadow:0px 5px 20px #006FEE6b;border-radius:5px;min-width:90px\" target=\"_blank\" data-saferedirecturl=\"#\">Reset</a></div></div><br/> <div style=\"padding-top:20px;font-size:10px;line-height:16px;color:#006FEE;letter-spacing:0.3px;text-align:center;font-family: ' + "'" + 'Radio Canada' + "'" + ', sans-serif;\"> If you did not register with this email on DPacks, You can safely ignore this email. Only a person with access to your email can create an account on behalf of this email.</div></div><div style=\"text-align:left\"> <div style=\"font-family:' + "'" + 'Radio Canada' + "'" + ', sans-serif;color:rgba(255,255,255,0.7);font-size:11px;line-height:18px;padding-top:12px;text-align:center\"> <div style=\"direction:ltr\">&copy; ' + new Date().getFullYear() + ' DPacks. All rights reserved.</div></div></div></td><td width=\"8\" style=\"width:8px\"></td></tr></tbody> </table> </td></tr><tr height=\"32\" style=\"height:32px\"> <td></td></tr></tbody></table>' :
                        size === "sm" ?
                            '<div>' +
                            '<div style="width: 90%; height:100%; background-color: rgb(224,224,224); font-family: Arial; border-radius: 30px; text-align: center; color: #000; padding: 60px 20px 60px;">' +
                            '<h1 style="margin-bottom: 10px">DPacks</h3>' +
                            '<p style="font-size: 14px">' + message + '</p>' +
                            '<p style="margin-top: 20px; font-size: 8px">©' + new Date().getFullYear() + ' DPacks</p>' +
                            '</div>' +
                            '</div>'
                            :
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