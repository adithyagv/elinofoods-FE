import React, { useState, useEffect } from "react";
import "./HeroCarousel.css";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";

const slides = [
  { id: 1, image: "./assets/slide 1.jpg" },
  { id: 2, image: "./assets/slide 2.jpg" },
  { id: 3, image: "./assets/slide 3.jpg" },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 10000); // auto slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carousel">
      {slides.map((slide, index) => (
        <div
          className={`slide ${index === current ? "active" : ""}`}
          key={slide.id}
        >
          <img src={slide.image} alt={`Slide ${index + 1}`} />
        </div>
      ))}
      <button className="arrow left" onClick={prevSlide}>
        <IoIosArrowDropleftCircle size={40} />
      </button>
      <button className="arrow right" onClick={nextSlide}>
        <IoIosArrowDroprightCircle size={40} />
      </button>

      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
