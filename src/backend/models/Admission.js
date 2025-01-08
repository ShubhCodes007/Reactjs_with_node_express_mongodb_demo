// backend/models/Admission.js
const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
    admissionId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
    motherName: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    taluka: { type: String, required: true },
    district: { type: String, required: true },
    pinCode: { type: String, required: true, match: /^[0-9]{6}$/ },
    state: { type: String, required: true },
    mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    aadhaarNumber: { type: String, required: true, match: /^[0-9]{12}$/ },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },
    religion: { type: String, required: true },
    casteCategory: { type: String, required: true },
    caste: { type: String, required: true },
    casteCertificate: { type: String },
    marksheet: { type: String },
    photo: { type: String },
    signature: { type: String },
    physicallyHandicapped: { type: String, required: true, enum: ['Yes', 'No'] }
}, { timestamps: true });

module.exports = mongoose.model('Admission', AdmissionSchema);
