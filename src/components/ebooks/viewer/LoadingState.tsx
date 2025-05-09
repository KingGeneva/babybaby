
import React from 'react';

interface LoadingStateProps {
  message: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-[600px]">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-babybaby-cosmic mb-4"></div>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
