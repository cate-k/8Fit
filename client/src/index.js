import React from "react";
import ReactDOM from "react-dom/client";
import { MoralisProvider } from "react-moralis";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "./index.css";

import Home from "./components/home";
import Dashboard from "./components/dashboard";
import Fitness from "./components/fitness";
import Nutrition from "./components/nutrition";
import Wellbeing from "./components/wellbeing";
import Profile from "./components/profile";

const root = ReactDOM.createRoot(document.getElementById("root"));
const moralisAppId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const moralisDappUrl = process.env.REACT_APP_MORALIS_DAPP_URL;

root.render(
  <MoralisProvider appId={moralisAppId} serverUrl={moralisDappUrl}>
    <Router>
      <Switch>
        <Route path="/home" render={(props) => <Home {...props} />} />
        <Route path="/dashboard" render={(props) => <Dashboard {...props} />} />
        <Route path="/fitness" render={(props) => <Fitness {...props} />} />
        <Route path="/nutrition" render={(props) => <Nutrition {...props} />} />
        <Route path="/wellbeing" render={(props) => <Wellbeing {...props} />} />
        <Route path="/profile/:user" render={(props) => <Profile {...props} />} />

        <Redirect to="/home" />
      </Switch>
    </Router>
  </MoralisProvider>
);