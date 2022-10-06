import React from "react";
import { Link } from "react-router-dom";

import Footer from "./sub-components/footer";

const Home = () => {
  return (
    <div className="page">
      <div className="content home">
        <img
          className="home-logo"
          src={require("../styles/images/logo.png")}
          alt="8Fit"
        />

        <p>8Fit is a platform that enables users to track their health, fitness, and wellness progress.</p>

        <Link to="/dashboard">
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
}

export default Home;