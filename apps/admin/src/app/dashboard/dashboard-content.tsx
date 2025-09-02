"use client";

// Removed: import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { DollarSign, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-components";
// Removed: import { getTodaySummary } from "@/lib/apiClient";
// Removed: import { toast } from 'react-toastify';
import { useTodaySummary } from "@/lib/hooks/useTodaySummary"; // New import


interface SummaryData {
  totalRevenue: number;
  pointsRedeemed: number;
  adImpressions: number;
}

export default function DashboardContent() {
  const { summary, isLoading, error } = useTodaySummary(); // Use the new hook

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
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ingresos por Publicidad (Hoy)
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary?.totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Datos en tiempo real
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Puntos G Canjeados (Hoy)
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{summary?.pointsRedeemed.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Datos en tiempo real
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Impresiones de Anuncios (Hoy)</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{summary?.adImpressions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Datos en tiempo real
          </p>
        </CardContent>
      </Card>
      </div>
  );
}