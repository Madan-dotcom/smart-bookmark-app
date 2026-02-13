"use client";

import { supabase } from "./lib/supabaseClient";

export default function Home() {
   const loginWithGoogle = async () => {
      await supabase.auth.signInWithOAuth({
         provider: "google",
      });
   };

   return (
      <main className='min-h-screen flex flex-col items-center justify-center max-w-lg mx-auto gap-6'>
         <h1 className='text-2xl font-bold text-center'>Welcome to Smart Bookmark App</h1>
         <button onClick={loginWithGoogle} className='bg-black text-white px-6 py-3 rounded'>
            Login with Google
         </button>
      </main>
   );
}
