import React from 'react';

const FallbackComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-600">Please try refreshing the page.</p>
      </div>
    </div>
  );
};

export default FallbackComponent;