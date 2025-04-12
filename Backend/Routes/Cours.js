const express = require('express');
const router = express.Router();
const { 
    createCours, 
    getAllCours, 
    getCoursById, 
    updateCours, 
    deleteCours,
    getCoursByCategory,
    getCoursByPrice,
    getCoursByPopularity,
    searchCours 
} = require('../Controller/CoursController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Cours:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - category_id
 *         - instructor_id
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category_id:
 *           type: string
 *         instructor_id:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/cours/add:
 *   post:
 *     summary: Ajouter un nouveau cours
 *     tags: [Cours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cours'
 *     responses:
 *       200:
 *         description: Cours ajouté avec succès
 */
router.post('/add', createCours);

/**
 * @swagger
 * /api/cours/all:
 *   get:
 *     summary: Récupérer tous les cours
 *     tags: [Cours]
 *     responses:
 *       200:
 *         description: Liste des cours
 */
router.get('/all', getAllCours);

/**
 * @swagger
 * /api/cours/get/{id}:
 *   get:
 *     summary: Récupérer un cours par ID
 *     tags: [Cours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du cours
 *     responses:
 *       200:
 *         description: Détails du cours
 */
router.get('/get/:id', getCoursById);

/**
 * @swagger
 * /api/cours/update/{id}:
 *   put:
 *     summary: Modifier un cours
 *     tags: [Cours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du cours
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cours'
 *     responses:
 *       200:
 *         description: Cours mis à jour
 */
router.put('/update/:id', updateCours);

/**
 * @swagger
 * /api/cours/delete/{id}:
 *   delete:
 *     summary: Supprimer un cours
 *     tags: [Cours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du cours
 *     responses:
 *       200:
 *         description: Cours supprimé
 */
router.delete('/delete/:id', deleteCours);

/**
 * @swagger
 * /api/cours/category/{categoryId}:
 *   get:
 *     summary: Récupérer les cours par catégorie
 *     tags: [Cours]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Liste des cours par catégorie
 */
router.get('/category/:categoryId', getCoursByCategory);

/**
 * @swagger
 * /api/cours/filter/price:
 *   get:
 *     summary: Récupérer les cours filtrés par prix
 *     tags: [Cours]
 *     parameters:
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *         description: Prix minimum
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *         description: Prix maximum
 *     responses:
 *       200:
 *         description: Liste des cours filtrés par prix
 */
router.get('/filter/price', getCoursByPrice);

/**
 * @swagger
 * /api/cours/filter/popularity:
 *   get:
 *     summary: Récupérer les cours par popularité
 *     tags: [Cours]
 *     responses:
 *       200:
 *         description: Liste des cours triés par popularité
 */
router.get('/filter/popularity', getCoursByPopularity);

/**
 * @swagger
 * /api/cours/search:
 *   get:
 *     summary: Rechercher des cours
 *     tags: [Cours]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Terme de recherche
 *     responses:
 *       200:
 *         description: Résultats de recherche des cours
 */
router.get('/search', searchCours);

module.exports = router;