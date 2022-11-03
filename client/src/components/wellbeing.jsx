import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Check } from "react-feather";

import Storage from "../abi/Storage";
import EightFit from "../abi/EightFit";
import Navigation from "./sub-components/navigation";
import StepsPost from "./sub-components/steps-post";
import CardioPost from "./sub-components/cardio-post";

const Wellbeing = () => {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [dailySleepGoal, setDailySleepGoal] = useState(0);
  const [weeklySleepGoal, setWeeklySleepGoal] = useState(0);
  const [dailyWellbeingGoal, setDailyWellbeingGoal] = useState(0);
  const [weeklyWellbeingGoal, setWeeklyWellbeingGoal] = useState(0);
  const [sleepPosts, setSleepPosts] = useState([]);
  const [wellbeingPosts, setWellbeingPosts] = useState([]);
  const [toggleEdit, setToggleEdit] = useState(false);

  // Set the page's title
  document.title = "Wellbeing | 8Fit - Track your health and fitness journey";

  useEffect(() => {
    const init = async () => {
      // Fetch the user's daily sleep goal
      let options = {
        contractAddress: Storage.address,
        functionName: "getDailySleepGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailySleepGoal) => {
          if (dailySleepGoal !== "") {
            setDailySleepGoal(parseInt(BigNumber.from(dailySleepGoal).toHexString()));
          }
        },
      });

      // Fetch the user's weekly sleep goal
      options = {
        contractAddress: Storage.address,
        functionName: "getWeeklySleepGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weeklySleepGoal) => {
          if (weeklySleepGoal !== "") {
            setWeeklySleepGoal(parseInt(BigNumber.from(weeklySleepGoal).toHexString()));
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

      // Fetch the user's weekly wellbeing goal
      options = {
        contractAddress: Storage.address,
        functionName: "getWeeklyWellbeingGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weeklyWellbeingGoal) => {
          if (weeklyWellbeingGoal !== "") {
            setWeeklyWellbeingGoal(parseInt(BigNumber.from(weeklyWellbeingGoal).toHexString()));
          }
        },
      });

      // Fetch the user's previous sleep posts
      options = {
        contractAddress: EightFit.address,
        functionName: "getSleepPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalSleepPostsCreated) => {
          for (
            let sleepPostsIndex = 0;
            sleepPostsIndex < totalSleepPostsCreated;
            sleepPostsIndex++
          ) {
            options = {
              contractAddress: EightFit.address,
              functionName: "getSleepPost",
              abi: EightFit.abi,
              params: { sleepPostId: sleepPostsIndex + 1 },
            };

            await contractProcessor.fetch({
              params: options,
              onSuccess: (sleepPost) => {
                // Display the user's previous logs of hours slept
                if (
                  sleepPost.userAddress.toLowerCase() === account.toLowerCase()
                ) {
                  setSleepPosts(
                    <StepsPost
                      key={sleepPosts.length}
                      id={sleepPost.shortPostId}
                      userAddress={sleepPost.userAddress}
                      activityLength={sleepPost.activityLength}
                      date={sleepPost.date}
                      status="hours"
                    />
                  );
                }
              },
            });
          }
        },
      });

      // Fetch the user's previous wellbeing posts
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
                // Display the user's previous logs of wellbeing activities
                if (wellbeingPost.userAddress.toLowerCase() === account.toLowerCase()) {
                  setWellbeingPosts(
                    <CardioPost
                      key={wellbeingPosts.length}
                      id={wellbeingPost.postId}
                      userAddress={wellbeingPost.userAddress}
                      category={wellbeingPost.category}
                      activityName={wellbeingPost.activityName}
                      minutesCompleted={wellbeingPost.minutesCompleted}
                      intensity={wellbeingPost.intensity}
                      date={wellbeingPost.date}
                      status="Wellbeing"
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

  const saveDailySleepGoal = async () => {
    if (document.getElementById("dailySleepGoal").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeDailySleepGoal",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newDailySleepGoal: document.getElementById("dailySleepGoal").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailySleepGoal) => {
          if (dailySleepGoal !== "") {
            setDailySleepGoal(dailySleepGoal);
          }
        },
      });
    } else if (document.getElementById("dailySleepGoal").value.length === 0) {
      alert("Daily sleep goal cannot be left empty.");
    }
  };

  const saveWeeklySleepGoal = async () => {
    if (document.getElementById("weeklySleepGoal").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeWeeklySleepGoal",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newWeeklySleepGoal: document.getElementById("weeklySleepGoal").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weeklySleepGoal) => {
          if (weeklySleepGoal !== "") {
            setWeeklySleepGoal(weeklySleepGoal);
          }
        },
      });
    } else if (document.getElementById("weeklySleepGoal").value.length === 0) {
      alert("Weekly sleep goal cannot be left empty.");
    }
  };

  const saveDailyWellbeingGoal = async () => {
    if (document.getElementById("dailyWellbeingGoal").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeDailyWellbeingGoal",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newDailyWellbeingGoal: document.getElementById("dailyWellbeingGoal").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (dailyWellbeingGoal) => {
          if (dailyWellbeingGoal !== "") {
            setDailyWellbeingGoal(dailyWellbeingGoal);
          }
        },
      });
    } else if (document.getElementById("dailyWellbeingGoal").value.length === 0) {
      alert("Daily wellbeing goal cannot be left empty.");
    }
  };

  const saveWeeklyWellbeingGoal = async () => {
    if (document.getElementById("weeklyWellbeingGoal").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeWeeklyWellbeingGoal",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newWeeklyWellbeingGoal: document.getElementById("weeklyWellbeingGoal").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weeklyWellbeingGoal) => {
          if (weeklyWellbeingGoal !== "") {
            setWeeklyWellbeingGoal(weeklyWellbeingGoal);
          }
        },
      });
    } else if (document.getElementById("weeklyWellbeingGoal").value.length === 0) {
      alert("Weekly wellbeing goal cannot be left empty.");
    }
  };

  const postSleepLog = async () => {
    if (document.getElementById("hoursSlept").value > 0) {
      // Initialise the date
      const date = new Date().getTime();

      let options = {
        contractAddress: EightFit.address,
        functionName: "addSleepPost",
        abi: EightFit.abi,
        params: {
          userAddress: account,
          hoursSlept: document.getElementById("hoursSlept").value,
          date: date,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async () => {
          alert("Added sleep log!");
        },
      });
    } else if (document.getElementById("hoursSlept").value.length === 0) {
      alert("Hours slept cannot be left empty.");
    }
  };

  const postWellbeingActivity = async () => {
    if (document.getElementById("wellbeingActivityName").value.length > 0) {
      if (document.getElementById("wellbeingMinutesCompleted").value > 0) {
        if (document.getElementById("wellbeingIntensity").value.length > 0) {
          // Initialise the date
          const date = new Date().getTime();

          let options = {
            contractAddress: EightFit.address,
            functionName: "addWellbeingPost",
            abi: EightFit.abi,
            params: {
              userAddress: account,
              category: "Wellbeing",
              activityName: document.getElementById("wellbeingActivityName").value,
              minutesCompleted: document.getElementById(
                "wellbeingMinutesCompleted"
              ).value,
              intensity: document.getElementById("wellbeingIntensity").value,
              date: date,
            },
          };

          await contractProcessor.fetch({
            params: options,
            onSuccess: async () => {
              alert("Posted wellbeing activity!");
            },
          });
        } else if (
          document.getElementById("wellbeingIntensity").value.length === 0
        ) {
          alert("Intensity cannot be left empty.");
        }
      } else if (
        document.getElementById("wellbeingMinutesCompleted").value.length === 0
      ) {
        alert("Minutes completed cannot be left empty.");
      }
    } else if (
      document.getElementById("wellbeingActivityName").value.length === 0
    ) {
      alert("Activity name cannot be left empty.");
    }
  };

  if (toggleEdit === true) {
    return (
      <div className="page">
        <Navigation />
  
        <div className="content">
          <h1>Wellbeing</h1>
          <div className="fitness-content cardio">
            <div className="steps-goals">
              <div className="steps-goal">
                <h3>Daily Sleep Goal</h3>
                <input id="dailySleepGoal" type="number" placeholder="0" />
                <Check className="save-icon" onClick={saveDailySleepGoal} />
              </div>

              <div className="steps-goal">
                <h3>Weekly Sleep Goal</h3>
                <input id="weeklySleepGoal" type="number" placeholder="0" />
                <Check className="save-icon" onClick={saveWeeklySleepGoal} />
              </div>
            </div>

            <div className="steps-goals">
              <div className="steps-goal">
                <h3>Daily Wellbeing Goal</h3>
                <input id="dailyWellbeingGoal" type="number" placeholder="0" />
                <Check className="save-icon" onClick={saveDailyWellbeingGoal} />
              </div>

              <div className="steps-goal">
                <h3>Weekly Wellbeing Goal</h3>
                <input id="weeklyWellbeingGoal" type="number" placeholder="0" />
                <Check className="save-icon" onClick={saveWeeklyWellbeingGoal} />
              </div>
            </div>

            <button className="edit-btn" onClick={exitEditDetails}>
              Exit
            </button>
            <br />

            <h2 className="steps-taken-heading">Hours Slept</h2>
            <div className="steps-taken">
              <input id="hoursSlept" type="number" placeholder="0" />
              <Check className="save-icon" onClick={postSleepLog} />
            </div>

            <div className="steps-posts">{sleepPosts}</div>
            <br />
            <br />

            <h2>Wellbeing Activities</h2>
            <div className="cardio-post-area">
              <div className="cardio-post-field">
                <p className="cardio-heading">Activity</p>
                <div className="profile-text-input">
                  <input
                    id="wellbeingActivityName"
                    type="text"
                    placeholder="(E.g. Yoga, Meditation)"
                  />
                </div>
              </div>

              <div className="cardio-post-field centre">
                <p className="cardio-heading">Activity Duration in Minutes</p>
                <div className="profile-text-input">
                  <input
                    id="wellbeingMinutesCompleted"
                    type="number"
                    placeholder="Enter duration in minutes"
                  />
                </div>
              </div>

              <div className="cardio-post-field">
                <p className="cardio-heading">Intensity</p>
                <div className="profile-text-input">
                  <input
                    id="wellbeingIntensity"
                    type="text"
                    placeholder="(I.e. Low, Medium, High)"
                  />
                </div>
              </div>
            </div>

            <button className="edit-btn" onClick={postWellbeingActivity}>
              Post
            </button>

            <div className="steps-posts">{wellbeingPosts}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="page">
        <Navigation />
  
        <div className="content">
          <h1>Wellbeing</h1>
          <div className="fitness-content cardio">
            <div className="steps-goals">
              <div className="steps-goal">
                <h3>Daily Sleep Goal</h3>
                {dailySleepGoal} hours
              </div>

              <div className="steps-goal">
                <h3>Weekly Sleep Goal</h3>
                {weeklySleepGoal} hours
              </div>
            </div>

            <div className="steps-goals">
              <div className="steps-goal">
                <h3>Daily Wellbeing Goal</h3>
                {dailyWellbeingGoal} minutes
              </div>

              <div className="steps-goal">
                <h3>Weekly Wellbeing Goal</h3>
                {weeklyWellbeingGoal} minutes
              </div>
            </div>

            <button className="edit-btn" onClick={editDetails}>
              Edit Goals
            </button>
            <br />

            <h2 className="steps-taken-heading">Hours Slept</h2>
            <div className="steps-taken">
              <input id="hoursSlept" type="number" placeholder="0" />
              <Check className="save-icon" onClick={postSleepLog} />
            </div>

            <div className="steps-posts">{sleepPosts}</div>
            <br />
            <br />

            <h2>Wellbeing Activities</h2>
            <div className="cardio-post-area">
              <div className="cardio-post-field">
                <p className="cardio-heading">Activity</p>
                <div className="profile-text-input">
                  <input
                    id="wellbeingActivityName"
                    type="text"
                    placeholder="(E.g. Yoga, Meditation)"
                  />
                </div>
              </div>

              <div className="cardio-post-field centre">
                <p className="cardio-heading">Activity Duration in Minutes</p>
                <div className="profile-text-input">
                  <input
                    id="wellbeingMinutesCompleted"
                    type="number"
                    placeholder="Enter duration in minutes"
                  />
                </div>
              </div>

              <div className="cardio-post-field">
                <p className="cardio-heading">Intensity</p>
                <div className="profile-text-input">
                  <input
                    id="wellbeingIntensity"
                    type="text"
                    placeholder="(I.e. Low, Medium, High)"
                  />
                </div>
              </div>
            </div>

            <button className="edit-btn" onClick={postWellbeingActivity}>
              Post
            </button>

            <div className="steps-posts">{wellbeingPosts}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Wellbeing;