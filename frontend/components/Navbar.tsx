"use client";

import { Leaf, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md shadow-brand-500/30">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
                The God Gift CRM
              </h1>
              <p className="text-[10px] text-brand-600 font-medium uppercase tracking-wider">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <Link
              href="/register"
              target="_blank"
              className="flex items-center gap-1.5 bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 hover:border-brand-300 hover:text-brand-700 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Customer Form
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-200">
              <Sparkles className="w-3.5 h-3.5" />
              Pro Dashboard
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
