import React from "react";

const SkillCard = ({
  imageUrl,
  name,
  email,
  skillsOffered = [],
  skillsWanted = [],
}) => {
  // Helper function to safely convert values to strings
  const safeString = (value) => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (value && typeof value === "object") {
      // If it's an object with a name property, use that
      if (value.name) return value.name;
      // Otherwise, stringify it
      return JSON.stringify(value);
    }
    return "";
  };

  // Helper function to safely handle arrays
  const safeArray = (value) => {
    if (Array.isArray(value)) return value;
    return [];
  };

  const displayName = safeString(name) || "Anonymous";
  const displayEmail = safeString(email) || "";
  const displaySkillsOffered = safeArray(skillsOffered);
  const displaySkillsWanted = safeArray(skillsWanted);

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
          {displayName}
        </p>
        <p className="text-[#60748a] text-xs sm:text-sm font-normal leading-normal">
          {displayEmail}
        </p>
        {displaySkillsOffered.length > 0 && (
          <div className="mt-1">
            <p className="text-[#60748a] text-xs font-medium">Offering:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {displaySkillsOffered.slice(0, 2).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded"
                >
                  {safeString(skill)}
                </span>
              ))}
              {displaySkillsOffered.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{displaySkillsOffered.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
        {displaySkillsWanted.length > 0 && (
          <div className="mt-1">
            <p className="text-[#60748a] text-xs font-medium">Seeking:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {displaySkillsWanted.slice(0, 2).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded"
                >
                  {safeString(skill)}
                </span>
              ))}
              {displaySkillsWanted.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{displaySkillsWanted.length - 2} more
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
