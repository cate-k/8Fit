import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

import Navigation from "./sub-components/navigation";

const Fitness = () => {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [dailyStepGoal, setDailyStepGoal] = useState(0);

  // Set the page's title
  document.title = "Fitness | 8Fit - Track your health and fitness journey";

  useEffect(() => {
    const init = async () => {
      // Fetch the user's daily step goal
      let options = {
        contractAddress: Storage.address,
        functionName: "getDailyStepGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailyStepGoal) => {
          if (dailyStepGoal !== "") {
            setDailyStepGoal(parseInt(BigNumber.from(dailyStepGoal).toHexString()));
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
        <h1>Fitness</h1>

        <div className="steps-goal">
          <h2>Daily Steps Goal</h2>
          {dailyStepGoal}
        </div>
      </div>
    </div>
  );
}

export default Fitness;