import React, { useState, useEffect } from "react";
import "./HeroCarousel.css";
import {
  IoIosArrowDroprightCircle,
  IoIosArrowDropleftCircle,
} from "react-icons/io";
import client from "../../lib/contentful";

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch slides from Contentful
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        console.log("Fetching carousel slides...");

        const response = await client.getEntries({
          content_type: "carouselSlide",
          order: "fields.order",
          include: 2, // Include linked assets
        });

        console.log("Contentful response:", response);

        if (!response.items || response.items.length === 0) {
          console.log("No carousel slide entries found");
          setSlides([]);
          setLoading(false);
          return;
        }

        const slidesData = response.items
          .map((item) => {
            console.log("Processing item:", item);
            console.log("Item fields:", item.fields);

            // Check if image field exists
            if (!item.fields.image) {
              console.error("Image field missing for item:", item.sys.id);
              return null;
            }

            let imageUrl = "";

            // Handle different image field structures
            if (Array.isArray(item.fields.image)) {
              // Image field is an array (Many files setting)
              console.log("Image field is array:", item.fields.image);
              if (item.fields.image.length > 0) {
                const firstImage = item.fields.image[0];
                if (firstImage.fields && firstImage.fields.file) {
                  imageUrl = firstImage.fields.file.url;
                  console.log("Found image URL (from array):", imageUrl);
                } else {
                  console.error(
                    "First image in array has no file field:",
                    firstImage
                  );
                }
              } else {
                console.error("Image array is empty for item:", item.sys.id);
              }
            } else if (
              item.fields.image.fields &&
              item.fields.image.fields.file
            ) {
              // Standard single linked asset structure
              imageUrl = item.fields.image.fields.file.url;
              console.log("Found image URL (single linked asset):", imageUrl);
            } else if (
              item.fields.image.sys &&
              item.fields.image.sys.type === "Link"
            ) {
              // Asset is linked but not resolved - need to find in includes
              const assetId = item.fields.image.sys.id;
              console.log("Looking for asset ID in includes:", assetId);

              if (response.includes && response.includes.Asset) {
                const asset = response.includes.Asset.find(
                  (a) => a.sys.id === assetId
                );
                if (asset && asset.fields && asset.fields.file) {
                  imageUrl = asset.fields.file.url;
                  console.log("Found image URL (from includes):", imageUrl);
                } else {
                  console.error("Asset not found in includes for ID:", assetId);
                }
              }
            } else if (typeof item.fields.image === "string") {
              // Direct URL string
              imageUrl = item.fields.image;
              console.log("Found direct image URL:", imageUrl);
            } else {
              console.error(
                "Unexpected image field structure:",
                item.fields.image
              );
              return null;
            }

            if (!imageUrl) {
              console.error(
                "Could not extract image URL for item:",
                item.sys.id
              );
              return null;
            }

            // Ensure proper HTTPS protocol
            const fullImageUrl = imageUrl.startsWith("//")
              ? `https:${imageUrl}`
              : imageUrl.startsWith("http")
              ? imageUrl
              : `https:${imageUrl}`;

            console.log("Final image URL:", fullImageUrl);

            return {
              id: item.sys.id,
              title: item.fields.title || "Untitled Slide",
              image: fullImageUrl,
              altText:
                item.fields.altText || item.fields.title || "Carousel slide",
              linkUrl: item.fields.linkUrl || null,
              description: item.fields.description || null,
              order: item.fields.order || 0,
            };
          })
          .filter(Boolean); // Remove null entries

        console.log("Processed slides data:", slidesData);
        setSlides(slidesData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching slides:", err);
        setError(`Failed to load slides: ${err.message}`);
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  // Auto slide effect
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(nextSlide, 10000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  if (loading) {
    return (
      <div className="carousel loading">
        <div className="loading-spinner">Loading slides...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carousel error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="carousel empty">
        <div className="empty-message">
          No slides available. Please add carousel slides in Contentful.
        </div>
      </div>
    );
  }

  return (
    <div className="carousel">
      {slides.map((slide, index) => (
        <div
          className={`slide ${index === current ? "active" : ""}`}
          key={slide.id}
        >
          {slide.linkUrl ? (
            <a href={slide.linkUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={slide.image}
                alt={slide.altText}
                loading="lazy"
                onError={(e) => {
                  console.error("Image failed to load:", slide.image);
                  e.target.style.display = "none";
                }}
                onLoad={() => {
                  console.log("Image loaded successfully:", slide.image);
                }}
              />
            </a>
          ) : (
            <img
              src={slide.image}
              alt={slide.altText}
              loading="lazy"
              onError={(e) => {
                console.error("Image failed to load:", slide.image);
                e.target.style.display = "none";
              }}
              onLoad={() => {
                console.log("Image loaded successfully:", slide.image);
              }}
            />
          )}
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            className="arrow left"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <IoIosArrowDropleftCircle size={40} />
          </button>
          <button
            className="arrow right"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <IoIosArrowDroprightCircle size={40} />
          </button>

          <div className="dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === current ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
