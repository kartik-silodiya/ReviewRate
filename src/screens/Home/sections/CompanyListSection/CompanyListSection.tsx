import { MapPinIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const CompanyListSection = (): JSX.Element => {
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
              src="/mask-group-3.png"
            />
            <img
              className="absolute top-[-2px] left-[-3px] w-[105px] h-[100px]"
              alt="Group"
              src="/group-11635-3.png"
            />
            <img
              className="absolute top-[16px] left-[17px] w-[66px] h-[66px]"
              alt="Ph phosphor logo"
              src="/ph-phosphor-logo-fill.svg"
            />
          </div>

          <div className="flex-1 flex flex-col gap-[14px]">
            <div className="flex items-start justify-between">
              <h2 className="[font-family:'Poppins',Helvetica] font-medium text-black text-xl tracking-[0] leading-[normal]">
                Pixel Web and App Development
              </h2>
              <div className="[font-family:'Poppins',Helvetica] font-normal text-[#757575] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                Reg. Date&nbsp;&nbsp;01-01-2016
              </div>
            </div>

            <div className="flex items-center gap-[3px]">
              <MapPinIcon className="w-[13px] h-[13px] text-[#757575] flex-shrink-0" />
              <p className="[font-family:'Poppins',Helvetica] font-normal text-[#757575] text-[13px] tracking-[0] leading-[normal]">
                410, Bansi Trade Center, Indore (M.P.)
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

              <Button className="bg-[#2f2f2f] hover:bg-[#2f2f2f]/90 text-white rounded-[5px] [font-family:'Poppins',Helvetica] font-medium text-[15px] tracking-[0] leading-[normal] h-[37px] px-[23px]">
                Detail Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
