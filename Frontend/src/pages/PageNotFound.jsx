import React from "react";

function PageNotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="text-center">
        {/* 404 Number */}
        <h1 className="text-9xl font-extrabold text-white drop-shadow-lg animate-bounce">
          404
        </h1>

        {/* Page Not Found Text */}
        <p className="mt-4 text-2xl md:text-3xl font-semibold text-white drop-shadow-md">
          Oops! Page Not Found
        </p>

        {/* Optional Description */}
        <p className="mt-2 text-white/80">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Optional Back Home Button */}
        <a
          href="/home"
          className="inline-block mt-6 px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-lg hover:bg-purple-100 transition"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}

export default PageNotFound;
