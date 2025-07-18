import React from 'react';

const steps = [
  {
    icon: "📸",
    title: "Upload Photo",
    description: "Take a photo or upload an image of your food. Our AI works with any food image – from home-cooked meals to restaurant dishes.",
  },
  {
    icon: "💡",
    title: "AI Analysis",
    description: "Our advanced AI analyzes your food instantly. Machine learning identifies ingredients and calculates nutritional values.",
  },
  {
    icon: "✨",
    title: "Get Results",
    description: "Receive detailed nutritional breakdown: calories, macros, vitamins, and personalized health insights.",
  }
];

const HowItWorks = () => (
  <section className="py-5 bg-white text-center">
    <div className="container">
      <h2 className="display-5 fw-bold mb-3">How It Works</h2>
      <p className="text-muted mb-5">
        Simple, fast, and accurate nutritional analysis in three easy steps
      </p>
      <div className="row">
        {steps.map((step, idx) => (
          <div className="col-md-4 mb-4" key={idx}>
            <div className="p-4 bg-light rounded shadow-sm h-100 d-flex flex-column align-items-center">
              <div className="display-4 mb-3">{step.icon}</div>
              <h3 className="h5 fw-semibold">{step.title}</h3>
              <p className="text-secondary">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
