import React from 'react';

function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Card Container */}
      <div className="bg-white p-8 shadow-lg rounded-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up for Art-connect</h2>

        {/* Signup Form */}
        <form className="space-y-4">

          {/* Username Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              id="username"
              name="username"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter a secure password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              id="password"
              name="password"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              id="password2"
              name="password2"
            />
          </div>

          {/* Submit Button */}
          <button className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
