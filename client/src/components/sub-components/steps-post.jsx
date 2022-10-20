import React from "react";
import { BigNumber } from "ethers";
import { useWeb3ExecuteFunction } from "react-moralis";
import { Trash } from "react-feather";

import EightFit from "../../abi/EightFit";

const StepsPost = (props) => {
  const contractProcessor = useWeb3ExecuteFunction();

  const deleteStepsPost = async () => {
    // Delete the post
    let options = {
      contractAddress: EightFit.address,
      functionName: "deleteDailyStepCountPost",
      abi: EightFit.abi,
      params: { stepsPostId: props.id },
    };

    await contractProcessor.fetch({ params: options });
  }

  return (
    <div className="steps-post">
      <p>{parseInt(BigNumber.from(props.activityLength).toHexString())} steps taken on {new Date(parseInt(BigNumber.from(props.date).toHexString())).toString('DD/mm/yy HH:mm:ss')}</p>

      <Trash className="delete-icon" onClick={deleteStepsPost} />
    </div>
  );
}

export default StepsPost;