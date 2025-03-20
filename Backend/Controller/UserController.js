const User = require("../Models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function add(req, res) {
    try {
        const user = new User({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email:req.body.email,
            password: req.body.password,
            role: req.body.role,
            dateInscription: req.body.dateInscription,
            isAnonymous:req.body.isAnonymous
          
        });

        await user.save();
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send
    }
}
const secretKey = process.env.JWT_SECRET; //la clé secrète est stockée dans une variable d'environnement appelée JWT_SECRET
// Fonction d'inscription
async function register(req, res) {
    try {
        const { nom, prenom, email, password, role } = req.body;

        // Vérifier si l'utilisateur existe déjà avec cet email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Si l'utilisateur existe déjà, renvoyer une erreur avant toute modification dans la base
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        // Si l'utilisateur n'existe pas, hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({
            nom,
            prenom,
            email,
            password: hashedPassword,
            email,
            role
        });

        // Sauvegarder le nouvel utilisateur dans la base de données
        await newUser.save();  // Si cette ligne échoue, le bloc catch sera exécuté

        // Générer un token JWT pour l'utilisateur
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // Le token expire après 1 heure
        );

        // Répondre avec le token JWT
        res.status(201).json({
            message: 'Inscription réussie',
            token
        });
    } catch (err) {
        // Si une erreur survient, ici tu captures toutes les erreurs possibles
        console.error('Erreur serveur:', err);

       

        // Autres erreurs
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
async function login(req, res) {
    try {
        // Récupérer les informations envoyées par l'utilisateur dans la requête
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe dans la base de données
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Comparer le mot de passe entré avec celui stocké dans la base de données (haché)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Si l'email et le mot de passe sont corrects, générer un JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }// Clé secrète utilisée pour signer le JWT
            
        );

        // Répondre avec le token JWT
        res.status(200).json({
            message: 'Connexion réussie',
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

async function showusers(req, res) {
    try {
        
        const user = await User.find();
        
        res.status(200).send(user)
        
    } catch (err) {
        console.log(err)
        
    }
}
async function showusersbyId(req, res) {
    try {
        
        const user= await User.findById(req.params.id);
        
        res.status(200).send(user)
        
    } catch (err) {
        console.log(err)
        
    }

}
async function showByName (req, res)  {
    try {
        const { name } = req.params.username
        const user = await User.findOne(name);
        
        res.status(200).send(user)
        
    } catch (err) {
        console.log(err)
        
    }

}
async function deleteusers (req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        res.status(200).send(user)
        
    } catch (err) {
        console.log(err)
        
    }

}
async function updateuser(req, res) {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); // new besh taatik l data baad update
        
        res.status(200).send(user)
        
    } catch (err) {
        console.log(err)
        
    }

}

module.exports = { add,showusers,showusersbyId,showByName,deleteusers,updateuser,register,login}

