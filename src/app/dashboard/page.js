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
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const [deleteId, setDeleteId] = useState(null);
   const [showDeleteModal, setShowDeleteModal] = useState(false);

   /* ---------- Fetch Bookmarks ---------- */
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

         supabase
            .channel("bookmarks-channel")
            .on("postgres_changes", { event: "*", schema: "public", table: "bookmarks" }, () => fetchBookmarks(data.user.id))
            .subscribe();
      };

      loadUser();
   }, [router]);

   /* ---------- Add Bookmark ---------- */
   const addBookmark = async () => {
      setError("");

      if (!title.trim() || !url.trim()) {
         setError("⚠ Please enter both Title and URL");
         return;
      }

      if (!user) return;

      setLoading(true);

      await supabase.from("bookmarks").insert([
         {
            title: title.trim(),
            url: url.trim(),
            user_id: user.id,
         },
      ]);

      setTitle("");
      setUrl("");
      setLoading(false);

      fetchBookmarks(user.id);
   };

   /* ---------- Delete Popup ---------- */
   const deleteBookmark = (id) => {
      setDeleteId(id);
      setShowDeleteModal(true);
   };

   const confirmDelete = async () => {
      if (!deleteId) return;

      await supabase.from("bookmarks").delete().eq("id", deleteId);

      setShowDeleteModal(false);
      setDeleteId(null);

      fetchBookmarks(user.id);
   };

   /* ---------- Logout ---------- */
   const logout = async () => {
      await supabase.auth.signOut();
      router.push("/");
   };

   return (
      <div className='p-10 max-w-7xl mx-auto my-20'>
         {/* Header */}
         <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center items-center text-center gap-3 mb-8'>
            <h1 className='text-2xl font-bold leading-tight'>
               <span className='block sm:inline'>Welcome,</span>{" "}
               <span className='block sm:inline whitespace-nowrap'>Hello {user?.user_metadata?.full_name || user?.email} 👋</span>
            </h1>
            <button onClick={logout} className='bg-gray-800 text-white px-4 py-2 rounded cursor-pointer'>
               Logout
            </button>
         </div>

         {/* Form */}
         <div className='flex flex-col gap-6 max-w-md mb-10'>
            <input
               placeholder='Title'
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className='border-2 p-2 rounded capitalize'
            />

            <input
               placeholder='URL'
               value={url}
               onChange={(e) => setUrl(e.target.value)}
               className='border-2 border-gray-300 hover:border-gray-500 transition-colors duration-300 p-2 rounded'
            />

            <button
               onClick={addBookmark}
               disabled={loading}
               className='bg-green-500 hover:bg-green-700 transition-colors duration-300 text-white p-2 rounded cursor-pointer'
            >
               {loading ? "Saving..." : "Add Bookmark"}
            </button>

            {error && <p className='text-red-500'>{error}</p>}
         </div>

         {/* Bookmark List */}
         <h2 className='text-xl font-semibold mb-4'>Saved Bookmarks</h2>

         {bookmarks.length === 0 ? (
            <p className='text-gray-500'>No bookmarks yet. Add your first bookmark!</p>
         ) : (
            <ul className='space-y-3'>
               {bookmarks.map((b) => (
                  <li key={b.id} className='border p-3 rounded flex justify-between items-center'>
                     <a href={b.url} target='_blank' rel='noopener noreferrer' className='text-blue-600 cursor-pointer'>
                        {b.title}
                     </a>

                     <button onClick={() => deleteBookmark(b.id)} className='bg-red-500 text-white px-3 py-1 rounded cursor-pointer'>
                        Delete
                     </button>
                  </li>
               ))}
            </ul>
         )}
         {/* Delete Modal */}
         {showDeleteModal && (
            <div className='fixed inset-0 bg-black/90 flex items-center justify-center'>
               <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
                  <h2 className='text-lg font-semibold mb-4 text-black'>Are you sure you want to delete?</h2>
                  <div className='flex justify-end gap-3'>
                     <button onClick={() => setShowDeleteModal(false)} className='px-4 py-2 border rounded text-black cursor-pointer'>
                        Cancel
                     </button>
                     <button onClick={confirmDelete} className='px-4 py-2 bg-red-600 text-white rounded cursor-pointer'>
                        Delete
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
