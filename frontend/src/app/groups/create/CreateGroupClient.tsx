
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { ChangeEvent } from "react";

export default function CreateGroupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get ownerId from:
  // /groups/create?ownerId=USER_ID
  const ownerId = searchParams.get("ownerId");

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function change(
    e: ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submit() {
    if (!ownerId) {
      setError("No owner was specified.");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter a group name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/groups", {
        name: form.name,
        description: form.description,
        ownerId: ownerId,
      });

      console.log("GROUP CREATED:", res.data);

      alert("Group created successfully!");

      // Go directly to the newly created group
      router.push(`/groups/${res.data.id}`);

    } catch (error: any) {
      console.error("CREATE GROUP ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND RESPONSE:", error.response?.data);

      setError(
        error.response?.data?.message ||
          "Failed to create group."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-6">

      <h1 className="text-2xl font-bold">
        Create Group
      </h1>

      {!ownerId && (
        <div className="mt-4 p-3 rounded bg-red-50 border border-red-300 text-red-700">
          No user was selected as the group owner.
        </div>
      )}

{/* Displayes user ID of group owner. */}
      {/* {ownerId && (
        <div className="mt-4 p-3 rounded bg-gray-50 border">
          <p className="text-sm text-gray-500">
            Group Owner ID
          </p>

          <p className="font-medium break-all">
            {ownerId}
          </p>
        </div>
      )} */}

      <input
        className="border p-2 w-full mt-5 rounded"
        name="name"
        placeholder="Group name"
        value={form.name}
        onChange={change}
      />

      <input
        className="border p-2 w-full mt-3 rounded"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={change}
      />

      {error && (
        <div className="mt-4 p-3 rounded bg-red-50 border border-red-300 text-red-700">
          {error}
        </div>
      )}

      <button
        className="bg-green-600 text-white px-4 py-2 mt-5 rounded disabled:opacity-50"
        onClick={submit}
        disabled={!ownerId || loading}
      >
        {loading ? "Creating..." : "Create Group"}
      </button>

      <button
        className="border px-4 py-2 mt-3 ml-3 rounded"
        onClick={() => router.back()}
      >
        Cancel
      </button>

    </main>
  );
}
