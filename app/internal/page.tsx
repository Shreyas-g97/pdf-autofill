// 'use client'

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { adapticServer } from '../../utils/helpers';
// import UseStore from '../results';

// const FileUploadComponent: React.FC<{ data: any }> = ({ data }) => {
//   const router = useRouter();
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [progressMessage, setProgressMessage] = useState<any>('');
//   const [error, setError] = useState<boolean>(false);
//   const [formattedData, setFormattedData] = useState<{ [key: string]: string }>({});
//   const upload = UseStore.useUploadStore(state => state.upload);
//   const setUpload = UseStore.useUploadStore(state => state.setUpload);

//   const progressMessages = [
//     'Analyzing document...',
//     'Extracting key information...',
//     'Comparing with clinical trials...',
//     'Finalizing results...'
//   ];

//   useEffect(() => {
//     if (!loading) {
//       return;
//     }
//     let messageIndex = 0;
//     const intervalId = setInterval(() => {
//       if (messageIndex < progressMessages.length) {
//         setProgressMessage(progressMessages[messageIndex]);
//         messageIndex++;
//       } else {
//         clearInterval(intervalId);
//       }
//     }, 6000);

//     return () => clearInterval(intervalId);
//   }, [loading, progressMessages.length]);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const uploadedFile = event.target.files ? event.target.files[0] : null;
//     if (uploadedFile) {
//       setFile(uploadedFile);
//     }
//   };

//   const handleFileUpload = async () => {
//     if (file) {
//       try {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('formFields', JSON.stringify(formattedData)); // Ensure formattedData is a properly serialized JSON string
  
//         setLoading(true);
//         setError(false);
  
//         const response = await axios.post(`${adapticServer}uploadPDF`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           },
//           responseType: 'blob'
//         });
  
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'filled_form.pdf');
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
  
//         console.log('Success:', response.data);
//         setUpload(response.data);
//         setFile(null);
//         setTimeout(() => {
//           setLoading(false);
//         }, 2000);
//       } catch (error) {
//         console.error('Error:', error);
//         setLoading(false);
//         setError(true);
//       }
//     }
//   };

//   const handleFormSubmit = async () => {
//     try {
//       if (!data || !data.client || !data.client.companyId) {
//         console.error('Data or client information is missing:', data);
//       }

//       // const targetID = data.client.companyId;
//       const targetID = '752242a1-11d4-4a13-89b0-c26f02ae4fe3';
//       const response = await axios.get(`${adapticServer}api/form-responses`);
//       console.log('Form responses:', response.data.data);
//       const responseData = response.data.data;

//       if (Array.isArray(responseData)) {
//         const matchingItem = responseData.find(item => item.clientId === targetID);
  
//         if (matchingItem) {
//           // console.log('Matching item:', matchingItem.fields.formFields);
//           const formFields = matchingItem.fields.formFields;
//           const formattedData: { [key: string]: string } = {};
//           for (const [key, value] of Object.entries(formFields)) {
//             if (
//               typeof value === 'object' &&
//               value !== null &&
//               'title' in value &&
//               'answer' in value &&
//               typeof value.title === 'string' &&
//               typeof value.answer === 'string'
//             ) {
//               formattedData[value.title] = value.answer;
//             }
//           }
//           console.log(formattedData)
//           setFormattedData(formattedData)
//         } else {
//           console.log(`No matching item found with clientID: ${targetID}`);
//           try {
//             const response = await axios.post(`${adapticServer}api/submit-form`, {
//               clientId: targetID
//             });
//             console.log(response.data);
//           } catch (error) {
//             console.error('Error submitting form:', error);
//           }
//         }
//       } else {
//         console.error('Response data is not an array:', responseData);
//       }

//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-semibold mb-8 text-center text-blue-600">Upload Medical Claim Form</h1>
//       <div className="flex flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
//         <div className="flex flex-col items-center w-1/2 pr-6 border-r">
//           <input
//             type="file"
//             accept=".pdf"
//             onChange={handleFileChange}
//             className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
//           />
//           <button
//             onClick={handleFileUpload}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
//           >
//             Upload File
//           </button>
//           {loading && (
//             <div className="text-center">
//               <div className="flex justify-center items-center">
//                 <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
//               </div>
//               <p className="text-blue-500 mt-2">{progressMessage}</p>
//             </div>
//           )}
//           {error && (
//             <div className="text-red-500">Something went wrong. Please try again.</div>
//           )}
//         </div>
//         <div className="flex flex-col items-center w-1/2 pl-6">
//           <button
//             onClick={handleFormSubmit}
//             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
//           >
//             Form Data
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileUploadComponent;

'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { adapticServer } from '../../utils/helpers';
import UseStore from '../results';

const FileUploadComponent: React.FC<{ data: any }> = ({ data }) => {
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

  const handleFileUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('formFields', JSON.stringify(formattedData)); // Ensure formattedData is a properly serialized JSON string
  
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

      const targetID = data.client.companyId;
      // const targetID = '752242a1-11d4-4a13-89b0-c26f02ae4fe3';
      const response = await axios.get(`${adapticServer}api/form-responses`);
      console.log('Form responses:', response.data.data);
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
              typeof value.title === 'string' &&
              typeof value.answer === 'string'
            ) {
              formattedData[value.title] = value.answer;
            }
          }
          setFormattedData(formattedData);
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
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;


