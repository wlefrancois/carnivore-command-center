import { createClient } from "/js/vendor/supabase.js";

const SUPABASE_URL = "https://ridxjmwuepoaefidacda.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_OB9EHyTG5q86PNJpgXB89w_g_VzCV2Y";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function signUp(email, password) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://carnivorecommandcenter.com/app/"
    }
  });
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
async function applyAuthNav(){
  const { data } = await supabase.auth.getSession();

  if(data?.session){
    document.body.classList.add("is-logged-in");
  }
}

applyAuthNav();
