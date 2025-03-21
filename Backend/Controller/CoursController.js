//CoursCategory
const CoursCategory = require('../models/CoursCategory');


//Cours
const Cours = require('../Models/Cours');

//coursseesion
const CoursSession = require('../Models/CoursSession');

//Validation
const { validateCourseCategory, validateCours, validateCoursSession  } = require('../Middll/Validate');


//CoursCategory
const createCategory = async (req, res) => {
    const { error } = validateCourseCategory(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const category = new CoursCategory({
        title: req.body.title,
        description: req.body.description,
        created_at: new Date(),
        updated_at: new Date()
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await CoursCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await CoursCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateCategory = async (req, res) => {
    const { error } = validateCourseCategory(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const category = await CoursCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        category.title = req.body.title;
        category.description = req.body.description;
        category.updated_at = new Date();

        const updatedCategory = await category.save();
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await CoursCategory.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Cours
const createCours = async (req, res) => {
    const { error } = validateCours(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const cours = new Cours({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category_id: req.body.category_id, // ID de catégorie
        instructor_id: req.body.instructor_id, // ID d'instructeur
        created_at: new Date(),
        updated_at: new Date()
    });

    try {
        const newCours = await cours.save();
        res.status(201).json(newCours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllCours = async (req, res) => {
    try {
        const cours = await Cours.find().populate('category_id instructor_id'); // Remplir les catégories et instructeurs
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCoursById = async (req, res) => {
    try {
        const cours = await Cours.findById(req.params.id).populate('category_id instructor_id');
        if (!cours) return res.status(404).json({ message: 'Cours non trouvé' });
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCours = async (req, res) => {
    const { error } = validateCours(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const cours = await Cours.findById(req.params.id);
        if (!cours) return res.status(404).json({ message: 'Cours non trouvé' });

        cours.title = req.body.title;
        cours.description = req.body.description;
        cours.price = req.body.price;
        cours.category_id = req.body.category_id;
        cours.instructor_id = req.body.instructor_id;
        cours.updated_at = new Date();

        const updatedCours = await cours.save();
        res.status(200).json(updatedCours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCours = async (req, res) => {
    try {
        const cours = await Cours.findByIdAndDelete(req.params.id); // Utilisation de findByIdAndDelete
        if (!cours) return res.status(404).json({ message: 'Cours non trouvé' });

        res.status(200).json({ message: 'Cours supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une session de cours
const createCoursSession = async (req, res) => {
    const { title, cours_id, video_url, duration, startdate, enddate, location, capacity, status } = req.body;
    
    const session = new CoursSession({
        title,
        cours_id,
        video_url,
        duration,
        startdate,
        enddate,
        location,
        capacity,
        status,
        created_at: new Date(),
        updated_at: new Date(),
    });

    try {
        const newSession = await session.save();
        res.status(201).json(newSession);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer toutes les sessions de cours
const getAllCoursSessions = async (req, res) => {
    try {
        const sessions = await CoursSession.find();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une session de cours par ID
const getCoursSessionById = async (req, res) => {
    try {
        const session = await CoursSession.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session non trouvée' });
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une session de cours
const updateCoursSession = async (req, res) => {
    const { title, cours_id, video_url, duration, startdate, enddate, location, capacity, status } = req.body;
    
    try {
        const session = await CoursSession.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session non trouvée' });

        session.title = title;
        session.cours_id = cours_id;
        session.video_url = video_url;
        session.duration = duration;
        session.startdate = startdate;
        session.enddate = enddate;
        session.location = location;
        session.capacity = capacity;
        session.status = status;
        session.updated_at = new Date();

        const updatedSession = await session.save();
        res.status(200).json(updatedSession);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une session de cours
const deleteCoursSession = async (req, res) => {
    try {
        const session = await CoursSession.findByIdAndDelete(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session non trouvée' });

        res.status(200).json({ message: 'Session supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    createCours,
    getAllCours,
    getCoursById,
    updateCours,
    deleteCours,
    createCoursSession,
    getAllCoursSessions,
    getCoursSessionById,
    updateCoursSession,
    deleteCoursSession
};