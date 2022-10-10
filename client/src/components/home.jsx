import React from "react";
import { Link } from "react-router-dom";

import Footer from "./sub-components/footer";

const Home = () => {
  // Set the page's title
  document.title = "Home | 8Fit - Track your health and fitness journey";

  return (
    <div className="page">
      <div className="content home">
        <div className="home-logo-container">
          <img
            className="home-logo"
            src={require("../styles/images/logo-white.png")}
            alt="8Fit"
          />
        </div>

        {/* <p>
          8Fit is a platform that enables users to track their health, fitness,
          and wellness progress.
        </p> */}

        <Link to="/profile">
          <button className="highlighted-btn">
            <img
              className="metamask-logo"
              src={require("../styles/images/metamask.png")}
              alt="MetaMask"
            />
            <span>Connect</span>
          </button>
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
