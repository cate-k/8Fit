import React from "react";
import { Link } from "react-router-dom";

import Footer from "./sub-components/footer";

const Home = () => {
  return (
    <div className="page">
      <div className="content">
        <h1>8Fit</h1>
        <p>8Fit is a platform that enables users to track their health, fitness, and wellness progress.</p>
      </div>

      <Footer />
    </div>
  );
}

export default Home;