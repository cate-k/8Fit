import React from "react";
import { BigNumber } from "ethers";
import { useWeb3ExecuteFunction } from "react-moralis";
import { Trash } from "react-feather";

import EightFit from "../../abi/EightFit";

const NutritionPost = (props) => {
  const contractProcessor = useWeb3ExecuteFunction();

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
    <div className="nutrition-post">
      <p>{parseInt(BigNumber.from(props.calories).toHexString())} calories {props.status} on {new Date(parseInt(BigNumber.from(props.date).toHexString())).toString('DD/mm/yy HH:mm:ss')}</p>

      <Trash className="delete-icon" onClick={(props.status === "eaten") ? deleteCaloriesEatenPost : deleteCaloriesBurnedPost} />
    </div>
  );
}

export default NutritionPost;