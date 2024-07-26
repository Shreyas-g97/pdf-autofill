'use client';

import React from 'react';

const LogDataButton: React.FC<{ data: any }> = ({ data }) => {
  const handleLogData = () => {
    console.log(data);
  };

  return (
    <button
      onClick={handleLogData}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
    >
      Log Data
    </button>
  );
};

export default LogDataButton;