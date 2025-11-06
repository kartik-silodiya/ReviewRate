// CompanyDetailPage.tsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getCompanyById,
  getReviewsForCompany,
  getAverageRating,
  addReview,
  likeReview,
} from '../../lib/api'; // Adjust path if needed

// --- Import Icons ---
import {
  MapPinIcon,
  StarIcon,
  PlusIcon,
  StarHalfIcon,
  UserCircleIcon,
  SearchIcon,
  ThumbsUpIcon,
  Share2Icon,
} from 'lucide-react';

// --- Import UI Components ---
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// --- NEW: Import Select components ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// --- END NEW ---

// --- Define Types ---
type Company = {
  id: number;
  name: string;
  location: string;
  city: string;
  founded_on: string;
  description: string;
  likes?: number;
  likedByUser?: boolean;
};

type Review = {
  id: number;
  full_name: string;
  subject: string;
  review_text: string;
  rating: number;
  created_at: string;
  likes_count?: number;
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
        />
      ))}
    </div>
  );
};

export const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // --- State for Data ---
  const [company, setCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]); // The raw list from API
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for "Add Review" Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewSubject, setNewReviewSubject] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);

  const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set());

  // --- NEW: State for sorting ---
  const [sortBy, setSortBy] = useState('date'); // 'date', 'rating_desc', 'rating_asc', 'likes'
  const [sortedReviews, setSortedReviews] = useState<Review[]>([]); // The list to be rendered
  // --- END NEW ---

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
        setReviews(reviewsData || []); // <-- Set the raw review list
        setAverageRating(avgRatingData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [id]);

  // --- NEW: Effect for Sorting Reviews ---
  useEffect(() => {
    const sortReviews = () => {
      const reviewsCopy = [...reviews]; // Create a copy to sort
      
      reviewsCopy.sort((a, b) => {
        switch (sortBy) {
          case 'rating_desc':
            return b.rating - a.rating;
          case 'rating_asc':
            return a.rating - b.rating;
          case 'likes':
            return (b.likes_count ?? 0) - (a.likes_count ?? 0);
          case 'date':
          default:
            // Newest first
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
      setSortedReviews(reviewsCopy); // <-- Set the new sorted list
    };

    sortReviews();
  }, [reviews, sortBy]); // Re-run when the source list or sort criteria changes
  // --- END NEW ---


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

      await addReview(reviewData, id);

      const [reviewsData, avgRatingData] = await Promise.all([
        getReviewsForCompany(id),
        getAverageRating(id),
      ]);
      setReviews(reviewsData || []); // <-- Update the raw list
      setAverageRating(avgRatingData);

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

  // --- Function to Handle Liking a Review ---
  const handleLikeReview = async (reviewId: number) => {
    if (likedReviews.has(reviewId)) return;

    setLikedReviews(prev => new Set(prev).add(reviewId));
    
    // Update the raw list
    const newReviews = reviews.map(r =>
      r.id === reviewId ? { ...r, likes_count: (r.likes_count || 0) + 1 } : r
    );
    setReviews(newReviews); // This will trigger the sorting useEffect

    try {
      await likeReview(reviewId);
    } catch (err) {
      console.error("Failed to like review:", err);
      // Rollback on failure
      setLikedReviews(prev => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
       const rolledBackReviews = reviews.map(r =>
        r.id === reviewId ? { ...r, likes_count: (r.likes_count || 0) - 1 } : r
      );
      setReviews(rolledBackReviews); // This will also trigger the sorting useEffect
    }
  };


  // --- Function to Handle Sharing a Review ---
  const handleShareReview = async (review: Review) => {
    if (!company) return;

    const shareData = {
      title: `Review for ${company.name} by ${review.full_name}`,
      text: `"${review.subject}: ${review.review_text}"`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Share not supported on this browser. Link copied to clipboard!");
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
      {/* ... (Header and Back to Home link remain the same) ... */}
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

      <div className="max-w-4xl mx-auto my-4">
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
                  <DialogContent className="sm:max-w-md p-8 bg-white rounded-lg shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-center font-bold">Add Review</DialogTitle>
                    </DialogHeader>

                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter"
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Enter"
                          value={newReviewSubject}
                          onChange={(e) => setNewReviewSubject(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="review" className="text-sm font-medium">Enter your Review</Label>
                        <Textarea
                          id="review"
                          placeholder="Description"
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Rating</h3>
                        <div className="flex items-center gap-4">
                          <StarRatingInput rating={newReviewRating} setRating={setNewReviewRating} />
                          <span className="text-sm text-gray-500">Satisfied</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                      <Button
                        type="submit"
                        onClick={handleReviewSubmit}
                        disabled={isSubmitting}
                        className="w-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg py-2 text-lg font-semibold"
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                {/* --- End Modal --- */}
              </div>
            </div>
          </div>

          {/* --- Review List --- */}
          <div className="mt-8 pt-6 border-t">
            {/* --- NEW: Header with Sort Dropdown --- */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Result Found: {reviews.length}
              </h2>
              <div className="flex items-center gap-2">
                 <Label htmlFor="sort-reviews" className="text-sm font-medium text-gray-700">Sort by:</Label>
                 <Select value={sortBy} onValueChange={setSortBy}>
                   <SelectTrigger id="sort-reviews" className="w-[180px] bg-white">
                     <SelectValue placeholder="Sort by" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="date">Newest First</SelectItem>
                     <SelectItem value="rating_desc">Rating: High to Low</SelectItem>
                     <SelectItem value="rating_asc">Rating: Low to High</SelectItem>
                     <SelectItem value="likes">Most Liked</SelectItem>
                   </SelectContent>
                 </Select>
              </div>
            </div>
            {/* --- END NEW --- */}

            <div className="space-y-6">
              {/* --- NEW: Map over sortedReviews --- */}
              {reviews.length > 0 ? (
                sortedReviews.map((review) => (
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
                      {/* --- ACTION BUTTONS --- */}
                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() => handleLikeReview(review.id)}
                          disabled={likedReviews.has(review.id)}
                          className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 disabled:text-blue-600 disabled:opacity-70 transition-colors"
                        >
                          <ThumbsUpIcon
                            className={`w-4 h-4 ${likedReviews.has(review.id) ? 'fill-blue-600 text-blue-600' : ''
                              }`}
                          />
                          <span className="text-sm font-medium">
                            {review.likes_count || 0}
                          </span>
                        </button>
                        <button
                          onClick={() => handleShareReview(review)}
                          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          <Share2Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  Be the first to leave a review!
                </p>
              )}
              {/* --- END NEW --- */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};