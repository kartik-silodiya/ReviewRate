// src/screens/Home/sections/CompanyListSection.tsx

import { Link } from "react-router-dom";
import { MapPinIcon } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

type Company = {
  id: string | number;
  name: string;
  location: string;
  founded_on: string;
  rating?: number;
  logo_url: string; // For your own manually uploaded logos
  website?: string;  // e.g., "google.com" (This is required for Logo.dev)
  reviews?: number; 
};

type CompanyCardProps = {
  company: Company;
};

// Your placeholder logo
const placeholderLogo = "https://placehold.co/80x80/6366f1/white?text=Logo";

// Your API key from the .env file
const LOGO_DEV_API_KEY = import.meta.env.VITE_LOGO_DEV_KEY;


export const CompanyListSection = ({ company }: CompanyCardProps): JSX.Element => {
  // Star logic (unchanged)
  const totalStars = 5;
  const filledStars = Math.round(company.rating ?? 0);
  const stars = Array.from({ length: totalStars }, (_, i) => ({
    filled: i < filledStars,
    src: i < filledStars ? "/fa-solid-star-1.svg" : "/fa-solid-star.svg",
  }));

  
  const logoSrc = company.logo_url
    ? company.logo_url
    : (company.website && LOGO_DEV_API_KEY) // Check if website and key exist
    ? `https://img.logo.dev/${company.website}?token=${LOGO_DEV_API_KEY}`
    : placeholderLogo;

  // --- END MODIFICATION ---

  return (
    <section className="w-full">
      <Card className="bg-white rounded-xl shadow-[0px_0px_15px_#0000001a] hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-5 flex items-center gap-5">
          {/* Company Logo */}
          <div className="relative flex-shrink-0">
            <img
              className="w-[80px] h-[80px] rounded-md object-contain"
              alt={`${company.name} Logo`}
              src={logoSrc}
              // --- THIS ERROR HANDLER IS CRUCIAL ---
              // If Logo.dev can't find a logo (404), it will fall back to your placeholder
              onError={(e) => {
                (e.target as HTMLImageElement).src = placeholderLogo;
              }}
              // --- END ERROR HANDLING ---
            />
          </div>

          {/* Company Info (Rest of your component is unchanged) */}
          <div className="flex-1 flex flex-col gap-2">
            {/* ... (rest of your component) ... */}
            {/* Header Row */}
            <div className="flex items-start justify-between">
              <h2 className="font-[Poppins] font-medium text-black text-lg leading-tight">
                {company.name}
              </h2>
              <span className="font-[Poppins] text-[#757575] text-xs whitespace-nowrap">
                Founded on&nbsp;{company.founded_on}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-[#757575] text-[13px]">
              <MapPinIcon className="w-[13px] h-[13px]" />
              <p className="truncate">{company.location}</p>
            </div>

            {/* Rating + Button Row */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <span className="font-[Poppins] font-semibold text-black text-[15px]">
                  {(company.rating ?? 0).toFixed(1)}
                </span>

                <div className="flex items-center gap-[3px]">
                  {stars.map((star, index) => (
                    <img
                      key={index}
                      className="w-[16px] h-[15px]"
                      alt="star"
                      src={star.src}
                    />
                  ))}
                </div>

                {/* Review count */}
                {company.reviews && (
                  <span className="text-[#757575] text-sm ml-1">
                    {company.reviews} Reviews
                  </span>
                )}
              </div>

              {/* Detail Review Button */}
              <Link to={`/company/${company.id}`}>
                <Button className="bg-[#2f2f2f] hover:bg-[#2f2f2f]/90 text-white rounded-[6px] font-[Poppins] font-medium text-[14px] h-[36px] px-[22px] transition-transform hover:scale-[1.03]">
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