import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser, UserButton } from "@clerk/clerk-react";

const Dashboard = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const sendDataToBackend = async () => {
    if (!user) return; // Don't send if user is not loaded yet

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Send user ID to backend with Google profile picture
      const userData = {
        clerkId: user?.id,
        email: user?.emailAddresses[0]?.emailAddress,
        name: user?.firstName,
        profilePic: user?.imageUrl, // Google profile picture URL
        // googleId: user?.externalAccounts?.[0]?.externalId, // Google account ID
      };

      console.log("Sending data:", userData);

      const response = await axios.post(
        "http://localhost:8000/api/v1/users",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      setResponse(response.data);
    } catch (error) {
      console.error("Error details:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      setError({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  // Automatically send data when component loads and user is available
  useEffect(() => {
    if (user) {
      sendDataToBackend();
    }
  }, [user]); // Dependency on user ensures it runs when user data is loaded

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {user?.firstName}!
        </h2>

        {/* Profile Picture Display */}
        {user?.imageUrl && (
          <div className="mb-4">
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-gray-200"
            />
            <p className="text-sm text-gray-600 mt-2">Google Profile Picture</p>
          </div>
        )}

        <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
        <p>User ID: {user?.id}</p>
        {user?.externalAccounts?.[0]?.externalId && (
          <p>Google ID: {user.externalAccounts[0].externalId}</p>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <p className="font-semibold">🔄 Sending user data to backend...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <h3 className="font-semibold">Error:</h3>
            <p>Status: {error.status}</p>
            <p>Message: {error.message}</p>
            {error.data && (
              <pre className="text-sm mt-2">
                {JSON.stringify(error.data, null, 2)}
              </pre>
            )}
          </div>
        )}

        {response && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <h3 className="font-semibold">✅ Success:</h3>
            <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
