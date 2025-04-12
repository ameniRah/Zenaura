const cron = require('node-cron');
const Notification = require('./models/Notification');
const Patient = require('./models/Patient');
const sendSMS = require('./utils/sendSMS'); // ta fonction d'envoi
const sendEmail = require('./utils/sendEmail'); // si tu veux aussi envoyer un mail

cron.schedule('*/5 * * * *', async () => {
  console.log("🔁 Vérification des notifications à envoyer...");

  try {
    const now = new Date();

    const notifications = await Notification.find({
      envoye: false,
      date_rappel: { $lte: now }
    });

    for (const notif of notifications) {
      const patient = await Patient.findById(notif.id_patient);

      if (!patient) continue;

      // ✅ Envoi du rappel
      await sendSMS(patient.telephone, notif.message);
      await sendEmail(patient.email, "Rappel", notif.message);

      notif.envoye = true;
      await notif.save();

      console.log(`✅ Notification envoyée au patient ${patient.nom}`);
    }
  } catch (err) {
    console.error("❌ Erreur dans le cron des rappels :", err);
  }
});
