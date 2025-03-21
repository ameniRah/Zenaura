const Disponibilities = require("../Models/Disponibilities");
const RendezVous = require("../Models/RendezVous");
const Evenement = require("../Models/Evenemnts");
const InscriptionEvenement = require("../Models/InscriEvenemenet");

//********************* Gestion de  disponiblités ******************* */

// ✅ Ajouter une disponibilité
async function addDisponibilite(req, res) {
    try {
      console.log(req.body);
      const disponibilite = new Disponibilities({
        id_psychologue: req.body.id_psychologue,
        date: req.body.date,
        heure_debut: req.body.heure_debut,
        heure_fin: req.body.heure_fin,
        statut: req.body.statut // "disponible", "occupé", "absent"
      });
  
      await disponibilite.save();
      res.status(201).json({ message: "Disponibilité ajoutée avec succès", disponibilite });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erreur lors de l'ajout de la disponibilité" });
    }
  }
  
  // ✅ Récupérer toutes les disponibilités
  async function getAllDisponibilites(req, res) {
    try {
      const disponibilites = await Disponibilities.find();
      res.status(200).json(disponibilites);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erreur lors de la récupération des disponibilités" });
    }
  }
  
  // ✅ Récupérer une disponibilité par ID
  async function getDisponibiliteById(req, res) {
    try {
      const disponibilite = await Disponibilities.findById(req.params.id);
      res.status(200).json(disponibilite);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erreur lors de la récupération de la disponibilité" });
    }
  }
  
  // ✅ Récupérer les disponibilités d’un psychologue spécifique
  async function getDisponibilitesByPsychologue(req, res) {
    try {
      const disponibilites = await Disponibilities.find({ id_psychologue: req.params.id_psychologue });
      res.status(200).json(disponibilites);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erreur lors de la récupération des disponibilités du psychologue" });
    }
  }
  
  // ✅ Modifier une disponibilité
  async function updateDisponibilite(req, res) {
    try {
      const disponibilite = await Disponibilities.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
  
      res.status(200).json({ message: "Disponibilité mise à jour", disponibilite });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erreur lors de la mise à jour de la disponibilité" });
    }
  }
  
  // ✅ Supprimer une disponibilité
  async function deleteDisponibilite(req, res) {
    try {
      const disponibilite = await Disponibilities.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Disponibilité supprimée", disponibilite });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erreur lors de la suppression de la disponibilité" });
    }
  }
  
  // ✅ Récupérer les disponibilités par statut (disponible, occupé, absent)
  async function getDisponibilitesByStatut(req, res) {
    try {
      const disponibilites = await Disponibilities.find({ statut: req.params.statut });
      res.status(200).json(disponibilites);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erreur lors du filtrage des disponibilités" });
    }
  }

//********************* Gestion de rendezvous ******************* */


// ✅ Ajouter un rendez-vous (avec vérification des disponibilités)
async function addRendezVous(req, res) {
    try {
        console.log(req.body);

        // Vérifier si le psychologue est disponible à la date et heure demandées
        const disponibilite = await Disponibilities.findOne({
            id_psychologue: req.body.id_psychologue,
            date: req.body.date,
            heure_debut: { $lte: req.body.heure }, // Heure de début ≤ heure demandée
            heure_fin: { $gte: req.body.heure },   // Heure de fin ≥ heure demandée
            statut: "disponible"
        });

        if (!disponibilite) {
            return res.status(400).json({ message: "Le psychologue n'est pas disponible à ce créneau." });
        }

        // Créer le rendez-vous
        const rendezVous = new RendezVous({
            id_psychologue: req.body.id_psychologue,
            id_patient: req.body.id_patient,
            date: req.body.date,
            heure: req.body.heure,
            motif: req.body.motif,
            statut: "en attente"
        });

        await rendezVous.save();
        res.status(201).json({ message: "Rendez-vous ajouté avec succès", rendezVous });

        // Mettre à jour la disponibilité comme "occupé"
        await Disponibilities.findByIdAndUpdate(disponibilite._id, { statut: "occupé" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur lors de l'ajout du rendez-vous" });
    }
}

// ✅ Récupérer tous les rendez-vous
async function getAllRendezVous(req, res) {
    try {
        const rendezVous = await RendezVous.find();
        res.status(200).json(rendezVous);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
    }
}

// ✅ Récupérer un rendez-vous par ID
async function getRendezVousById(req, res) {
    try {
        const rendezVous = await RendezVous.findById(req.params.id);
        res.status(200).json(rendezVous);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur lors de la récupération du rendez-vous" });
    }
}

// ✅ Récupérer les rendez-vous d’un psychologue spécifique
async function getRendezVousByPsychologue(req, res) {
    try {
        const rendezVous = await RendezVous.find({ id_psychologue: req.params.id_psychologue });
        res.status(200).json(rendezVous);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous du psychologue" });
    }
}

// ✅ Modifier un rendez-vous (par exemple, reprogrammer ou changer le statut)
async function updateRendezVous(req, res) {
    try {
        const rendezVous = await RendezVous.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Rendez-vous mis à jour", rendezVous });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur lors de la mise à jour du rendez-vous" });
    }
}

// ✅ Annuler un rendez-vous
async function deleteRendezVous(req, res) {
    try {
        const rendezVous = await RendezVous.findByIdAndDelete(req.params.id);

        if (rendezVous) {
            // Rendre la disponibilité à nouveau "disponible"
            await Disponibilities.findOneAndUpdate(
                { id_psychologue: rendezVous.id_psychologue, date: rendezVous.date },
                { statut: "disponible" }
            );
        }

        res.status(200).json({ message: "Rendez-vous annulé", rendezVous });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur lors de l'annulation du rendez-vous" });
    }
}

// ✅ Récupérer les rendez-vous par statut (en attente, confirmé, annulé)
async function getRendezVousByStatut(req, res) {
    try {
        const rendezVous = await RendezVous.find({ statut: req.params.statut });
        res.status(200).json(rendezVous);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur lors du filtrage des rendez-vous" });
    }
}




  module.exports = {
    addDisponibilite,
    getAllDisponibilites,
    getDisponibiliteById,
    getDisponibilitesByPsychologue,
    updateDisponibilite,
    deleteDisponibilite,
    getDisponibilitesByStatut,
    addRendezVous,
    getAllRendezVous,
    getRendezVousById,
    getRendezVousByPsychologue,
    updateRendezVous,
    deleteRendezVous,
    getRendezVousByStatut,
    addEvenement,
    getAllEvenements,
    getEvenementById,
    updateEvenement,
    deleteEvenement,
    inscrireEvenement,
    getInscriptionsByEvenement,
    annulerInscription
  };