"use client";

import { Clock, Instagram, Phone } from "lucide-react";
import { Customer } from "@/services/api";
import { formatDateTime, getInstagramUsername } from "@/lib/utils";

interface RecentCustomersProps {
  customers: Customer[];
  loading: boolean;
}

export default function RecentCustomers({
  customers,
  loading,
}: RecentCustomersProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-gray-100">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
        <Clock className="w-4 h-4 text-brand-500" />
        <h3 className="text-sm font-bold text-gray-900">Recent Additions</h3>
      </div>

      <div className="divide-y divide-gray-50">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-24 bg-gray-100 rounded animate-pulse" />
                  <div className="h-2.5 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))
          : customers.length === 0
          ? (
            <div className="px-5 py-8 text-center text-xs text-gray-400">
              No customers yet
            </div>
          )
          : customers.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="px-5 py-3 flex items-center gap-3 hover:bg-brand-50/30 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-brand-700">
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {c.name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="w-3 h-3" />
                      {c.whatsappNumber}
                    </span>
                    {c.instagramLink && (
                      <span className="flex items-center gap-1 text-xs text-pink-500 truncate">
                        <Instagram className="w-3 h-3 shrink-0" />
                        {getInstagramUsername(c.instagramLink)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0 hidden sm:block">
                  {formatDateTime(c.createdAt)}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}
