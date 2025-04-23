const nodemailer = require('nodemailer');

// Configurer le transporteur d'email
const transporter = nodemailer.createTransport({
    service: 'gmail', // ou un autre service comme Outlook, Yahoo, etc.
    auth: {
        user: process.env.EMAIL_USER, // Adresse email
        pass: process.env.EMAIL_PASS  // Mot de passe ou clé d'application
    }
});

// Fonction pour envoyer un email
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé :', info.response);
        return { success: true };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        return { success: false };
    }
};

// Exemple de modèles d'email
const emailTemplates = {
    inscription: (email, sessionInfo) => ({
        to: email,
        subject: `Inscription confirmée pour ${sessionInfo.title}`,
        text: `Vous êtes inscrit à la session ${sessionInfo.title} qui commence le ${sessionInfo.startdate}.`,
        html: `<p>Vous êtes inscrit à la session <strong>${sessionInfo.title}</strong> qui commence le <strong>${sessionInfo.startdate}</strong>.</p>`
    }),
    scheduleChange: (email, sessionInfo, changes) => ({
        to: email,
        subject: `Changements dans la session ${sessionInfo.title}`,
        text: `Les changements suivants ont été effectués : ${changes.join(', ')}`,
        html: `<p>Les changements suivants ont été effectués pour la session <strong>${sessionInfo.title}</strong> :</p><ul>${changes.map(change => `<li>${change}</li>`).join('')}</ul>`
    }),
    reminder: (email, sessionInfo) => ({
        to: email,
        subject: `Rappel pour la session ${sessionInfo.title}`,
        text: `La session ${sessionInfo.title} commence bientôt le ${sessionInfo.startdate}.`,
        html: `<p>La session <strong>${sessionInfo.title}</strong> commence bientôt le <strong>${sessionInfo.startdate}</strong>.</p>`
    })
};

// Fonction pour programmer des rappels
const scheduleReminder = (email, sessionInfo) => {
    console.log(`Rappel programmé pour ${email} concernant la session ${sessionInfo.title}`);
};

module.exports = {
    sendEmail,
    emailTemplates,
    scheduleReminder
};