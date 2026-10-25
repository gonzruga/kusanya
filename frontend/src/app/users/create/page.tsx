"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submit() {
    try {
      setLoading(true);

      // Create user through UserController
      // POST /user
      const response = await api.post(
        "/user",
        form
      );

      console.log(
        "Created user:",
        response.data
      );

      // Get ID of newly created user
      const userId = response.data.id;

      if (!userId) {
        throw new Error(
          "User was created but no user ID was returned."
        );
      }

      // Immediately go to the created user's page
      router.push(`/users/${userId}`);

    } catch (error: any) {
      console.error(
        "Create user error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      alert(
        JSON.stringify(
          error.response?.data ||
            "Failed to create user",
          null,
          2
        )
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-6">

      <h1 className="text-3xl font-bold mb-6">
        Create User
      </h1>

      <input
        className="border p-2 w-full mb-3"
        name="firstName"
        placeholder="First name"
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mb-3"
        name="lastName"
        placeholder="Last name"
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mb-3"
        name="mobileNumber"
        placeholder="Mobile Number"
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mb-3"
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mb-4"
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
      >
        {loading
          ? "Creating User..."
          : "Create User"}
      </button>

    </main>
  );
}