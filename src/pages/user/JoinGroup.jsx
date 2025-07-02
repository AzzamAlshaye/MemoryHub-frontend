

function JoinGroup() {

  
 
  return (
    <div className="w-full max-w-md bg-white p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
        Join a Group
      </h1>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        Invitation Link
      </label>
      <input
        type="text"
        
        placeholder="Paste invitation link here"
        className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-inner"
      />

      <div className="flex gap-4">
        <button
          className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full text-sm font-semibold transition"
        >
          Join
        </button>
        <button
          
          className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-full text-sm font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default JoinGroup;
