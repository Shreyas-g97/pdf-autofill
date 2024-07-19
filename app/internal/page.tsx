'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { adapticServer } from '../../utils/helpers';
import UseStore from '../results';

const FileUploadComponent: React.FC = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    employerName: '',
    policyNumber: '',
    employeeId: '',
    employeeName: '',
    employeeBirthdate: '',
    employeeAddress: '',
    employeePhone: '',
    patientName: '',
    patientBirthdate: '',
    patientRelationship: '',
    patientSex: '',
    claimRelatedToAccident: 'No',
    claimRelatedToEmployment: 'No',
    medicalCoverage: 'Yes',
    dentalCoverage: 'Yes',
    visionCoverage: 'No',
    prescriptionCoverage: 'Yes'
  });
  const upload = UseStore.useUploadStore(state => state.upload);
  const setUpload = UseStore.useUploadStore(state => state.setUpload);

  const progressMessages = [
    'Analyzing document...',
    'Extracting key information...',
    'Comparing with clinical trials...',
    'Finalizing results...'
  ];

  useEffect(() => {
    if (!loading) {
      return;
    }
    let messageIndex = 0;
    const intervalId = setInterval(() => {
      if (messageIndex < progressMessages.length) {
        setProgressMessage(progressMessages[messageIndex]);
        messageIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 6000);

    return () => clearInterval(intervalId);
  }, [loading, progressMessages.length]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setError(false);
  
        const response = await axios.post(`${adapticServer}uploadPDF`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob'
      });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'filled_form.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();

        console.log('Success:', response.data);
        setUpload(response.data);
        setFile(null);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    } catch (error) {
        console.error('Error:', error);
        setLoading(false);
        setError(true);
    }
  }
  };

  const handleFormSubmit = async () => {
    try {
      const response = await axios.post(`${adapticServer}saveFormData`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Form data saved:', response.data);
    } catch (error) {
      console.error('Error saving form data:', error);
      setError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8 text-center text-blue-600">Upload Medical Claim Form</h1>
      <div className="flex flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center w-1/2 pr-6 border-r">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <button
            onClick={handleFileUpload}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
          >
            Upload File
          </button>
          {loading && (
            <div className="text-center">
              <div className="flex justify-center items-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              </div>
              <p className="text-blue-500 mt-2">{progressMessage}</p>
            </div>
          )}
          {error && (
            <div className="text-red-500">Something went wrong. Please try again.</div>
          )}
        </div>
        <div className="flex flex-col items-center w-1/2 pl-6">
          <input
            type="text"
            name="employerName"
            placeholder="Employer's Name"
            value={formData.employerName}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="policyNumber"
            placeholder="Policy/Group Number"
            value={formData.policyNumber}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="employeeId"
            placeholder="Employee's ID Number"
            value={formData.employeeId}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="employeeName"
            placeholder="Employee's Name"
            value={formData.employeeName}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="employeeBirthdate"
            placeholder="Employee's Birthdate (MM/DD/YYYY)"
            value={formData.employeeBirthdate}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="employeeAddress"
            placeholder="Employee's Address (include ZIP Code)"
            value={formData.employeeAddress}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="employeePhone"
            placeholder="Employee's Daytime Telephone Number"
            value={formData.employeePhone}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="patientName"
            placeholder="Patient's Name"
            value={formData.patientName}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="patientBirthdate"
            placeholder="Patient's Birthdate (MM/DD/YYYY)"
            value={formData.patientBirthdate}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="patientRelationship"
            placeholder="Patient's Relationship to Employee"
            value={formData.patientRelationship}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <select
            name="patientSex"
            value={formData.patientSex}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          >
            <option value="">Select Patient's Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-Binary/Other">Non-Binary/Other</option>
          </select>
          <select
            name="claimRelatedToAccident"
            value={formData.claimRelatedToAccident}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          >
            <option value="No">Is claim related to an accident? No</option>
            <option value="Yes">Is claim related to an accident? Yes</option>
          </select>
          <select
            name="claimRelatedToEmployment"
            value={formData.claimRelatedToEmployment}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          >
            <option value="No">Is claim related to employment? No</option>
            <option value="Yes">Is claim related to employment? Yes</option>
          </select>
          <select
            name="medicalCoverage"
            value={formData.medicalCoverage}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          >
            <option value="Yes">Medical Coverage: Yes</option>
            <option value="No">Medical Coverage: No</option>
          </select>
          <select
            name="dentalCoverage"
            value={formData.dentalCoverage}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          >
            <option value="Yes">Dental Coverage: Yes</option>
            <option value="No">Dental Coverage: No</option>
          </select>
          <select
            name="visionCoverage"
            value={formData.visionCoverage}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          >
            <option value="Yes">Vision Coverage: Yes</option>
            <option value="No">Vision Coverage: No</option>
          </select>
          <select
            name="prescriptionCoverage"
            value={formData.prescriptionCoverage}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          >
            <option value="Yes">Prescription Coverage: Yes</option>
            <option value="No">Prescription Coverage: No</option>
          </select>
          <button
            onClick={handleFormSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadComponent;
