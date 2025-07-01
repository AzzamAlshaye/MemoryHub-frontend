// import React, { useState, useRef } from 'react';
// import Footer from '../components/Footer';
// import { FaCamera } from 'react-icons/fa';

// function Create() {
//   const [preview, setPreview] = useState(null);
//   const fileInputRef = useRef();

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => setPreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="min-h-screen flex bg-blue-100 justify-center items-center">
//       <main className="w-full max-w-md p-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//           Create New Group
//         </h1>
//         <div className="bg-white p-6 rounded-lg shadow-md space-y-6">

//           {/* Image upload circle */}
//           <div
//             className="w-32 h-32 mx-auto rounded-full border-2 border-blue-500 overflow-hidden cursor-pointer relative"
//             onClick={() => fileInputRef.current.click()}
//           >
//             {preview ? (
//               <img
//                 src={preview}
//                 alt="Group"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
//                 <FaCamera size={24} />
//               </div>
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               className="hidden"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//             />
//           </div>
//           <p className="text-center text-sm text-gray-500">
//             Click the circle to upload a group image
//           </p>

//           {/* Group Title */}
//           <div className="flex flex-col">
//             <label className="mb-2 font-medium text-gray-700 text-center">
//               Group Title
//             </label>
//             <input
//               type="text"
//               className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
//               placeholder="Enter group title"
//             />
//           </div>

//           {/* Description */}
//           <div className="flex flex-col">
//             <label className="mb-2 font-medium text-gray-700 text-center">
//               Description
//             </label>
//             <textarea
//               className="border border-gray-300 rounded px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-200"
//               placeholder="Enter group description"
//             />
//           </div>

//           {/* Create Button */}
//           <button
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-semibold transition"
//           >
//             Create Group
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Create;
