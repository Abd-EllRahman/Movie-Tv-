import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Flags from 'react-flags-select';
import './Register.css'; // Ensure this path is correct

// Comprehensive list of country codes and flags
const countryCodes = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'IT', name: 'Italy', dialCode: '+39' },
  { code: 'ES', name: 'Spain', dialCode: '+34' },
  { code: 'CN', name: 'China', dialCode: '+86' },
  { code: 'BR', name: 'Brazil', dialCode: '+55' },
  { code: 'RU', name: 'Russia', dialCode: '+7' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27' },
  { code: 'KR', name: 'South Korea', dialCode: '+82' },
  { code: 'PT', name: 'Portugal', dialCode: '+351' },
  { code: 'IE', name: 'Ireland', dialCode: '+353' },
  { code: 'SE', name: 'Sweden', dialCode: '+46' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31' },
  { code: 'BE', name: 'Belgium', dialCode: '+32' },
  { code: 'DK', name: 'Denmark', dialCode: '+45' },
  { code: 'FI', name: 'Finland', dialCode: '+358' },
  { code: 'NO', name: 'Norway', dialCode: '+47' },
  { code: 'IS', name: 'Iceland', dialCode: '+354' },
  { code: 'MT', name: 'Malta', dialCode: '+356' },
  { code: 'SY', name: 'Syria', dialCode: '+963' },
  { code: 'EG', name: 'Egypt', dialCode: '+20' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60' },
  { code: 'PH', name: 'Philippines', dialCode: '+63' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94' },
  // Add more countries as needed
];

export default function Register() {
  let navigate = useNavigate();
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [countryCode, setCountryCode] = useState(countryCodes[0].dialCode); // Default to the first country code
  const [selectedFlag, setSelectedFlag] = useState(countryCodes[0].code); // Default to the first country code

  async function register(values) {
    console.log(values);
    const { data } = await axios.post(`https://note-sigma-black.vercel.app/api/v1/users/signUp`, values);
    console.log(data);
    navigate("/login");
  }

  let validationSchema = Yup.object({
    name: Yup.string().max(15, "Name should be less than 15 characters").required("Name is required"),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().matches(/^[a-zA-Z][a-z0-9]{5,8}$/, "Invalid Password").required('Password is required'),
    phone: Yup.string()
      .test('is-valid-phone', 'Phone is invalid', value => {
        if (!value) return false; 
        const phoneNumber = parsePhoneNumberFromString(`${countryCode} ${value}`);
        return phoneNumber ? phoneNumber.isValid() : false;
      })
      .required('Phone is required'),
  });

  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      age: "",
      phone: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => register(values)
  });

  const handleCountryChange = (code) => {
    const selectedCountry = countryCodes.find(country => country.code === code);
    setCountryCode(selectedCountry.dialCode);
    setSelectedFlag(selectedCountry.code);
  };

  return (
    <div className="container my-5">
      <div className="login-card p-4 rounded shadow">
        <h2 className='mb-4 text-center text-light'>Sign Up</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name" className="mb-2 fw-bolder fs-5 text-light">Name</label>
            <input
              type="text"
              id="name"
              name='name'
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control input-field"
            />
            {formik.errors.name && formik.touched.name ? (
              <div className='alert alert-danger'>{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email" className="mb-2 fw-bolder fs-5 text-light">Email</label>
            <input
              type="email"
              id="email"
              name='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control input-field"
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
              name='password'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control input-field"
            />
            {formik.errors.password && formik.touched.password ? (
              <div className='alert alert-danger'>{formik.errors.password}</div>
            ) : null}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="age" className="mb-2 fw-bolder fs-5 text-light">Age</label>
            <input
              type="number"
              id="age"
              name='age'
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control input-field"
            />
            {formik.errors.age && formik.touched.age ? (
              <div className='alert alert-danger'>{formik.errors.age}</div>
            ) : null}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="phone" className="mb-2 fw-bolder fs-5 text-light">Phone</label>
            <div className="input-group">
              <div className="input-group-prepend">
              <Flags 
                countries={countryCodes.map(country => country.code)} 
                selected={selectedFlag} 
                onSelect={handleCountryChange} 
                placeholder="Select a country" 
                className="flags-select me-2" // Apply the custom class here
              />

                {/* Display the dial code next to the flag */}
                <span className="input-group-text">{countryCode}</span>
              </div>
              <input
                type="tel"
                id="phone"
                name='phone'
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control input-field"
                placeholder="Enter your phone number"
              />
            </div>
            {formik.errors.phone && formik.touched.phone ? (
              <div className='alert alert-danger'>{formik.errors.phone}</div>
            ) : null}
          </div>

          <div className='d-flex justify-content-center mt-4'>
            <button type="submit" className="btn-submit me-3" onClick={handleScrollToTop}>Submit</button>
            <button 
              type="button" 
              className="btn-submit" 
              onClick={formik.resetForm} 
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
