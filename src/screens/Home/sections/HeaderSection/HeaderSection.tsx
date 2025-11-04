import { MapPinIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const HeaderSection = (): JSX.Element => {
  const stars = [
    { filled: true, src: "/fa-solid-star-1.svg" },
    { filled: true, src: "/fa-solid-star-1.svg" },
    { filled: true, src: "/fa-solid-star-1.svg" },
    { filled: true, src: "/fa-solid-star-1.svg" },
    { filled: false, src: "/fa-solid-star.svg" },
  ];

  return (
    <Card className="w-full rounded-[10px] shadow-[0px_0px_25px_#0000001a]">
      <CardContent className="p-[23px] relative">
        <div className="flex items-start gap-6">
          <div className="relative w-[95px] h-[95px] flex-shrink-0">
            <img
              className="w-full h-full object-cover"
              alt="Mask group"
              src="/mask-group-1.png"
            />
            <img
              className="absolute top-0 left-0 w-full h-full"
              alt="Group"
              src="/group-11635-1.png"
            />
          </div>

          <div className="flex-1 flex flex-col gap-[11px]">
            <div className="flex items-start justify-between">
              <h2 className="[font-family:'Poppins',Helvetica] font-medium text-black text-xl tracking-[0] leading-[normal]">
                Code Tech Company
              </h2>
              <div className="[font-family:'Poppins',Helvetica] font-normal text-[#757575] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                Reg. Date&nbsp;&nbsp;01-01-2016
              </div>
            </div>

            <div className="flex items-start gap-[3px]">
              <MapPinIcon className="mt-[3px] w-[13px] h-[13px] text-[#757575] flex-shrink-0" />
              <p className="[font-family:'Poppins',Helvetica] font-normal text-[#757575] text-[13px] tracking-[0] leading-[normal]">
                414, Kanha Appartment, Bhawarkua, Indore (M.P.)
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
              </div>

              <Button className="bg-[#2f2f2f] hover:bg-[#2f2f2f]/90 text-white rounded-[5px] h-[37px] px-[23px] [font-family:'Poppins',Helvetica] font-medium text-[15px] tracking-[0] leading-[normal]">
                Detail Review
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
