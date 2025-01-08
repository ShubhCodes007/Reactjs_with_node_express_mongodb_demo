import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import Swal from 'sweetalert2';


const Register = () => {
  const navigate = useNavigate();
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      firstName: '',
      middleName: '',
      lastName: '',
      fullName: '',
      mobile: '',
      photo: null,
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      .required('Username is required'),
      firstName: Yup.string()
        .matches(/^[A-Z][a-z]*$/, 'First name must start with a capital letter and contain only alphabets')
        .required('First name is required'),
      middleName: Yup.string()
        .matches(/^[A-Z][a-z]*$/, 'Middle name must start with a capital letter and contain only alphabets')
        .required('Middle name is required'),
      lastName: Yup.string()
        .matches(/^[A-Z][a-z]*$/, 'Last name must start with a capital letter and contain only alphabets')
        .required('Last name is required'),
      mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Must be a valid 10-digit number starting with 6, 7, 8, or 9')
        .required('Mobile number is required'),
      photo: Yup.mixed()
        .test('fileSize', 'File size should be less than 1MB', (value) => !value || (value && value.size <= 1024 * 1024))
        .test('fileFormat', 'Only JPG, JPEG, PNG files are allowed', (value) =>
          !value || (value && ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type))
        )
        .required('Photo is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
          'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character'
        )
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      try {
          const formData = new FormData();
          Object.keys(values).forEach((key) => {
              if (key === "photo" && values[key]) {
                  formData.append(key, values[key]); // ✅ Ensure photo is appended
              } else {
                  formData.append(key, values[key]);
              }
          });
  
          console.log("Sending Form Data:", formData); // ✅ Debugging
  
          await axios.post("http://localhost:5000/api/auth/register", formData, {
              headers: { "Content-Type": "multipart/form-data" }
          });
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You have been registered successfully!',
          }).then(() => {
            navigate('/login');
          });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.response?.data?.message || 'An error occurred. Please try again.',
        });
      }
  },
  });

  return (
    <div className={styles['login-container']}>
      <h2 className={styles['login-heading']}>Registration</h2>
      <form className={styles['reg-form']} onSubmit={formik.handleSubmit} encType="multipart/form-data">

        <input type="text" name="username" placeholder="Username" {...formik.getFieldProps('username')} />
        {formik.touched.username && formik.errors.username ? <div className={styles['error']}>{formik.errors.username}</div> : null}

        <input type="text" name="firstName" placeholder="First Name" {...formik.getFieldProps('firstName')} />
        {formik.touched.firstName && formik.errors.firstName ? <div className={styles['error']}>{formik.errors.firstName}</div> : null}

        <input type="text" name="middleName" placeholder="Middle Name" {...formik.getFieldProps('middleName')} />
        {formik.touched.middleName && formik.errors.middleName ? <div className={styles['error']}>{formik.errors.middleName}</div> : null}

        <input type="text" name="lastName" placeholder="Last Name" {...formik.getFieldProps('lastName')} />
        {formik.touched.lastName && formik.errors.lastName ? <div className={styles['error']}>{formik.errors.lastName}</div> : null}

        <input type="text" name="fullName" placeholder="Full Name" value={`${formik.values.firstName} ${formik.values.middleName} ${formik.values.lastName}`} readOnly />

        <input type="text" name="mobile" placeholder="Mobile Number" maxLength="10" {...formik.getFieldProps('mobile')} />
        {formik.touched.mobile && formik.errors.mobile ? <div className={styles['error']}>{formik.errors.mobile}</div> : null}

        <input type="email" name="email" placeholder="Email" {...formik.getFieldProps('email')} />
        {formik.touched.email && formik.errors.email ? <div className={styles['error']}>{formik.errors.email}</div> : null}

        <input type="password" name="password" placeholder="Password" {...formik.getFieldProps('password')} />
        {formik.touched.password && formik.errors.password ? <div className={styles['error']}>{formik.errors.password}</div> : null}

        <input type="password" name="confirmPassword" placeholder="Confirm Password" {...formik.getFieldProps('confirmPassword')} />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className={styles['error']}>{formik.errors.confirmPassword}</div> : null}

        <label>Upload Photo (JPEG, JPG, PNG, max 1MB):</label>
        <input type="file" name="photo" accept="image/jpeg, image/jpg, image/png" onChange={(e) => {
          formik.setFieldValue('photo', e.target.files[0]);
          setPreviewPhoto(URL.createObjectURL(e.target.files[0]));
        }} />
        {previewPhoto && <img src={previewPhoto} alt="Preview" className={styles['preview-img']} />}
        {formik.touched.photo && formik.errors.photo ? <div className={styles['error']}>{formik.errors.photo}</div> : null}
        <button className={styles['reg-btn']} type="submit">Register</button>
        <p>Already Have Account ? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
