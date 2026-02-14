"use client";

import { supabase } from "./lib/supabaseClient";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
   const loginWithGoogle = async () => {
      await supabase.auth.signInWithOAuth({
         provider: "google",
         options: {
            redirectTo: `${window.location.origin}/dashboard`,
            queryParams: {
               prompt: "consent select_account",
            },
         },
      });
   };

   return (
      <main className='bg-neutral-200 min-h-screen flex items-center justify-center'>
         <div className='bg-white max-w-xl w-full flex justify-center items-center p-10 rounded shadow'>
            <div className='flex flex-col justify-center items-center gap-8'>
               <h1 className='text-black text-2xl font-bold'>Smart Bookmark App</h1>
               <button onClick={loginWithGoogle} className='border px-8 py-3 rounded cursor-pointer flex items-center gap-3 shadow-sm'>
                  <FcGoogle size={22} />
                  <span className='text-black'>Sign In with Google</span>
               </button>
            </div>
         </div>
      </main>
   );
}
