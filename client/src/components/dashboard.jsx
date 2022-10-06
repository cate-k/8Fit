import React from "react";
import { Link } from "react-router-dom";

import Navigation from "./sub-components/navigation";

const Dashboard = () => {
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