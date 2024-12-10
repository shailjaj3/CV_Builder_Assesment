const CV = require("../models/cv");

// Create a new CV
exports.createCV = async (req, res) => {
    try {
        const { layout, basicDetails, education, experience, projects, skills, socialProfiles } = req.body;

        const newCV = new CV({
            user: req.userId,  // Associate the logged-in user's ID with the CV
            layout,
            basicDetails: { ...basicDetails },
            education,
            experience,
            projects,
            skills,
            socialProfiles,
        });

        // Save the CV to the database
        await newCV.save();

        res.status(201).json({
            success: true,
            message: "CV created successfully!",
            data: newCV,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all CVs for the logged-in user
exports.getAllCVs = async (req, res) => {
    try {
        // Find all CVs where the user ID matches the logged-in user's ID
        const cvs = await CV.find({ user: req.userId });

        res.status(200).json({
            success: true,
            data: cvs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a specific CV by ID, but only if it belongs to the logged-in user
exports.getCVById = async (req, res) => {
    try {
        // Find the CV by ID and ensure it's owned by the logged-in user
        const cv = await CV.findOne({ _id: req.params.id, user: req.userId });

        if (!cv) {
            return res.status(404).json({ success: false, message: "CV not found or not authorized" });
        }

        res.status(200).json({
            success: true,
            data: cv,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a CV by ID, but only if it belongs to the logged-in user
exports.updateCV = async (req, res) => {
    try {

        const {
            layout,
            basicDetails,
            education,
            experience,
            projects,
            skills,
            socialProfiles,
        } = req.body;

        // Extract imageUrl from basicDetails or req.file
        const imageUrl = basicDetails?.imageUrl || req.file?.path;

        const updateData = {
            layout,
            basicDetails: {
                ...basicDetails,
                imageUrl,
            },
            education,
            experience,
            projects,
            skills,
            socialProfiles,
        };


        const cv = await CV.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            updateData,
            { new: true }
        );

        if (!cv) {
            return res.status(404).json({ success: false, message: 'CV not found or not authorized' });
        }

        res.status(200).json({
            success: true,
            message: 'CV updated successfully!',
            data: cv,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a CV by ID, but only if it belongs to the logged-in user
exports.deleteCV = async (req, res) => {
    try {
        // Ensure the CV belongs to the logged-in user before deleting
        const cv = await CV.findOneAndDelete({ _id: req.params.id, user: req.userId });

        if (!cv) {
            return res.status(404).json({ success: false, message: "CV not found or not authorized" });
        }

        res.status(200).json({
            success: true,
            message: "CV deleted successfully!",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
