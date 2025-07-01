// src/components/ReportPopup.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";

const DEFAULT_REASONS = [
  "Inappropriate content",
  "Spam or misleading",
  "Harassment or hate speech",
  "Self-harm or suicide",
  "Other",
];

/**
 * Props:
 *  - target: { type: "post" } or { type: "comment", id: number }
 *  - onCancel: () => void
 *  - onSubmit: (payload: { target, reason, description }) => void
 */
export default function ReportPopup({ target, onCancel, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState(DEFAULT_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [description, setDescription] = useState("");

  const swalOpts = { customClass: { container: "z-[9999]" } };

  const handleSubmit = async () => {
    const reason =
      selectedReason === "Other" ? customReason.trim() : selectedReason;

    if (!reason) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Reason",
        text: "Please select or enter a reason for reporting.",
        ...swalOpts,
      });
    }
    if (!description.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please provide additional details.",
        ...swalOpts,
      });
    }

    const { isConfirmed } = await Swal.fire({
      icon: "question",
      title: "Submit Report?",
      text: "Are you sure you want to report this?",
      showCancelButton: true,
      confirmButtonText: "Yes, report",
      cancelButtonText: "Cancel",
      ...swalOpts,
    });
    if (!isConfirmed) return;

    onSubmit({ target, reason, description });

    await Swal.fire({
      icon: "success",
      title: "Report Submitted",
      text: "Thank you. Your report has been submitted.",
      ...swalOpts,
    });
  };

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h3 className="text-lg font-semibold">
          Report {target.type === "post" ? "Post" : "Comment"}
        </h3>

        <div>
          <label className="block text-sm font-medium mb-1">Reason</label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none"
          >
            {DEFAULT_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {selectedReason === "Other" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Other Reason
            </label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Please describe the reason..."
              className="w-full border rounded px-3 py-2 focus:outline-none h-20 resize-y"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            Additional Details
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide any extra information..."
            className="w-full border rounded px-3 py-2 focus:outline-none h-20 resize-y"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
