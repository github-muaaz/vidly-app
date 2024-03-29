import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light custom-navbar">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          Vidly
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target=" #navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink to="/movies" className="nav-item nav-link">
              Movies
            </NavLink>
            <NavLink to="/customers" className="nav-item nav-link">
              Customers
            </NavLink>
            <NavLink to="/rentals" className="nav-item nav-link">
              Rentals
            </NavLink>
            {!user && (
              <React.Fragment>
                <NavLink to="/login" className="nav-item nav-link">
                  Login
                </NavLink>
                <NavLink to="/register" className="nav-item nav-link">
                  Register
                </NavLink>
              </React.Fragment>
            )}
            {user && (
              <React.Fragment>
                <NavLink to="/profile" className="nav-item nav-link">
                  {user.name}
                </NavLink>
                <NavLink to="/logout" className="nav-item nav-link">
                  Logout
                </NavLink>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
