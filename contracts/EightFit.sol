// SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.8.0;

import "./Storage.sol";

contract EightFit {
  struct ShortPost {
    uint256 shortPostId;
    address userAddress;
    uint256 activityLength;
    uint256 date;
  }

  struct Post {
    uint256 postId;
    address userAddress;
    string category;
    string activityName;
    uint256 minutesCompleted;
    string intensity;
    uint256 date;
  }

  ShortPost[] public stepsPosts;
  ShortPost[] public caloriesEatenPosts;
  ShortPost[] public caloriesBurnedPosts;
  ShortPost[] public sleepPosts;
  Post[] public cardioPosts;
  Post[] public strengthTrainingPosts;
  Post[] public wellbeingPosts;
  Storage dataStorage;

  // Getters
  function getStepsPostsCount() public view returns(uint256) {
    return stepsPosts.length;
  }

  function getStepsPost(uint256 stepsPostId) public view returns(ShortPost memory) {
    // The post's index in the array starts from zero, so 1 is subtracted from the ID
    return stepsPosts[stepsPostId - 1];
  }

  function getCaloriesEatenPostsCount() public view returns(uint256) {
    return caloriesEatenPosts.length;
  }

  function getCaloriesEatenPost(uint256 caloriesEatenPostId) public view returns(ShortPost memory) {
    return caloriesEatenPosts[caloriesEatenPostId - 1];
  }

  function getCaloriesBurnedPostsCount() public view returns(uint256) {
    return caloriesBurnedPosts.length;
  }

  function getCaloriesBurnedPost(uint256 caloriesBurnedPostId) public view returns(ShortPost memory) {
    return caloriesBurnedPosts[caloriesBurnedPostId - 1];
  }

  function getSleepPostsCount() public view returns(uint256) {
    return sleepPosts.length;
  }

  function getSleepPost(uint256 sleepPostId) public view returns(ShortPost memory) {
    return sleepPosts[sleepPostId - 1];
  }

  function getCardioPostsCount() public view returns(uint256) {
    return cardioPosts.length;
  }

  function getCardioPost(uint256 cardioPostId) public view returns(Post memory) {
    return cardioPosts[cardioPostId - 1];
  }

  function getStrengthTrainingPostsCount() public view returns(uint256) {
    return strengthTrainingPosts.length;
  }

  function getStrengthTrainingPost(uint256 strengthTrainingPostId) public view returns(Post memory) {
    return strengthTrainingPosts[strengthTrainingPostId - 1];
  }

  function getWellbeingPostsCount() public view returns(uint256) {
    return wellbeingPosts.length;
  }

  function getWellbeingPost(uint256 wellbeingPostId) public view returns(Post memory) {
    return wellbeingPosts[wellbeingPostId - 1];
  }

  // Setters
  function setStorageAddress(address dataStorageContractAddress) public {
    dataStorage = Storage(dataStorageContractAddress);
  }

  function addDailyStepPost(address userAddress, uint256 stepsTakenToday, uint256 date) public {
    stepsPosts.push(ShortPost(stepsPosts.length + 1, userAddress, stepsTakenToday, date));

    // Add points to the user
    dataStorage.addPoints(userAddress, 10);
  }

  function deleteDailyStepCountPost(uint256 stepsPostId) public {
    for (uint256 i = 0; i < stepsPosts.length; i++) {
      if (stepsPosts[i].shortPostId == stepsPostId) {
        stepsPosts[i] = stepsPosts[stepsPosts.length - 1];
        stepsPosts.pop();
      }
    }
  }

  function addCaloriesEatenPost(address userAddress, uint256 caloriesEatenToday, uint256 date) public {
    caloriesEatenPosts.push(ShortPost(caloriesEatenPosts.length + 1, userAddress, caloriesEatenToday, date));
  }

  function deleteCaloriesEatenPost(uint256 caloriesEatenPostId) public {
    for (uint256 i = 0; i < caloriesEatenPosts.length; i++) {
      if (caloriesEatenPosts[i].shortPostId == caloriesEatenPostId) {
        caloriesEatenPosts[i] = caloriesEatenPosts[caloriesEatenPosts.length - 1];
        caloriesEatenPosts.pop();
      }
    }
  }

  function addCaloriesBurnedPost(address userAddress, uint256 caloriesBurnedToday, uint256 date) public {
    caloriesBurnedPosts.push(ShortPost(caloriesBurnedPosts.length + 1, userAddress, caloriesBurnedToday, date));
  }

  function deleteCaloriesBurnedPost(uint256 caloriesBurnedPostId) public {
    for (uint256 i = 0; i < caloriesBurnedPosts.length; i++) {
      if (caloriesBurnedPosts[i].shortPostId == caloriesBurnedPostId) {
        caloriesBurnedPosts[i] = caloriesBurnedPosts[caloriesBurnedPosts.length - 1];
        caloriesBurnedPosts.pop();
      }
    }
  }

  function addSleepPost(address userAddress, uint256 hoursSlept, uint256 date) public {
    sleepPosts.push(ShortPost(sleepPosts.length + 1, userAddress, hoursSlept, date));

    dataStorage.addPoints(userAddress, 3);
  }

  function deleteSleepPost(uint256 sleepPostId) public {
    for (uint256 i = 0; i < sleepPosts.length; i++) {
      if (sleepPosts[i].shortPostId == sleepPostId) {
        sleepPosts[i] = sleepPosts[sleepPosts.length - 1];
        sleepPosts.pop();
      }
    }
  }

  function addCardioPost(address userAddress, string memory category, string memory activityName, uint256 minutesCompleted, string memory intensity, uint256 date) public {
    require(bytes(category).length > 0, "Category is required");
    require(bytes(activityName).length > 0, "Activity name is required");

    cardioPosts.push(Post(cardioPosts.length + 1, userAddress, category, activityName, minutesCompleted, intensity, date));

    dataStorage.addPoints(userAddress, 25);
  }

  function deleteCardioPost(uint256 cardioPostId) public {
    for (uint256 i = 0; i < cardioPosts.length; i++) {
      if (cardioPosts[i].postId == cardioPostId) {
        cardioPosts[i] = cardioPosts[cardioPosts.length - 1];
        cardioPosts.pop();
      }
    }
  }

  function addStrengthTrainingPost(address userAddress, string memory category, string memory activityName, uint256 minutesCompleted, string memory intensity, uint256 date) public {
    require(bytes(category).length > 0, "Category is required");
    require(bytes(activityName).length > 0, "Activity name is required");

    strengthTrainingPosts.push(Post(strengthTrainingPosts.length + 1, userAddress, category, activityName, minutesCompleted, intensity, date));

    dataStorage.addPoints(userAddress, 30);
  }

  function deleteStrengthTrainingPost(uint256 strengthTrainingPostId) public {
    for (uint256 i = 0; i < strengthTrainingPosts.length; i++) {
      if (strengthTrainingPosts[i].postId == strengthTrainingPostId) {
        strengthTrainingPosts[i] = strengthTrainingPosts[strengthTrainingPosts.length - 1];
        strengthTrainingPosts.pop();
      }
    }
  }

  function addWellbeingPost(address userAddress, string memory category, string memory activityName, uint256 minutesCompleted, string memory intensity, uint256 date) public {
    require(bytes(category).length > 0, "Category is required");
    require(bytes(activityName).length > 0, "Activity name is required");

    wellbeingPosts.push(Post(wellbeingPosts.length + 1, userAddress, category, activityName, minutesCompleted, intensity, date));

    dataStorage.addPoints(userAddress, 20);
  }

  function deleteWellbeingPost(uint256 wellbeingPostId) public {
    for (uint256 i = 0; i < wellbeingPosts.length; i++) {
      if (wellbeingPosts[i].postId == wellbeingPostId) {
        wellbeingPosts[i] = wellbeingPosts[wellbeingPosts.length - 1];
        wellbeingPosts.pop();
      }
    }
  }
}