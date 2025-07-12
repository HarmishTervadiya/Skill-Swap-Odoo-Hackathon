import React from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import SkillTags from "./components/SkillTags";
import FeaturedSkillSwaps from "./components/FeaturedSkillSwaps";
import "./App.css";

function Search() {
  const skillsOffered = [
    "Web Development",
    "Graphic Design",
    "Content Writing",
    "Photography",
    "Marketing",
    "Data Analysis",
    "UI/UX Design",
    "Project Management",
  ];

  const skillsWanted = [
    "Language Tutoring",
    "Music Lessons",
    "Fitness Training",
    "Cooking Classes",
    "Financial Planning",
    "Legal Advice",
    "Career Coaching",
    "Personal Styling",
  ];

  return (
    <>
      <link href="src/App.css" rel="stylesheet"></link>

      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <div className="px-2 sm:px-4 md:px-8 lg:px-16 xl:px-40 flex flex-1 justify-center py-3 sm:py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <SearchBar />
              <SkillTags title="Skills Offered" skills={skillsOffered} />
              <SkillTags title="Skills Wanted" skills={skillsWanted} />
              <FeaturedSkillSwaps />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
