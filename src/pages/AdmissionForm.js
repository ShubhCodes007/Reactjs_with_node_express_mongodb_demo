import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from './AdmissionForm.module.css';
import { districtTalukaData } from './districtTalukaData';
import { useState } from 'react';
import Swal from 'sweetalert2';





const religionOptions = [
  { value: 'Hindu', label: 'Hindu' },
  { value: 'Islam', label: 'Islam' },
  { value: 'Christian', label: 'Christian' },
  { value: 'Sikh', label: 'Sikh' },
  { value: 'Buddhism', label: 'Buddhism' },
  { value: 'Jainism', label: 'Jainism' },
  { value: 'Other', label: 'Other' },
];

const AdmissionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const admissionToEdit = location.state?.admission || null;
  const [talukas, setTalukas] = useState([]);
  const [titleOptions, setTitleOptions] = useState([]);

 
  const formik = useFormik({
    initialValues: {
      _id: admissionToEdit?._id || "",
      title: admissionToEdit?.title || '',
      firstName: admissionToEdit?.firstName || '',
      middleName: admissionToEdit?.middleName || '',
      lastName: admissionToEdit?.lastName || '',
      motherName: admissionToEdit?.motherName || '',
      gender: admissionToEdit?.gender || '',
      address: admissionToEdit?.address || '',
      taluka: admissionToEdit?.taluka || '',
      district: admissionToEdit?.district || '',
      state: 'Maharashtra',
      pinCode: admissionToEdit?.pinCode || '',
      //state: admissionToEdit?.state || '',
      mobile: admissionToEdit?.mobile || '',
      email: admissionToEdit?.email || '',
      aadhaarNumber: admissionToEdit?.aadhaarNumber || '',
      dateOfBirth: admissionToEdit?.dateOfBirth || '',
      religion: admissionToEdit?.religion || '',
      casteCategory: admissionToEdit?.casteCategory || '',
      caste: admissionToEdit?.caste || '',
      physicallyHandicapped: admissionToEdit?.physicallyHandicapped || 'NO',
      casteCertificate: admissionToEdit?.casteCertificate || '',
      marksheet: admissionToEdit?.marksheet || '',
      photo: admissionToEdit?.photo || '',
      signature: admissionToEdit?.signature || '',
      
    },
    enableReinitialize: true, 
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      firstName: Yup.string()
      .matches(/^[A-Z][a-z]*$/, 'First name must start with a capital letter and contain only alphabets')
      .required('First name is required'),
      middleName: Yup.string()
      .matches(/^[A-Z][a-z]*$/, 'Middle name must start with a capital letter and contain only alphabets'),
      lastName: Yup.string()
      .matches(/^[A-Z][a-z]*$/, 'Last name must start with a capital letter and contain only alphabets')
      .required('Last name is required'),
      motherName: Yup.string()
      .matches(/^[A-Z][a-z]*$/, 'Mother name must start with a capital letter and contain only alphabets')
      .required('Mother name is required'),
      gender: Yup.string().required('Gender is required'),
      address: Yup.string().required('Address is required'),
      taluka: Yup.string().required('Taluka is required'),
      district: Yup.string().required('District is required'),
      pinCode: Yup.string().matches(/^\d{6}$/, 'Must be a valid 6-digit pin code').required('Pin code is required'),
      mobile: Yup.string()
  .matches(/^[6-9]\d{9}$/, 'Must be a valid 10-digit number starting with 6, 7, 8, or 9')
  .required('Mobile number is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      aadhaarNumber: Yup.string().matches(/^\d{12}$/, 'Must be a valid 12-digit Aadhaar number').required('Aadhaar number is required'),
      dateOfBirth: Yup.date()
  .max(new Date(), 'Date of birth cannot be in the future')
  .required('Date of birth is required'),
      religion: Yup.string().required('Religion is required'),
      casteCategory: Yup.string().required('Caste category is required'),
      caste: Yup.string().required('Caste is required'),
      physicallyHandicapped: Yup.string().required('Please select an option'),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (values[key]) {
            formData.append(key, values[key]);
          }
        });

        if (admissionToEdit && admissionToEdit._id) {
          await axios.put(`http://localhost:5000/api/form/update/${admissionToEdit._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          Swal.fire({
            title: 'Success!',
            text: 'Form updated successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          await axios.post('http://localhost:5000/api/form/submit', formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          Swal.fire({
            title: 'Success!',
            text: 'Form submitted successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
        navigate('/report');
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Submission failed. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  });
  // ✅ Handle District Change and Update Taluka Options
  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    formik.setFieldValue('district', selectedDistrict);
    setTalukas(districtTalukaData[selectedDistrict] || []);
    formik.setFieldValue('taluka', ''); // Reset taluka when district changes
  };
  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    formik.setFieldValue('gender', selectedGender);
    let titles = [];
    if (selectedGender === 'Male') {
      titles = ['Mr.'];
    } else if (selectedGender === 'Female') {
      titles = ['Ms.', 'Mrs.'];
    } else {
      titles = ['Mx.'];
    }
    setTitleOptions(titles);
    formik.setFieldValue('title', titles[0] || ''); // Set default title
  };
  return (
    <div className={styles['form-container']}>
      <h2 className={styles['heading']}>Admission Form</h2>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
      <div className={styles['form-fields']}>
          <label>Gender:</label>
          <select name="gender" value={formik.values.gender} onChange={handleGenderChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {formik.touched.gender && formik.errors.gender && <div className={styles.error}>{formik.errors.gender}</div>}
        </div>

        {/* ✅ Title Dropdown */}
        <div className={styles['form-fields']}>
          <label>Title:</label>
          <select name="title" value={formik.values.title} onChange={formik.handleChange}>
            <option value="">Select Title</option>
            {titleOptions.map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
          {formik.touched.title && formik.errors.title && <div className={styles.error}>{formik.errors.title}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>First Name:</label>
          <input type="text" name="firstName" placeholder="First Name" {...formik.getFieldProps('firstName')} />
          {formik.touched.firstName && formik.errors.firstName && <div className={styles.error}>{formik.errors.firstName}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>Middle Name:</label>
          <input type="text" name="middleName" placeholder="Middle Name" {...formik.getFieldProps('middleName')} />
          {formik.touched.middleName && formik.errors.middleName && <div className={styles.error}>{formik.errors.middleName}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>Last Name:</label>
          <input type="text" name="lastName" placeholder="Last Name" {...formik.getFieldProps('lastName')} />
          {formik.touched.lastName && formik.errors.lastName && <div className={styles.error}>{formik.errors.lastName}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>Full Name:</label>
          <input type="text" name="fullName" placeholder="Full Name" value={`${formik.values.firstName} ${formik.values.middleName} ${formik.values.lastName}`} readOnly />
        </div>

        <div className={styles['form-fields']}>
          <label>Mother's Name:</label>
          <input type="text" name="motherName" placeholder="Mother Name" {...formik.getFieldProps('motherName')} />
          {formik.touched.motherName && formik.errors.motherName && <div className={styles.error}>{formik.errors.motherName}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>Address:</label>
          <input type="text" name="address" placeholder="Address" {...formik.getFieldProps('address')} />
          {formik.touched.address && formik.errors.address && <div className={styles.error}>{formik.errors.address}</div>}
        </div>

        {/* ✅ District Dropdown */}
        <div className={styles['form-fields']}>
          <label>District:</label>
          <select name="district" value={formik.values.district} onChange={handleDistrictChange}>
            <option value="">Select District</option>
            {Object.keys(districtTalukaData).map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          {formik.touched.district && formik.errors.district && <div className={styles.error}>{formik.errors.district}</div>}
        </div>

        {/* ✅ Taluka Dropdown */}
        <div className={styles['form-fields']}>
          <label>Taluka:</label>
          <select name="taluka" value={formik.values.taluka} onChange={formik.handleChange} disabled={!formik.values.district}>
            <option value="">Select Taluka</option>
            {talukas.map((taluka) => (
              <option key={taluka} value={taluka}>{taluka}</option>
            ))}
          </select>
          {formik.touched.taluka && formik.errors.taluka && <div className={styles.error}>{formik.errors.taluka}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>Pin Code:</label>
          <input type="text" name="pinCode" placeholder="Pin Code" maxLength="6" {...formik.getFieldProps('pinCode')} />
          {formik.touched.pinCode && formik.errors.pinCode && <div className={styles.error}>{formik.errors.pinCode}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>State:</label>
          <input type="text" name="state" placeholder="State" {...formik.getFieldProps('state')} readOnly />
          {formik.touched.state && formik.errors.state && <div className={styles.error}>{formik.errors.state}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>Mobile Number:</label>
          <input type="text" name="mobile" placeholder="Mobile Number"  maxLength="10" {...formik.getFieldProps('mobile')} />
          {formik.touched.mobile && formik.errors.mobile && <div className={styles.error}>{formik.errors.mobile}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>Email:</label>
          <input type="email" name="email" placeholder="Email" {...formik.getFieldProps('email')} />
          {formik.touched.email && formik.errors.email && <div className={styles.error}>{formik.errors.email}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>Aadhaar Number:</label>
          <input type="text" name="aadhaarNumber" placeholder="Aadhaar Number"  maxLength="12" {...formik.getFieldProps('aadhaarNumber')} />
          {formik.touched.aadhaarNumber && formik.errors.aadhaarNumber && <div className={styles.error}>{formik.errors.aadhaarNumber}</div>}
        </div>

        <div className={styles['form-fields']}>
  <label>Date of Birth:</label>
  <input
    type="date"
    name="dateOfBirth"
    value={formik.values.dateOfBirth || ''} // Ensure value is always defined
    onChange={(e) => {
      formik.handleChange(e);
      const birthYear = new Date(e.target.value).getFullYear();
      const currentYear = new Date().getFullYear();
      formik.setFieldValue('age', currentYear - birthYear);
    }}
    onBlur={formik.handleBlur} // Add onBlur to handle touched state
  />
  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
    <div className={styles.error}>{formik.errors.dateOfBirth}</div>
  )}
</div>
        <div className={styles['form-fields']}>
          <label>Age:</label>
          <input type="text" name="age" placeholder="Age" value={formik.values.age} readOnly />
        </div>

       
        <div className={styles['form-fields']}>
  <label>Religion:</label>
  <div className="select-container">
    <Select
      options={religionOptions}
      onChange={(option) => formik.setFieldValue('religion', option?.value)}
      onBlur={formik.handleBlur}
    />
  </div>
  {formik.touched.religion && formik.errors.religion && <div className={styles.error}>{formik.errors.religion}</div>}
</div>


        <div className={styles['form-fields']}>
          <label>Caste Category:</label>
          <input type="text" name="casteCategory" placeholder="Caste Category" {...formik.getFieldProps('casteCategory')} />
          {formik.touched.casteCategory && formik.errors.casteCategory && <div className={styles.error}>{formik.errors.casteCategory}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>Caste:</label>
          <input type="text" name="caste" placeholder="Caste" {...formik.getFieldProps('caste')} />
          {formik.touched.caste && formik.errors.caste && <div className={styles.error}>{formik.errors.caste}</div>}
        </div>

        <div className={styles['form-fields']}>
          <label>
          Physically Handicapped:
          <input type="radio" name="physicallyHandicapped" value="Yes" onChange={() => formik.setFieldValue('physicallyHandicapped', 'Yes')} /> Yes
          <input type="radio" name="physicallyHandicapped" value="No" onChange={() => formik.setFieldValue('physicallyHandicapped', 'No')} /> No
        </label>
        {formik.touched.physicallyHandicapped && formik.errors.physicallyHandicapped ? <div className={styles.error}>{formik.errors.physicallyHandicapped}</div> : null}
        </div>

        <div className={styles['form-fields']}>
          <label>Photo:</label>
          <input type="file" name="photo" onChange={(e) => formik.setFieldValue('photo', e.target.files[0] || '')} />
        </div>

        <div className={styles['form-fields']}>
          <label>Signature:</label>
          <input type="file" name="signature" onChange={(e) => formik.setFieldValue('signature', e.target.files[0] || '')} />
        </div>

        <div className={styles['form-fields']}>
          <label>Caste Certificate:</label>
          <input type="file" name="casteCertificate" onChange={(e) => formik.setFieldValue('casteCertificate', e.target.files[0] || '')} />
        </div>

        <div className={styles['form-fields']}>
          <label>Marksheet:</label>
          <input type="file" name="marksheet" onChange={(e) => formik.setFieldValue('marksheet', e.target.files[0] || '')} />
        </div>

        <button className={styles.btn} type="submit">{admissionToEdit ? "Update" : "Submit"}</button>
      </form>
    </div>
  );
};

export default AdmissionForm;
