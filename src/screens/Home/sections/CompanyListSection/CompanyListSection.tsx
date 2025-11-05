// src/screens/Home/sections/CompanyListSection.tsx

import { Link } from "react-router-dom"; // 1. Import Link
import { MapPinIcon } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

// 2. Define the Company type (you can move this to a shared types file)
type Company = {
  id: string | number;
  name: string;
  location: string;
  founded_on: string;
  rating?: number;
  logo_url: string; // We'll use this for the image
};

// 3. Define the props our component will receive
type CompanyCardProps = {
  company: Company;
};

// 4. Update the function to accept 'company' as a prop
export const CompanyListSection = ({
  company,
}: CompanyCardProps): JSX.Element => {
  // This logic should also be dynamic, but we'll leave it for now
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
            {/* 5. Use dynamic image data */}
            <img
              className="w-[95px] h-[95px]"
              alt="Company Logo"
              src={company.logo_url || 'https://placehold.co/95x95/6366f1/white?text=G'}
            />

            {/* You can remove the other 2 decorative img tags if they aren't needed */}
          </div>

          <div className="flex-1 flex flex-col gap-[14px]">
            <div className="flex items-start justify-between">
              {/* 6. Use dynamic name */}
              <h2 className="[font-family:'Poppins',Helvetica] font-medium text-black text-xl tracking-[0] leading-[normal]">
                {company.name}
              </h2>
              {/* 7. Use dynamic date */}
              <div className="[font-family:'Poppins',Helvetica] font-normal text-[#757575] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                Reg. Date&nbsp;&nbsp;{company.founded_on}
              </div>
            </div>

            <div className="flex items-center gap-[3px]">
              <MapPinIcon className="w-[13px] h-[13px] text-[#757575] flex-shrink-0" />
              {/* 8. Use dynamic location */}
              <p className="[font-family:'Poppins',Helvetica] font-normal text-[#757575] text-[13px] tracking-[0] leading-[normal]">
                {company.location}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {/* 9. Use dynamic rating */}
                <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-base tracking-[0] leading-[normal]">
                  {(company.rating ?? 0).toFixed(1)}

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

              {/* 10. Wrap the Button in the Link component */}
              <Link to={`/company/${company.id}`}>
                <Button className="bg-[#2f2f2f] hover:bg-[#2f2f2f]/90 text-white rounded-[5px] [font-family:'Poppins',Helvetica] font-medium text-[15px] tracking-[0] leading-[normal] h-[37px] px-[23px]">
                  Detail Review
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};