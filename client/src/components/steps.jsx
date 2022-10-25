import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Check } from "react-feather";

import Storage from "../abi/Storage";
import EightFit from "../abi/EightFit";
import Navigation from "./sub-components/navigation";
import StepsPost from "./sub-components/steps-post";

const Fitness = () => {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [dailyStepGoal, setDailyStepGoal] = useState(0);
  const [weeklyStepGoal, setWeeklyStepGoal] = useState(0);
  const [stepsPosts, setStepsPosts] = useState([]);
  const [toggleEdit, setToggleEdit] = useState(false);

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
            setDailyStepGoal(
              parseInt(BigNumber.from(dailyStepGoal).toHexString())
            );
          }
        },
      });

      // Fetch the user's weekly step goal
      options = {
        contractAddress: Storage.address,
        functionName: "getWeeklyStepGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weeklyStepGoal) => {
          if (weeklyStepGoal !== "") {
            setWeeklyStepGoal(
              parseInt(BigNumber.from(weeklyStepGoal).toHexString())
            );
          }
        },
      });

      // Fetch the user's previous steps taken
      options = {
        contractAddress: EightFit.address,
        functionName: "getStepsPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalStepsPostsCreated) => {
          for (
            let stepsPostsIndex = 0;
            stepsPostsIndex < totalStepsPostsCreated;
            stepsPostsIndex++
          ) {
            options = {
              contractAddress: EightFit.address,
              functionName: "getStepsPost",
              abi: EightFit.abi,
              params: { stepsPostId: stepsPostsIndex + 1 },
            };

            await contractProcessor.fetch({
              params: options,
              onSuccess: (stepsPost) => {
                // Display the user's previous logs of steps taken
                if (
                  stepsPost.userAddress.toLowerCase() === account.toLowerCase()
                ) {
                  setStepsPosts(
                    <StepsPost
                      key={stepsPosts.length}
                      id={stepsPost.shortPostId}
                      userAddress={stepsPost.userAddress}
                      activityLength={stepsPost.activityLength}
                      date={stepsPost.date}
                    />
                  );
                }
              },
            });
          }
        },
      });
    };

    init();
  }, [account]);

  const editDetails = () => {
    setToggleEdit(true);
  };

  const exitEditDetails = () => {
    setToggleEdit(false);
  };

  const saveDailyStepsGoal = async () => {
    if (document.getElementById("dailyStepsGoal").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeDailyStepGoal",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newDailyStepGoal: document.getElementById("dailyStepsGoal").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailyStepsGoal) => {
          if (dailyStepsGoal !== "") {
            setDailyStepGoal(dailyStepsGoal);
          }
        },
      });
    } else if (document.getElementById("dailyStepsGoal").value.length === 0) {
      alert("Daily steps goal cannot be left empty.");
    }
  };

  const saveWeeklyStepsGoal = async () => {
    if (document.getElementById("weeklyStepsGoal").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeWeeklyStepGoal",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newWeeklyStepGoal: document.getElementById("weeklyStepsGoal").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weeklyStepsGoal) => {
          if (weeklyStepsGoal !== "") {
            setWeeklyStepGoal(weeklyStepsGoal);
          }
        },
      });
    } else if (document.getElementById("weeklyStepsGoal").value.length === 0) {
      alert("Weekly steps goal cannot be left empty.");
    }
  };

  const postStepsTaken = async () => {
    if (document.getElementById("stepsTaken").value > 0) {
      // Initialise the date
      const date = new Date().getTime();

      let options = {
        contractAddress: EightFit.address,
        functionName: "addDailyStepPost",
        abi: EightFit.abi,
        params: {
          userAddress: account,
          stepsTakenToday: document.getElementById("stepsTaken").value,
          date: date,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async () => {
          alert("Added steps taken today!");
        },
      });
    } else if (document.getElementById("stepsTaken").value.length === 0) {
      alert("Steps taken today cannot be left empty.");
    }
  };

  // Check if the user has clicked on the edit details button
  if (toggleEdit === true) {
    return (
      <div className="page">
        <Navigation />

        <div className="content">
          <h1>Fitness</h1>

          <h2>Steps</h2>
          <div className="fitness-content">
            <div className="steps-goals">
              <div className="steps-goal">
                <h3>Daily Steps Goal</h3>
                <input id="dailyStepsGoal" type="number" placeholder="0" />
                <Check className="save-icon" onClick={saveDailyStepsGoal} />
              </div>

              <div className="steps-goal">
                <h3>Weekly Steps Goal</h3>
                <input id="weeklyStepsGoal" type="number" placeholder="0" />
                <Check className="save-icon" onClick={saveWeeklyStepsGoal} />
              </div>
            </div>

            <button className="edit-btn" onClick={exitEditDetails}>
              Exit
            </button>

            <h2 className="steps-taken-heading">Steps Taken Today</h2>
            <div className="steps-taken">
              <input id="stepsTaken" type="number" placeholder="0" />
              <Check className="save-icon" onClick={postStepsTaken} />
            </div>

            <div className="steps-posts">{stepsPosts}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="page">
        <Navigation />

        <div className="content">
          <h1>Fitness</h1>

          <h2>Steps</h2>
          <div className="fitness-content">
            <div className="steps-goals">
              <div className="steps-goal">
                <h3>Daily Steps Goal</h3>
                {dailyStepGoal}
              </div>

              <div className="steps-goal">
                <h3>Weekly Steps Goal</h3>
                {weeklyStepGoal}
              </div>
            </div>

            <button className="edit-btn" onClick={editDetails}>
              Edit Goals
            </button>

            <h2 className="steps-taken-heading">Steps Taken Today</h2>
            <div className="steps-taken">
              <input id="stepsTaken" type="number" placeholder="0" />
              <Check className="save-icon" onClick={postStepsTaken} />
            </div>

            <div className="steps-posts">{stepsPosts}</div>
          </div>
        </div>
      </div>
    );
  }
};

export default Fitness;
