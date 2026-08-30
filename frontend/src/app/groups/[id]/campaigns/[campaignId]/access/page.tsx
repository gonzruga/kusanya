"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function CampaignAccessPage() {

  const params = useParams();
  const router = useRouter();

  const groupId = params.id as string;
  const campaignId = params.campaignId as string;

  const [campaignCode, setCampaignCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    setError("");

    if (!campaignCode.trim()) {
      setError("Please enter the campaign code.");
      return;
    }

    try {

      setLoading(true);

      await api.post(
        `/groups/${groupId}/campaigns/verify-access`,
        {
          campaignId,
          campaignCode: campaignCode.trim(),
        }
      );

      router.push(
        `/groups/${groupId}/campaigns/${campaignId}`
      );

    } catch (error: any) {

      console.error(error);

      setError(
        error?.response?.data?.message ||
        "Invalid campaign code."
      );

    } finally {

      setLoading(false);

    }
  }

  return (

    <div className="max-w-md mx-auto mt-20">

      <div className="border rounded-lg p-6 shadow">

        <h1 className="text-2xl font-bold">
          Campaign Access
        </h1>

        <p className="mt-3 text-gray-600">
          Enter the campaign code to access this campaign.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >

          <label className="block font-medium">
            Campaign Code
          </label>

          <input
            type="text"
            value={campaignCode}
            onChange={(e) =>
              setCampaignCode(e.target.value)
            }
            placeholder="Enter campaign code"
            className="w-full border rounded px-3 py-2 mt-2"
          />

          {error && (

            <p className="text-red-600 mt-3">
              {error}
            </p>

          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded mt-5 disabled:opacity-50"
          >

            {loading
              ? "Verifying..."
              : "Access Campaign"
            }

          </button>

        </form>

      </div>

    </div>

  );
}