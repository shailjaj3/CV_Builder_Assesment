const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    layout: {
        type: String
    },
    basicDetails: {
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        introductoryParagraph: { type: String },
        imageUrl: { type: String } // Field to store image URL
    },
    education: [{
        degreeName: { type: String },
        institution: { type: String },
        percentage: { type: String }
    }],
    experience: [{
        organizationName: { type: String },
        joiningLocation: { type: String },
        position: { type: String },
        CTC: { type: String },
        joiningDate: { type: String },
        leavingDate: { type: String },
        technologies: [{ type: String }]
    }],
    projects: [{
        projectTitle: { type: String },
        teamSize: { type: String },
        duration: { type: String },
        technologies: [{ type: String }],
        description: { type: String }
    }],
    skills: [{
        skillName: { type: String },
        perfection: { type: String }
    }],
    socialProfiles: [{
        platformName: { type: String },
        profileLink: { type: String }
    }]
});

module.exports = mongoose.model('CV', cvSchema);
