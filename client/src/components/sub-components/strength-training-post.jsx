import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Trash } from "react-feather";

import EightFit from "../../abi/EightFit";

const StrengthTrainingPost = (props) => {
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

  const deleteStrengthTrainingPost = async () => {
    // Delete the post
    let options = {
      contractAddress: EightFit.address,
      functionName: "deleteStrengthTrainingPost",
      abi: EightFit.abi,
      params: { strengthTrainingPostId: props.id },
    };

    await contractProcessor.fetch({ params: options });
  }

  return (
    <div className="strength-training-post">
      <p>{minutesCompleted} minutes of {props.activityName}</p>

      <p>Date Posted: {new Date(parseInt(BigNumber.from(props.date).toHexString())).toString('DD/mm/yy HH:mm:ss')}</p>

      <Trash className="delete-icon" onClick={deleteStrengthTrainingPost} />
    </div>
  );
}

export default StrengthTrainingPost;