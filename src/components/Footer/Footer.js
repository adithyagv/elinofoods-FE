import './Footer.css';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="column">
        <h4>SHOP</h4>
        <p>All Products</p>
        <p>Bars</p>
        <p>Fruit Jerky</p>
      </div>
      <div className="column">
        <h4>QUICK LINKS</h4>
        <p>Privacy Policy</p>
        <p>Terms & Conditions</p>
        <p>Shipping</p>
      </div>
      <div className="column">
        <h4>CONTACT US</h4>
        <p>Email: <strong>example@gmail.com</strong></p>
        <p>Follow us: <FaFacebook className='icon' /> <FaInstagram className='icon' /></p>
      </div>
    </footer>
  );
};

export default Footer;
