import React, { useState } from 'react';
import './InstaFeed.css';
import { FaInstagramSquare, FaPlay } from 'react-icons/fa';
import { FaInstagram } from "react-icons/fa";
const ReelCard = ({ url }) => {
  const openReel = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="reel-card" onClick={openReel}>
      <div className="play-icon">
        <FaPlay />
      </div>
      <img
        src="https://via.placeholder.com/300x500?text=Reel+Thumbnail"
        alt="Reel"
      />
    </div>
  );
};

const InstaFeed = () => {
  const reels = [
    'https://www.instagram.com/reel/DAlM42hR-kD/?igsh=MTI3aTYzY2phZXMxNg==',
    'https://www.instagram.com/reel/DAlM42hR-kD/?igsh=MTI3aTYzY2phZXMxNg==',
    'https://www.instagram.com/reel/DAlM42hR-kD/?igsh=MTI3aTYzY2phZXMxNg==',
    'https://www.instagram.com/reel/DAlM42hR-kD/?igsh=MTI3aTYzY2phZXMxNg==',
    'https://www.instagram.com/reel/DAlM42hR-kD/?igsh=MTI3aTYzY2phZXMxNg==',
  ];

  return (
     <div className="reel-card-container">
        <div className="reel-card-header">
    <h2 className="reel-card-title">
        Check us out <br></br>on your <FaInstagram className='insta-icon' /> feed
    </h2>   
    </div>
    <div className="reel-slider">
      {reels.map((url, index) => (
        <ReelCard key={index} url={url} />
      ))}
    </div>
    </div>
  );
};

export default InstaFeed;
