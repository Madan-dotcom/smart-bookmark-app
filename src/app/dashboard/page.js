"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
   const router = useRouter();

   const [user, setUser] = useState(null);
   const [title, setTitle] = useState("");
   const [url, setUrl] = useState("");
   const [bookmarks, setBookmarks] = useState([]);

   const fetchBookmarks = async (userId) => {
      const { data } = await supabase.from("bookmarks").select("*").eq("user_id", userId).order("created_at", { ascending: false });

      setBookmarks(data || []);
   };

   useEffect(() => {
      const loadUser = async () => {
         const { data } = await supabase.auth.getUser();

         if (!data.user) {
            router.push("/");
            return;
         }

         setUser(data.user);
         fetchBookmarks(data.user.id);
      };

      loadUser();
   }, [router]);

   const addBookmark = async () => {
      if (!title || !url || !user) return;

      await supabase.from("bookmarks").insert([
         {
            title,
            url,
            user_id: user.id,
         },
      ]);

      setTitle("");
      setUrl("");
      fetchBookmarks(user.id);
   };

   const deleteBookmark = async (id) => {
      await supabase.from("bookmarks").delete().eq("id", id);

      fetchBookmarks(user.id);
   };

   return (
      <div className='p-10'>
         <h1 className='text-2xl font-bold mb-6'>Welcome {user?.email}</h1>

         <div className='flex flex-col gap-4 max-w-md mb-10'>
            <input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} className='border p-2 rounded' />

            <input placeholder='URL' value={url} onChange={(e) => setUrl(e.target.value)} className='border p-2 rounded' />

            <button onClick={addBookmark} className='bg-black text-white p-2 rounded cursor-pointer'>
               Add Bookmark
            </button>
         </div>

         <h2 className='text-xl font-semibold mb-4'>Saved Bookmarks</h2>
         <ul className='space-y-3'>
            {bookmarks.map((b) => (
               <li key={b.id} className='border p-3 rounded flex justify-between items-center cursor-pointer'>
                  <a href={b.url} target='_blank' className='text-blue-600'>
                     {b.title}
                  </a>

                  <button onClick={() => deleteBookmark(b.id)} className='bg-red-500 text-white px-3 py-1 rounded cursor-pointer'>
                     Delete
                  </button>
               </li>
            ))}
         </ul>
      </div>
   );
}
