import React from "react";

const SearchBar = ({ placeholder = "Search by skill or keyword" }) => {
  return (
    <div className="px-2 sm:px-4 py-2 sm:py-3">
      <label className="flex flex-col min-w-40 h-10 sm:h-12 w-full">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
          <div
            className="text-[#60748a] flex border-none bg-[#f0f2f5] items-center justify-center pl-3 sm:pl-4 rounded-l-lg border-r-0"
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
          <input
            placeholder={placeholder}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-full placeholder:text-[#60748a] px-3 sm:px-4 rounded-l-none border-l-0 pl-2 text-sm sm:text-base font-normal leading-normal"
          />
        </div>
      </label>
    </div>
  );
};

export default SearchBar;
