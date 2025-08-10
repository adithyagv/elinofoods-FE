import React, { useState, useEffect } from "react";
import "./BlogHome.css";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";

const slidess = [
  { id: 1, image: "./assets/blg 1.png", text: "Healthy Eating 101", subtext: "A Beginner's Guide to Nutrition" },
  { id: 2, image: "./assets/blg 2.png", text: "Nutrition Tips for a Balanced Diet", subtext: "Simple Ways to Improve Your Eating Habits" },
  { id: 3, image: "./assets/blg 3.png", text: "Meal Prep Ideas for Busy Lives",   subtext: "Quick and Healthy Recipes to Save Time" },
];

const BlogHome = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slidess.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slidess.length) % slidess.length);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

 

  return (
    <div className="blog-home">
        <h2>
            Healthy Eating 101
        </h2>
    <div className="carousel-blog">
      {slidess.map((slides, index) => (
        <div
          className={`slides ${index === current ? "active" : ""}`}
          key={slides.id}
        >
          <img src={slides.image} alt={`Slide ${index + 1}`} />
          <div  alt={`Slide ${index + 1}`}>
            <h2 className="slide-text">{slides.text}</h2>
            <p className="slide-subtext">{slides.subtext}</p>
            </div>
        
        <button className="read-more1">Read More</button>
        </div>
      ))}
    <div className="arrows">
      <button className="arrows left" onClick={prevSlide}>
        <IoIosArrowDropleftCircle size={40} />
      </button>
      <button className="arrows right" onClick={nextSlide}>
        <IoIosArrowDroprightCircle size={40} />
      </button>
</div>
      <div className="dots">
        {slidess.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
    </div>
  );
};

export default BlogHome;
