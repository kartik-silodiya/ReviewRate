import { MapPinIcon, SearchIcon } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { CompanyListSection } from "./sections/CompanyListSection";
import { HeaderSection } from "./sections/HeaderSection";
import { ResultCountSection } from "./sections/ResultCountSection";
import { SearchAndFilterSection } from "./sections/SearchAndFilterSection";

export const Home = (): JSX.Element => {
  return (
    <div className="bg-white w-full flex flex-col">
      <header className="w-full bg-white shadow-[0px_2px_25px_#0000001a] px-20 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img className="w-10 h-10" alt="Frame" src="/frame-1.svg" />
        </div>

        <div className="flex-1 max-w-96 mx-auto relative">
          <Input
            type="text"
            placeholder="SearchIcon..."
            className="w-full h-[37px] bg-white rounded-[5px] border border-solid border-[#cdcdcd] pl-3 pr-10 [font-family:'Poppins',Helvetica] font-normal text-[#777777] text-[15px]"
          />
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-gray-400" />
        </div>

        <nav className="flex items-center gap-[109px]">
          <button className="[font-family:'Poppins',Helvetica] font-normal text-black text-[17px] tracking-[0] leading-[normal]">
            SignUp
          </button>
          <button className="[font-family:'Poppins',Helvetica] font-normal text-black text-[17px] tracking-[0] leading-[normal]">
            Login
          </button>
        </nav>
      </header>

      <main className="flex-1 px-20 py-10">
        <div className="flex items-end gap-4 mb-6">
          <div className="flex-1 max-w-[413px]">
            <label className="block [font-family:'Poppins',Helvetica] font-normal text-[#4a4a4a] text-sm tracking-[0] leading-[normal] mb-2">
              Select City
            </label>
            <div className="relative">
              <Input
                type="text"
                defaultValue="Indore, Madhya Pradesh, India"
                className="w-full h-[37px] bg-white rounded-[5px] border border-solid border-[#cdcdcd] pl-3 pr-10 [font-family:'Poppins',Helvetica] font-normal text-black text-[15px]"
              />
              <MapPinIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-gray-600" />
            </div>
          </div>

          <Button className="h-[37px] px-4 rounded-[5px] bg-[linear-gradient(137deg,rgba(209,0,243,1)_0%,rgba(0,43,197,1)_100%)] [font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal] border-0">
            Find Company
          </Button>

          <Button className="h-[37px] px-2.5 rounded-[5px] bg-[linear-gradient(137deg,rgba(209,0,243,1)_0%,rgba(0,43,197,1)_100%)] [font-family:'Poppins',Helvetica] font-medium text-white text-[15px] tracking-[0] leading-[normal] border-0">
            + Add Company
          </Button>

          <div className="ml-auto">
            <label className="block [font-family:'Poppins',Helvetica] font-normal text-[#4a4a4a] text-sm tracking-[0] leading-[normal] mb-2">
              Sort:
            </label>
            <Select defaultValue="name">
              <SelectTrigger className="w-[154px] h-[37px] bg-white rounded-[5px] border border-solid border-[#cdcdcd] [font-family:'Poppins',Helvetica] font-medium text-black text-[15px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full h-px bg-gray-300 mb-6" />

        <ResultCountSection />
        <HeaderSection />
        <SearchAndFilterSection />
        <CompanyListSection />
      </main>
    </div>
  );
};
