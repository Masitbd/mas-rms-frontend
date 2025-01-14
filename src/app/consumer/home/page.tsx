import ALlCategories from "@/components/consumer-home/ALlCategories";
import DiscountedItems from "@/components/consumer-home/DiscountedItems";
import Hero from "@/components/consumer-home/Hero";
import KnowMoreAboutUs from "@/components/consumer-home/KnowMoreAboutUs";
import PopularCategories from "@/components/consumer-home/PopularCategories";
import Reviews from "@/components/consumer-home/Reiviews";
import StatSection from "@/components/consumer-home/StatSection";
import React from "react";

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto lg:mt-24 mt-36">
      <div>
        <Hero />
      </div>
      <div>
        <DiscountedItems />
      </div>
      <div>
        <PopularCategories />
      </div>
      <div>
        <ALlCategories />
      </div>
      <div>
        <Reviews />
      </div>
      <div>
        <KnowMoreAboutUs />
      </div>
      <div>
        <StatSection />
      </div>
    </div>
  );
};

export const revalidate = 60;
export default HomePage;

// export async function getStaticProps() {
//   const res = await fetch("https://jsonplaceholder.typicode.com/posts");
//   const posts = await res.json();
//   console.log("Fetched posts:", posts); // Logs on the server during build/revalidation

//   return {
//     props: {
//       posts,
//     },
//     revalidate: 60, // In seconds
//   };
// }
