import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getCompanyById,
  getReviewsForCompany,
  getAverageRating,
  addReview, // We need this new API function
} from '../../lib/api'; // Adjust path if needed

// --- Import Icons ---
import { MapPinIcon, StarIcon, PlusIcon, StarHalfIcon, UserCircleIcon, SearchIcon } from 'lucide-react';

// --- Import UI Components ---
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// --- Define Types ---
type Company = {
  id: number;
  name: string;
  location: string;
  city: string;
  founded_on: string;
  description: string;
  // ... any other company fields
};

type Review = {
  id: number;
  full_name: string;
  subject: string;
  review_text: string;
  rating: number;
  created_at: string;
};

// --- Helper Component for Star Rating Display ---
const StarRatingDisplay = ({ rating, reviewCount }: { rating: number, reviewCount?: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4; // Check for half star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalfStar && <StarHalfIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-gray-300" />
      ))}
      {reviewCount !== undefined && (
        <span className="ml-2 text-sm text-gray-600">
          ({reviewCount} Reviews)
        </span>
      )}
    </div>
  );
};

// --- Helper Component for Star Rating Input ---
const StarRatingInput = ({ rating, setRating }: { rating: number, setRating: (rating: number) => void }) => {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`w-7 h-7 cursor-pointer ${star <= rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300 hover:text-gray-400'
            }`}
          onClick={() => setRating(star)}
          onMouseEnter={() => { /* can add hover effect here */ }}
          onMouseLeave={() => { /* can remove hover effect here */ }}
        />
      ))}
    </div>
  );
};


export const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // --- State for Data ---
  const [company, setCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for "Add Review" Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReviewName, setNewReviewName] = useState(""); // Added Name
  const [newReviewSubject, setNewReviewSubject] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);

  // --- Data Loading Effect ---
  useEffect(() => {
    if (!id) {
      setError('No company ID provided.');
      setLoading(false);
      return;
    }

    const loadCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [companyData, reviewsData, avgRatingData] = await Promise.all([
          getCompanyById(id),
          getReviewsForCompany(id),
          getAverageRating(id),
        ]);

        setCompany(companyData);
        setReviews(reviewsData || []);
        setAverageRating(avgRatingData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [id]);

  // --- Function to Handle Review Submission ---
  const handleReviewSubmit = async () => {
    if (!id || newReviewRating === 0 || !newReviewSubject || !newReviewText || !newReviewName) {
      alert("Please fill out all fields and select a rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        full_name: newReviewName,
        subject: newReviewSubject,
        review_text: newReviewText,
        rating: newReviewRating,
      };

      // 1. Add the new review
      await addReview(reviewData, id);

      // 2. Refresh all data to show the new review and rating
      const [reviewsData, avgRatingData] = await Promise.all([
        getReviewsForCompany(id),
        getAverageRating(id),
      ]);
      setReviews(reviewsData || []);
      setAverageRating(avgRatingData);

      // 3. Reset form and close modal
      setIsModalOpen(false);
      setNewReviewName("");
      setNewReviewSubject("");
      setNewReviewText("");
      setNewReviewRating(0);

    } catch (err: any) {
      setError("Failed to submit review: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-lg text-red-600 mb-4">Error: {error}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-lg mb-4">Company not found.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  // --- Main Page Render ---
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <header className="w-full bg-white shadow-[0px_2px_25px_#0000001a] px-20 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img className="w-10 h-10" alt="Frame" src="/frame-1.svg" />
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

      <div className="max-w-4xl mx-auto mb-4">
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">

          {/* --- Company Header --- */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img
              src="https://placehold.co/95x95/6366f1/white?text=G"
              alt="Company Logo"
              className="w-[95px] h-[95px] rounded-lg border flex-shrink-0"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/95x95/6366f1/white?text=G')}
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {company.name}
                </h1>
                <span className="text-sm text-gray-500 mt-1 md:mt-0 flex-shrink-0">
                  Founded on: {new Date(company.founded_on).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPinIcon className="w-4 h-4" />
                <span>{company.location}, {company.city}</span>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{averageRating ? averageRating.toFixed(1) : 'N/A'}</span>
                  <StarRatingDisplay
                    rating={averageRating || 0}
                    reviewCount={reviews.length}
                  />
                </div>

                {/* --- Add Review Button & Modal --- */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-center">Add Review</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="Your Name"
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          placeholder="Review Title"
                          value={newReviewSubject}
                          onChange={(e) => setNewReviewSubject(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="review" className="text-right">
                          Review
                        </Label>
                        <Textarea
                          id="review"
                          placeholder="Type your review here."
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-1">
                          Rating
                        </Label>
                        <div className="col-span-3">
                          <StarRatingInput rating={newReviewRating} setRating={setNewReviewRating} />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isSubmitting}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" onClick={handleReviewSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* --- End Modal --- */}

              </div>
            </div>
          </div>

          {/* --- Review List --- */}
          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">
              Result Found: {reviews.length}
            </h2>
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-4">
                    <UserCircleIcon className="w-10 h-10 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{review.full_name}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleString()}
                          </p>
                        </div>
                        <StarRatingDisplay rating={review.rating} />
                      </div>
                      <h4 className="font-medium mt-2">{review.subject}</h4>
                      <p className="mt-1 text-gray-700">
                        {review.review_text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  Be the first to leave a review!
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};