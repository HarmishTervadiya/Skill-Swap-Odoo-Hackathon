import React from "react";

const SkillTags = ({ title, skills }) => {
  return (
    <>
      <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {title}
      </h2>
      <div className="flex gap-3 p-3 flex-wrap pr-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f5] pl-4 pr-4"
          >
            <p className="text-[#111418] text-sm font-medium leading-normal">
              {skill}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SkillTags;
