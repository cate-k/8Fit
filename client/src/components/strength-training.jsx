import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Check } from "react-feather";

import Storage from "../abi/Storage";
import EightFit from "../abi/EightFit";
import Navigation from "./sub-components/navigation";
import StrengthTrainingPost from "./sub-components/strength-training-post";

const StrengthTraining = () => {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [dailyStrengthTrainingGoal, setDailyStrengthTrainingGoal] = useState(0);
  const [weeklyStrengthTrainingGoal, setWeeklyStrengthTrainingGoal] =
    useState(0);
  const [strengthTrainingPosts, setStrengthTrainingPosts] = useState([]);
  const [toggleEdit, setToggleEdit] = useState(false);

  // Set the page's title
  document.title =
    "Strength Training | 8Fit - Track your health and fitness journey";

  useEffect(() => {
    const init = async () => {
      // Fetch the user's daily strength training goal
      let options = {
        contractAddress: Storage.address,
        functionName: "getDailyStrengthTrainingGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailyStrengthTrainingGoal) => {
          if (dailyStrengthTrainingGoal !== "") {
            setDailyStrengthTrainingGoal(
              parseInt(BigNumber.from(dailyStrengthTrainingGoal).toHexString())
            );
          }
        },
      });

      // Fetch the user's weekly strength training goal
      options = {
        contractAddress: Storage.address,
        functionName: "getWeeklyStrengthTrainingGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weeklyStrengthTrainingGoal) => {
          if (weeklyStrengthTrainingGoal !== "") {
            setWeeklyStrengthTrainingGoal(
              parseInt(BigNumber.from(weeklyStrengthTrainingGoal).toHexString())
            );
          }
        },
      });

      // Fetch the user's previous strength training posts
      options = {
        contractAddress: EightFit.address,
        functionName: "getStrengthTrainingPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalStrengthTrainingPostsCreated) => {
          for (
            let strengthTrainingPostsIndex = 0;
            strengthTrainingPostsIndex < totalStrengthTrainingPostsCreated;
            strengthTrainingPostsIndex++
          ) {
            options = {
              contractAddress: EightFit.address,
              functionName: "getStrengthTrainingPost",
              abi: EightFit.abi,
              params: {
                strengthTrainingPostId: strengthTrainingPostsIndex + 1,
              },
            };

            await contractProcessor.fetch({
              params: options,
              onSuccess: (strengthTrainingPost) => {
                // Display the user's previous logs of strength training activities
                if (
                  strengthTrainingPost.userAddress.toLowerCase() ===
                  account.toLowerCase()
                ) {
                  setStrengthTrainingPosts(
                    <StrengthTrainingPost
                      key={strengthTrainingPosts.length}
                      id={strengthTrainingPost.postId}
                      userAddress={strengthTrainingPost.userAddress}
                      category={strengthTrainingPost.category}
                      activityName={strengthTrainingPost.activityName}
                      minutesCompleted={strengthTrainingPost.minutesCompleted}
                      intensity={strengthTrainingPost.intensity}
                      date={strengthTrainingPost.date}
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

  const saveDailyStrengthTrainingGoal = async () => {
    if (document.getElementById("dailyStrengthTrainingGoal").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeDailyStrengthTrainingGoal",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newDailyStrengthTrainingGoal: document.getElementById(
            "dailyStrengthTrainingGoal"
          ).value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailyStrengthTrainingGoal) => {
          if (dailyStrengthTrainingGoal !== "") {
            setDailyStrengthTrainingGoal(dailyStrengthTrainingGoal);
          }
        },
      });
    } else if (
      document.getElementById("dailyStrengthTrainingGoal").value.length === 0
    ) {
      alert("Daily strength training goal cannot be left empty.");
    }
  };

  const saveWeeklyStrengthTrainingGoal = async () => {
    if (document.getElementById("weeklyStrengthTrainingGoal").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeWeeklyStrengthTrainingGoal",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newWeeklyStrengthTrainingGoal: document.getElementById(
            "weeklyStrengthTrainingGoal"
          ).value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weeklyStrengthTrainingGoal) => {
          if (weeklyStrengthTrainingGoal !== "") {
            setWeeklyStrengthTrainingGoal(weeklyStrengthTrainingGoal);
          }
        },
      });
    } else if (
      document.getElementById("weeklyStrengthTrainingGoal").value.length === 0
    ) {
      alert("Weekly strength training goal cannot be left empty.");
    }
  };

  const postStrengthTrainingActivity = async () => {
    if (
      document.getElementById("strengthTrainingActivityName").value.length > 0
    ) {
      if (
        document.getElementById("strengthTrainingMinutesCompleted").value > 0
      ) {
        if (
          document.getElementById("strengthTrainingIntensity").value.length > 0
        ) {
          // Initialise the date
          const date = new Date().getTime();

          let options = {
            contractAddress: EightFit.address,
            functionName: "addStrengthTrainingPost",
            abi: EightFit.abi,
            params: {
              userAddress: account,
              category: "Strength Training",
              activityName: document.getElementById(
                "strengthTrainingActivityName"
              ).value,
              minutesCompleted: document.getElementById(
                "strengthTrainingMinutesCompleted"
              ).value,
              intensity: document.getElementById("strengthTrainingIntensity")
                .value,
              date: date,
            },
          };

          await contractProcessor.fetch({
            params: options,
            onSuccess: async () => {
              alert("Posted strength training activity!");
            },
          });
        } else if (
          document.getElementById("strengthTrainingIntensity").value.length ===
          0
        ) {
          alert("Intensity cannot be left empty.");
        }
      } else if (
        document.getElementById("strengthTrainingMinutesCompleted").value
          .length === 0
      ) {
        alert("Minutes completed cannot be left empty.");
      }
    } else if (
      document.getElementById("strengthTrainingActivityName").value.length === 0
    ) {
      alert("Activity name cannot be left empty.");
    }
  };

  // Check if the user has clicked on the edit details button
  if (toggleEdit === true) {
    return (
      <div className="page">
        <Navigation />

        <div className="content">
          <h1>Fitness</h1>

          <h2>Strength Training</h2>
          <div className="fitness-content">
            <div className="strength-training-goal">
              <h3>Daily Strength Training Goal</h3>
              <p className="fitness-text-input">
                <input
                  id="dailyStrengthTrainingGoal"
                  type="number"
                  placeholder="0"
                />
                <Check
                  className="save-icon"
                  onClick={saveDailyStrengthTrainingGoal}
                />
              </p>
            </div>

            <div className="strength-training-goal">
              <h3>Weekly Strength Training Goal</h3>
              <p className="fitness-text-input">
                <input
                  id="weeklyStrengthTrainingGoal"
                  type="number"
                  placeholder="0"
                />
                <Check
                  className="save-icon"
                  onClick={saveWeeklyStrengthTrainingGoal}
                />
              </p>
            </div>
            <div>
              <button className="edit-btn" onClick={exitEditDetails}>
                Exit
              </button>
            </div>
          </div>
          <div className="strength-training-post-area">
            <h2>Strength Training Activities</h2>

            <p className="profile-heading">Activity Name</p>
            <p className="profile-text-input">
              <input
                id="strengthTrainingActivityName"
                type="text"
                placeholder="Enter an activity name (e.g. weights, Crossfit, circuit training)"
              />
            </p>

            <p className="profile-heading">Minutes Completed</p>
            <p className="profile-text-input">
              <input
                id="strengthTrainingMinutesCompleted"
                type="number"
                placeholder="Enter activity length in minutes"
              />
            </p>

            <p className="profile-heading">Intensity</p>
            <p className="profile-text-input">
              <input
                id="strengthTrainingIntensity"
                type="text"
                placeholder="Enter an intensity (i.e. low, medium, high)"
              />
            </p>
            <div className="fitness-content">
              <button
                className="strength-training-submit-btn"
                onClick={postStrengthTrainingActivity}
              >
                Post
              </button>
            </div>
          </div>

          <div className="strength-training-posts">{strengthTrainingPosts}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="page">
        <Navigation />

        <div className="content">
          <h1>Fitness</h1>

          <h2>Strength Training</h2>
          <div className="fitness-content">
            <div className="strength-training-goal">
              <h3>Daily Strength Training Goal</h3>
              <div className="strength-training-data">
                {dailyStrengthTrainingGoal} minutes
              </div>
            </div>

            <div className="strength-training-goal">
              <h3>Weekly Strength Training Goal</h3>
              <div className="strength-training-data">
                {weeklyStrengthTrainingGoal} minutes
              </div>
            </div>
            <div>
              <button className="edit-btn" onClick={editDetails}>
                Edit Goals
              </button>
            </div>
          </div>
          <div className="strength-training-post-area">
            <h2>Strength Training Activities</h2>

            <p className="profile-heading">Activity Name</p>
            <p className="profile-text-input">
              <input
                id="strengthTrainingActivityName"
                type="text"
                placeholder="Enter an activity name (e.g. weights, Crossfit, circuit training)"
              />
            </p>

            <p className="profile-heading">Minutes Completed</p>
            <p className="profile-text-input">
              <input
                id="strengthTrainingMinutesCompleted"
                type="number"
                placeholder="Enter activity length in minutes"
              />
            </p>

            <p className="profile-heading">Intensity</p>
            <p className="profile-text-input">
              <input
                id="strengthTrainingIntensity"
                type="text"
                placeholder="Enter an intensity (i.e. low, medium, high)"
              />
            </p>
            <div className="fitness-content">
              <button
                className="strength-training-submit-btn"
                onClick={postStrengthTrainingActivity}
              >
                Post
              </button>
            </div>
          </div>

          <div className="strength-training-posts">{strengthTrainingPosts}</div>
        </div>
      </div>
    );
  }
};

export default StrengthTraining;
