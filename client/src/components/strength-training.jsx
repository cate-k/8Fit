import React from "react";
import { Link } from "react-router-dom";

import Navigation from "./sub-components/navigation";

const StrengthTraining = () => {
  // Set the page's title
  document.title = "Strength Training | 8Fit - Track your health and fitness journey";

  return (
    <div className="page">
      <Navigation />

      <div className="content">
        <h1>Strength Training</h1>

        <div className="strength-training-links">
          {/* <Link to="/steps">
            <button className="highlighted-btn">
              <span>Steps</span>
            </button>
          </Link> */}
        </div>
      </div>
    </div>
  );
}

export default StrengthTraining;