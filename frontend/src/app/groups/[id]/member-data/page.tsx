"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { api } from "@/lib/api";

type Member = {
  member_id: string;
  first_name: string | null;
  mobile_number: string;
  comment: string | null;
  default_contribution: number;
  average_contribution: number;
  total_contributed: number;
  campaigns_supported: number;
  behaviour_segment: string | null;
};

type Contribution = {
  campaign_title: string;
  member_first_name: string | null;
  mobile_number: string;
  transaction_reference: string;
  created_at: string;
};

type MemberDataResponse = {
  members: Member[];
  contributions: Contribution[];
};

export default function MemberDataPage() {
  const params = useParams();

  const id = params.id as string;

  const [data, setData] = useState<MemberDataResponse>({
    members: [],
    contributions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/groups/${id}/member-data`
        );

        setData(response.data);
      } catch (error) {
        console.error(error);

        setError(
          "Unable to load member and contribution data."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-10 px-4">
        <p>Loading member data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-10 px-4">
        <p className="text-red-600">{error}</p>

        <Link
          href={`/groups/${id}`}
          className="inline-block mt-5 bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Group
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 pb-20">

      {/* ------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------ */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Member & Contribution Data
          </h1>

          <p className="text-gray-600 mt-2">
            Member behaviour and contribution activity
          </p>
        </div>

        <Link
          href={`/groups/${id}`}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          ← Back to Group
        </Link>

      </div>


      {/* ------------------------------------------------ */}
      {/* MEMBERS */}
      {/* ------------------------------------------------ */}

      <section className="mb-12">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">
            MEMBERS
          </h2>

          <span className="text-sm text-gray-600">
            {data.members.length} members
          </span>

        </div>

        <div className="border rounded-lg overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-4 py-3 text-left">
                  First Name
                </th>

                <th className="px-4 py-3 text-left">
                  Mobile Number
                </th>

                <th className="px-4 py-3 text-left">
                  Comment
                </th>

                <th className="px-4 py-3 text-right">
                  Default Contribution
                </th>

                <th className="px-4 py-3 text-right">
                  Average Contribution
                </th>

                <th className="px-4 py-3 text-right">
                  Total Contributed
                </th>

                <th className="px-4 py-3 text-center">
                  Campaigns Supported
                </th>

                <th className="px-4 py-3 text-left">
                  Behaviour Segment
                </th>

              </tr>

            </thead>

            <tbody>

              {data.members.map((member) => (

                <tr
                  key={member.member_id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-4 py-3 font-medium">
                    {member.first_name || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    {member.mobile_number}
                  </td>

                  <td className="px-4 py-3">
                    {member.comment || "—"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {formatAmount(
                      member.default_contribution
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {formatAmount(
                      member.average_contribution
                    )}
                  </td>

                  <td className="px-4 py-3 text-right font-medium">
                    {formatAmount(
                      member.total_contributed
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {member.campaigns_supported}
                  </td>

                  <td className="px-4 py-3">
                    {member.behaviour_segment || "—"}
                  </td>

                </tr>

              ))}

              {data.members.length === 0 && (

                <tr>

                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No active members found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* ------------------------------------------------ */}
      {/* CONTRIBUTIONS */}
      {/* ------------------------------------------------ */}

      <section>

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">
            CONTRIBUTIONS
          </h2>

          <span className="text-sm text-gray-600">
            {data.contributions.length} contributions
          </span>

        </div>

        <div className="border rounded-lg overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-4 py-3 text-left">
                  Date
                </th>

                <th className="px-4 py-3 text-left">
                  Member
                </th>

                <th className="px-4 py-3 text-left">
                  Amount
                </th>

                <th className="px-4 py-3 text-left">
                  Campaign
                </th>

                <th className="px-4 py-3 text-left">
                  Mobile Number
                </th>

                <th className="px-4 py-3 text-left">
                  Code
                </th>

              </tr>

            </thead>

            <tbody>

              {data.contributions.map(
                (contribution, index) => (

                  <tr
                    key={`${contribution.transaction_reference}-${index}`}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-4 py-3 font-medium">
                      {contribution.campaign_title}
                    </td>

                    <td className="px-4 py-3">
                      {contribution.member_first_name || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      {contribution.mobile_number}
                    </td>

                    <td className="px-4 py-3 font-mono text-xs">
                      {contribution.transaction_reference}
                    </td>

                    <td className="px-4 py-3">
                      {formatDate(
                        contribution.created_at
                      )}
                    </td>

                  </tr>

                )
              )}

              {data.contributions.length === 0 && (

                <tr>

                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No successful contributions found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}