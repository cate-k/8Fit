import React from "react";
import { BigNumber } from "ethers";

const NutritionPost = (props) => {
  return (
    <div className="nutrition-post">
      <p>{parseInt(BigNumber.from(props.calories).toHexString())} calories {props.status}</p>
    </div>
  );
}

export default NutritionPost;