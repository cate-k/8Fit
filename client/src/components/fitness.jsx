import React from "react";
import { Link } from "react-router-dom";

import Navigation from "./sub-components/navigation";

const Fitness = () => {
  // Set the page's title
  document.title = "Fitness | 8Fit - Track your health and fitness journey";

  return (
    <div className="page">
      <Navigation />

      <div className="content">
        <h1>Fitness</h1>

        <div className="fitness-links">
          <Link to="/steps">
            <button className="highlighted-btn">
              <span>Steps</span>
            </button>
          </Link>

          <Link to="/cardio">
            <button className="highlighted-btn">
              <span>Cardio</span>
            </button>
          </Link>

          <Link to="/strength-training">
            <button className="highlighted-btn">
              <span>Strength Training</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Fitness;