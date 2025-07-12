import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import SkillTags from "./components/SkillTags";
import FeaturedSkillSwaps from "./components/FeaturedSkillSwaps";
import "./App.css";

function Search() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

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

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/v1/users");
      console.log("API Response:", response);
      console.log("Response data:", response.data);
      console.log("Data type:", typeof response.data);
      console.log("Is array:", Array.isArray(response.data));

      // Handle different response structures
      let usersData = response.data;
      if (response.data && response.data.users) {
        usersData = response.data.users;
      } else if (response.data && response.data.data) {
        usersData = response.data.data;
      }

      // Ensure it's an array
      const finalUsers = Array.isArray(usersData) ? usersData : [];
      console.log("Final users array:", finalUsers);

      setUsers(finalUsers);
      setFilteredUsers(finalUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    filterUsers(term, selectedSkills);
  };

  // Handle skill selection
  const handleSkillSelect = (skill) => {
    const newSelectedSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];

    setSelectedSkills(newSelectedSkills);
    filterUsers(searchTerm, newSelectedSkills);
  };

  // Filter users based on search term and selected skills
  const filterUsers = (term, skills) => {
    let filtered = users;

    // Filter by search term
    if (term) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(term.toLowerCase()) ||
          user.email?.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filter by selected skills
    if (skills.length > 0) {
      filtered = filtered.filter((user) =>
        skills.some(
          (skill) =>
            user.skillsOffered?.includes(skill) ||
            user.skillsWanted?.includes(skill)
        )
      );
    }

    setFilteredUsers(filtered);
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <div className="px-2 sm:px-4 md:px-8 lg:px-16 xl:px-40 flex flex-1 justify-center py-3 sm:py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <SearchBar onSearch={handleSearch} />

              {/* Skills Filter */}
              <div className="mb-6">
                <SkillTags
                  title="Skills Offered"
                  skills={skillsOffered}
                  selectedSkills={selectedSkills}
                  onSkillSelect={handleSkillSelect}
                />
                <SkillTags
                  title="Skills Wanted"
                  skills={skillsWanted}
                  selectedSkills={selectedSkills}
                  onSkillSelect={handleSkillSelect}
                />
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={fetchUsers}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Search Results */}
              {!loading && !error && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">
                      {searchTerm || selectedSkills.length > 0
                        ? `Search Results (${filteredUsers.length} users found)`
                        : "All Users"}
                    </h2>
                    {(searchTerm || selectedSkills.length > 0) && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedSkills([]);
                          setFilteredUsers(users);
                        }}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>

                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">
                        No users found matching your criteria.
                      </p>
                    </div>
                  ) : (
                    <FeaturedSkillSwaps users={filteredUsers} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
