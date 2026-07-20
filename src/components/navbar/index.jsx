import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  RiCloseLine,
  RiSearchLine,
  RiMenuLine,
} from "react-icons/ri";
import "./styles/navbar.css";
import logo from "../../assets/CineZ.svg";
import { searchMulti } from "../../api";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showMenu) setShowMenu(false);
    if (showLogin) setShowLogin(false);
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    if (showMenu) setShowMenu(false);
    if (showSearch) setShowSearch(false);
  };

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setQuery(input);

    if (input.length > 1) {
      searchMulti({ query: input, limit: 5 })
        .then((data) => {
          setResults(data.items);
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
    } else {
      setResults([]);
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setShowSearch(false);
      setQuery("");
      setResults([]);
    }
  };

  return (
    <header className="header" id="header">
      <nav className="nav">
        <Link to="/" className="nav__logo">
          <img src={logo} alt="Cinez logo" />
        </Link>

        <div
          className={`nav__menu ${showMenu ? "show-menu" : ""}`}
          id="nav-menu"
        >
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink
                to="/"
                className="nav__link"
                onClick={() => setShowMenu(false)}
              >
                Home
              </NavLink>
            </li>

            <li className="nav__item">
              <NavLink
                to="/movies"
                className="nav__link"
                onClick={() => setShowMenu(false)}
              >
                Movies
              </NavLink>
            </li>

            <li className="nav__item">
              <NavLink 
                to="/tv-shows"
                className="nav__link"
                onClick={() => setShowMenu(false)}
              >
                Series
              </NavLink>
            </li>

            {/* <li className="nav__item">
              <NavLink
                to="/favorites"
                className="nav__link"
                onClick={() => setShowMenu(false)}
              >
                Favorites
              </NavLink>
            </li>

            <li className="nav__item">
              <NavLink
                to="/about"
                className="nav__link"
                onClick={() => setShowMenu(false)}
              >
                About
              </NavLink>
            </li> */}
          </ul>

          {/* Close button */}
          <div className="nav__close" id="nav-close" onClick={toggleMenu}>
            <RiCloseLine />
          </div>
        </div>

        <div className="nav__actions">
          {/* Search button */}
          <RiSearchLine
            className="nav__search"
            id="search-btn"
            onClick={toggleSearch}
          />

          {/* Login button */}
          {/* <RiUserLine
            className="nav__login"
            id="login-btn"
            onClick={toggleLogin}
          /> */}

          {/* Toggle button */}
          <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
            <RiMenuLine />
          </div>
        </div>

        {/* Search Form */}
        <div className={`search ${showSearch ? "show-search" : ""}`}>
          <form className="search__form" onSubmit={handleSearchSubmit}>
            <RiSearchLine className="search__icon" />
            <input
              type="search"
              placeholder="Search for movies, TV shows..."
              className="search__input"
              value={query}
              onChange={handleSearchChange}
            />
            <RiCloseLine
              className="search__close"
              id="search-close"
              onClick={() => {
                toggleSearch();
                setQuery("");
                setResults([]);
              }}
            />
          </form>

          {/* Search dropdown suggestions */}
          {results.length > 0 && (
            <div className="search-results-dropdown">
              {results.map((item) => (
                <Link
                  key={`${item.mediaType}-${item.id}`}
                  to={`/${item.mediaType}/${item.id}`}
                  className="search-result-item"
                  onClick={() => {
                    setShowSearch(false);
                    setQuery("");
                    setResults([]);
                  }}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Login Form */}
        <div className={`login ${showLogin ? "show-login" : ""}`}>
          <form className="login__form">
            <h2 className="login__title">Login</h2>

            <div className="login__group">
              <div>
                <label htmlFor="email" className="login__label">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="login__input"
                  id="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="login__label">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="login__input"
                  id="password"
                />
              </div>
            </div>

            <div>
              <p className="login__signup">
                Don't have an account? <a href="#">Sign up</a>
              </p>
              <a href="#" className="login__forgot">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login__button">
              Login
            </button>
            <RiCloseLine
              className="login__close"
              id="login-close"
              onClick={toggleLogin}
            />
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
