import { MapPinIcon, SearchIcon } from "lucide-react"; // <-- FIX: 'from'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // <-- FIX: 'from'
import { Input } from "@/components/ui/input"; // <-- FIX: 'from'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyListSection } from "./sections/CompanyListSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// --- API functions ---
import { getCompanies, addCompany } from "@/lib/api"; // <-- FIX: 'from'

// --- Merged Company Type ---
type Company = {
  id: string | number;
  name: string;
  location: string;
  founded_on: string;
  rating?: number;
  logo_url: string;
  website?: string;
  reviews?: number;
  city: string;
  created_at?: string;
};

// --- Dummy Data ---
const dummyCompanies: Company[] = [
  {
    id: "1",
    name: "Graffersid Web and App Development",
    location: "816, Shekhar Central, Manorama Ganj, AB road, New Palasia, Indore (M.P.)",
    founded_on: "01-01-2016",
    rating: 4.5,
    reviews: 41,
    logo_url: "",
    website: "graffersid.com",
    city: "Indore",
  },
  {
    id: "2",
    name: "Code Tech Company",
    location: "414, Kanha Appartment, Bhawarkua, Indore (M.P.)",
    founded_on: "01-01-2016",
    rating: 4.5,
    reviews: 0,
    logo_url: "",
    website: "codetech.com",
    city: "Indore",
  },
  {
    id: "3",
    name: "Innogent Pvt. Ltd.",
    location: "910, Shekhar Central, Manorama Ganj, AB road, New Palasia, Indore (M.P.)",
    founded_on: "01-01-2016",
    rating: 4.5,
    reviews: 0,
    logo_url: "",
    website: "innogent.com",
    city: "Indore",
  },
  {
    id: "4",
    name: "Pixel Web and App Development",
    location: "410, Bansi Trade Center, Indore (M.P.)",
    founded_on: "01-01-2016",
    rating: 4.5,
    reviews: 35,
    logo_url: "",
    website: "",
    city: "Indore",
  },
];
// --- END MODIFICATION ---

export const Home = (): JSX.Element => {
  // --- State for 'Add Company' form ---
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [foundedOn, setFoundedOn] = useState("");
  const [city, setCity] = useState("");

  // --- State for search, filtering, and sorting ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Indore, Madhya Pradesh, India");
  const [sortBy, setSortBy] = useState("name");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  // --- State for modal and submission ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- State for company list ---
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCompanies(); // ← Fetch from Supabase
      const apiData = data || []; // Ensure data is an array, even if null/undefined
      // ✅ Combine dummy data with the API data
      setCompanies([...dummyCompanies, ...apiData]);
    } catch (err: any) {
      setError("Failed to fetch companies: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchCompanies();
}, []);

