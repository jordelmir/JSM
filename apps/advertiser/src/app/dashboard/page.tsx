"use client";

// Removed: import { useEffect, useState } from "react";
import { DollarSign, Megaphone, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
// Removed: import { getCampaignPerformanceSummary } from "@/lib/apiClient";
// Removed: import { toast } from 'react-toastify';
import { useCampaignSummary } from "@/lib/hooks/useCampaignSummary"; // New import
import { useTranslation } from "react-i18next"; // New import


interface CampaignSummary {
  totalImpressions: number;
  totalBudgetSpent: number;
  // impressionsByDay: { date: string; impressions: number }[]; // For a simple graph
}

export default function AdvertiserDashboardPage() {
  const { t } = useTranslation(); // Use the new hook
  const { summary, isLoading, error } = useCampaignSummary(); // Use the new hook

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">{t("Error!")}</strong> {/* Translated */}
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("Total Impressions")} {/* Translated */}
          </CardTitle>
          <Megaphone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.totalImpressions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {t("Across all your campaigns")} {/* Translated */}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("Budget Spent")} {/* Translated */}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary?.totalBudgetSpent.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {t("Across all your campaigns")} {/* Translated */}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("Overall Performance")}</CardTitle> {/* Translated */}
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{t("N/A")}</div> {/* Translated */}
          <p className="text-xs text-muted-foreground">
            {t("Data not available")} {/* Translated */}
          </p>
        </CardContent>
      </Card>
      </div>
  );
}
