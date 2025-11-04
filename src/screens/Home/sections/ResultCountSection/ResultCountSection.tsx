import { MapPinIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const ResultCountSection = (): JSX.Element => {
  const stars = [
    { filled: true, src: "/fa-solid-star-1.svg" },
    { filled: true, src: "/fa-solid-star-1.svg" },
    { filled: true, src: "/fa-solid-star-1.svg" },
    { filled: true, src: "/fa-solid-star-1.svg" },
    { filled: false, src: "/fa-solid-star.svg" },
  ];

  return (
    <section className="w-full">
      <Card className="bg-white rounded-[10px] shadow-[0px_0px_25px_#0000001a]">
        <CardContent className="p-[23px] flex items-start gap-6">
          <div className="relative flex-shrink-0">
            <img
              className="w-[95px] h-[95px]"
              alt="Mask group"
              src="/mask-group.png"
            />
            <img
              className="absolute top-[-2px] left-[-3px] w-[105px] h-[100px]"
              alt="Group"
              src="/group-11635.png"
            />
          </div>

          <div className="flex-1 flex flex-col gap-[9px]">
            <div className="flex items-start justify-between">
              <h2 className="[font-family:'Poppins',Helvetica] font-medium text-black text-xl tracking-[0] leading-[normal]">
                Graffersid Web and App Development
              </h2>
              <p className="[font-family:'Poppins',Helvetica] font-normal text-[#757575] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                Founded on 01-01-2016
              </p>
            </div>

            <div className="flex items-start gap-[3px]">
              <MapPinIcon className="mt-[3px] w-[13px] h-[13px] text-[#757575] flex-shrink-0" />
              <p className="[font-family:'Poppins',Helvetica] font-normal text-[#757575] text-[13px] tracking-[0] leading-[normal]">
                816, Shekhar Central, Manorama Ganj, AB road, New Palasia,
                Indore (M.P.)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-base tracking-[0] leading-[normal]">
                  4.5
                </span>
                <div className="flex items-center gap-[5px]">
                  {stars.map((star, index) => (
                    <img
                      key={index}
                      className="w-[18px] h-[16.2px]"
                      alt="Star"
                      src={star.src}
                    />
                  ))}
                </div>
                <span className="ml-[11px] [font-family:'Poppins',Helvetica] font-medium text-black text-base tracking-[0] leading-[normal]">
                  41 Reviews
                </span>
              </div>

              <Button className="bg-[#2f2f2f] hover:bg-[#2f2f2f]/90 rounded-[5px] h-[37px] px-[23px] [font-family:'Poppins',Helvetica] font-medium text-white text-[15px] tracking-[0] leading-[normal]">
                Detail Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
