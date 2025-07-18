import React from 'react';
import foodExample from '../assets/food-example.jpg';

const HeroSection = () => (
  <section className="container py-5">
    <div className="row align-items-center bg-light p-4 rounded shadow">
      <div className="col-md-6 mb-4 mb-md-0">
        <h1 className="display-4 fw-bold">
          Discover Your Food's <span className="text-success">Nutrition</span>
        </h1>
        <p className="lead text-muted">
          Upload any food image and get instant, AI-powered nutritional analysis. Make informed decisions about your meals with cutting-edge technology.
        </p>
        <div className="d-flex gap-3 mb-3">
          <button
            className="btn btn-success btn-lg shadow"
            onClick={() => window.open('/FoodLens/Food_Nutrition.html', '_blank')}
          >
            Analyze Food Now
          </button>
          <button className="btn btn-outline-secondary btn-lg">Learn More</button>
        </div>
        <div className="d-flex flex-wrap gap-4 text-secondary small">
          <span>⚡ AI Powered</span>
          <span>⚡ Instant Results</span>
          <span>🔒 Secure &amp; Private</span>
        </div>
      </div>
      {/* Always center image on all screen sizes */}
      <div className="col-md-6 d-flex justify-content-center align-items-center mt-4 mt-md-0">
        <img
          src={foodExample}
          alt="Fresh Food"
          className="img-fluid rounded shadow"
          style={{ 
            maxWidth: '350px', 
            width: '100%',        // Ensures it's responsive on mobile
            height: 'auto', 
            objectFit: 'cover'    // Keeps image proportions nicely
          }}
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
