import React from "react";
import { BigNumber } from "ethers";
import { useWeb3ExecuteFunction } from "react-moralis";
import { Trash } from "react-feather";

import EightFit from "../../abi/EightFit";

const NutritionPost = (props) => {
  const contractProcessor = useWeb3ExecuteFunction();

  const date = new Date(parseInt(BigNumber.from(props.date).toHexString())).toString('DD/mm/yy HH:mm:ss');

  const deleteCaloriesEatenPost = async () => {
    let options = {
      contractAddress: EightFit.address,
      functionName: "deleteCaloriesEatenPost",
      abi: EightFit.abi,
      params: { caloriesEatenPostId: props.id },
    };

    await contractProcessor.fetch({ params: options });
  }

  const deleteCaloriesBurnedPost = async () => {
    let options = {
      contractAddress: EightFit.address,
      functionName: "deleteCaloriesBurnedPost",
      abi: EightFit.abi,
      params: { caloriesBurnedPostId: props.id },
    };

    await contractProcessor.fetch({ params: options });
  }

  return (
    <div className="steps-post">
      <p>{date.substring(date.indexOf(' ') + 1, date.indexOf(' ') + 12)}</p>

      <p>{parseInt(BigNumber.from(props.calories).toHexString())} calories {props.status}</p>

      <Trash className="delete-icon" onClick={(props.status === "eaten") ? deleteCaloriesEatenPost : deleteCaloriesBurnedPost} />
    </div>
  );
}

export default NutritionPost;