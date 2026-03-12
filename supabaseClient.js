const SUPABASE_URL = "https://ugbierbtxvwxtjnnhovg.supabase.co";
const SUPABASE_KEY = "sb_publishable_RGW9ijQfKqTa2te2FhpsBw_bxA7Mkrp";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Supabase connected");