const handleSaveCompany = async () => {
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
      logo_url: `https://placehold.co/95x95/6366f1/white?text=${companyName.charAt(0)}`,
      website: companyName.toLowerCase().replace(/\s+/g, "") + ".com",
      reviews: 0,
    };

    await addCompany(companyData);
   // ✅ Re-fetch updated list
    const updatedCompanies = await getCompanies();
    const apiData = updatedCompanies || []; // Ensure it's an array
    // ✅ Re-combine dummy data with the new API data
    setCompanies([...dummyCompanies, ...apiData]);

    // Reset form
    setCompanyName("");
    setLocation("");
    setFoundedOn("");
    setCity("");
    setIsAddModalOpen(false);
  } catch (err: any) {
    setError("Failed to add company: " + err.message);
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};

  // --- Handle search and filtering logic ---
  const handleFilter = () => {
    let filtered = companies;

    // --- Filtering ---
    if (selectedCity) {
      // --- !! MAIN FIX !! ---
      // This checks if the long string "Indore, Madhya Pradesh, India"
      // includes the short string "Indore". This is CORRECT.
      filtered = filtered.filter((company) =>
        selectedCity.toLowerCase().includes(company.city.toLowerCase())
      );
      // --- !! END MAIN FIX !! ---
    }
    
    if (searchQuery) {
      filtered = filtered.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // --- Sorting ---
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
        case "average":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "location":
          return a.location.localeCompare(b.location);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredCompanies(sorted);
  };

  // --- useEffect for real-time filtering and sorting ---
  useEffect(() => {
    handleFilter();
  }, [searchQuery, selectedCity, companies, sortBy]);

  return (
    <div className="bg-white w-full flex flex-col min-h-screen">
      
      {/* --- Header --- */}
      <header className="w-full bg-white shadow-[0px_2px_25px_#0000001a] px-20 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img className="w-10 h-10" alt="Frame" src="/frame-1.svg" />
          <span className="text-2xl font-bold">Review&RATE</span>
        </div>
        <div className="flex-1 max-w-96 mx-auto relative">
          <Input
            type="text"
            placeholder="Search for a company..."
            value={searchQuery}
            // --- FIX: Added event type ---
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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

      {/* Main content area */}
      <main className="flex-1 px-20 py-10">
        
        {/* --- Search/Filter/Dialog --- */}
        <div className="flex items-end gap-4 mb-6">
          
          {/* Select City */}
          <div className="flex-1 max-w-[413px]">
            <Label className="block [font-family:'Poppins',Helvetica] font-normal text-[#4a4a4a] text-sm tracking-[0] leading-[normal] mb-2">
              Select City
            </Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter city to filter..."
                value={selectedCity}
                // --- FIX: Added event type ---
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedCity(e.target.value)}
                className="w-full h-[37px] bg-white rounded-[5px] border border-solid border-[#cdcdcd] pl-3 pr-10 [font-family:'Poppins',Helvetica] font-normal text-black text-[15px]"
              />
              <MapPinIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-purple-600" />
            </div>
          </div>

          {/* --- "Find Company" Button --- */}
          <Button
            onClick={handleFilter}
            className="h-[37px] px-4 rounded-[5px] bg-[linear-gradient(137deg,rgba(209,0,243,1)_0%,rgba(0,43,197,1)_100%)] [font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal] border-0"
          >
            Find Company
          </Button>

          {/* --- Add Company Dialog --- */}
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
                <DialogDescription className="text-center text-sm text-gray-500">
                  Fill in the form below to add a new company to the directory.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 relative z-10">
                {/* ... (Form inputs) ... */}
                <div>
                  <Label className="block text-sm text-gray-600 mb-1">
                    Company name
                  </Label>
                  <Input
                    placeholder="Enter..."
                    value={companyName}
                    // --- FIX: Added event type ---
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
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
                      // --- FIX: Corrected typo and added event type ---
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
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
                      type="date"
                      value={foundedOn}
                      // --- FIX: Added event type ---
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFoundedOn(e.target.value)}
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
                    // --- FIX: Added event type ---
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>
              <Button
                type="submit"
                onClick={handleSaveCompany}
                disabled={isSubmitting}
                className="w-full mt-6 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium py-2 hover:opacity-90 transition-all"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogContent>
          </Dialog>

          {/* --- 'Sort' Select --- */}
          <div className="ml-auto">
            <Label className="block [font-family:'Poppins',Helvetica] font-normal text-[#4a4a4a] text-sm tracking-[0] leading-[normal] mb-2">
              Sort:
            </Label>
            <Select
              defaultValue="name"
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger 
                className="w-[154px] h-[37px] bg-white rounded-[5px] border border-solid border-[#cdcdcd] [font-family:'Poppins',Helvetica] font-medium text-black text-[15px]"
              >
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

        {/* --- Result Count --- */}
        <p className="text-sm text-gray-600 my-6 font-[Poppins]">
          Result Found: {filteredCompanies.length}
        </p>

        {/* --- Company List --- */}
        <div className="flex flex-col gap-6">
          {loading && <p>Loading companies...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && filteredCompanies.length === 0 && (
            <p>
              No companies found. Try adjusting your search or be the first to
              add one!
            </p>
          )}
          {!loading &&
            !error &&
            filteredCompanies.map((company) => (
              <CompanyListSection key={company.id} company={company} />
            ))}
        </div>
      </main>
    </div>
  );
};