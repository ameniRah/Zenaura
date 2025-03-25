const User = require("../Models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer"); // Pour envoyer des emails
const crypto = require("crypto"); // Pour générer un OTP sécurisé
const otpMap = new Map(); // Une structure temporaire pour stocker les OTPs associés aux emails


// 📨 1️⃣ Fonction pour envoyer un OTP à l'email de l'utilisateur
async function sendOTP(req, res) {
    try {
        const { email } = req.body; // Récupère l'email entré par l'utilisateur
        const user = await User.findOne({ email }); // Cherche l'utilisateur dans la base de données

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Générer un OTP (code à 6 chiffres aléatoire)
        const otp = crypto.randomInt(100000, 999999).toString();
        otpMap.set(email, otp); // Associe l'OTP à l'email de l'utilisateur (stocké temporairement)

        // Configuration du service d'envoi d'email (Hotmail/Outlook)
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',  // Serveur SMTP pour Hotmail/Outlook
            port: 587,                  // Port TLS
            secure: false,              // false signifie que TLS sera utilisé
            auth: {
                user: "ines.aouadi@esprit.tn",  // Ton adresse email Hotmail
                pass: "sknclhrvjwvpzslc"         // Ton mot de passe
            }
        });

        // Envoi de l'email avec l'OTP
        await transporter.sendMail({
            from: "ines.aouadi@esprit.tn",  // Ton adresse email Hotmail
            to: email,                    // L'email de l'utilisateur
            subject: "Code de récupération de mot de passe",
            text: `Votre code de récupération est : ${otp}`
        });

        res.status(200).json({ message: "OTP envoyé à votre email." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
// 🔑 2️⃣ Fonction pour vérifier l'OTP et mettre à jour le mot de passe
async function verifyOTP(req, res) {
    try {
        const { email, otp, newPassword } = req.body;

        // Vérifier si l'OTP entré correspond à celui stocké
        if (otpMap.get(email) !== otp) {
            return res.status(400).json({ message: "OTP invalide ou expiré" });
        }

        // Hacher le nouveau mot de passe avant de l'enregistrer
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe de l'utilisateur dans la base de données
        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        // Supprimer l'OTP après l'utilisation
        otpMap.delete(email);

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès !" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}


const secretKey = process.env.JWT_SECRET;

// Fonction d'inscription
async function register(req, res) {
    try {
        const { nom, prenom, email, password, role,dateNaissance} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            nom,
            prenom,
            email,
            password: hashedPassword,
            role,
            dateNaissance
        });

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        await newUser.save();

        res.status(201).json({
            message: 'Inscription réussie',
            token
        });

    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérification du statut de l'utilisateur
        if (user.status === "non autorisé") {
            return res.status(403).json({
                message: "Votre compte est non autorisé. Veuillez contacter l'administration pour plus d'informations."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const expiresIn = '2h';
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn }
        );  

        console.log(`Token généré avec succès ! Durée de validité : ${expiresIn}`);
        res.status(200).json({
            message: 'Connexion réussie',
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
async function authorizeUser(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        user.status = "non autorisé";  // Changer le statut
        await user.save();

        res.status(200).json({ message: 'Utilisateur non autorisé avec succès' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}


async function showusers(req, res) {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

async function showusersbyId(req, res) {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

async function showByName(req, res) {
    try {
        const { name } = req.params.username;
        const user = await User.findOne({ name });
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

async function deleteusers(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

async function updateuser(req, res) {
    try {
        // Vérifier si le mot de passe est présent dans les nouvelles données
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

module.exports = {  showusers, showusersbyId, showByName, deleteusers, updateuser, register, login,sendOTP,verifyOTP,authorizeUser };
