"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type ImportError = {
  row: number | null;
  mobileNumber: string;
  error: string;
};

type ImportResult = {
  success: boolean;
  totalRows: number;
  imported: number;
  failed: number;
  errors: ImportError[];
};

export default function MemberUploadPage() {
  const params = useParams();
  const router = useRouter();

  const groupId = params.id as string;

  const [file, setFile] =
    useState<File | null>(null);

  const [result, setResult] =
    useState<ImportResult | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ============================================================
  // UPLOAD
  // ============================================================

  async function handleUpload() {
    if (!file) {
      setError(
        "Please select a CSV or Excel file.",
      );

      return;
    }

    if (!groupId) {
      setError(
        "Group ID is missing.",
      );

      return;
    }

    setUploading(true);
    setError("");
    setResult(null);

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      formData.append(
        "groupId",
        groupId,
      );

      const response =
        await api.post(
          "/members/bulk-upload",
          formData,
        );

      setResult(
        response.data,
      );
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data
          ?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message ||
              "Unable to upload members.",
      );
    } finally {
      setUploading(false);
    }
  }

  // ============================================================
  // FILE CHANGE
  // ============================================================

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0] ??
      null;

    setFile(selectedFile);
    setResult(null);
    setError("");
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <h1 className="text-3xl font-bold">
        Upload members
      </h1>

      <p className="mt-2 text-gray-600">
        Upload a CSV or Microsoft Excel
        file containing your group members.
      </p>

      <p className="mt-1 text-sm text-gray-500">
        Supported formats: CSV, Excel
        (.xlsx, .xls)
      </p>

      {/* ======================================================
          TEMPLATES
      ====================================================== */}

      <div className="mt-4">
        <p className="font-medium">
          Download a template:
        </p>

        <div className="mt-2 flex gap-4">

          <a
            href="/members-template.xlsx"
            download
            className="text-blue-600 underline"
          >
            Excel template
          </a>

          <a
            href="/members-template.csv"
            download
            className="text-blue-600 underline"
          >
            CSV template
          </a>

        </div>
      </div>

      {/* ======================================================
          FILE SELECTOR
      ====================================================== */}

      <div className="mt-6 border rounded-lg p-6">

        <label className="block font-medium mb-2">
          Member file
        </label>

        <input
          type="file"
          accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={handleFileChange}
          className="block w-full"
        />

        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name}
          </p>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={
            !file || uploading
          }
          className="mt-5 bg-green-600 text-white px-5 py-2 rounded disabled:bg-gray-400"
        >
          {uploading
            ? "Importing members..."
            : "Import members"}
        </button>

      </div>

      {/* ======================================================
          GENERAL ERROR
      ====================================================== */}

      {error && (
        <div className="mt-6 border border-red-300 bg-red-50 rounded-lg p-4">

          <h2 className="font-bold text-red-700">
            Upload failed
          </h2>

          <p className="mt-1 text-red-600">
            {error}
          </p>

        </div>
      )}

      {/* ======================================================
          IMPORT RESULT
      ====================================================== */}

      {result && (
        <div className="mt-6 border rounded-lg p-6">

          <h2 className="text-xl font-bold">
            {result.success
              ? "Import completed"
              : "Import completed with errors"}
          </h2>

          {/* Summary */}

          <div className="mt-4 space-y-2">

            <p>
              <strong>
                {result.imported}
              </strong>{" "}
              members imported successfully.
            </p>

            <p>
              <strong>
                {result.failed}
              </strong>{" "}
              rows could not be imported.
            </p>

            <p className="text-gray-600">
              Total rows:{" "}
              {result.totalRows}
            </p>

          </div>

          {/* ==================================================
              ERRORS
          ================================================== */}

          {result.failed > 0 && (
            <div className="mt-6">

              <h3 className="font-bold text-red-700">
                Rows requiring attention
              </h3>

              <div className="mt-3 space-y-3">

                {result.errors.map(
                  (item, index) => (
                    <div
                      key={`${item.row}-${index}`}
                      className="border rounded p-3 bg-red-50"
                    >

                      <p className="font-medium">
                        Row{" "}
                        {item.row ??
                          "unknown"}
                      </p>

                      {item.mobileNumber && (
                        <p className="text-sm">
                          Mobile:{" "}
                          {
                            item.mobileNumber
                          }
                        </p>
                      )}

                      <p className="text-sm text-red-700">
                        {item.error}
                      </p>

                    </div>
                  ),
                )}

              </div>

            </div>
          )}

          {/* ==================================================
              BACK TO GROUP
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              router.push(
                `/groups/${groupId}`,
              )
            }
            className="mt-6 border px-4 py-2 rounded"
          >
            Back to group
          </button>

        </div>
      )}

    </main>
  );
}