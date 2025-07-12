import React from "react";

const SkillTags = ({ title, skills, selectedSkills = [], onSkillSelect }) => {
  const handleSkillClick = (skill) => {
    if (onSkillSelect) {
      onSkillSelect(skill);
    }
  };

  return (
    <>
      <h2 className="text-[#111418] text-lg sm:text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-2 sm:pb-3 pt-3 sm:pt-5">
        {title}
      </h2>
      <div className="flex gap-2 sm:gap-3 p-2 sm:p-3 flex-wrap pr-2 sm:pr-4">
        {skills.map((skill, index) => {
          const isSelected = selectedSkills.includes(skill);
          return (
            <div
              key={index}
              onClick={() => handleSkillClick(skill)}
              className={`flex h-7 sm:h-8 shrink-0 items-center justify-center gap-x-1 sm:gap-x-2 rounded-lg pl-3 sm:pl-4 pr-3 sm:pr-4 cursor-pointer transition-colors ${
                isSelected
                  ? "bg-[#0c77f2] text-white"
                  : "bg-[#f0f2f5] text-[#111418] hover:bg-[#e4e6e9]"
              }`}
            >
              <p className="text-[#111418] text-xs sm:text-sm font-medium leading-normal">
                {skill}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SkillTags;
