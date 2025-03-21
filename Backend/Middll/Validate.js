const Joi = require('joi');

const validateCourseCategory = (data) => {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(100).required(),
        description: Joi.string().trim().min(10).max(500).required()
    });

    return schema.validate(data);
};

const validateCours = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(10).max(500).required(),
        price: Joi.number().required(),
        category_id: Joi.string().required(),  // ID de catégorie, doit être un ObjectId valide
        instructor_id: Joi.string().required()  // ID d'instructeur, doit être un ObjectId valide
    });

    return schema.validate(data);
};

const validateCoursSession = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        cours_id: Joi.string().required(),  // Tu peux le remplacer par un ObjectId plus tard
        video_url: Joi.string().uri().required(),
        duration: Joi.number().required(),
        startdate: Joi.date().required(),
        enddate: Joi.date().required(),
        location: Joi.string().required(),
        capacity: Joi.number().required(),
        status: Joi.string().valid('active', 'inactive', 'completed').required(),
    });

    return schema.validate(data);
};


module.exports = {
    validateCourseCategory,
    validateCours,
    validateCoursSession
    
};
