"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  role?: string;
  createdAt?: string;
};

export default function UserPage() {
  const params = useParams();
  const router = useRouter();

  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/user/${userId}`);

        console.log("User data:", response.data);

        setUser(response.data);
      } catch (error: any) {
        console.error("Failed to load user:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load user."
        );
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadUser();
    }
  }, [userId]);

  // Loading
  if (loading) {
    return (
      <main className="max-w-3xl mx-auto mt-10 p-6">
        <h1 className="text-2xl font-bold">
          Loading user...
        </h1>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="max-w-3xl mx-auto mt-10 p-6">
        <div className="border border-red-300 bg-red-50 p-4 rounded">
          <h1 className="text-xl font-bold text-red-700">
            Unable to load user
          </h1>

          <p className="text-red-600 mt-2">
            {error}
          </p>
        </div>

        <button
          onClick={() => router.push("/users/create")}
          className="mt-5 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New User
        </button>
      </main>
    );
  }

  // User not found
  if (!user) {
    return (
      <main className="max-w-3xl mx-auto mt-10 p-6">
        <h1 className="text-2xl font-bold">
          User not found
        </h1>
      </main>
    );
  }

  // User page
  return (
    <main className="max-w-3xl mx-auto mt-10 p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          User Profile
        </h1>

        <button
          onClick={() => router.push("/groups")}
          className="border px-4 py-2 rounded"
        >
          Groups
        </button>
      </div>

      <div className="border rounded-lg p-6 shadow-sm">

        <h2 className="text-2xl font-bold mb-6">
          {user.firstName} {user.lastName}
        </h2>

        <div className="space-y-4">

          <div>
            <p className="text-sm text-gray-500">
              User ID
            </p>

            <p className="font-medium break-all">
              {user.id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              First Name
            </p>

            <p className="font-medium">
              {user.firstName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Last Name
            </p>

            <p className="font-medium">
              {user.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Mobile Number
            </p>

            <p className="font-medium">
              {user.mobileNumber}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-medium">
              {user.email}
            </p>
          </div>

          {user.role && (
            <div>
              <p className="text-sm text-gray-500">
                Role
              </p>

              <p className="font-medium">
                {user.role}
              </p>
            </div>
          )}

        </div>
      </div>

      <div className="mt-6 flex gap-3">

        <button
          onClick={() =>
            router.push(`/groups/create?ownerId=${user.id}`)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Group
        </button>

        <button
          onClick={() => router.push("/groups")}
          className="border px-4 py-2 rounded"
        >
          View Groups
        </button>

      </div>

    </main>
  );
}