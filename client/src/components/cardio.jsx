import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Check } from "react-feather";

import Storage from "../abi/Storage";
import EightFit from "../abi/EightFit";
import Navigation from "./sub-components/navigation";
import CardioPost from "./sub-components/cardio-post";

const Cardio = () => {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [dailyCardioGoal, setDailyCardioGoal] = useState(0);
  const [weeklyCardioGoal, setWeeklyCardioGoal] = useState(0);
  const [cardioPosts, setCardioPosts] = useState([]);
  const [toggleEdit, setToggleEdit] = useState(false);

  // Set the page's title
  document.title = "Cardio | 8Fit - Track your health and fitness journey";

  useEffect(() => {
    const init = async () => {
      // Fetch the user's daily cardio goal
      let options = {
        contractAddress: Storage.address,
        functionName: "getDailyCardioGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailyCardioGoal) => {
          if (dailyCardioGoal !== "") {
            setDailyCardioGoal(parseInt(BigNumber.from(dailyCardioGoal).toHexString()));
          }
        },
      });

      // Fetch the user's weekly cardio goal
      options = {
        contractAddress: Storage.address,
        functionName: "getWeeklyCardioGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weeklyCardioGoal) => {
          if (weeklyCardioGoal !== "") {
            setWeeklyCardioGoal(
              parseInt(BigNumber.from(weeklyCardioGoal).toHexString())
            );
          }
        },
      });

      // Fetch the user's previous cardio posts
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
                // Display the user's previous logs of cardio activities
                if (cardioPost.userAddress.toLowerCase() === account.toLowerCase()) {
                  setCardioPosts(
                    <CardioPost
                      key={cardioPosts.length}
                      id={cardioPost.postId}
                      userAddress={cardioPost.userAddress}
                      category={cardioPost.category}
                      activityName={cardioPost.activityName}
                      minutesCompleted={cardioPost.minutesCompleted}
                      intensity={cardioPost.intensity}
                      date={cardioPost.date}
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

  const saveDailyCardioGoal = async () => {
    if (document.getElementById("dailyCardioGoal").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeDailyCardioGoal",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newDailyCardioGoal: document.getElementById("dailyCardioGoal").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailyCardioGoal) => {
          if (dailyCardioGoal !== "") {
            setDailyCardioGoal(dailyCardioGoal);
          }
        },
      });
    } else if (document.getElementById("dailyCardioGoal").value.length === 0) {
      alert("Daily cardio goal cannot be left empty.");
    }
  };

  const saveWeeklyCardioGoal = async () => {
    if (document.getElementById("weeklyCardioGoal").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeWeeklyCardioGoal",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newWeeklyCardioGoal:
            document.getElementById("weeklyCardioGoal").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weeklyCardioGoal) => {
          if (weeklyCardioGoal !== "") {
            setWeeklyCardioGoal(weeklyCardioGoal);
          }
        },
      });
    } else if (document.getElementById("weeklyCardioGoal").value.length === 0) {
      alert("Weekly cardio goal cannot be left empty.");
    }
  };

  const postCardioActivity = async () => {
    if (document.getElementById("cardioActivityName").value.length > 0) {
      if (document.getElementById("cardioMinutesCompleted").value > 0) {
        if (document.getElementById("cardioIntensity").value.length > 0) {
          // Initialise the date
          const date = new Date().getTime();

          let options = {
            contractAddress: EightFit.address,
            functionName: "addCardioPost",
            abi: EightFit.abi,
            params: {
              userAddress: account,
              category: "Cardio",
              activityName: document.getElementById("cardioActivityName").value,
              minutesCompleted: document.getElementById(
                "cardioMinutesCompleted"
              ).value,
              intensity: document.getElementById("cardioIntensity").value,
              date: date,
            },
          };

          await contractProcessor.fetch({
            params: options,
            onSuccess: async () => {
              alert("Posted cardio activity!");
            },
          });
        } else if (
          document.getElementById("cardioIntensity").value.length === 0
        ) {
          alert("Intensity cannot be left empty.");
        }
      } else if (
        document.getElementById("cardioMinutesCompleted").value.length === 0
      ) {
        alert("Minutes completed cannot be left empty.");
      }
    } else if (
      document.getElementById("cardioActivityName").value.length === 0
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

          <h2>Cardio</h2>
          <div className="fitness-content cardio">
            <div className="steps-goals">
              <div className="steps-goal">
                <h3>Daily Cardio Goal</h3>
                <input id="dailyCardioGoal" type="number" placeholder="0" />
                <Check className="save-icon" onClick={saveDailyCardioGoal} />
              </div>

              <div className="steps-goal">
                <h3>Weekly Cardio Goal</h3>
                <input id="weeklyCardioGoal" type="number" placeholder="0" />
                <Check className="save-icon" onClick={saveWeeklyCardioGoal} />
              </div>
            </div>

            <button className="edit-btn" onClick={exitEditDetails}>
              Exit
            </button>
            <br />

            <h2>Cardio Activities</h2>
            <div className="cardio-post-area">
              <div className="cardio-post-field">
                <p className="cardio-heading">Activity</p>
                <div className="profile-text-input">
                  <input
                    id="cardioActivityName"
                    type="text"
                    placeholder="(E.g. Running, Swimming)"
                  />
                </div>
              </div>

              <div className="cardio-post-field centre">
                <p className="cardio-heading">Activity Duration in Minutes</p>
                <div className="profile-text-input">
                  <input
                    id="cardioMinutesCompleted"
                    type="number"
                    placeholder="Enter duration in minutes"
                  />
                </div>
              </div>

              <div className="cardio-post-field">
                <p className="cardio-heading">Intensity</p>
                <div className="profile-text-input">
                  <input
                    id="cardioIntensity"
                    type="text"
                    placeholder="(I.e. Low, Medium, High)"
                  />
                </div>
              </div>
            </div>

            <button className="edit-btn" onClick={postCardioActivity}>
              Post
            </button>

            <div className="steps-posts">{cardioPosts}</div>
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

          <h2>Cardio</h2>
          <div className="fitness-content cardio">
            <div className="steps-goals">
              <div className="steps-goal">
                <h3>Daily Cardio Goal</h3>
                {dailyCardioGoal} minutes
              </div>

              <div className="steps-goal">
                <h3>Weekly Cardio Goal</h3>
                {weeklyCardioGoal} minutes
              </div>
            </div>

            <button className="edit-btn" onClick={editDetails}>
              Edit Goals
            </button>
            <br />

            <h2>Cardio Activities</h2>
            <div className="cardio-post-area">
              <div className="cardio-post-field">
                <p className="cardio-heading">Activity</p>
                <div className="profile-text-input">
                  <input
                    id="cardioActivityName"
                    type="text"
                    placeholder="(E.g. Running, Swimming)"
                  />
                </div>
              </div>

              <div className="cardio-post-field centre">
                <p className="cardio-heading">Activity Duration in Minutes</p>
                <div className="profile-text-input">
                  <input
                    id="cardioMinutesCompleted"
                    type="number"
                    placeholder="Enter duration in minutes"
                  />
                </div>
              </div>

              <div className="cardio-post-field">
                <p className="cardio-heading">Intensity</p>
                <div className="profile-text-input">
                  <input
                    id="cardioIntensity"
                    type="text"
                    placeholder="(I.e. Low, Medium, High)"
                  />
                </div>
              </div>
            </div>

            <button className="edit-btn" onClick={postCardioActivity}>
              Post
            </button>

            <div className="steps-posts">{cardioPosts}</div>
          </div>
        </div>
      </div>
    );
  }
};

export default Cardio;
