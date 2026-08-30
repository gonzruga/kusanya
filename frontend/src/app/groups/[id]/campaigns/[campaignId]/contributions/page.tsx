"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ContributePage() {

  const router = useRouter();

  const params = useParams();

  const groupId = params.id as string;
  const campaignId = params.campaignId as string;

  const [form, setForm] = useState({

    mobileNumber: "",

    amount: "",

    provider: "MPESA",

    transactionReference: "",

    providerReference: ""

  });

  function change(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  }

  async function submit() {

    try {

      await api.post(

        `/campaigns/${campaignId}/contributions`,

        {

          mobileNumber: form.mobileNumber,

          amount: Number(form.amount),

          provider: form.provider,

          transactionReference: form.transactionReference,

          providerReference: form.providerReference,

          campaignId

        }

      );

      alert("Contribution recorded");

      router.push(
        `/groups/${groupId}/campaigns/${campaignId}`
      );

    }

    catch(err){

      console.log(err);

      alert("Contribution failed");

    }

  }

  return (

    <div className="max-w-md mx-auto mt-10">

      <h1 className="text-3xl font-bold">

        Make Contribution

      </h1>

      <input
        className="border p-2 w-full mt-4"
        name="mobileNumber"
        placeholder="Mobile Number"
        onChange={change}
      />

      <input
        className="border p-2 w-full mt-3"
        name="amount"
        placeholder="Amount"
        onChange={change}
      />

      <select
        className="border p-2 w-full mt-3"
        name="provider"
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
        placeholder="Transaction Reference"
        onChange={change}
      />

      <input
        className="border p-2 w-full mt-3"
        name="providerReference"
        placeholder="Provider Reference (optional)"
        onChange={change}
      />

      <button
        onClick={submit}
        className="bg-green-600 text-white px-5 py-2 mt-5 rounded"
      >

        Submit Contribution

      </button>

    </div>

  );

}