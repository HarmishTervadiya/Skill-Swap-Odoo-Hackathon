import React from "react";
import SkillCard from "./SkillCard";

const FeaturedSkillSwaps = ({ users = [] }) => {
  // Ensure users is an array
  const userArray = Array.isArray(users) ? users : [];

  // If no users provided, show empty state
  if (!userArray || userArray.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No users available</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-[#111418] text-lg sm:text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-2 sm:pb-3 pt-3 sm:pt-5">
        Users ({userArray.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 p-2 sm:p-4">
        {userArray.map((user, index) => (
          <SkillCard
            key={user?.clerkId || index}
            imageUrl={
              user?.profilePicture.uri || "https://avatar.iran.liara.run/public"
            }
            name={user?.name || "Anonymous"}
            email={user?.email}
            skillsOffered={user?.skillsOffered || []}
            skillsWanted={user?.skillsWanted || []}
          />
        ))}
      </div>
    </>
  );
};

export default FeaturedSkillSwaps;
