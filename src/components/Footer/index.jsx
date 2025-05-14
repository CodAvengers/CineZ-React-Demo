import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-wrapper">
                <div className="footer-section">
                    <h4>Home</h4>
                    <ul>
                        <li><a href="#">Categories</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Movies</h4>
                    <ul>
                        <li><a href="#">Genres</a></li>
                        <li><a href="#">Trending</a></li>
                        <li><a href="#">New Release</a></li>
                        <li><a href="#">Popular</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Shows</h4>
                    <ul>
                        <li><a href="#">Genres</a></li>
                        <li><a href="#">Trending</a></li>
                        <li><a href="#">New Release</a></li>
                        <li><a href="#">Popular</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>
                <div className="footer-section footer-social">
                    <h4>Connect With Us</h4>
                    <ul>
                        <li><a href="#"><FaFacebookF /></a></li>
                        <li><a href="#"><FaTwitter /></a></li>
                        <li><a href="#"><FaInstagram /></a></li>
                        <li><a href="#"><FaLinkedinIn /></a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2025 CineZ. All rights reserved.</p>
                <div>
                    <a href="#">Terms of Use</a>
                    <span> | </span>
                    <a href="#">Privacy Policy</a>
                    <span> | </span>
                    <a href="#">Cookie Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
