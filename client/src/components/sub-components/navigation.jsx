import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

import Storage from "../../abi/Storage.json";

const Navigation = () => {
  const { authenticate, account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const init = async () => {
      // Authenticate the user
      if (account === null) {
        authenticate({ signingMessage: "Authenticate using MetaMask to continue using 8Fit" });
      }

      // Fetch the user's profile picture
      let options = {
        contractAddress: Storage.address,
        functionName: "getProfilePic",
        abi: Storage.abi,
        params: { userAddress: account },
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: (userProfilePic) => {
          if (userProfilePic !== "") {
            setProfilePic(userProfilePic);
          }
        },
      });
    };

    init();
  }, [account]);

  return (
    <div className="navigation">
      <div className="nav-logo">
        <Link to="/home">
          <img
            className="logo"
            src={require("../../styles/images/logo.jpg").default}
            alt="8Fit"
          />
        </Link>
      </div>

      <div className="nav-links">
        <Link
          to={{
            pathname: "/profile/" + account
          }}
        >
          <img
            className="profile-pic"
            src={profilePic === "" ? require("../../styles/images/user.png").default : profilePic}
            alt="Profile"
          />
        </Link>
      </div>
    </div>
  );
}

export default Navigation;