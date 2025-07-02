import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaMapPin } from "react-icons/fa";

function CreatePost() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles([...mediaFiles, ...files]);
  };

  const handlePrivacySelect = (option) => {
    setSelectedPrivacy(option);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Title',
        text: 'Please enter a title for your memory!',
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Memory Pinned!',
      text: 'Your memory has been successfully pinned.',
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 shadow-md rounded-lg space-y-6">
      <h1 className="text-[1rem] font-bold text-gray-800 mb-4">Pin your memories on the map</h1>
      <div className='bg-white p-4 flex flex-col gap-3'>

        {/* Title */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-1">Memory Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your memory a title"
            className="w-full border border-gray-200 text-[.7rem] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share your memory details..."
            className="w-full text-[.7rem] border border-gray-200 rounded-md px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Upload Media */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Upload Media</label>
          <div className="border border-gray-200 border-dashed rounded-md p-6 text-center text-gray-600">
            <h1 className='flex justify-center text-blue-300'><FaCloudUploadAlt /></h1>
            <p>Drag and drop files here, or click to browse</p>
            <p className='text-gray-300 text-[.7rem]'>Supports images and video up to 50 MB</p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="w-60 cursor-pointer text-[.5rem] bg-blue-200 rounded px-4 py-2 hover:bg-blue-300 delay-300 duration-400 mt-2"
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Privacy Setting</label>
          <div className="grid grid-cols-3 gap-4">
            {["Private", "Public", "Community"].map((option) => (
              <div
                key={option}
                onClick={() => handlePrivacySelect(option)}
                className={`border border-gray-200 rounded-md p-2 cursor-pointer transition flex items-center gap-2
                  ${selectedPrivacy === option ? 'bg-blue-100 border-blue-400' : 'hover:bg-blue-50 border-blue-100'}`}
              >
                <input
                  type="radio"
                  name="privacy"
                  checked={selectedPrivacy === option}
                  onChange={() => handlePrivacySelect(option)}
                  className="w-4 h-4 cursor-pointer"
                />
                <div>
                  <h2 className="font-semibold">{option}</h2>
                  <p className="text-[.5rem] text-gray-500">
                    {option === "Private" && "Only visible to you"}
                    {option === "Public" && "Visible to everyone"}
                    {option === "Community" && "Visible to selected community members"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-1">Location</label>
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-md">
            <div className='text-blue-300'>
              <FaLocationDot />
            </div>
            <div>
              <p className="text-gray-700 text-[1rem]">Central Park, New York</p>
              <p className="text-[.5rem] text-gray-500 ">
                Auto-filled from map. <span className="text-blue-400 cursor-pointer hover:underline">Change</span>
              </p>
            </div>
          </div>
        </div>

        {/* Pin Button */}
        <div className="text-right flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-200 text-white px-3 text-[.6rem] py-2 rounded-md flex items-center gap-1 hover:bg-blue-300 delay-300 duration-400 cursor-pointer"
          >
            <FaMapPin /> Pin Memory
          </button>
        </div>

        {/* Preview */}
        {(title || mediaFiles.length > 0 || description) && (
          <div className="border gap-2 rounded-md p-4 mt-6 bg-gray-50">

            <div className='flex flex-wrap gap-4 mb-4'>
              {mediaFiles.map((file, index) => {
                const isImage = file.type.startsWith("image/");
                const isVideo = file.type.startsWith("video/");
                const url = URL.createObjectURL(file);
                return (
                  <div key={index} className="w-32 h-32 overflow-hidden rounded-md border">
                    {isImage && (
                      <img src={url} alt={`preview-${index}`} className="object-cover w-full h-full" />
                    )}
                    {isVideo && (
                      <video controls className="object-cover w-full h-full">
                        <source src={url} type={file.type} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                );
              })}
            </div>

            {/* User info */}
            <div className='bg-white p-2'>
              <div className='flex gap-2'>
                <img src="/images.jpg" className='rounded w-8' alt="User" />
                <div className='flex text-[.7rem] flex-col'>
                  <h1>user name</h1>
                  <h1 className='flex items-center text-gray-500'><FaLocationDot /> user location</h1>
                </div>
              </div>
              <div className='mt-2'>
                <p className="text-[.7rem] font-medium">{title}</p>
                {description && (
                  <p className="text-[.6rem] text-gray-600 mt-1">{description}</p>
                )}
              </div>
              {selectedPrivacy && (
                <p className="text-[.5rem] bg-blue-100 text-blue-400 rounded px-4 inline-block mt-2">
                  {selectedPrivacy}
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CreatePost;
