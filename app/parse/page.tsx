'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { adapticServer } from '../../utils/helpers';
import UseStore from '../results';

const FileParseComponent: React.FC = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const upload = UseStore.useUploadStore(state => state.upload);
  const setUpload = UseStore.useUploadStore(state => state.setUpload);

  // Progress messages
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
        clearInterval(intervalId); // Stop updating once the last message is reached
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

        setLoading(true);
        setError(false);
  
        const response = await axios.post(`${adapticServer}parsePDF`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob' // This is important to handle the file response correctly
      });

        // const url = window.URL.createObjectURL(new Blob([response.data]));
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', 'filled_form.pdf'); // Set the file name
        // document.body.appendChild(link);
        // link.click();
        // link.remove();

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

  return (
    <div>
        <div className="flex flex-col items-center justify-center p-6 rounded-lg min-h-screen bg-white">
            <h1 className="text-3xl font-semibold mb-4 text-center">Upload Filled Medical Claim Form</h1>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="border border-2 border-blue-300 rounded-lg p-4"
          />
          <button
            onClick={handleFileUpload}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2'
          >
            Upload File
          </button>
          {loading && (
              <div className="text-center">
                <div className="flex justify-center items-center">
                  {/* Replace with your actual loading spinner */}
                  <div className="spinner"></div>
                </div>
                <p className="text-blue-500 mt-2">{progressMessage}</p>
              </div>
          )}
          {error && (
            <div className="text-red-500">Something went wrong. Please try again.</div>
          )}
        </div>
    </div>
  );
};

export default FileParseComponent;