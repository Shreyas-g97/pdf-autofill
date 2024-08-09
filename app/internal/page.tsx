'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { adapticServer } from '../../utils/helpers';
import UseStore from '../results';

type FileUploadComponentProps = {
  data: { [key: string]: any };
};

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ data }) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<any>('');
  const [error, setError] = useState<boolean>(false);
  const [formDataError, setFormDataError] = useState<string | null>(null);
  const [showUploadSection, setShowUploadSection] = useState<boolean>(false);
  const [formattedData, setFormattedData] = useState<{ [key: string]: string }>({});
  const upload = UseStore.useUploadStore(state => state.upload);
  const setUpload = UseStore.useUploadStore(state => state.setUpload);
  const [jsonData, setJsonData] = useState<{ [key: string]: any }>({});

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

  const formatDataForBackend = (data: { [key: string]: any }) => {
    return {
      "Employer's Name": data["Employer's Name"] || 'ABC Corp',
      "Policy/Group Number": data["Policy/Group Number"] || '123456',
      "Employee's Aetna ID Number": data["Employee's ID Number"] || 'A123456',
      "Employee's Name": data["Employee's Name"] || 'John Doe',
      "Employee's Birthdate (MM/DD/YYYY)": data["Employee's Birthdate (MM/DD/YYYY)"] || '01/01/1980',
      "Active": "Yes",
      "Retired": "No",
      "Date of Retirement": "",
      "Employee's Address (include ZIP Code)": data["Employee's Address"] || '123 Main St, Anytown, USA 12345',
      "Address is new": "Yes",
      "Employee's Daytime Telephone Number": data["Employee's Daytime Telephone Number"] || '555-123-4567',
      "Employee's Daytime Telephone Number (first 3 digits)": data["Employee's Daytime Telephone Number"].substring(0,3),
      "Employee's Daytime Telephone Number (rest)": data["Employee's Daytime Telephone Number"].substring(3).trim(),
      "Patient's Name": data["Patient's Name"] || 'Jane Doe',
      "Patient's Aetna ID Number": "B987654",
      "Patient's Birthdate (MM/DD/YYYY)": data["Patient's Birthdate (MM/DD/YYYY)"] || '02/02/2010',
      "Patient's Relationship to Employee": data["Patient's Relationship to Employee"] || 'Self',
      "Patient's Address (if different from employee)": "",
      "Male": "",
      "Female": "",
      "Non-Binary/Other": "Off",
      "Married": "No",
      "Single": "Yes",
      "Is patient employed? No": "Yes",
      "Is patient employed? Yes": "No",
      "Name & Address of Employer": "",
      "Is claim related to an accident? No": data["Is claim related to an accident?"] || 'Yes',
      "Is claim related to an accident? Yes": "No",
      "If Yes, date": "",
      "Time AM": "Off",
      "Time PM": "Off",
      "Is claim related to employment? No": data["Is claim related to employment?"] || 'Yes',
      "Is claim related to employment? Yes": "No",
      "Country of medical services outside U.S.": "",
      "Services outside U.S. Emergency care": "Off",
      "Services outside U.S. Scheduled care": "Off",
      "Are family members expenses covered by another plan? No": "Yes",
      "Are family members expenses covered by another plan? Yes": "No",
      "Other plan details": "",
      "Member’s ID Number": "",
      "Member’s Name": "",
      "Member’s Birthdate (MM/DD/YYYY)": "",
      "Authorization Signature": "",
      "Authorization Date": "",
      "Release of Information Signature": "",
      "Payment Authorization Signature": "",
      "Payment Authorization Date": "",
      "Date of Illness (first symptom) or injury (accident) or pregnancy (LMP)": "",
      "Date first consulted for this condition": "",
      "Similar illness or injury dates": "",
      "Emergency check": "Off",
      "Date patient able to return to work": "",
      "Date of total disability from": "",
      "Date of total disability through": "",
      "Date of partial disability from": "",
      "Date of partial disability through": "",
      "Name of referring physician": "",
      "Hospitalization dates admitted": "",
      "Hospitalization dates discharged": "",
      "Facility name & address": "",
      "Primary Diagnosis": "",
      "Secondary Diagnosis": "",
      "Other Diagnosis": "",
      "Additional Diagnosis": "",
      "Procedures, Medical Services, Supplies Furnished Date": "",
      "Service Place": "",
      "Procedure Code": "",
      "Service Description Charges": "",
      "Service Days or Units": "",
      "Service Diagnosis Code": "",
      "Physician's Name & Address": "",
      "Physician's Telephone Number": "",
      "Taxpayer identifying number": "",
      "Patient Account Number": "",
      "Total charge": "",
      "Amount paid": "",
      "Balance due": "",
      "Physician's Signature": "",
      "National Provider Identifier": "",
      "Physician's Date": "",
      "UMP ID Number": "U123456",
      "Patient's Last Name": data["Patient's Name"].split(' ').pop() || 'Doe',
      "Patient's First Name": data["Patient's Name"].split(' ')[0] || 'Jane',
      "Patient's MI": "",
      "Patient's Date of Birth": data["Patient's Birthdate (MM/DD/YYYY)"] || '02/02/2010',
      "Patient's Sex": data["Patient's Sex"] || 'Female',
      "Patient's Relationship to Subscriber": data["Patient's Relationship to Employee"] || 'Child',
      "Daytime Phone Number": data["Employee's Daytime Telephone Number"] || '555-123-4567',
      "Subscriber's Last Name": data["Employer's Name"].split(' ').pop() || 'Doe',
      "Subscriber's First Name": data["Employer's Name"].split(' ')[0] || 'John',
      "Subscriber's MI": "",
      "Group Number": data["Policy/Group Number"] || '789101',
      "Medical coverage": data.medicalCoverage || 'Yes',
      "Vision coverage": data.visionCoverage || 'No',
      "Dental coverage": data.dentalCoverage || 'Yes',
      "Prescription coverage": data.prescriptionCoverage || 'Yes',
      "With Orthodontia": "No",
      "Coverage type (Group or Individual)": "Group",
      "Medicare coverage": "No",
      "Medicare Part A": "Off",
      "Medicare Part B": "Off",
      "Medicare Part D": "Off",
      "Other Group Insurance Plan Name": "",
      "ID Number": data["Employee's ID Number"] || 'A123456',
      "Relationship to Subscriber": "Self",
      "Subscriber's Date of Birth": data["Employee's Birthdate (MM/DD/YYYY)"]  || '01/01/1980',
      "Address for Submitting Claims": data["Employee's Address"] || '123 Main St, Anytown, USA 12345',
      "City": "Anytown",
      "State": "USA",
      "ZIP Code": "12345",
      "Coverage for Subscriber": "Yes",
      "Coverage for Spouse/DP": "No",
      "Coverage for Child(ren)": "Yes",
      "Coverage for Family": "Yes",
      "Name of person with legal custody (if children are covered by more than one plan)": "",
      "Other group ID numbers": "",
      "Subscriber's Employer": data["Employer's Name"] || 'ABC Corp',
      "Effective Date of this Plan": "01/01/2023",
      "Type of service received (if paid in cash)": "",
      "Signature Date": "01/01/2024",
      "Name of illness and injury": "",
      "Provider's name": "",
      "If injury, date occurred": "",
      "If injury, how, when, where": "",
      "Name of illness and injury 1": "",
      "Provider's name 1": "",
      "If injury, date occurred 1": "",
      "If injury, how, when, where 1": "",
      "Name of illness and injury 2": "",
      "Provider's name 2": "",
      "If injury, date occurred 2": "",
      "If injury, how, when, where 2": ""
    };
  };
  

  const handleFileUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        console.log(jsonData);
        formData.append('formFields', JSON.stringify(jsonData)); // Include the formatted JSON data
  
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
      if (!data || !data.client || !data.client.companyId) {
        console.error('Data or client information is missing:', data);
        setFormDataError('Data or client information is missing.');
        return;
      }

      const targetID = data.client?.id || data.client?.companyId;
      // const targetID = "752242a1-11d4-4a13-89b0-c26f02ae4fe3";
      const response = await axios.get(`${adapticServer}api/form-responses`);
      // console.log('Form responses:', response.data.data);
      const responseData = response.data.data;

      if (Array.isArray(responseData)) {
        const matchingItem = responseData.find(item => item.clientId === targetID);
  
        if (matchingItem) {
          const formFields = matchingItem.fields.formFields;
          const formattedData: { [key: string]: string } = {};
          for (const [key, value] of Object.entries(formFields)) {
            if (
              typeof value === 'object' &&
              value !== null &&
              'title' in value &&
              'answer' in value &&
              typeof value.title === 'string'
            ) {
               // Check if the answer is an array
               if (Array.isArray(value.answer) && value.answer.length > 0) {
                // Take the first element of the array
                formattedData[value.title] = value.answer[0];
              } else if (typeof value.answer === 'string') {
                formattedData[value.title] = value.answer;
              }
            }
          }
          setFormattedData(formattedData);
          setJsonData(formatDataForBackend(formattedData));
          console.log(formattedData);
          console.log(jsonData);
          setShowUploadSection(true);
          setFormDataError(null); // Clear any previous error
        } else {
          console.log(`No matching item found with clientID: ${targetID}`);
          try {
            const response = await axios.post(`${adapticServer}api/request-form`, {
              clientId: targetID
            });
            console.log(response.data);
            setFormDataError('No form data found. Form submission triggered. Please fill out the form');
          } catch (error) {
            console.error('Error submitting form:', error);
            setFormDataError('Error submitting form.');
          }
        }
      } else {
        console.error('Response data is not an array:', responseData);
        setFormDataError('Response data is not an array.');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormDataError('An error occurred while fetching form responses.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8 text-center text-blue-600">Upload Medical Claim Form</h1>
      <div className="flex flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        {!showUploadSection ? (
          <div className="flex flex-col items-center w-full">
            <button
              onClick={handleFormSubmit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Retrieve Your Form Data
            </button>
            {formDataError && (
              <div className="text-red-500 mt-4">{formDataError}</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
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
        )}
      </div>
    </div>
  );
}  

export default FileUploadComponent;