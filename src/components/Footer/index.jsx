import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/CineZ.svg";
import "./styles/footer.css";

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="CineZ Logo" />
            </Link>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Links</h4>
              <ul>
                <li>
                  <NavLink to="/movies" className="nav__link">
                    Movies
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/tv-shows" className="nav__link">
                    Series
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <ul>
                <li>
                  <a href="https://github.com/bravvjr">GitHub</a>
                </li>
                <li>
                  <a href="https://www.behance.net/bravvjr">Behance</a>
                </li>
              </ul>
            </div>
            {/* <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms & Conditions</a>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
        <hr />
        <div className="footer-bottom">
          <p>
            © 2025 <a href="#">CineZ</a>. All Rights Reserved.
          </p>
          <div className="footer-socials">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-github"></i>
            </a>
            <a href="#">
              <i className="fab fa-dribbble"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
