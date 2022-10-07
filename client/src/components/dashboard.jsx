import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Zap } from "react-feather";

import Storage from "../abi/Storage";
import Navigation from "./sub-components/navigation";

const Dashboard = () => {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [welcomeMessage, setWelcomeMessage] = useState("Welcome!");
  const [points, setPoints] = useState(0);

  // Set the page's title
  document.title = "Dashboard | 8Fit - Track your health and fitness journey";

  useEffect(() => {
    const init = async () => {
      // Fetch the user's display name
      let options = {
        contractAddress: Storage.address,
        functionName: "getDisplayName",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (name) => {
          if (name !== "") {
            setWelcomeMessage("Welcome, " + name + "!");
          }
        },
      });

      // Fetch the user's total points
      options = {
        contractAddress: Storage.address,
        functionName: "getPoints",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (points) => {
          if (points !== "") {
            setPoints(parseInt(BigNumber.from(points).toHexString()));
          }
        },
      });
    };

    init();
  }, [account]);

  return (
    <div className="page">
      <Navigation />

      <div className="content">
        <h1>{welcomeMessage}</h1>
        <div className="points-info">
          <Zap className="points-icon" />
          {points} points earned
        </div>
      </div>
    </div>
  );
}

export default Dashboard;