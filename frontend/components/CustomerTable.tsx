"use client";

import { useState } from "react";
import {
  Search,
  Copy,
  ExternalLink,
  Trash2,
  Download,
  Loader2,
  Users,
  Instagram,
  Phone,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Customer, customerApi, exportApi } from "@/services/api";
import { formatDate, getInstagramUsername } from "@/lib/utils";

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  total: number;
  onRefresh: () => void;
}

type SortKey = "name" | "whatsappNumber" | "createdAt";
type SortDir = "asc" | "desc";

export default function CustomerTable({
  customers,
  loading,
  search,
  onSearchChange,
  total,
  onRefresh,
}: CustomerTableProps) {
  const [exporting, setExporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone).then(() => {
      toast.success("WhatsApp number copied!");
    });
  };

  const handleOpenInstagram = (link: string) => {
    const url = link.startsWith("http") ? link : `https://${link}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await customerApi.delete(id);
      toast.success("Customer deleted");
      onRefresh();
    } catch {
      toast.error("Failed to delete customer");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      exportApi.downloadExcel();
      toast.success("Downloading Excel file...");
    } catch {
      toast.error("Export failed");
    } finally {
      setTimeout(() => setExporting(false), 1500);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...customers].sort((a, b) => {
    let aVal = a[sortKey] as string;
    let bVal = b[sortKey] as string;
    if (sortKey === "createdAt") {
      return sortDir === "asc"
        ? new Date(aVal).getTime() - new Date(bVal).getTime()
        : new Date(bVal).getTime() - new Date(aVal).getTime();
    }
    aVal = aVal.toLowerCase();
    bVal = bVal.toLowerCase();
    return sortDir === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return (
        <ChevronUp className="w-3 h-3 text-gray-300 group-hover:text-gray-400" />
      );
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-brand-500" />
    ) : (
      <ChevronDown className="w-3 h-3 text-brand-500" />
    );
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-gray-100">
      {/* Table header toolbar */}
      <div className="px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Users className="w-5 h-5 text-brand-500 shrink-0" />
          <div>
            <h2 className="text-base font-bold text-gray-900">All Customers</h2>
            <p className="text-xs text-gray-500">{total} total records</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 h-9 w-48 sm:w-64 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
            />
          </div>

          {/* Export */}
          <Button
            variant="soft"
            size="sm"
            onClick={handleExport}
            disabled={exporting}
            className="shrink-0"
          >
            {exporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Export Excel</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">
                #
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort("name")}
                  className="group flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Name
                  <SortIcon col="name" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort("whatsappNumber")}
                  className="group flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  WhatsApp
                  <SortIcon col="whatsappNumber" />
                </button>
              </th>
              <th className="text-left px-4 py-3 hidden md:table-cell">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Instagram
                </span>
              </th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">
                <button
                  onClick={() => handleSort("createdAt")}
                  className="group flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Added On
                  <SortIcon col="createdAt" />
                </button>
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                      <Users className="w-7 h-7 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">
                        {search ? "No customers found" : "No customers yet"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {search
                          ? `No results for "${search}"`
                          : "Add your first customer using the form above"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((customer, index) => (
                <tr
                  key={customer.id}
                  className="group hover:bg-brand-50/30 transition-colors"
                >
                  <td className="px-6 py-3.5 text-xs text-gray-400 font-medium">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-brand-700">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        {customer.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-mono text-xs">
                        {customer.whatsappNumber}
                      </span>
                      <button
                        onClick={() => handleCopyPhone(customer.whatsappNumber)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-brand-100 text-brand-600 transition-all"
                        title="Copy number"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell">
                    {customer.instagramLink ? (
                      <button
                        onClick={() =>
                          handleOpenInstagram(customer.instagramLink!)
                        }
                        className="flex items-center gap-1.5 text-xs text-pink-600 hover:text-pink-700 font-medium group/ig"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        {getInstagramUsername(customer.instagramLink)}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/ig:opacity-100 transition-opacity" />
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-gray-500">
                      {formatDate(customer.createdAt)}
                    </span>
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleCopyPhone(customer.whatsappNumber)}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                        title="Copy WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      {customer.instagramLink && (
                        <button
                          onClick={() =>
                            handleOpenInstagram(customer.instagramLink!)
                          }
                          className="p-1.5 rounded-lg hover:bg-pink-50 text-pink-600 transition-colors"
                          title="Open Instagram"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDelete(customer.id, customer.name)
                        }
                        disabled={deletingId === customer.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete customer"
                      >
                        {deletingId === customer.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!loading && sorted.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing {sorted.length} of {total} customers
          </p>
          <Badge variant="secondary" className="text-xs">
            {total} total
          </Badge>
        </div>
      )}
    </div>
  );
}
