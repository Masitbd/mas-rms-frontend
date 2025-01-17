"use client";

import Image from "next/image";
import TimeRoundIcon from "@rsuite/icons/TimeRound";
import deliverImg from "@/assets/images/Tracking.png";
import contactImg from "@/assets/images/ID Verified.png";

const CategoryDelivery = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-[#FBFBFB] w-full md:w-[100vw] max-w-7xl mx-auto h-full  md:h-[480px] shadow-lg border-[1px] mb-10 rounded-lg ">
      <div className="p-5 md:p-12">
        <div className="flex items-center gap-2  ">
          <Image width={25} src={deliverImg} alt="Deliver img" />
          <p className="text-[#03081F] font-bold">Delivery information</p>
        </div>
        <div className=" text-sm  flex flex-col gap-3 mt-10">
          <p>
            <span className="font-bold"> Monday:</span>
            12:00 AM–3:00 AM, 8:00 AM–3:00 AM
          </p>
          <p>
            <span className="font-bold"> Tuesday: </span>
            8:00 AM-3:00 AM
          </p>
          <p>
            <span className="font-bold"> Wednesday: </span>
            8:00 AM–3:00 AM
          </p>
          <p>
            <span className="font-bold"> Thursday:</span>
            8:00 AM–3:00 AM
          </p>
          <p>
            <span className="font-bold"> Friday:</span>
            8:00 AM–3:00 AM
          </p>
          <p>
            <span className="font-bold"> Saturday: </span>
            8:00 AM - 3:00 AM
          </p>
          <p>
            <span className="font-bold"> Sunday:</span>
            8:00 AM–12:00 AM
          </p>
          <p>
            <span className="font-bold">Estimated time until delivery:</span>
            20 min
          </p>
        </div>
      </div>
      <div className="p-5 md:p-12 ">
        <div className="flex items-center gap-2">
          <Image width={25} src={contactImg} alt="contact" />
          <p className="text-[#03081F] font-bold">Contact information</p>
        </div>

        <div className="text-sm leading-loose mt-8">
          <p>
            If you have allergies or other dietary restrictions, please contact
            the restaurant. The restaurant will provide food-specific
            information upon request.
          </p>
          <p className="font-bold">Phone number</p>
          <p>+8801777777777777</p>
          <p className="font-bold">Website</p>
          <a
            href="http://Example.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            http://Example.com/
          </a>
        </div>
      </div>
      <div className="bg-[#03081F] p-5 md:p-12rounded-e-lg ">
        <div className="flex items-center gap-3">
          <TimeRoundIcon color="white" />
          <p className="text-white font-bold">Operational Times</p>
        </div>
        <div className=" text-sm  flex flex-col gap-3 mt-10 text-slate-100">
          <p>
            <span className="font-bold"> Monday:</span>
            12:00 AM–3:00 AM, 8:00 AM–3:00 AM
          </p>
          <p>
            <span className="font-bold"> Tuesday: </span>
            8:00 AM-3:00 AM
          </p>
          <p>
            <span className="font-bold"> Wednesday: </span>
            8:00 AM–3:00 AM
          </p>
          <p>
            <span className="font-bold"> Thursday:</span>
            8:00 AM–3:00 AM
          </p>
          <p>
            <span className="font-bold"> Friday:</span>
            8:00 AM–3:00 AM
          </p>
          <p>
            <span className="font-bold"> Saturday: </span>
            8:00 AM - 3:00 AM
          </p>
          <p>
            <span className="font-bold"> Sunday:</span>
            8:00 AM–12:00 AM
          </p>
          <p>
            <span className="font-bold">Estimated time until delivery:</span>
            20 min
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryDelivery;
