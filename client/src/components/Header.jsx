import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="relative flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f5] px-3 sm:px-4 md:px-6 lg:px-10 py-2 sm:py-3">
      <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 text-[#111418]">
          <div className="size-3 sm:size-4">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <Link
            to="/"
            className="text-[#111418] text-sm sm:text-base md:text-lg font-bold leading-tight tracking-[-0.015em] no-underline"
          >
            Skill Swap
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-9">
          <Link
            to="/"
            className="text-[#111418] text-sm font-medium leading-normal no-underline hover:text-[#0c77f2] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/OnBoarding"
            className="text-[#111418] text-sm font-medium leading-normal no-underline hover:text-[#0c77f2] transition-colors"
          >
            OnBoarding
          </Link>

          <Link
            to="/Profile"
            className="text-[#111418] text-sm font-medium leading-normal no-underline hover:text-[#0c77f2] transition-colors"
          >
            Profile
          </Link>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Desktop Search and Profile */}
      <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-8">
        <UserButton afterSignOutUrl="/sign-in" />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 md:hidden z-50 shadow-lg">
          <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-2 sm:space-y-3">
            <Link
              to="/"
              className="block text-[#111418] text-sm font-medium leading-normal no-underline hover:text-[#0c77f2] py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/OnBoarding"
              className="block text-[#111418] text-sm font-medium leading-normal no-underline hover:text-[#0c77f2] py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              OnBoarding
            </Link>
            <Link
              to="/search"
              className="block text-[#111418] text-sm font-medium leading-normal no-underline hover:text-[#0c77f2] py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
            <a
              className="block text-[#111418] text-sm font-medium leading-normal no-underline hover:text-[#0c77f2] py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              Messages
            </a>

            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
