import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ProgressBar } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";

import Storage from "../abi/Storage";
import EightFit from "../abi/EightFit";
import Navigation from "./sub-components/navigation";

const Dashboard = () => {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [welcomeMessage, setWelcomeMessage] = useState("Welcome!");
  const [stepsTaken, setStepsTaken] = useState(0);
  const [dailyStepsTakenGoal, setDailyStepsTakenGoal] = useState(0);
  const [cardioActivity, setCardioActivity] = useState(0);
  const [dailyCardioActivityGoal, setDailyCardioActivityGoal] = useState(0);
  const [wellbeingActivity, setWellbeingActivity] = useState(0);
  const [dailyWellbeingGoal, setDailyWellbeingGoal] = useState(0);
  const [points, setPoints] = useState(0);
  const [pointsGoal, setPointsGoal] = useState(100);
  const [level, setLevel] = useState(0);

  // Set the page's title
  document.title = "Dashboard | 8Fit - Track your health and fitness journey";

  useEffect(() => {
    const init = async () => {
      // Initialise the date
      const date = new Date().getTime();

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
        onSuccess: (pointsReturned) => {
          if (pointsReturned !== "") {
            setPoints(parseInt(BigNumber.from(pointsReturned).toHexString()));

            // Calculate the user's next XP goal
            if (points >= pointsGoal) {
              let currentPoints = points.toString().substring(0, 1);

              setPointsGoal((parseInt(currentPoints) + 1) * 100);
            }

            // Initialise the user's current level based on XP goal
            setLevel(parseInt(pointsGoal.toString().substring(0, 1)));
          }
        },
      });

      // Fetch the user's previous logs of steps taken
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
                // Check if the log is from today
                if (
                  stepsPost.userAddress.toLowerCase() === account.toLowerCase() &&
                  Date(parseInt(BigNumber.from(stepsPost.date).toHexString())).toString('DD/mm/yy HH:mm:ss') === date
                ) {
                  setStepsTaken(parseInt(BigNumber.from(stepsPost.activityLength).toHexString()));
                }
              },
            });
          }
        },
      });

      // Fetch the user's daily step goal
      options = {
        contractAddress: Storage.address,
        functionName: "getDailyStepGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailyStepGoal) => {
          if (dailyStepGoal !== "") {
            setDailyStepsTakenGoal(parseInt(BigNumber.from(dailyStepGoal).toHexString()));
          }
        },
      });

      // Fetch how many minutes of cardio the user has done today
      options = {
        contractAddress: EightFit.address,
        functionName: "getCardioPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalCardioPostsCreated) => {
          for (let cardioPostsIndex = 0; cardioPostsIndex < totalCardioPostsCreated; cardioPostsIndex++) {
            options = {
              contractAddress: EightFit.address,
              functionName: "getCardioPost",
              abi: EightFit.abi,
              params: { cardioPostId: cardioPostsIndex + 1 },
            };

            await contractProcessor.fetch({
              params: options,
              onSuccess: (cardioPost) => {
                // Check if the log is from today
                if (
                  cardioPost.userAddress.toLowerCase() === account.toLowerCase() &&
                  Date(parseInt(BigNumber.from(cardioPost.date).toHexString())).toString('DD/mm/yy HH:mm:ss') === date
                ) {
                  setCardioActivity(parseInt(BigNumber.from(cardioPost.activityLength).toHexString()));
                }
              },
            });
          }
        },
      });

      // Fetch the user's daily cardio goal
      options = {
        contractAddress: Storage.address,
        functionName: "getDailyCardioGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailyCardioGoal) => {
          if (dailyCardioGoal !== "") {
            setDailyCardioActivityGoal(parseInt(BigNumber.from(dailyCardioGoal).toHexString()));
          }
        },
      });

      // Fetch how many minutes of wellbeing activity the user has done today
      options = {
        contractAddress: EightFit.address,
        functionName: "getWellbeingPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalWellbeingPostsCreated) => {
          for (let wellbeingPostsIndex = 0; wellbeingPostsIndex < totalWellbeingPostsCreated; wellbeingPostsIndex++) {
            options = {
              contractAddress: EightFit.address,
              functionName: "getWellbeingPost",
              abi: EightFit.abi,
              params: { wellbeingPostId: wellbeingPostsIndex + 1 },
            };

            await contractProcessor.fetch({
              params: options,
              onSuccess: (wellbeingPost) => {
                // Check if the log is from today
                if (
                  wellbeingPost.userAddress.toLowerCase() === account.toLowerCase() &&
                  Date(parseInt(BigNumber.from(wellbeingPost.date).toHexString())).toString('DD/mm/yy HH:mm:ss') === date
                ) {
                  setWellbeingActivity(parseInt(BigNumber.from(wellbeingPost.activityLength).toHexString()));
                }
              },
            });
          }
        },
      });

      // Fetch the user's daily wellbeing goal
      options = {
        contractAddress: Storage.address,
        functionName: "getDailyWellbeingGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailyWellbeingGoal) => {
          if (dailyWellbeingGoal !== "") {
            setDailyWellbeingGoal(parseInt(BigNumber.from(dailyWellbeingGoal).toHexString()));
          }
        },
      });
    };

    init();
  }, [account, points, pointsGoal]);

  return (
    <div className="page">
      <Navigation />

      <div className="content">
        <h1>{welcomeMessage}</h1>
        <div className="points-progress">
          <ProgressBar
            percent={(points / pointsGoal) * 100}
            filledBackground="linear-gradient(to right, #53dfd1, #a87cd4)"
          />
          <span>{points} / {pointsGoal} XP</span>
          <span className="level">Level {level}</span>
        </div>

        <div className="progress-circles">
          <div className="progress-circle-container">
            <CircularProgressbarWithChildren
              value={(stepsTaken / dailyStepsTakenGoal) * 100}
              styles={buildStyles({
                pathColor: "#59d7ee",
              })}
            >
              <div className="progress-circle">
                <strong>{stepsTaken}</strong> out of <strong>{dailyStepsTakenGoal}</strong> steps taken today
              </div>
            </CircularProgressbarWithChildren>
          </div>

          <div className="progress-circle-container">
            <CircularProgressbarWithChildren
              value={(cardioActivity / dailyCardioActivityGoal) * 100}
              styles={buildStyles({
                pathColor: "#a87cd4",
              })}
            >
              <div className="progress-circle">
                <strong>{cardioActivity}</strong> out of <strong>{dailyCardioActivityGoal}</strong> minutes of cardio today
              </div>
            </CircularProgressbarWithChildren>
          </div>

          <div className="progress-circle-container">
            <CircularProgressbarWithChildren
              value={(wellbeingActivity / dailyWellbeingGoal) * 100}
              styles={buildStyles({
                pathColor: "#46769b",
              })}
            >
              <div className="progress-circle">
                <strong>{wellbeingActivity}</strong> out of <strong>{dailyWellbeingGoal}</strong> minutes of wellbeing activity today
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </div>

        <h2>Achievements</h2>
      </div>
    </div>
  );
}

export default Dashboard;