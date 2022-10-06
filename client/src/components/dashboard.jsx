import React from "react";
import { Link } from "react-router-dom";

import Navigation from "./sub-components/navigation";

const Dashboard = () => {
  // Set the page's title
  document.title = "Dashboard | 8Fit - Track your health and fitness journey";

  return (
    <div className="page">
      <Navigation />

      <div className="content">
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}

export default Dashboard;