import CategoryDelivery from "@/components/consumer-components/CategoryDelivery";
import CategoryHero from "@/components/consumer-components/CategoryHero";
import CategoryLayout from "@/components/consumer-components/CategoryLayout";
import mapImg from "@/assets/images/mapImg.png";
import Image from "next/image";
import CustonmerReviews from "@/components/consumer-components/CustonmerReviews";

const CategoryPage = () => {
  return (
    <div className="max-w-7xl mx-auto lg:mt-28 mt-36 px-2">
      <CategoryHero />
      <CategoryLayout />
      <CategoryDelivery />
      <div className="my-10 relative">
        <div>
          <Image src={mapImg} alt="map" />
        </div>
        <div className="w-full max-w-[270px] h-full md:h-[323px] flex flex-col justify-center px-4 md:leading-loose bg-[#03081FF7] text-white rounded-lg absolute top-1/2 left-12 transform -translate-y-1/2">
          <p className="text-white font-bold">Kacchi House</p>
          <p className="text-[#FC8A06]">Mirpur</p>
          <p className="text-sm">
            Mirpur Section- 02, Road No. 01. M irpur- 02, Road No. 05.
          </p>
          <p className="md:font-bold ">Phone number</p>
          <p className="text-[#FC8A06]">+8801777777777777</p>
          <p className="md:font-bold">Website</p>
          <a
            href="http://Example.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FC8A06] underline text-sm"
          >
            http://Example.com/
          </a>
        </div>
      </div>

      <CustonmerReviews />
    </div>
  );
};

export default CategoryPage;
