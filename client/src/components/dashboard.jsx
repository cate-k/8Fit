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
  const [cardioActivityBadge, setCardioActivityBadge] = useState(false);
  const [strengthActivityBadge, setStrengthActivityBadge] = useState(false);
  const [wellbeingActivityBadge, setWellbeingActivityBadge] = useState(false);
  const [weightTargetBadge, setWeightTargetBadge] = useState(false);
  const [sleepTargetBadge, setSleepTargetBadge] = useState(false);

  // Set the page's title
  document.title = "Dashboard | 8Fit - Track your health and fitness journey";

  useEffect(() => {
    const init = async () => {
      // Initialise the date
      const dateToday = (new Date()).getTime();
      let date = new Date(parseInt(BigNumber.from(dateToday).toHexString())).toString('DD/mm/yy HH:mm:ss');
      date = date.substring(date.indexOf(' ') + 1, date.indexOf(' ') + 12);

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

      // Badge 1 - Cardio Fanatic (logged 5 or more cardio activities in total)
      // Fetch the total number of cardio activities the user has
      options = {
        contractAddress: EightFit.address,
        functionName: "getCardioPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalCardioPostsCreated) => {
          let userCardioPostsCount = 0;
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
                // Check if the log belongs to the user
                if (cardioPost.userAddress.toLowerCase() === account.toLowerCase()) {
                  userCardioPostsCount++;

                  if (userCardioPostsCount >= 5) {
                    setCardioActivityBadge(true);
                  }
                }
              },
            });
          }
        },
      });

      // Badge 2 - Gym Junkie (logged 5 or more strength sessions in total)
      // Fetch the total number of Strength activities that the user has
      options = {
        contractAddress: EightFit.address,
        functionName: "getStrengthTrainingPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalStrengthTrainingPostsCreated) => {
          let userStrengthTrainingPostsCount = 0;
          for (let strengthTrainingPostsIndex = 0; strengthTrainingPostsIndex < totalStrengthTrainingPostsCreated; strengthTrainingPostsIndex++) {
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
                // Check if the post belongs to the current user
                if (strengthTrainingPost.userAddress.toLowerCase() === account.toLowerCase()) {
                  userStrengthTrainingPostsCount++;

                  // If the user has 5 or more strength training posts, award badge
                  if (userStrengthTrainingPostsCount >= 5) {
                    setStrengthActivityBadge(true);
                  }
                }
              },
            });
          }
        },
      });

      // Badge 3 - Zen (logged 5 or more wellbeing sessions in total)
      options = {
        contractAddress: EightFit.address,
        functionName: "getWellbeingPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalWellbeingPostsCreated) => {
          let userWellbeingPostsCount = 0;
          for (let wellbeingPostsIndex = 0; wellbeingPostsIndex < totalWellbeingPostsCreated; wellbeingPostsIndex++) {
            options = {
              contractAddress: EightFit.address,
              functionName: "getWellbeingPost",
              abi: EightFit.abi,
              params: {
                wellbeingPostId: wellbeingPostsIndex + 1,
              },
            };

            await contractProcessor.fetch({
              params: options,
              onSuccess: (wellbeingPost) => {
                // Check if the post belongs to the current user
                if (wellbeingPost.userAddress.toLowerCase() === account.toLowerCase()) {
                  userWellbeingPostsCount++;

                  // If the user has 5 or more strength training posts, award badge
                  if (userWellbeingPostsCount >= 5) {
                    setWellbeingActivityBadge(true);
                  }
                }
              },
            });
          }
        },
      });

      // Badge 4 - Dreamer (reached weekly sleep goal)
      // Fetch all the sleep posts for this user
      options = {
        contractAddress: EightFit.address,
        functionName: "getSleepPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalSleepPostsCreated) => {
          let userSleepPostsArr = [];
          // variable to track total sleep for last 7 sleep posts
          let userTotalSleepInSevenPosts = 0;

          for (let sleepPostsIndex = 0; sleepPostsIndex < totalSleepPostsCreated; sleepPostsIndex++) {
            // get the sleep post for the current loop
            options = {
              contractAddress: EightFit.address,
              functionName: "getSleepPost",
              abi: EightFit.abi,
              params: {
                sleepPostId: sleepPostsIndex + 1,
              },
            };

            await contractProcessor.fetch({
              params: options,
              onSuccess: async (sleepPost) => {
                // Check if the post belongs to the current user
                if (sleepPost.userAddress.toLowerCase() === account.toLowerCase()) {
                  userSleepPostsArr.push(sleepPost);
                }
              },
            });
          }

          // If the length of the sleepPostsArr <= 7 get the total
          if (userSleepPostsArr.length <= 7) {
            for (let userSleepPostsIndex = 0; userSleepPostsIndex < userSleepPostsArr.length; userSleepPostsIndex++) {
              userTotalSleepInSevenPosts += parseInt(
                userSleepPostsArr[userSleepPostsIndex].activityLength
              );
            }
          } else {
            let lastSevenSleepPosts = userSleepPostsArr.slice(-7);
            for (let userSleepPostsIndex = 0; userSleepPostsIndex < lastSevenSleepPosts.length; userSleepPostsIndex++) {
              userTotalSleepInSevenPosts += parseInt(
                lastSevenSleepPosts[userSleepPostsIndex].activityLength
              );
            }
          }

          // Fetch the users weekly sleep goal
          options = {
            contractAddress: Storage.address,
            functionName: "getWeeklySleepGoal",
            abi: Storage.abi,
            params: { userAddress: account },
          };

          await contractProcessor.fetch({
            params: options,
            onSuccess: async (userWeeklySleepGoal) => {
              if (
                userTotalSleepInSevenPosts >= userWeeklySleepGoal &&
                userWeeklySleepGoal > 0
              ) {
                setSleepTargetBadge(true);
              }
            },
          });
        },
      });

      // Badge 5 - Fine Diner (user is at their bodyweight goal +-3%
      // Fetch the user's weight
      options = {
        contractAddress: Storage.address,
        functionName: "getWeightCount",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weightLogCount) => {
          let userCurrentWeight = 0;
          for (
            let weightLogIndex = 0;
            weightLogIndex < weightLogCount;
            weightLogIndex++
          ) {
            options = {
              contractAddress: Storage.address,
              functionName: "getWeight",
              abi: Storage.abi,
              params: {
                userAddress: account,
                index: weightLogIndex,
              },
            };

            await contractProcessor.fetch({
              params: options,
              onSuccess: (weightLog) => {
                // Get the user's current weight
                if (weightLogIndex === weightLogCount - 1) {
                  userCurrentWeight = weightLog;
                }
              },
            });
          }

          // Fetch users goal weight
          options = {
            contractAddress: Storage.address,
            functionName: "getWeightGoal",
            abi: Storage.abi,
            params: { userAddress: account },
          };

          await contractProcessor.fetch({
            params: options,
            onSuccess: (goalWeight) => {
              if (
                userCurrentWeight >= goalWeight * 0.97 &&
                userCurrentWeight <= goalWeight * 1.03
              ) {
                setWeightTargetBadge(true);
              }
            },
          });
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
          <span>
            {points} / {pointsGoal} XP
          </span>
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
                <strong>{stepsTaken}</strong> out of <strong>{dailyStepsTakenGoal}</strong> steps taken today </div>
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

        <div className="badge-container">
          <div className={"badge-outer"}>
            <img
              className={
                "badge-image " +
                "default-badge " +
                (cardioActivityBadge ? "earned-badge" : "")
              }
              src={require("../styles/images/badge1.png")}
            ></img>
            <div className="badge-text">
              <div className="badge-title">Cardio Fanatic</div>
              <div className="badge-desc">Logged 5 Cardio Activities</div>
            </div>
          </div>

          <div className={"badge-outer"}>
            <img
              className={
                "badge-image " +
                "default-badge " +
                (strengthActivityBadge ? "earned-badge" : "")
              }
              src={require("../styles/images/badge2.png")}
            ></img>
            <div className="badge-text">
              <div className="badge-title">Gym Junkie</div>
              <div className="badge-desc">Logged 5 Strength Activities</div>
            </div>
          </div>

          <div className={"badge-outer"}>
            <img
              className={
                "badge-image " +
                "default-badge " +
                (wellbeingActivityBadge ? "earned-badge" : "")
              }
              src={require("../styles/images/badge3.png")}
            ></img>
            <div className="badge-text">
              <div className="badge-title">Zen</div>
              <div className="badge-desc">Logged 5 Wellbeing Activities</div>
            </div>
          </div>

          <div className={"badge-outer"}>
            <img
              className={
                "badge-image " +
                "default-badge " +
                (weightTargetBadge ? "earned-badge" : "")
              }
              src={require("../styles/images/badge5.png")}
            ></img>
            <div className="badge-text">
              <div className="badge-title">Fine Diner</div>
              <div className="badge-desc">Within 5% of Weight Goal</div>
            </div>
          </div>

          <div className={"badge-outer"}>
            <img
              className="badge-image"
              src={require("../styles/images/badge4.png")}
            ></img>
            <div className="badge-text">
              <div className="badge-title">Dreamer</div>
              <div className="badge-desc">Reached Weekly Sleep Goal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
