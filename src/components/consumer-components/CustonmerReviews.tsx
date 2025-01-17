"use client";
import ArrowLeftLineIcon from "@rsuite/icons/ArrowLeftLine";
import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";
import userImg from "@/assets/images/user.png";
import Image from "next/image";
import StarIcon from "@rsuite/icons/Star";
import TimeRoundIcon from "@rsuite/icons/TimeRound";

const CustonmerReviews = () => {
  return (
    <div className="my-16 bg-[#D9D9D9] rounded-md p-14">
      <div className="flex items-center justify-between ">
        <p className="text-2xl font-bold">Customer Reviews</p>

        <div className="flex items-center  gap-5 ">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl bg-[#FC8A06]">
            {" "}
            <ArrowLeftLineIcon />{" "}
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl bg-[#FC8A06]">
            {" "}
            <ArrowRightLineIcon />{" "}
          </div>
        </div>
      </div>

      {/*  */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-7">
        <div className="w-full max-w-[380px]  h-fulll min-h-[220px]  bg-white rounded-lg p-4">
          {/*  */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="pe-3 border-r-2 border-[#FC8A06]">
                <Image width={40} src={userImg} alt="user" />
              </div>
              <div>
                <p className="font-bold">ST Glx</p>
                <p className="text-[#FC8A06] text-sm">Mirpur Dhaka</p>
              </div>
            </div>

            <div>
              <div className="flex justify-end mb-1">
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
              </div>
              <div className="flex gap-2 items-center">
                <TimeRoundIcon color="#FC8A06" />
                <p>23 September 2024</p>
              </div>
            </div>
          </div>

          {/*  */}

          <p className="mt-5 leading-loose text-[13px]">
            The positive aspect was undoubtedly the efficiency of the service.
            The queue moved quickly, the staff was friendly, and the food was up
            to the usual McDonald&lsquo;s standard – hot and satisfying.
          </p>
        </div>
        <div className="w-full max-w-[380px] h-fulll min-h-[220px]  bg-white rounded-lg p-4">
          {/*  */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="pe-3 border-r-2 border-[#FC8A06]">
                <Image width={40} src={userImg} alt="user" />
              </div>
              <div>
                <p className="font-bold">ST Glx</p>
                <p className="text-[#FC8A06] text-sm">Mirpur Dhaka</p>
              </div>
            </div>

            <div>
              <div className="flex justify-end mb-1">
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
              </div>
              <div className="flex gap-2 items-center">
                <TimeRoundIcon color="#FC8A06" />
                <p>23 September 2024</p>
              </div>
            </div>
          </div>

          {/*  */}

          <p className="mt-5 leading-loose text-[13px]">
            The positive aspect was undoubtedly the efficiency of the service.
            The queue moved quickly, the staff was friendly, and the food was up
            to the usual McDonald&lsquo;s standard – hot and satisfying.
          </p>
        </div>
        <div className="w-full max-w-[380px] h-fulll min-h-[220px]  bg-white rounded-lg p-4">
          {/*  */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="pe-3 border-r-2 border-[#FC8A06]">
                <Image width={40} src={userImg} alt="user" />
              </div>
              <div>
                <p className="font-bold">ST Glx</p>
                <p className="text-[#FC8A06] text-sm">Mirpur Dhaka</p>
              </div>
            </div>

            <div>
              <div className="flex justify-end mb-1">
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
                <StarIcon color="#FC8A06" />
              </div>
              <div className="flex gap-2 items-center">
                <TimeRoundIcon color="#FC8A06" />
                <p>23 September 2024</p>
              </div>
            </div>
          </div>

          {/*  */}

          <p className="mt-5 leading-loose text-[13px]">
            The positive aspect was undoubtedly the efficiency of the service.
            The queue moved quickly, the staff was friendly, and the food was up
            to the usual McDonald&lsquo;s standard – hot and satisfying.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustonmerReviews;
