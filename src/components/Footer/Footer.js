import "./Footer.css";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  // Shop links configuration
  const shopLinks = [
    { name: "All Products", path: "/products" },
    { name: "Bars", path: "/products?category=bar-blast" },
    { name: "Fruit Jerky", path: "/products?category=fruit-jerky" },
  ];

  // Quick links configuration
  const quickLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms-conditions" },
    { name: "Shipping", path: "/shipping" },
  ];

  // Social links configuration
  const socialLinks = [
    {
      icon: <FaFacebook className="icon" />,
      url: "https://facebook.com/elinofoods",
      name: "Facebook",
      ariaLabel: "Visit our Facebook page",
    },
    {
      icon: <FaInstagram className="icon" />,
      url: "https://instagram.com/elinofoods",
      name: "Instagram",
      ariaLabel: "Visit our Instagram page",
    },
  ];

  // Contact configuration
  const contactInfo = {
    email: "elinofoods@gmail.com",
    phone: "+1 234 567 8900", // Add if needed
    address: "123 Food Street, City, Country", // Add if needed
  };

  return (
    <footer className="footer">
      <div className="column">
        <h4>SHOP</h4>
        {shopLinks.map((link, index) => (
          <a
            key={index}
            href={link.path}
            className="footer-link"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            <p>{link.name}</p>
          </a>
        ))}
      </div>

      <div className="column">
        <h4>QUICK LINKS</h4>
        {quickLinks.map((link, index) => (
          <a
            key={index}
            href={link.path}
            className="footer-link"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            <p>{link.name}</p>
          </a>
        ))}
      </div>

      <div className="column">
        <h4>CONTACT US</h4>
        <p>
          Email:{" "}
          <strong>
            <a
              href={`mailto:${contactInfo.email}`}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
              className="email-link"
            >
              {contactInfo.email}
            </a>
          </strong>
        </p>
        <p className="social-links">
          Follow us:{" "}
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.ariaLabel}
              title={social.name}
              style={{
                color: "inherit",
                textDecoration: "none",
                marginLeft: index > 0 ? "8px" : "0",
              }}
            >
              {social.icon}
            </a>
          ))}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
