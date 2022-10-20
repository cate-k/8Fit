import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Trash } from "react-feather";

import EightFit from "../../abi/EightFit";

const CardioPost = (props) => {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [minutesCompleted, setMinutesCompleted] = useState(0);

  useEffect(() => {
    const init = async () => {
      // Convert minutes completed to a readable integer
      setMinutesCompleted(parseInt(BigNumber.from(props.minutesCompleted).toHexString()));
    };

    init();
  }, [account]);

  const deleteCardioPost = async () => {
    // Delete the post
    let options = {
      contractAddress: EightFit.address,
      functionName: "deleteCardioPost",
      abi: EightFit.abi,
      params: { cardioPostId: props.id },
    };

    await contractProcessor.fetch({ params: options });
  }

  return (
    <div className="cardio-post">
      <p>{minutesCompleted} minutes of {props.activityName}</p>

      <p>Date Posted: {new Date(parseInt(BigNumber.from(props.date).toHexString())).toString('DD/mm/yy HH:mm:ss')}</p>

      <Trash className="delete-icon" onClick={deleteCardioPost} />
    </div>
  );
}

export default CardioPost;