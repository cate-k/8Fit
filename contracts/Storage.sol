// SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.8.0;

contract Storage {
  // User properties
  mapping(address => string) public displayName;
  mapping(address => string) public profilePic;
  mapping(address => uint256) public age;
  mapping(address => string) public gender;
  mapping(address => uint256) public height;
  mapping(address => uint256[]) public weight;
  mapping(address => uint256) public points;
  mapping(address => uint256) public weightGoal;
  mapping(address => uint256[]) public caloriesEaten;
  mapping(address => uint256[]) public caloriesBurned;
  mapping(address => uint256) public dailyStepGoal;
  mapping(address => uint256) public weeklyStepGoal;
  mapping(address => uint256) public dailyCardioGoal;
  mapping(address => uint256) public weeklyCardioGoal;
  mapping(address => uint256) public dailyStrengthTrainingGoal;
  mapping(address => uint256) public weeklyStrengthTrainingGoal;
  mapping(address => uint256) public dailySleepGoal;
  mapping(address => uint256) public weeklySleepGoal;
  mapping(address => uint256) public dailyWellbeingGoal;
  mapping(address => uint256) public weeklyWellbeingGoal;

  // Getters
  function getDisplayName(address userAddress) public view returns(string memory) {
    return displayName[userAddress];
  }

  function getProfilePic(address userAddress) public view returns(string memory) {
    return profilePic[userAddress];
  }

  function getAge(address userAddress) public view returns(uint256) {
    return age[userAddress];
  }

  function getGender(address userAddress) public view returns(string memory) {
    return gender[userAddress];
  }

  function getHeight(address userAddress) public view returns(uint256) {
    return height[userAddress];
  }

  function getWeightCount(address userAddress) public view returns(uint256) {
    return weight[userAddress].length;
  }

  function getWeight(address userAddress, uint256 index) public view returns(uint256) {
    return weight[userAddress][index];
  }

  function getPoints(address userAddress) public view returns(uint256) {
    return points[userAddress];
  }

  function getWeightGoal(address userAddress) public view returns(uint256) {
    return weightGoal[userAddress];
  }

  function getCaloriesEatenCount(address userAddress) public view returns(uint256) {
    return caloriesEaten[userAddress].length;
  }

  function getCaloriesEaten(address userAddress, uint256 index) public view returns(uint256) {
    return caloriesEaten[userAddress][index];
  }

  function getCaloriesBurnedCount(address userAddress) public view returns(uint256) {
    return caloriesBurned[userAddress].length;
  }

  function getCaloriesBurned(address userAddress, uint256 index) public view returns(uint256) {
    return caloriesBurned[userAddress][index];
  }

  function getDailyStepGoal(address userAddress) public view returns(uint256) {
    return dailyStepGoal[userAddress];
  }

  function getWeeklyStepGoal(address userAddress) public view returns(uint256) {
    return weeklyStepGoal[userAddress];
  }

  function getDailyCardioGoal(address userAddress) public view returns(uint256) {
    return dailyCardioGoal[userAddress];
  }

  function getWeeklyCardioGoal(address userAddress) public view returns(uint256) {
    return weeklyCardioGoal[userAddress];
  }

  function getDailyStrengthTrainingGoal(address userAddress) public view returns(uint256) {
    return dailyStrengthTrainingGoal[userAddress];
  }

  function getWeeklyStrengthTrainingGoal(address userAddress) public view returns(uint256) {
    return weeklyStrengthTrainingGoal[userAddress];
  }

  function getDailySleepGoal(address userAddress) public view returns(uint256) {
    return dailySleepGoal[userAddress];
  }

  function getWeeklySleepGoal(address userAddress) public view returns(uint256) {
    return weeklySleepGoal[userAddress];
  }

  function getDailyWellbeingGoal(address userAddress) public view returns(uint256) {
    return dailyWellbeingGoal[userAddress];
  }

  function getWeeklyWellbeingGoal(address userAddress) public view returns(uint256) {
    return weeklyWellbeingGoal[userAddress];
  }

  // Setters
  function changeDisplayName(address userAddress, string memory newDisplayName) public {
    require(bytes(newDisplayName).length > 0 && bytes(newDisplayName).length <= 30, "Display name length must be above 0 and below 30 chars");

    displayName[userAddress] = newDisplayName;
  }

  function changeProfilePic(address userAddress, string memory newProfilePic) public {
    require(bytes(newProfilePic).length > 0, "Please select a valid profile picture");

    profilePic[userAddress] = newProfilePic;
  }

  function changeAge(address userAddress, uint256 newAge) public {
    age[userAddress] = newAge;
  }

  function changeGender(address userAddress, string memory newGender) public {
    gender[userAddress] = newGender;
  }

  function changeHeight(address userAddress, uint256 newHeight) public {
    height[userAddress] = newHeight;
  }
 
  function changeWeight(address userAddress, uint256 newWeight) public {
    weight[userAddress].push(newWeight);
  }

  function addPoints(address userAddress, uint256 pointsToAdd) public {
    points[userAddress] += pointsToAdd;
  }

  function changeWeightGoal(address userAddress, uint256 newWeightGoal) public {
    weightGoal[userAddress] = newWeightGoal;
  }

  function addCaloriesEatenToday(address userAddress, uint256 caloriesEatenToday) public {
    caloriesEaten[userAddress].push(caloriesEatenToday);
  }

  function addCaloriesBurnedToday(address userAddress, uint256 caloriesBurnedToday) public {
    caloriesBurned[userAddress].push(caloriesBurnedToday);
  }

  function changeDailyStepGoal(address userAddress, uint256 newDailyStepGoal) public {
    dailyStepGoal[userAddress] = newDailyStepGoal;
  }

  function changeWeeklyStepGoal(address userAddress, uint256 newWeeklyStepGoal) public {
    weeklyStepGoal[userAddress] = newWeeklyStepGoal;
  }

  function changeDailyCardioGoal(address userAddress, uint256 newDailyCardioGoal) public {
    dailyCardioGoal[userAddress] = newDailyCardioGoal;
  }

  function changeWeeklyCardioGoal(address userAddress, uint256 newWeeklyCardioGoal) public {
    weeklyCardioGoal[userAddress] = newWeeklyCardioGoal;
  }

  function changeDailyStrengthTrainingGoal(address userAddress, uint256 newDailyStrengthTrainingGoal) public {
    dailyStrengthTrainingGoal[userAddress] = newDailyStrengthTrainingGoal;
  }

  function changeWeeklyStrengthTrainingGoal(address userAddress, uint256 newWeeklyStrengthTrainingGoal) public {
    weeklyStrengthTrainingGoal[userAddress] = newWeeklyStrengthTrainingGoal;
  }

  function changeDailySleepGoal(address userAddress, uint256 newDailySleepGoal) public {
    dailySleepGoal[userAddress] = newDailySleepGoal;
  }

  function changeWeeklySleepGoal(address userAddress, uint256 newWeeklySleepGoal) public {
    weeklySleepGoal[userAddress] = newWeeklySleepGoal;
  }

  function changeDailyWellbeingGoal(address userAddress, uint256 newDailyWellbeingGoal) public {
    dailyWellbeingGoal[userAddress] = newDailyWellbeingGoal;
  }

  function changeWeeklyWellbeingGoal(address userAddress, uint256 newWeeklyWellbeingGoal) public {
    weeklyWellbeingGoal[userAddress] = newWeeklyWellbeingGoal;
  }
}