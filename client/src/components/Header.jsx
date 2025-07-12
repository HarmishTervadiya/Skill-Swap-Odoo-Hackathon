import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f5] px-10 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-[#111418]">
          <div className="size-4">
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
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">
            Skill Swap
          </h2>
        </div>
        <div className="flex items-center gap-9">
          <a
            className="text-[#111418] text-sm font-medium leading-normal"
            href="#"
          >
            Home
          </a>
          <a
            className="text-[#111418] text-sm font-medium leading-normal"
            href="#"
          >
            My Skills
          </a>
          <a
            className="text-[#111418] text-sm font-medium leading-normal"
            href="#"
          >
            Requests
          </a>
          <a
            className="text-[#111418] text-sm font-medium leading-normal"
            href="#"
          >
            Messages
          </a>
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <label className="flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div
              className="text-[#60748a] flex border-none bg-[#f0f2f5] items-center justify-center pl-4 rounded-l-lg border-r-0"
              data-icon="MagnifyingGlass"
              data-size="24px"
              data-weight="regular"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input
              placeholder="Search"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-full placeholder:text-[#60748a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            />
          </div>
        </label>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          style={{
            backgroundImage:
              "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAWxwI_chr5F9Qbm_wa2_T8y0zIxHES56CPwz4FrWcPr70uZQv4oJU298ZSKHvMdMrZ3VqnkeyF4WsHNz0BG7UPGARFoIxU3grj1iruzVVpcslq8oaVg5Ty2q2VeCAh86eGkCNkOW1Z7ieNmPhEcPVB4iGbdLSfeMChxnfBYVhP1DRlXgkzXM2aLnhGxLlMLJtHAgkCKfU6rArC7l04UIahHLFWuWKs6JuDV-8jmVFj-q9yAQccsFg1SWPIj7Zi-7FpR-AA3zRP)",
          }}
        ></div>
      </div>
    </header>
  );
};

export default Header;
