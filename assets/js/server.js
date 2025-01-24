require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use(cors());

app.post('/enviar-correo', (req, res) => {
    const { to, nombre, password, user } = req.body;

    const server = process.env.API_SERVER;

    const htmlContent = `
    <div dir="ltr" class="es-wrapper-color">
    <!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
        </v:background>
    <![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
                <td class="esd-email-paddings" valign="top">
                    <table class="esd-header-popover es-header" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td class="esd-stripe" align="center">
                                    <table class="es-header-body" width="800" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                        <tbody>
                                            <tr>
                                                <td class="esd-structure es-p20t es-p20r es-p20l" align="left">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tbody>
                                                            <tr>
                                                                <td width="760" class="esd-container-frame" align="center" valign="top">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://fijbjmr.stripocdn.email/content/guids/CABINET_c9c4d81d9950590c056e581ce131079d930a9484653f4f775be25a45708fb14f/images/logo_bestvoiper_mesa_de_trabajo_1_copia_2_blH.png" alt style="display: block;" width="460"></a></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td class="esd-stripe" align="center">
                                    <table class="es-content-body" width="800" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                        <tbody>
                                            <tr>
                                                <td class="es-p20t es-p20r es-p20l esd-structure" align="left">
                                                    <table width="100%" cellspacing="0" cellpadding="0">
                                                        <tbody>
                                                            <tr>
                                                                <td class="esd-container-frame" width="760" valign="top" align="center">
                                                                    <table width="100%" cellspacing="0" cellpadding="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-text es-p5">
                                                                                    <p style="line-height: 200%; font-size: 23px;"><strong>&nbsp;Usuario ${user}, tu contraseña de acceso</strong></p>
                                                                                    <p style="line-height: 200%;">Te indicamos tu contraseña para acceder al sistema</p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="esd-footer-popover es-footer" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td class="esd-stripe" align="center">
                                    <table class="es-footer-body" width="800" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                        <tbody>
                                            <tr>
                                                <td class="esd-structure es-p10" align="left">
                                                    <!--[if mso]><table width="780" cellpadding="0" cellspacing="0"><tr><td width="267" valign="top"><![endif]-->
                                                    <table cellpadding="0" cellspacing="0" align="left" class="es-left">
                                                        <tbody>
                                                            <tr>
                                                                <td width="247" class="esd-container-frame es-m-p20b" align="center" valign="top">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="left" class="esd-block-text">
                                                                                    <p><br></p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                                <td class="es-hidden" width="20"></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <!--[if mso]></td><td width="247" valign="top"><![endif]-->
                                                    <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                        <tbody>
                                                            <tr>
                                                                <td width="247" align="left" class="esd-container-frame es-m-p20b">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-text es-p10" bgcolor="#31cb4b"><span style="font-size:33px;"><strong style="font-size: 23px; color: white;">${password}</strong></span></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <!--[if mso]></td><td width="20"></td><td width="246" valign="top"><![endif]-->
                                                    <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                                                        <tbody>
                                                            <tr>
                                                                <td width="246" align="left" class="esd-container-frame">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="left" class="esd-block-text">
                                                                                    <p><br></p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="esd-structure" align="left">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tbody>
                                                            <tr>
                                                                <td width="800" class="esd-container-frame" align="center" valign="top">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-text es-p15">
                                                                                    <p>Si tiene un error con su contraseña, contacte al administrador.</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-text es-p20">
                                                                                    <p style="line-height: 120%;">Recibió este correo electrónico porque usted o alguien inició una operación de recuperación de contraseña de su cuenta.</p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="esd-structure es-p20t es-p20r" align="left">
                                                    <!--[if mso]><table width="780" cellpadding="0" cellspacing="0"><tr><td width="380" valign="top"><![endif]-->
                                                    <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                        <tbody>
                                                            <tr>
                                                                <td width="380" class="es-m-p20b esd-container-frame" align="left">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-text" esd-links-color="#333333">
                                                                                    <p><strong><a href="https://${server}/bestcallcenter" target="_blank" style="color: #333333;">Sitio web</a></strong></p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <!--[if mso]></td><td width="20"></td><td width="380" valign="top"><![endif]-->
                                                    <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                                                        <tbody>
                                                            <tr>
                                                                <td width="380" align="left" class="esd-container-frame">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-text" esd-links-color="#333333">
                                                                                    <p style="color: #333333;"><strong><a href="https://www.bestvoiper.com.co" target="_blank">Términos de servicio</a></strong></p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="esd-structure es-p20t es-p20r" align="left">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tbody>
                                                            <tr>
                                                                <td width="780" class="esd-container-frame" align="center" valign="top">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-text es-p40">
                                                                                    <p>© 2012 Todos los derechos reservados.</p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`;


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "info@bestvoiper.com",
            pass: "Bestvoiper2024*"
        }
    });

    const mailOptions = {
        from: 'no-reply@bestvoiper.com',
        to: to,
        subject: "¡Hola " + nombre + "!",
        html: htmlContent
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString()) + process.env.GMAIL_USER + " " + process.env.GMAIL_PASS;
        }
        res.status(200).send('Correo enviado: ' + info.response);
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
