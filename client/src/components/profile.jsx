import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Check } from "react-feather";

import Storage from "../abi/Storage";
import Navigation from "./sub-components/navigation";

const Profile = () => {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [displayName, setDisplayName] = useState("You");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("No gender entered");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [toggleEdit, setToggleEdit] = useState(false);

  // Set the page's title
  document.title =
    displayName + " | 8Fit - Track your health and fitness journey";

  useEffect(() => {
    const init = async () => {
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
            setDisplayName(name);
          }
        },
      });

      // Fetch the user's age
      options = {
        contractAddress: Storage.address,
        functionName: "getAge",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (age) => {
          if (age !== "") {
            setAge(age);
          }
        },
      });

      // Fetch the user's gender
      options = {
        contractAddress: Storage.address,
        functionName: "getGender",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (gender) => {
          if (gender !== "") {
            setGender(gender);
          }
        },
      });

      // Fetch the user's height
      options = {
        contractAddress: Storage.address,
        functionName: "getHeight",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (height) => {
          if (height !== "") {
            setHeight(height);
          }
        },
      });

      // Fetch the user's weight
      options = {
        contractAddress: Storage.address,
        functionName: "getWeight",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weight) => {
          if (weight !== "") {
            setWeight(weight);
          }
        },
      });
    };

    init();
  }, [account]);

  const editProfileDetails = () => {
    setToggleEdit(true);
  };

  const exitEditProfileDetails = () => {
    setToggleEdit(false);
  };

  const saveDisplayName = async () => {
    // Prevent the user from going under or over the character limit for the display name
    if (
      document.getElementById("displayName").value.length > 0 &&
      document.getElementById("displayName").value.length <= 30
    ) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeDisplayName",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newDisplayName: document.getElementById("displayName").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (name) => {
          if (name !== "") {
            setDisplayName(name);
          }
        },
      });
    } else if (document.getElementById("displayName").value.length === 0) {
      alert("Display name cannot be left empty.");
    } else if (document.getElementById("displayName").value.length > 30) {
      alert("Display name cannot be over 30 characters.");
    }
  };

  const saveAge = async () => {
    if (document.getElementById("age").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeAge",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newAge: document.getElementById("age").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (age) => {
          if (age !== "") {
            setAge(age);
          }
        },
      });
    } else if (document.getElementById("age").value.length === 0) {
      alert("Age cannot be left empty.");
    }
  };

  const saveGender = async () => {
    if (document.getElementById("gender").value.length > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeGender",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newGender: document.getElementById("gender").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (gender) => {
          if (gender !== "") {
            setGender(gender);
          }
        },
      });
    } else if (document.getElementById("gender").value.length === 0) {
      alert("Gender cannot be left empty.");
    }
  };

  const saveHeight = async () => {
    if (document.getElementById("height").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeHeight",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newHeight: document.getElementById("height").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (height) => {
          if (height !== "") {
            setHeight(height);
          }
        },
      });
    } else if (document.getElementById("height").value.length === 0) {
      alert("Height cannot be left empty.");
    }
  };

  const saveWeight = async () => {
    if (document.getElementById("weight").value > 0) {
      let options = {
        contractAddress: Storage.address,
        functionName: "changeWeight",
        abi: Storage.abi,
        params: {
          userAddress: account,
          newWeight: document.getElementById("weight").value,
        },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: async (weight) => {
          if (weight !== "") {
            setWeight(weight);
          }
        },
      });
    } else if (document.getElementById("weight").value.length === 0) {
      alert("Weight cannot be left empty.");
    }
  };

  // Check if the user has clicked on the edit profile details button
  if (toggleEdit === true) {
    return (
      <div className="page profile">
        <Navigation />

        <div className="content">
          <h1>Profile</h1>

          <p className="profile-heading">Display Name</p>
          <p className="profile-text-input">
            <input id="displayName" type="text" placeholder={displayName} />
            <Check className="save-icon" onClick={saveDisplayName} />
          </p>

          <p className="profile-heading">Age</p>
          <p className="profile-text-input">
            <input id="age" type="number" placeholder={age} />
            <Check className="save-icon" onClick={saveAge} />
          </p>

          <p className="profile-heading">Gender</p>
          <p className="profile-text-input">
            <input id="gender" type="text" placeholder="Enter your gender" />
            <Check className="save-icon" onClick={saveGender} />
          </p>

          <p className="profile-heading">Height (in cm)</p>
          <p className="profile-text-input">
            <input id="height" type="number" placeholder={height} />
            <Check className="save-icon" onClick={saveHeight} />
          </p>

          <p className="profile-heading">Weight (in kg)</p>
          <p className="profile-text-input last">
            <input id="weight" type="number" placeholder={weight} />
            <Check className="save-icon" onClick={saveWeight} />
          </p>

          <button className="edit-btn" onClick={exitEditProfileDetails}>
            Exit
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="page profile">
        <Navigation />

        <div className="content">
          <h1>Profile</h1>

          <p className="profile-heading">Display Name</p>
          <p>{displayName}</p>

          <p className="profile-heading">Age</p>
          <p>{parseInt(BigNumber.from(age).toHexString())}</p>

          <p className="profile-heading">Gender</p>
          <p>{gender}</p>

          <p className="profile-heading">Height (in cm)</p>
          <p>{parseInt(BigNumber.from(height).toHexString())}</p>

          <p className="profile-heading">Weight (in kg)</p>
          <p>{parseInt(BigNumber.from(weight).toHexString())}</p>

          <button className="edit-btn" onClick={editProfileDetails}>
            Edit Profile Details
          </button>
        </div>
      </div>
    );
  }
};

export default Profile;
