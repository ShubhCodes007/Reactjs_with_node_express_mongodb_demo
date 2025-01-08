// frontend/src/pages/Report.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Report.module.css';

const Report = () => {
  const [admissions, setAdmissions] = useState([]);
  const [viewMore, setViewMore] = useState(false); // State to toggle view
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/report');
      setAdmissions(response.data);
    } catch (error) {
      console.error('Error fetching admissions');
    }
  };

  const handleEdit = (admission) => {
    console.log("Editing Admission ID:", admission._id); // Debugging
    navigate('/admission-form', { state: { admission } }); 
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("Invalid ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        console.log("Attempting to delete ID:", id);
        const response = await axios.delete(`http://localhost:5000/api/form/delete/${id}`);
        alert(response.data.message);
        fetchAdmissions(); // ✅ Refresh the list after deletion
      } catch (error) {
        console.error("Delete Error:", error.response?.data || error.message);
        alert("Error deleting admission: " + (error.response?.data?.message || "Unknown error"));
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/report/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'admissions.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting data');
    }
  };

  const addRow = () => {
    // Add a new row with empty data
    const newRow = {
      admissionId: '',
      title: '',
      fullName: '',
      motherName: '',
      gender: '',
      address: '',
      taluka: '',
      district: '',
      pinCode: '',
      state: '',
      mobile: '',
      email: '',
      aadhaarNumber: '',
      dateOfBirth: '',
      age: '',
      religion: '',
      casteCategory: '',
      caste: '',
      physicallyHandicapped: '',
      photo: '',
      signature: '',
      casteCertificate: '',
      marksheet: '',
    };
    setAdmissions([...admissions, newRow]);
  };

  return (
    <div className={styles['rep-container']}>
      <h2 className={styles['rep-heading']}>ADMISSION RECORDS</h2>
      <button className={styles['exp-btn']} onClick={handleExport}>Export to Excel</button>
      
      
      <table className={styles['table-wrapper']} border="1">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Full Name</th>
            <th>Mother's Name</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Taluka</th>
            <th>District</th>
            <th>Pin Code</th>
            <th>State</th>
            <th>Mobile Number</th>  
            <th>Email</th>
            {viewMore && (
              <>
                <th>Aadhaar Number</th>
                <th>Date of Birth</th>
                <th>Age</th>
                <th>Religion</th>
                <th>Caste Category</th>
                <th>Caste</th>
                <th>Physically Handicapped</th>
                <th>Photo</th>
                <th>Signature</th>
                <th>Caste Certificate</th>
                <th>Marksheet</th>
                <th className={styles['action-th']}>Actions</th>
              </>
            )}
            
          </tr>
        </thead>
        <tbody>
          {admissions.map((admission, index) => (
            <tr key={index}>
              <td>{admission.admissionId}</td>
              <td>{admission.title}</td>
              <td>{admission.fullName || `${admission.firstName} ${admission.middleName} ${admission.lastName}`}</td>
              <td>{admission.motherName}</td>
              <td>{admission.gender}</td>
              <td>{admission.address}</td>
              <td>{admission.taluka}</td>
              <td>{admission.district}</td>
              <td>{admission.pinCode}</td>          
              <td>{admission.state}</td>
              <td>{admission.mobile}</td>
              <td>{admission.email}</td>
                  {viewMore && (
                <>
                  <td>{admission.aadhaarNumber}</td>
                  <td>{admission.dateOfBirth}</td>
                  <td>{admission.age}</td>
                  <td>{admission.religion}</td>
                  <td>{admission.casteCategory}</td>
                  <td>{admission.caste}</td>
                  <td>{admission.physicallyHandicapped ? 'Yes' : 'No'}</td>
                  <td>
                    {admission.photo && <img src={`data:image/png;base64,${admission.photo}`} alt="Photo" width="50" />}
                  </td>
                  <td>
                    {admission.signature && <img src={`data:image/png;base64,${admission.signature}`} alt="Signature" width="50" />}
                  </td>
                  <td>
                    {admission.casteCertificate && <img src={`data:image/png;base64,${admission.casteCertificate}`} alt="Caste Certificate" width="50" />}
                  </td>
                  <td>
                    {admission.marksheet && <img src={`data:image/png;base64,${admission.marksheet}`} alt="Marksheet" width="50" />}
                  </td>
                  <td className={styles['action-td']}>
                   <button className={styles['rep-btn']} onClick={() => handleEdit(admission)}>Edit</button><br />
                   <button className={styles['rep-btn']} onClick={() => handleDelete(admission._id)}>Delete</button>
                </td>
                </>
              )}
             
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles['add-row-btn']} onClick={addRow}>Add Row</button>
      
      {!viewMore && (
        <button className={styles['view-more-btn']} onClick={() => setViewMore(true)}>View More</button>
      )}
    </div>
  );
};

export default Report;