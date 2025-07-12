import Header from "./components/Header";

function Profile() {
  return (
    <>
      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex p-4 @container">
                <div className="flex w-full flex-col gap-4 items-center">
                  <div className="flex gap-4 flex-col items-center">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                      style={{
                        backgroundImage:
                          "url(https://lh3.googleusercontent.com/aida-public/AB6AXuDZAFD254LNJFjSt6NN1NH8D6x0K3kixzwx1AfMTPNsTTjMYv-v2N6W6ZHn8n_VPhKTLmV1g3kncilxMvP40lcawZux5D6I8n2obQvP85xXY-XYozjQsiafRK2f5eJsl9nZsYDetkpbLKM8nDrvU31Q-xRH6TzX3tK_Bz2dKdw3GDtfNb1ooUC-L-5dxEIEQTOfOckT1SRTOQAIJkd0eSnG36rmbNCmO3URbXogya2hUGXSku3m2g5Bxx9MhXW-83jSEdRrqcCd)",
                      }}
                    ></div>
                    <div className="flex flex-col items-center justify-center justify-center">
                      <p className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
                        Olivia Bennett
                      </p>
                      <p className="text-[#6a7581] text-base font-normal leading-normal text-center">
                        San Francisco, CA
                      </p>
                      <p className="text-[#6a7581] text-base font-normal leading-normal text-center">
                        Available for swaps
                      </p>
                    </div>
                  </div>
                  <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto">
                    <span className="truncate">Edit Profile</span>
                  </button>
                </div>
              </div>
              <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Skills Offered
              </h2>
              <div className="flex gap-3 p-3 flex-wrap pr-4">
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f1f2f4] pl-4 pr-4">
                  <p className="text-[#121416] text-sm font-medium leading-normal">
                    Graphic Design
                  </p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f1f2f4] pl-4 pr-4">
                  <p className="text-[#121416] text-sm font-medium leading-normal">
                    UI/UX Design
                  </p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f1f2f4] pl-4 pr-4">
                  <p className="text-[#121416] text-sm font-medium leading-normal">
                    Illustration
                  </p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f1f2f4] pl-4 pr-4">
                  <p className="text-[#121416] text-sm font-medium leading-normal">
                    Branding
                  </p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f1f2f4] pl-4 pr-4">
                  <p className="text-[#121416] text-sm font-medium leading-normal">
                    Web Design
                  </p>
                </div>
              </div>
              <div className="flex px-4 py-3 justify-start">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Add Skill</span>
                </button>
              </div>
              <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Skills Wanted
              </h2>
              <div className="flex gap-3 p-3 flex-wrap pr-4">
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f1f2f4] pl-4 pr-4">
                  <p className="text-[#121416] text-sm font-medium leading-normal">
                    Photography
                  </p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f1f2f4] pl-4 pr-4">
                  <p className="text-[#121416] text-sm font-medium leading-normal">
                    Video Editing
                  </p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f1f2f4] pl-4 pr-4">
                  <p className="text-[#121416] text-sm font-medium leading-normal">
                    Motion Graphics
                  </p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f1f2f4] pl-4 pr-4">
                  <p className="text-[#121416] text-sm font-medium leading-normal">
                    3D Modeling
                  </p>
                </div>
              </div>
              <div className="flex px-4 py-3 justify-start">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Add Skill</span>
                </button>
              </div>
              <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Availability
              </h2>
              <p className="text-[#121416] text-base font-normal leading-normal pb-3 pt-1 px-4">
                Available for swaps on weekends and evenings.
              </p>
              <div className="p-4 @container">
                <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-[#dde0e3] bg-white p-5 @[480px]:flex-row @[480px]:items-center">
                  <div className="flex flex-col gap-1">
                    <p className="text-[#121416] text-base font-bold leading-tight">
                      Profile Visibility
                    </p>
                    <p className="text-[#6a7581] text-base font-normal leading-normal">
                      Make your profile public or private
                    </p>
                  </div>
                  <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#f1f2f4] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#dce7f3]">
                    <div
                      className="h-full w-[27px] rounded-full bg-white"
                      style={{
                        boxShadow:
                          "rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px",
                      }}
                    ></div>
                    <input type="checkbox" className="invisible absolute" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
