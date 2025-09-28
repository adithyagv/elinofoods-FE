import React, { useState, useEffect } from "react";
import "./InstaFeed.css";
import { FaPlay } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const ReelCard = ({ reel }) => {
  const openReel = () => {
    window.open(reel.permalink, "_blank");
  };

  return (
    <div className="reel-card" onClick={openReel}>
      <div className="play-icon">
        <FaPlay />
      </div>
      <img src={reel.thumbnail_url || reel.media_url} alt="Reel" />
    </div>
  );
};

const InstaFeed = () => {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const response = await fetch(
        `https://graph.instagram.com/${process.env.REACT_APP_INSTAGRAM_ACCOUNT_ID}/media?fields=id,media_type,media_url,thumbnail_url,permalink&access_token=${process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN}`
      );
      const data = await response.json();
      if (data.data) {
        const reelData = data.data
          .filter((item) => item.media_type === "VIDEO")
          .slice(0, 5);
        setReels(reelData);
      }
    } catch (error) {
      console.error("Error fetching reels:", error);
    }
  };

  return (
    <div className="reel-card-container">
      <div className="reel-card-header">
        <h2 className="reel-card-title">
          Check us out <br></br>on your <FaInstagram className="insta-icon" />{" "}
          feed
        </h2>
      </div>
      <div className="reel-slider">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </div>
  );
};

export default InstaFeed;
