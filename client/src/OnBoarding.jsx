import React from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header";

function OnBoarding() {
  return (
    <>
      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <div className="px-2 sm:px-4 md:px-8 lg:px-16 xl:px-40 flex flex-1 justify-center py-3 sm:py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-2 sm:p-4">
                <div className="flex min-w-72 flex-col gap-2 sm:gap-3">
                  <p className="text-[#111418] tracking-light text-xl sm:text-2xl md:text-[32px] font-bold leading-tight">
                    Welcome to Skill Swap, Sarah!
                  </p>
                  <p className="text-[#60748a] text-xs sm:text-sm font-normal leading-normal">
                    You're all set to start exploring and exchanging skills.
                    Here's what you can do next:
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 bg-white px-2 sm:px-4 min-h-[60px] sm:min-h-[72px] py-2">
                <div
                  className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f5] shrink-0 size-10 sm:size-12"
                  data-icon="User"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    className="sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#111418] text-sm sm:text-base font-medium leading-normal line-clamp-1">
                    Complete Your Profile
                  </p>
                  <p className="text-[#60748a] text-xs sm:text-sm font-normal leading-normal line-clamp-2">
                    Showcase your expertise and what you're looking to learn.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 bg-white px-2 sm:px-4 min-h-[60px] sm:min-h-[72px] py-2">
                <div
                  className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f5] shrink-0 size-10 sm:size-12"
                  data-icon="MagnifyingGlass"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    className="sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#111418] text-sm sm:text-base font-medium leading-normal line-clamp-1">
                    Browse Skills
                  </p>
                  <p className="text-[#60748a] text-xs sm:text-sm font-normal leading-normal line-clamp-2">
                    Discover skills offered by others and find opportunities to
                    exchange.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 bg-white px-2 sm:px-4 min-h-[60px] sm:min-h-[72px] py-2">
                <div
                  className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f5] shrink-0 size-10 sm:size-12"
                  data-icon="Plus"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    className="sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#111418] text-sm sm:text-base font-medium leading-normal line-clamp-1">
                    Post a Request
                  </p>
                  <p className="text-[#60748a] text-xs sm:text-sm font-normal leading-normal line-clamp-2">
                    Post a request for a specific skill you need and connect
                    with potential partners.
                  </p>
                </div>
              </div>
              <div className="flex px-2 sm:px-4 py-2 sm:py-3 justify-end">
                <Link
                  to="/search"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 sm:h-10 px-3 sm:px-4 bg-[#0c77f2] text-white text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] no-underline hover:bg-[#0a5fd1]"
                >
                  <span className="truncate">Get Started</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OnBoarding;
