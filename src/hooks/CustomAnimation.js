import { useEffect, useRef, useState } from "react";

// Custom hook for intersection observer
export const useInView = (options = {}) => {
  const [inView, setInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setInView(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-50px 0px",
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated, options]);

  return [ref, inView];
};

// Animation variants
export const animationVariants = {
  fadeInUp: {
    initial: {
      opacity: 0,
      transform: "translateY(60px)",
    },
    animate: {
      opacity: 1,
      transform: "translateY(0px)",
    },
  },
  fadeInLeft: {
    initial: {
      opacity: 0,
      transform: "translateX(-60px)",
    },
    animate: {
      opacity: 1,
      transform: "translateX(0px)",
    },
  },
  fadeInRight: {
    initial: {
      opacity: 0,
      transform: "translateX(60px)",
    },
    animate: {
      opacity: 1,
      transform: "translateX(0px)",
    },
  },
  fadeIn: {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  },
  scaleIn: {
    initial: {
      opacity: 0,
      transform: "scale(0.8)",
    },
    animate: {
      opacity: 1,
      transform: "scale(1)",
    },
  },
  slideInUp: {
    initial: {
      opacity: 0,
      transform: "translateY(100px)",
    },
    animate: {
      opacity: 1,
      transform: "translateY(0px)",
    },
  },
  rotateIn: {
    initial: {
      opacity: 0,
      transform: "rotate(-10deg) scale(0.9)",
    },
    animate: {
      opacity: 1,
      transform: "rotate(0deg) scale(1)",
    },
  },
};

// Animated component wrapper
export const AnimatedSection = ({
  children,
  animation = "fadeInUp",
  delay = 0,
  duration = 0.6,
  className = "",
  style = {},
  onClick = null,
}) => {
  const [ref, inView] = useInView();
  const variant = animationVariants[animation];

  const animationStyle = {
    ...variant.initial,
    transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
    ...(inView ? variant.animate : {}),
    ...style,
  };

  return (
    <div
      ref={ref}
      className={className}
      style={animationStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
