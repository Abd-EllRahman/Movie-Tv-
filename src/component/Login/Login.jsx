import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure this path is correct

export default function Login({ saveLoginData }) {
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function login(values) {
    try {
      let { data } = await axios.post(`https://note-sigma-black.vercel.app/api/v1/users/signIn`, values);
      localStorage.setItem('token', data.token);
      saveLoginData();
      setErrorMessage(''); // Clear any previous error message
      navigate("/home");
    } catch (error) {
      // Handle error here and set an appropriate error message
      setErrorMessage('Incorrect email or password. Please try again.');
    }
  }

  let validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .matches(/^[a-zA-Z0-9]{6,8}$/, "Password must be 6-8 characters long and contain only letters and numbers")
      .required('Password is required'),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => login(values),
  });

  return (
    <div className="container my-5">
      <div className="login-card p-4 rounded shadow">
        <h2 className='mb-4 text-center text-light'> Sign In</h2>

        {/* Display error message if login fails */}
        {errorMessage && <div className='alert alert-danger text-center'>{errorMessage}</div>}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email" className="mb-2 fw-bolder fs-5 text-light">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control input-field"
              aria-label="Email address"
              required
            />
            {formik.errors.email && formik.touched.email ? (
              <div className='alert alert-danger'>{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" className="mb-2 fw-bolder fs-5 text-light">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control input-field"
              aria-label="Password"
              required
            />
            {formik.errors.password && formik.touched.password ? (
              <div className='alert alert-danger'>{formik.errors.password}</div>
            ) : null}
          </div>


          <div className='d-flex justify-content-center mt-2'>
            <button type="submit" className="btn-submit me-3" onClick={handleScrollToTop}>Submit</button>
            <button 
              type="button" 
              className="btn-submit" 
              onClick={() => formik.resetForm({ values: { email: '', password: '' } })}
            >
              Clear
            </button>
          </div>

          <div className='d-flex justify-content-center mt-3'>
            <p>Don't have an account? <Link className='sign' to="/Register">Sign Up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
