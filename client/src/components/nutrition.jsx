import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Check } from "react-feather";

import Storage from "../abi/Storage";
import EightFit from "../abi/EightFit";
import Navigation from "./sub-components/navigation";
import NutritionPost from "./sub-components/nutrition-post";

const Nutrition = () => {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [weightGoal, setWeightGoal] = useState(0);
  const [caloriesEatenPosts, setCaloriesEatenPosts] = useState([]);
  const [caloriesBurnedPosts, setCaloriesBurnedPosts] = useState([]);
  const [toggleEdit, setToggleEdit] = useState(false);

  // Set the page's title
  document.title = "Nutrition | 8Fit - Track your health and fitness journey";

  useEffect(() => {
    const init = async () => {
      // Fetch the user's weight goal
      let options = {
        contractAddress: Storage.address,
        functionName: "getWeightGoal",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weightGoal) => {
          if (weightGoal !== "") {
            setWeightGoal(parseInt(BigNumber.from(weightGoal).toHexString()));
          }
        },
      });

      // Fetch the user's previous logs of calories eaten
      options = {
        contractAddress: EightFit.address,
        functionName: "getCaloriesEatenPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalCaloriesEatenPostsCreated) => {
          for (let postIndex = 0; postIndex < totalCaloriesEatenPostsCreated; postIndex++) {
            options = {
              contractAddress: EightFit.address,
              functionName: "getCaloriesEatenPost",
              abi: EightFit.abi,
              params: { caloriesEatenPostId: postIndex + 1 },
            };

            await contractProcessor.fetch({
              params: options,
              onSuccess: (caloriesEatenPost) => {
                if (caloriesEatenPost.userAddress.toLowerCase() === account.toLowerCase()) {
                  setCaloriesEatenPosts(
                    <NutritionPost
                      key={caloriesEatenPosts.length}
                      id={caloriesEatenPost.shortPostId}
                      userAddress={caloriesEatenPost.userAddress}
                      calories={caloriesEatenPost.activityLength}
                      date={caloriesEatenPost.date}
                      status="eaten"
                    />
                  );
                }
              }
            });
          }
        },
      });

      // Fetch the user's previous logs of calories burned
      options = {
        contractAddress: EightFit.address,
        functionName: "getCaloriesBurnedPostsCount",
        abi: EightFit.abi,
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (totalCaloriesBurnedPostsCreated) => {
          for (let postIndex = 0; postIndex < totalCaloriesBurnedPostsCreated; postIndex++) {
            options = {
              contractAddress: EightFit.address,
              functionName: "getCaloriesBurnedPost",
              abi: EightFit.abi,
              params: { caloriesBurnedPostId: postIndex + 1 },
            };

            await contractProcessor.fetch({
              params: options,
              onSuccess: (caloriesBurnedPost) => {
                if (caloriesBurnedPost.userAddress.toLowerCase() === account.toLowerCase()) {
                  setCaloriesBurnedPosts(
                    <NutritionPost
                      key={caloriesBurnedPosts.length}
                      id={caloriesBurnedPost.shortPostId}
                      userAddress={caloriesBurnedPost.userAddress}
                      calories={caloriesBurnedPost.activityLength}
                      date={caloriesBurnedPost.date}
                      status="burned"
                    />
                  );
                }
              }
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

  const saveWeightGoal = async () => {
    if (document.getElementById("nutritionWeightGoal").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeWeightGoal",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newWeightGoal: document.getElementById("nutritionWeightGoal").value
        },
      };
      
      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weightGoal) => {
          if (weightGoal !== "") {
            setWeightGoal(weightGoal);
          }
        },
      });
    } else if (document.getElementById("nutritionWeightGoal").value.length === 0) {
      alert("Weight goal cannot be left empty.");
    }
  };

  const postCaloriesEaten = async () => {
    if (document.getElementById("nutritionCaloriesEaten").value > 0) {
      // Initialise the date
      const date = (new Date()).getTime();

      let options = {
        contractAddress: EightFit.address,
        functionName: "addCaloriesEatenPost",
        abi: EightFit.abi,
        params: {
          userAddress: account,
          caloriesEatenToday: document.getElementById("nutritionCaloriesEaten").value,
          date: date
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async () => {
          alert("Posted log of calories eaten!");
        },
      });
    } else if (document.getElementById("nutritionCaloriesEaten").value.length === 0) {
      alert("Calories eaten cannot be left empty.");
    }
  };

  const postCaloriesBurned = async () => {
    if (document.getElementById("nutritionCaloriesBurned").value > 0) {
      // Initialise the date
      const date = (new Date()).getTime();

      let options = {
        contractAddress: EightFit.address,
        functionName: "addCaloriesBurnedPost",
        abi: EightFit.abi,
        params: {
          userAddress: account,
          caloriesBurnedToday: document.getElementById("nutritionCaloriesBurned").value,
          date: date
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async () => {
          alert("Posted log of calories burned!");
        },
      });
    } else if (document.getElementById("nutritionCaloriesBurned").value.length === 0) {
      alert("Calories burned cannot be left empty.");
    }
  };

  // Check if the user has clicked on the edit details button
  if (toggleEdit === true) {
    return (
      <div className="page">
        <Navigation />

        <div className="content">
          <h1>Nutrition</h1>

          <div className="nutrition-goal">
            <h3>Weight Goal</h3>
            <p className="fitness-text-input">
              <input
                id="nutritionWeightGoal"
                type="number"
                placeholder={weightGoal}
              />
              <Check className="save-icon" onClick={saveWeightGoal} />
            </p>
          </div>

          <button className="edit-btn" onClick={exitEditDetails}>Exit</button>

          <div className="nutrition-post-area">
            <p className="profile-heading">Calories Eaten</p>
            <p className="profile-text-input">
              <input
                id="nutritionCaloriesEaten"
                type="number"
                placeholder="Enter amount of calories eaten"
              />
            </p>

            <button className="nutrition-submit-btn" onClick={postCaloriesEaten}>Post</button>
          </div>

          <div className="nutrition-post-area">
            <p className="profile-heading">Calories Burned</p>
            <p className="profile-text-input">
              <input
                id="nutritionCaloriesBurned"
                type="number"
                placeholder="Enter amount of calories burned"
              />
            </p>

            <button className="nutrition-submit-btn" onClick={postCaloriesBurned}>Post</button>
          </div>

          <div className="nutrition-posts">
            <h3>Calories Eaten</h3>
            {caloriesEatenPosts}

            <h3>Calories Burned</h3>
            {caloriesBurnedPosts}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="page">
        <Navigation />

        <div className="content">
          <h1>Nutrition</h1>

          <div className="nutrition-goal">
            <h3>Weight Goal</h3>
            {weightGoal} kg
          </div>

          <button className="edit-btn" onClick={editDetails}>Edit Goal</button>

          <div className="nutrition-post-area">
            <p className="profile-heading">Calories Eaten</p>
            <p className="profile-text-input">
              <input
                id="nutritionCaloriesEaten"
                type="number"
                placeholder="Enter amount of calories eaten"
              />
            </p>

            <button className="nutrition-submit-btn" onClick={postCaloriesEaten}>Post</button>
          </div>

          <div className="nutrition-post-area">
            <p className="profile-heading">Calories Burned</p>
            <p className="profile-text-input">
              <input
                id="nutritionCaloriesBurned"
                type="number"
                placeholder="Enter amount of calories burned"
              />
            </p>

            <button className="nutrition-submit-btn" onClick={postCaloriesBurned}>Post</button>
          </div>

          <div className="nutrition-posts">
            <h3>Calories Eaten</h3>
            {caloriesEatenPosts}

            <h3>Calories Burned</h3>
            {caloriesBurnedPosts}
          </div>
        </div>
      </div>
    );
  }
}

export default Nutrition;