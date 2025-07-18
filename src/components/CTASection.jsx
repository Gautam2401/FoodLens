import React from 'react';

const CTASection = () => (
  <section className="py-5 mt-4">
    <div className="container bg-success text-white text-center rounded p-5 shadow">
      <h2 className="display-6 fw-bold mb-3">Ready to Transform Your Nutrition?</h2>
      <p className="mb-4">Join thousands of users who are making smarter food choices with AI</p>
      <button className="btn btn-light btn-lg text-success fw-semibold mb-3" onClick={() => window.open('/FoodLens/Food_Nutrition.html', '_blank')}>
        Start Analyzing
      </button>
      <div className="d-flex flex-column flex-md-row gap-3 justify-content-center small">
        <span>👥 10,000+ Users</span>
        <span>⚡ Lightning Fast</span>
        <span>🔒 100% Secure</span>
      </div>
    </div>
  </section>
);

export default CTASection;
