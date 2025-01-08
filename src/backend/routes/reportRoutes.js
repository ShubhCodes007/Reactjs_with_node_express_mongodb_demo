// backend/routes/reportRoutes.js
const express = require('express');
const Admission = require('../models/Admission');
const ExcelJS = require('exceljs');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const admissions = await Admission.find();
        res.json(admissions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving admissions' });
    }
});

module.exports = router;


// Export Admissions to Excel
router.get('/export', async (req, res) => {
    try {
        const admissions = await Admission.find();
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Admissions');
        
        worksheet.columns = [
            { header: 'Admission ID', key: 'admissionId', width: 20 },
            { header: 'Title', key: 'title', width: 10},
            { header: 'Full Name', key: 'fullName', width: 30},
            { header: 'Mobile', key: 'mobile', width: 15},
            { header: 'Email', key: 'email', width: 30},
            { header: 'Gender', key: 'gender', width: 10},
            { header: 'Date of Birth', key: 'dateOfBirth', width: 15},
            { header: 'Age', key: 'age', width: 10},
            { header: 'Address', key: 'address', width: 30},
            { header: 'Taluka', key: 'taluka', width: 15 },
            { header: 'District', key: 'district', width: 15 },
            { header: 'Pin Code', key: 'pinCode', width: 15 },
            { header: 'Aadhaar Number', key: 'aadhaarNumber', width: 20 },
            { header: 'Religion', key: 'religion', width: 15 },
            { header: 'Caste', key: 'caste', width: 15 },
            { header: 'Caste Category', key: 'casteCategory', width: 15 },
            { header: 'State', key: 'state', width: 20 },
            { header: 'Physically Handicapped', key: 'physicallyHandicapped', width: 20 },
            { header: 'Photo', key: 'photo', width: 20 },
            { header: 'Signature', key: 'signature', width: 20 },
            { header: 'Marksheet', key: 'marksheet', width: 20 },
            { header: 'Caste Certificate', key: 'casteCertificate', width: 20 },
        ];
        
        admissions.forEach(admission => {
            worksheet.addRow(admission);
        });
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=admissions.xlsx');
        
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
