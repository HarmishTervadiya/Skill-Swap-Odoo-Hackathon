import React from "react";

const SkillCard = ({
  imageUrl,
  name,
  email,
  skillsOffered = [],
  skillsWanted = [],
}) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 pb-2 sm:pb-3">
      <div
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg bg-gray-200"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
        }}
      >
        {!imageUrl && (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      <div>
        <p className="text-[#111418] text-sm sm:text-base font-medium leading-normal">
          {name}
        </p>
        <p className="text-[#60748a] text-xs sm:text-sm font-normal leading-normal">
          {email}
        </p>
        {skillsOffered.length > 0 && (
          <div className="mt-1">
            <p className="text-[#60748a] text-xs font-medium">Offering:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {skillsOffered.slice(0, 2).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
              {skillsOffered.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{skillsOffered.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
        {skillsWanted.length > 0 && (
          <div className="mt-1">
            <p className="text-[#60748a] text-xs font-medium">Seeking:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {skillsWanted.slice(0, 2).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
              {skillsWanted.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{skillsWanted.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
