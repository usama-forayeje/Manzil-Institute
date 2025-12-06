import React from 'react';

const RequirementsSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Admission Requirements</h2>
        <ul className="list-disc list-inside space-y-4">
          <li>Age: 3-18 years</li>
          <li>Birth certificate</li>
          <li>Previous school records</li>
          <li>Medical certificate</li>
          <li>Passport size photos</li>
        </ul>
      </div>
    </section>
  );
};

export default RequirementsSection;
