import React from "react";
import { useOutletContext } from "react-router-dom";

export const InquiriesPage = () => {
  const { inquiries } = useOutletContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#1C3325]">
          Inbound Inquiries & Student Queries
        </h2>
        <p className="text-[13px] text-[#5C665F]">
          Direct inquiries from the sanctuary contact form with 1-click WhatsApp messaging.
        </p>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student Name</th>
              <th>WhatsApp Phone</th>
              <th>Program of Interest</th>
              <th>Message / Query</th>
              <th>Status</th>
              <th>Direct Contact</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id}>
                <td className="text-[12px] text-[#5C665F]">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </td>
                <td className="font-bold text-[#1C3325]">{inq.name}</td>
                <td className="font-semibold">{inq.whatsapp}</td>
                <td>
                  <span className="badge badge-neutral">{inq.program}</span>
                </td>
                <td className="max-w-[320px]">
                  <p className="text-[13px] leading-relaxed">{inq.message}</p>
                </td>
                <td>
                  <span
                    className={`badge ${
                      inq.status === "contacted"
                        ? "badge-info"
                        : inq.status === "resolved"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {inq.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <a
                    href={`https://wa.me/91${inq.whatsapp.replace(/\D/g, "").slice(-10)}?text=Namaskara%20${encodeURIComponent(inq.name)}%2C%20thank%20you%20for%20contacting%20Shash%20Studios%20Mysuru.`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-accent text-[12px] py-1.5 px-3"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    WhatsApp
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
