const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/authMiddleware");
const cvController = require("../controllers/cvController");

// Protected routes (only accessible with valid JWT token)
router.post('/', verifyToken, cvController.createCV);
router.get('/', verifyToken, cvController.getAllCVs);
router.get('/:id', verifyToken, cvController.getCVById);
router.put('/:id', verifyToken, cvController.updateCV);
router.delete('/:id', verifyToken, cvController.deleteCV);

module.exports = router;
