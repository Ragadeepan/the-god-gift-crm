"use client";

import { Users, UserPlus, TrendingUp, Calendar } from "lucide-react";
import { StatsData } from "@/services/api";

interface StatsCardsProps {
  stats: StatsData | null;
  loading: boolean;
}

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bg: string;
  iconBg: string;
  suffix?: string;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards: StatCard[] = [
    {
      label: "Total Customers",
      value: stats?.total ?? 0,
      icon: Users,
      color: "text-brand-700",
      bg: "from-brand-50 to-white border-brand-100",
      iconBg: "bg-brand-100",
    },
    {
      label: "Added Today",
      value: stats?.todayCount ?? 0,
      icon: UserPlus,
      color: "text-blue-700",
      bg: "from-blue-50 to-white border-blue-100",
      iconBg: "bg-blue-100",
    },
    {
      label: "This Week",
      value: stats?.weekCount ?? 0,
      icon: TrendingUp,
      color: "text-violet-700",
      bg: "from-violet-50 to-white border-violet-100",
      iconBg: "bg-violet-100",
    },
    {
      label: "Latest Entry",
      value: stats?.recentCustomers[0]?.name ?? "—",
      icon: Calendar,
      color: "text-orange-700",
      bg: "from-orange-50 to-white border-orange-100",
      iconBg: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-2xl p-5 animate-fade-in border shadow-lg`}
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderColor: "rgba(255,255,255,0.7)",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${card.iconBg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-7 w-16 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <div
                  className={`text-2xl font-bold ${card.color} leading-none mb-1 truncate`}
                >
                  {card.value}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {card.label}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
