import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Storage from "../abi/Storage";
import EightFit from "../abi/EightFit";
import Navigation from "./sub-components/navigation";

const Fitness = () => {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [stepsTaken, setStepsTaken] = useState(0);
  const [dailyStepsTakenGoal, setDailyStepsTakenGoal] = useState(0);
  const [cardioActivity, setCardioActivity] = useState(0);
  const [dailyCardioActivityGoal, setDailyCardioActivityGoal] = useState(0);
  const [wellbeingActivity, setWellbeingActivity] = useState(0);
  const [dailyWellbeingGoal, setDailyWellbeingGoal] = useState(0);

  // Set the page's title
  document.title = "Fitness | 8Fit - Track your health and fitness journey";

  useEffect(() => {
    const init = async () => {
      // Initialise the date
      const dateToday = (new Date()).getTime();
      let date = new Date(parseInt(BigNumber.from(dateToday).toHexString())).toString('DD/mm/yy HH:mm:ss');
      date = date.substring(date.indexOf(' ') + 1, date.indexOf(' ') + 12);

      // Fetch the user's previous logs of steps taken
      let options = {
        contractAddress: EightFit.address,
        functionName: "getStepsPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalStepsPostsCreated) => {
          for (let stepsPostsIndex = 0; stepsPostsIndex < totalStepsPostsCreated; stepsPostsIndex++) {
            options = {
              contractAddress: EightFit.address,
              functionName: "getStepsPost",
              abi: EightFit.abi,
              params: { stepsPostId: stepsPostsIndex + 1 },
            };

            await contractProcessor.fetch({
              params: options,
              onSuccess: (stepsPost) => {
                // Parse the post's date to make the format the same as today's date
                let postDate = Date(parseInt(BigNumber.from(stepsPost.date).toHexString())).toString('DD/mm/yy HH:mm:ss');
                postDate = postDate.substring(postDate.indexOf(' ') + 1, postDate.indexOf(' ') + 12);

                // Check if the log is from today
                if (
                  stepsPost.userAddress.toLowerCase() === account.toLowerCase() &&
                  postDate === date
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
            setDailyStepsTakenGoal(
              parseInt(BigNumber.from(dailyStepGoal).toHexString())
            );
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
                // Parse the post's date to make the format the same as today's date
                let postDate = Date(parseInt(BigNumber.from(cardioPost.date).toHexString())).toString('DD/mm/yy HH:mm:ss');
                postDate = postDate.substring(postDate.indexOf(' ') + 1, postDate.indexOf(' ') + 12);

                // Check if the log is from today
                if (
                  cardioPost.userAddress.toLowerCase() === account.toLowerCase() &&
                  postDate === date
                ) {
                  setCardioActivity(parseInt(BigNumber.from(cardioPost.minutesCompleted).toHexString()));
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
            setDailyCardioActivityGoal(
              parseInt(BigNumber.from(dailyCardioGoal).toHexString())
            );
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
                // Parse the post's date to make the format the same as today's date
                let postDate = Date(parseInt(BigNumber.from(wellbeingPost.date).toHexString())).toString('DD/mm/yy HH:mm:ss');
                postDate = postDate.substring(postDate.indexOf(' ') + 1, postDate.indexOf(' ') + 12);

                // Check if the log is from today
                if (
                  wellbeingPost.userAddress.toLowerCase() === account.toLowerCase() &&
                  postDate === date
                ) {
                  setWellbeingActivity(parseInt(BigNumber.from(wellbeingPost.minutesCompleted).toHexString()));
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
            setDailyWellbeingGoal(
              parseInt(BigNumber.from(dailyWellbeingGoal).toHexString())
            );
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

        <div className="progress-circles">
          <div className="progress-circle-container">
            <CircularProgressbarWithChildren
              value={(stepsTaken / dailyStepsTakenGoal) * 100}
              styles={buildStyles({
                pathColor: "#59d7ee",
              })}
            >
              <div className="progress-circle">
                <strong>{stepsTaken}</strong> out of <strong>{dailyStepsTakenGoal}</strong> steps taken today </div>
            </CircularProgressbarWithChildren>

            <div className="fitness-link">
              <Link to="/steps">
                <button className="highlighted-btn">
                  <span>Steps</span>
                </button>
              </Link>
            </div>
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

            <div className="fitness-link">
              <Link to="/cardio">
                <button className="highlighted-btn">
                  <span>Cardio</span>
                </button>
              </Link>
            </div>
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

            <div className="fitness-link">
              <Link to="/strength-training">
                <button className="highlighted-btn">
                  <span>Strength Training</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fitness;