import React from "react";
import { Link } from "react-router-dom";

import Navigation from "./sub-components/navigation";

const Nutrition = () => {
  // Set the page's title
  document.title = "Nutrition | 8Fit - Track your health and fitness journey";

  return (
    <div className="page">
      <Navigation />

      <div className="content">
        <h1>Nutrition</h1>
      </div>
    </div>
  );
}

export default Nutrition;