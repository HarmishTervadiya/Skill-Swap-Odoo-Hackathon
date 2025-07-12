import React from "react";
import SkillCard from "./SkillCard";

const FeaturedSkillSwaps = () => {
  const skillSwaps = [
    {
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDM6VcRuVHqlgn8IUnDAXJc7kY4kDM8F9sxy3LxY5eINg-L3Tt2dr9w5W3tZUwYhdS7_4Syju-NmrRZp2bNz7xAdrdyCZHVQBms0c3INrwrXgAQODyWaJolLxT2EceqsJcevOxd8HmYg-hz_9vphQ0uh8fgIaBOR568nVdIU347k42bGdWbRFNtui4wDfRDYZaZxzLP_xOVd_1NozGKzXbCuRu5LiC1CSvwLq6BB6VzqwMjytaCjWKdMrFMpMsg2ZxCgY1jfIOI",
      name: "Sarah M. - Web Development",
      offering: "React, Node.js, JavaScript",
      seeking: "Spanish Tutoring",
    },
    {
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBekXXwmlc_2_6e9BLY4o0O070B9uInpwxP3gdyD4xa5plptPqCdzFKCDT5wbexQDg3SkokDdACj3eM8YGdwqb1zOyQJDZQPnsAYwwtqmhtP7bTumRNehQ5EQNOo0SsE5X42CCvGes4JFQmRhXhQ7akcthDYxGEra58wS17opFvMgv2LmBfjj-3PfXNK850X6Ofb1YCzb5Mxx8hkuNfsJkE5QBvJlUEXVMzMg06GH0sJs_xUxTihhmFGz2PRJ_69TEJc3JvGL-5",
      name: "David L. - Graphic Design",
      offering: "Logo Design, Branding, Illustration",
      seeking: "Guitar Lessons",
    },
    {
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCW01WT4HGKXJP79uademfm9eFMmTX3SCo9piRw44g4_UMvPvA4urop4sa-Ybr1IJN2e2Kq6EXKbKnT0Y5UGHV_BiYxa4a4E-t6J1GniPZhHG319rjYTBoxiTxZL3u18UjWcgOa8xuV4IuiQKoC_d90nD1J31TqO2BY81yZ47wjMrnOyvUWW7liGDx1auJjYUzjfiUqh8gFHF046Az8lq6q9a1QDVa-BjvEXulA8JVltsT4kfxMictfihAmywlnUhLri6-C8Zwb",
      name: "Emily R. - Content Writing",
      offering: "Blog Posts, Articles, Copywriting",
      seeking: "Yoga Classes",
    },
    {
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAAoZBwzWg6PBfVcVP9MtNjBcvyzt58CAWIIIvraO-3pGTcGwL4Dfj40s2mktWLOBpx6RPiGGfC0lhh3vQeQCKMEUJzTc7c8bp2-xDWGmIKzYyjsT4gNLdhwZ_tEPeITQEnH6q87VIB_rcK8EwwbDoG5urMUgd2yuzFWrm_BEN-zabOV7FXY6Wje0PivISnzqu27rZXC5od2C2082SzcHxMPvXwKYky_1LwrrJXVTGy7rHN1jSFYTAeA9fA8PhlH0z9l5zSIj-9",
      name: "Michael B. - Photography",
      offering: "Portrait Photography, Event Photography",
      seeking: "French Tutoring",
    },
    {
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDYtlYCQ_EuZNyTNDBu-mF-tboiRCYt_SuR8GekECQE84cWhdGbcHJH9URPMkGHKzpbC4IHJB9XFNqewBnWy6BiZ0gZdv-uKZXXCThZAmh1iCzk19iM3-8WIeRKraLcxUImd-UUG0p3wWS2j39zC2YE_BVTPfFgdnlzdQ4eeDfiOfzaHZ52u_CRaFa73E6IJE58xVGxzk4KOxvmNrO-WiZbm7u0Gnn0mZ6RSuTQ7VPA0zMbDUsgz-iCxucMGlFd2DOHkhmKJWui",
      name: "Jessica K. - Marketing",
      offering: "Social Media Management, SEO",
      seeking: "Cooking Classes",
    },
    {
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ-p6voaP_q2FgmgZKJ59I0vkDUKOn3_Ch0aLbmvHCqJoNSvgDUNpgJbBa8_3XmTms9m_ElQrdZn8QSj8rGGbLyKhqd5LY8fIpsJozhSkhVwder1PW2SmEEcu0cwsQcRCWJ-OH3FnO4nUbKdD4dENxpOPbLy0h4GRAV9Vw3r7_NF84IW0o0egi6qpLLHQgqUv2BsPnowcD2Evik9KdbTrwHP2p3aKzwgNU0HUhtFnP4c5fF9tDqbqG_ELJ8PHTCzlG_X-BOoVC",
      name: "Daniel S. - Data Analysis",
      offering: "Data Visualization, Statistical Analysis",
      seeking: "Personal Training",
    },
  ];

  return (
    <>
      <h2 className="text-[#111418] text-lg sm:text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-2 sm:pb-3 pt-3 sm:pt-5">
        Featured Skill Swaps
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 p-2 sm:p-4">
        {skillSwaps.map((swap, index) => (
          <SkillCard
            key={index}
            imageUrl={swap.imageUrl}
            name={swap.name}
            offering={swap.offering}
            seeking={swap.seeking}
          />
        ))}
      </div>
    </>
  );
};

export default FeaturedSkillSwaps;
