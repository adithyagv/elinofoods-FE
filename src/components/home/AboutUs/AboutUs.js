import React from 'react';
import './AboutUs.css';

const aboutCards = [
  {
    title: "Our Story",
    image: "./assets/reel 1.jpg",
  },
  {
    title: "Our Ingredients",
    image: "./assets/reel 2.jpg",  
  },
  {
    title: "Our Process",
    image: "./assets/reel 1.jpg",
  },
  {
    title: "Our Commitment",
    image: "./assets/reel 2.jpg",
  },
];

const AboutUs = () => {
  return (
    <div className="about-us-section">
      <h2>About Us</h2>
      <div className="about-cards-container">
        {aboutCards.map((card, index) => (
          <div className="about-card fade-in" key={index}>
            <img src={card.image} alt={card.title} className="card-image" />
            <div className="overlay">
              <h3>{card.title}</h3>
              <button className="read-more">Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
