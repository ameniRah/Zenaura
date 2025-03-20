const Disponibilities = require("../Models/Disponibilities");
//********************* CRUD DISPONIBILITÉS ******************* */

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
  
  module.exports = {
    addDisponibilite,
    getAllDisponibilites,
    getDisponibiliteById,
    getDisponibilitesByPsychologue,
    updateDisponibilite,
    deleteDisponibilite,
    getDisponibilitesByStatut
  };