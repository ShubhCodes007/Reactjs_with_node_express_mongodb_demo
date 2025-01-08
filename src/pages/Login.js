import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import Swal from 'sweetalert2';

const Login = () => {
    const navigate = useNavigate();
    const [captcha, setCaptcha] = useState('');

    useEffect(() => {
        fetchCaptcha();
    }, []);

    // Fetch Captcha from Backend
    const fetchCaptcha = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/captcha', { withCredentials: true });
          setCaptcha(response.data.captcha);
          formik.setFieldValue('captcha', '');
        } catch (error) {
          console.error('Error fetching captcha:', error);
          Swal.fire({
            icon: 'error',
            title: 'Captcha Error',
            text: 'Failed to load captcha. Please try again later.',
          });
        }
      };

    // Formik Setup
    const formik = useFormik({
        initialValues: {
            identifier: '', // Changed from email to identifier
            password: '',
            captcha: '',
        },
        validationSchema: Yup.object({
            identifier: Yup.string().required('Email or Username is required'),
            password: Yup.string().required('Password is required'),
            captcha: Yup.string().required('Captcha is required'),
        }),
        onSubmit: async (values) => {
            try {
              // Validate Captcha
              const captchaResponse = await axios.post(
                'http://localhost:5000/api/captcha/validate',
                { captcha: values.captcha },
                { withCredentials: true }
              );
      
              if (captchaResponse.status === 200) {
                // Proceed with login
                const response = await axios.post('http://localhost:5000/api/auth/login', {
                  identifier: values.identifier, // Changed from email to identifier
                  password: values.password,
                }, { withCredentials: true });
      
                localStorage.setItem('token', response.data.token);
                Swal.fire({
                  icon: 'success',
                  title: 'Login Successful',
                  text: 'Welcome back! Redirecting to the admission form.',
                }).then(() => {
                  navigate('/admission-form');
                });
              }
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.message || 'Please check your credentials and try again.',
              });
              fetchCaptcha();
            }
          },
        });

    return (
        <div className={styles['login-container']}>
            <h2 className={styles['login-heading']}>Login</h2>
            <form className={styles['login-form']} onSubmit={formik.handleSubmit}>
                <input
                    type="text"
                    name="identifier"
                    placeholder="Email or Username"
                    {...formik.getFieldProps('identifier')}
                />
                {formik.touched.identifier && formik.errors.identifier ? <div className={styles['error']}>{formik.errors.identifier}</div> : null}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password ? <div className={styles['error']}>{formik.errors.password}</div> : null}

                <div dangerouslySetInnerHTML={{ __html: captcha }}></div>
                <input
                    type="text"
                    name="captcha"
                    placeholder="Enter Captcha"
                    {...formik.getFieldProps('captcha')}
                />
                {formik.touched.captcha && formik.errors.captcha ? <div className={styles['error']}>{formik.errors.captcha}</div> : null}

                <button className={styles['login-btn']} type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
