import { MapPinIcon, SearchIcon } from "lucide-react";
import { useState, useEffect } from "react"; // No change here
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { CompanyListSection } from "./sections/CompanyListSection";
import { HeaderSection } from "./sections/HeaderSection";
import { ResultCountSection } from "./sections/ResultCountSection";
import { SearchAndFilterSection } from "./sections/SearchAndFilterSection";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";


// --- 1. Import your API functions ---
import { getCompanies, addCompany } from "@/lib/api"; // Assuming relative path is '@/lib/api'


// --- Company Type (same as before) ---
type Company = {
  id: string | number;
  name: string;
  location: string;
  founded_on: string;
  rating: number;
  logo_url: string;
  // Add any other fields your API returns
  city: string;
  created_at: string;
};


export const Home = (): JSX.Element => {
  // --- State for 'Add Company' form (Original) ---
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [foundedOn, setFoundedOn] = useState("");
  const [city, setCity] = useState("");


  // --- 2. Add state to control the 'Add Company' modal ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // To disable button


  // --- State for company list (Original) ---
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for errors


  // --- 3. UPDATED 'handleSaveCompany' function ---
  const handleSaveCompany = async () => {
    // Basic validation
    if (!companyName || !location || !city || !foundedOn) {
      alert("Please fill out all fields.");
      return;
    }


    setIsSubmitting(true);
    try {
      const companyData = {
        name: companyName,
        location,
        city,
        founded_on: foundedOn,
        // Add any other default fields your DB requires
        description: "No description provided.",
        logo_url: "https://placehold.co/95x95/6366f1/white?text=G"
      };


      // Call the API function
      const newCompany = await addCompany(companyData);


      // --- This is the REAL-TIME update ---
      // Add the new company to the top of the existing list
      setCompanies([newCompany, ...companies]);


      // Clear the form and close the modal
      setCompanyName("");
      setLocation("");
      setFoundedOn("");
      setCity("");
      setIsAddModalOpen(false); // Close the modal
    } catch (err: any) {
      setError("Failed to add company: " + err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- Fetch companies (Original, but now uses getCompanies) ---
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        // We'll use a null search term to get all companies
        const data = await getCompanies(null);
        setCompanies(data || []);
      } catch (err: any) {
        setError("Failed to fetch companies: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };


    fetchCompanies();
  }, []); // Empty array means this runs once on load


  return (
    <div className="bg-white w-full flex flex-col">
      {/* --- Header (Original) --- */}
      <header className="w-full bg-white shadow-[0px_2px_25px_#0000001a] px-20 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img className="w-10 h-10" alt="Frame" src="/frame-1.svg" />
          <span className="text-2xl font-bold">Review&RATE</span>
        </div>
        <div className="flex-1 max-w-96 mx-auto relative">
          <Input
            type="text"
            placeholder="Search..."
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
        {/* --- Search/Filter/Dialog (Original) --- */}
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


          {/* --- 4. Connect Dialog to state --- */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-[37px] px-2.5 rounded-[5px] bg-[linear-gradient(137deg,rgba(209,0,243,1)_0%,rgba(0,43,197,1)_100%)] [font-family:'Poppins',Helvetica] font-medium text-white text-[15px] tracking-[0] leading-[normal] border-0">
                + Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border-0 shadow-lg sm:max-w-[430px] w-[90%] max-h-[90vh] px-6 py-8 bg-white">
              <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 opacity-80 blur-2xl" />
              <div className="absolute -top-14 left-10 w-16 h-16 rounded-full bg-purple-300 opacity-60 blur-xl" />
              <DialogHeader className="relative z-10 mb-6">
                <DialogTitle className="text-2xl font-semibold text-center text-black">
                  Add Company
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 relative z-10">
                <div>
                  <Label className="block text-sm text-gray-600 mb-1">
                    Company name
                  </Label>
                  <Input
                    placeholder="Enter..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <Label className="block text-sm text-gray-600 mb-1">
                    Location
                  </Label>
                  <div className="relative">
                    <MapPinIcon
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <Input
                      placeholder="Select Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-600 mb-1">
                    Founded on
                  </Label>
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10m-9 8h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <Input
                      placeholder="DD/MM/YYYY or YYYY-MM-DD"
                      type="date" // Use date type for better UX
                      value={foundedOn}
                      onChange={(e) => setFoundedOn(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-600 mb-1">
                    City
                  </Label>
                  <Input
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>
              <Button
                type="submit"
                onClick={handleSaveCompany}
                disabled={isSubmitting} // Disable button while saving
                className="w-full mt-6 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium py-2 hover:opacity-90 transition-all"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogContent>
          </Dialog>


          {/* --- 'Sort' Select (Original) --- */}
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
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="location">Location</SelectItem>

              </SelectContent>
            </Select>
          </div>
        </div>


        <div className="w-full h-px bg-gray-300 mb-6" />


        {/* --- Other Sections (Original) --- */}
        <ResultCountSection />
        <HeaderSection />
        <SearchAndFilterSection />


        {/* --- Company List (Original, but now with error handling) --- */}
        <div className="flex flex-col gap-6 mt-6">
          {loading && <p>Loading companies...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && companies.length === 0 && (
            <p>No companies found. Be the first to add one!</p>
          )}
          {!loading && !error &&
            companies.map((company) => (
              <CompanyListSection key={company.id} company={company} />
            ))}
        </div>
      </main>
    </div>
  );
};
