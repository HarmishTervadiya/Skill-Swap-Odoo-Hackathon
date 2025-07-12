import React from "react";

const SkillCard = ({ imageUrl, name, offering, seeking }) => {
  return (
    <div className="flex flex-col gap-3 pb-3">
      <div
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      ></div>
      <div>
        <p className="text-[#111418] text-base font-medium leading-normal">
          {name}
        </p>
        <p className="text-[#60748a] text-sm font-normal leading-normal">
          Offering: {offering} | Seeking: {seeking}
        </p>
      </div>
    </div>
  );
};

export default SkillCard;
