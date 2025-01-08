const express = require('express');
const mongoose = require("mongoose");
const multer = require("multer");
const Admission = require('../models/Admission');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// ✅ Configure Multer for file uploads
const storage = multer.memoryStorage(); // ✅ Store image in memory as Buffer
const upload = multer({ storage: storage });

// Create Admission with File Upload
router.post('/submit', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'casteCertificate', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log("Received Admission Form Data:", req.body);
        console.log("Received Files:", req.files);

        const admissionId = uuidv4(); // Generate unique ID
        const { title, firstName, middleName, lastName, motherName, gender, address, taluka, district, pinCode, state, mobile, email, aadhaarNumber, dateOfBirth, religion, casteCategory, caste, physicallyHandicapped } = req.body;
        const fullName = `${firstName} ${middleName} ${lastName}`.trim();
        const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();

        const newAdmission = new Admission({
            admissionId,
            title,
            firstName,
            middleName,
            lastName,
            fullName,
            motherName,
            gender,
            address,
            taluka,
            district,
            pinCode,
            state,
            mobile,
            email,
            aadhaarNumber,
            dateOfBirth,
            age,
            religion,
            casteCategory,
            caste,
            physicallyHandicapped,
            photo: req.files?.photo ? req.files.photo[0].buffer.toString("base64") : '',
            signature: req.files?.signature ? req.files.signature[0].buffer.toString("base64") : '',
            casteCertificate: req.files?.casteCertificate ? req.files.casteCertificate[0].buffer.toString("base64") : '',
            marksheet: req.files?.marksheet ? req.files.marksheet[0].buffer.toString("base64") : ''
        });

        await newAdmission.save();
        console.log("Admission Saved Successfully:", newAdmission);
        res.status(201).json({ message: 'Admission form submitted successfully', admissionId });
    } catch (error) {
        console.error("Error Saving Admission:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Retrieve All Admissions for Report Page
router.get('/report', async (req, res) => {
    try {
        const admissions = await Admission.find();
        console.log("Retrieved Admissions:", admissions);
        res.status(200).json(admissions);
    } catch (error) {
        console.error("Error Retrieving Admissions:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE an admission by ID
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting Admission ID:", id);

        // ✅ Validate if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // ✅ Find and delete the admission
        const deletedAdmission = await Admission.findByIdAndDelete(id);

        if (!deletedAdmission) {
            console.log("Admission not found for ID:", id);
            return res.status(404).json({ message: "Admission not found" });
        }

        console.log("Deleted Admission:", deletedAdmission);
        res.json({ message: "Admission deleted successfully", deletedAdmission });

    } catch (error) {
        console.error("Delete Error:", error.message);
        res.status(500).json({ message: "Error deleting admission: " + error.message });
    }
});

// UPDATE an admission by ID
router.put("/update/:id", upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "casteCertificate", maxCount: 1 },
    { name: "marksheet", maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received Update Request for ID:", id);
        console.log("Received Data:", req.body);
        console.log("Received Files:", req.files);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const existingAdmission = await Admission.findById(id);
        if (!existingAdmission) {
            return res.status(404).json({ message: "Admission not found" });
        }

        // ✅ Recalculate full name if firstName, middleName, or lastName is updated
        const firstName = req.body.firstName || existingAdmission.firstName;
        const middleName = req.body.middleName || existingAdmission.middleName;
        const lastName = req.body.lastName || existingAdmission.lastName;
        const fullName = `${firstName} ${middleName} ${lastName}`.trim();

        // ✅ Ensure physicallyHandicapped updates correctly
        const physicallyHandicapped = req.body.physicallyHandicapped !== undefined 
            ? req.body.physicallyHandicapped 
            : existingAdmission.physicallyHandicapped;

        // ✅ Update images only if new files are uploaded, otherwise keep existing images
        const updatedFields = {
            ...req.body,
            fullName,
            physicallyHandicapped,
            photo: req.files?.photo ? req.files.photo[0].buffer.toString("base64") : existingAdmission.photo,
            signature: req.files?.signature ? req.files.signature[0].buffer.toString("base64") : existingAdmission.signature,
            casteCertificate: req.files?.casteCertificate ? req.files.casteCertificate[0].buffer.toString("base64") : existingAdmission.casteCertificate,
            marksheet: req.files?.marksheet ? req.files.marksheet[0].buffer.toString("base64") : existingAdmission.marksheet
        };

        const updatedAdmission = await Admission.findByIdAndUpdate(id, updatedFields, { new: true });

        console.log("Updated Admission:", updatedAdmission);
        res.json({ message: "Admission updated successfully", admission: updatedAdmission });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Error updating admission: " + error.message });
    }
});

module.exports = router;  