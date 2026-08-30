"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function GroupAnalyticsPage() {
  const params = useParams();

  const groupId = params.id as string;

  // Replace this with your actual Lightdash dashboard URL
  const lightdashDashboardUrl =
    "http://localhost:8080/projects/49675b6b-2ccb-46c2-8101-f98a11dbab90/dashboards/223a7229-b94a-4e99-97f1-1f60ae4cbe97/view"
    // "http://localhost:8080/share/dashboard/YOUR_SHARED_DASHBOARD_ID";

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Group Analytics
              </h1>

              <p className="text-gray-500 mt-1">
                Contribution and campaign statistics
              </p>
            </div>

            <Link
              href={`/groups/${groupId}`}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              ← Back to Group
            </Link>

          </div>

        </div>
      </div>


      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        <div className="bg-white rounded-lg shadow overflow-hidden">

          <iframe
            src={lightdashDashboardUrl}
            title="KUSANYA Group Analytics"
            className="w-full"
            style={{
              height: "1000px",
              border: "none",
            }}
            allow="fullscreen"
          />

        </div>

      </div>

    </main>
  );
}