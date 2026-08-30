"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams, } from "next/navigation";
import { api } from "@/lib/api";
// useSearchParams for getting query parameters from the URL, if needed in the future.

export default function CreateContributionPage() {

  const router = useRouter();

  const params = useParams();

  const groupId = params.id as string;
  const campaignId = params.campaignId as string;

  const searchParams = useSearchParams();
  const campaignCode = searchParams.get("code");

  const [form, setForm] = useState({
    mobileNumber: "",
    amount: "",
    provider: "MPESA",
    transactionReference: campaignCode || "",
    providerReference: "",
  });

  function change(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submit() {

    try {

      const response = await api.post(
        `/contributions`,
        // `/campaigns/${campaignId}/contributions`,
        {
          mobileNumber: form.mobileNumber,
          amount: Number(form.amount),
          provider: form.provider,
          transactionReference: form.transactionReference,
          providerReference: form.providerReference,
          campaignId,
        }
      );

      alert("Contribution created successfully.");

      router.push(
        `/groups/${groupId}/campaigns/${campaignId}`
      );

    } 
    // catch (error) {

    //   console.log(error);

    //   alert("Failed to create contribution.");

    // }

    catch (error: any) {
      console.error("Create contribution error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create contribution.";

      alert(message);
    }

  }

  return (

    <div className="max-w-lg mx-auto mt-10">

      <h1 className="text-3xl font-bold">
        Make Contribution
      </h1>

      <p className="text-gray-600 mt-2">
        Campaign ID: {campaignId}
      </p>

      {/* <p className="text-gray-600 mt-2">
        Campaign Code: {campaignCode}
      </p>       */}

      <input
        className="border p-2 w-full mt-5"
        name="mobileNumber"
        placeholder="Mobile Number"
        value={form.mobileNumber}
        onChange={change}
      />

      <input
        className="border p-2 w-full mt-3"
        type="number"
        name="amount"
        placeholder="Contribution Amount"
        value={form.amount}
        onChange={change}
      />

      <select
        className="border p-2 w-full mt-3"
        name="provider"
        value={form.provider}
        onChange={change}
      >
        <option value="MPESA">M-Pesa</option>
        <option value="TIGOPESA">Tigo Pesa</option>
        <option value="AIRTELMONEY">Airtel Money</option>
        <option value="HALOPESA">HaloPesa</option>
        <option value="MIXX">Mixx</option>
      </select>

      <input
        className="border p-2 w-full mt-3"
        name="transactionReference"
        placeholder="Campaign Code"
        value={form.transactionReference}
        onChange={change}
        // readOnly
      />

      <input
        className="border p-2 w-full mt-3"
        name="providerReference"
        placeholder="Provider Reference (*Optional pending API*)" //Temporarily optional pending API
        value={form.providerReference}
        onChange={change}
      />

      <button
        onClick={submit}
        className="bg-green-600 text-white px-5 py-2 mt-6 rounded"
      >
        Submit Contribution
      </button>

    </div>

  );

}