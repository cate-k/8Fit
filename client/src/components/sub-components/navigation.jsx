import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMoralis, useWeb3ExecuteFunction  } from "react-moralis";
import Identicon from "react-hooks-identicons";
import { Activity, Heart, Coffee, PlusSquare } from "react-feather";

const Navigation = () => {
  const { authenticate, account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [displayName, setDisplayName] = useState("You");

  useEffect(() => {
    const init = async () => {
      // Authenticate the user
      if (account === null) {
        authenticate({ signingMessage: "Authenticate using MetaMask to continue using 8Fit" });
      }

      // Fetch the user's profile picture
      let options = {
        contractAddress: Storage.address,
        functionName: "getDisplayName",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: (userDisplayName) => {
          if (userDisplayName !== "") {
            setDisplayName(userDisplayName);
          }
        },
      });
    };

    init();
  }, [account]);

  return (
    <div className="navigation">
      <div className="nav-logo">
        <Link to="/home">
          <img
            className="logo"
            src={require("../../styles/images/logo.png")}
            alt="8Fit"
          />
        </Link>
      </div>

      <div className="nav-links">
        <Link className="link" to="/dashboard">
          <Activity className="link-icon" />
          <h3>Dashboard</h3>
        </Link>

        <Link className="link" to="/fitness">
          <Heart className="link-icon" />
          <h3>Fitness</h3>
        </Link>

        <Link className="link" to="/nutrition">
          <Coffee className="link-icon" />
          <h3>Nutrition</h3>
        </Link>

        <Link className="link" to="/wellbeing">
          <PlusSquare className="link-icon" />
          <h3>Wellbeing</h3>
        </Link>

        <Link
          className="link"
          to={{
            pathname: "/profile/" + account
          }}
        >
          <Identicon className="avatar" string={account} size={45} />
          <h3>{displayName}</h3>
        </Link>
      </div>
    </div>
  );
}

export default Navigation;