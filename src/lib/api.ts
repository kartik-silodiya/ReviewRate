// src/lib/api.ts

// Note: Your file is .js, so you might need to adjust the import.
// If supabaseClient.js doesn't have a 'default' export,
// use: import { supabase } from '../supabaseClient';
import { supabase } from '@/supabaseClient';

export async function getCompanies(searchTerm: any = "") {
  let query = supabase.from("companies").select("*");

  // Only filter if a term is given
  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}


// 2. FOR YOUR "ADD COMPANY" FORM
export async function addCompany(companyData: any) {
  // companyData should be an object like:
  // { name: "...", location: "...", city: "..." }
  const { data, error } = await supabase.from('companies').insert(companyData).select();
  if (error) throw error;
  return data[0];
}

// 3. FOR YOUR "COMPANY DETAIL" PAGE (to get reviews)
export async function getReviewsForCompany(companyId: string, sortBy = 'created_at') {
  let ascending = false;
  if (sortBy === 'rating') ascending = false; // Highest rating first
  if (sortBy === 'created_at') ascending = false; // Newest first

  const { data, error } = await supabase
    .from('reviews')
    .select('*') // Get all review details
    .eq('company_id', companyId) // Only for this company
    .order(sortBy, { ascending: ascending });

  if (error) throw error;
  return data;
}

// 4. FOR YOUR "ADD REVIEW" FORM
export async function addReview(reviewData: any, companyId: any) {
  // reviewData should be an object like:
  // { full_name: "...", subject: "...", rating: 5, review_text: "..." }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      ...reviewData,
      company_id: companyId // Make sure to link the review!
    })
    .select();

  if (error) throw error;
  return data[0];
}

// 5. FOR YOUR "COMPANY DETAIL" PAGE (to get average)
export async function getAverageRating(companyId: string) {
  const { data, error } = await supabase.rpc('get_average_rating', {
    company_id_in: companyId,
  });
  if (error) throw error;
  return data;
}

// 6. FOR YOUR "COMPANY DETAIL" PAGE (to get the company's own info)
export async function getCompanyById(companyId: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId) // Get the one company that matches the ID
    .maybeSingle(); // <-- THIS IS THE FIX (was .single())

  if (error) throw error;
  return data;
}

export const likeReview = async (reviewId: number) => {
  const { error } = await supabase.rpc('increment_like', { 
    review_id_to_inc: reviewId 
  });

  if (error) {
    console.error('Error incrementing like:', error);
    throw new Error(error.message);
  }
};