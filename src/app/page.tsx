
"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { generateData } from "@/utils/mockData";
import { useMemo } from "react";

const ChartComponent = dynamic(
  () => import("@/components/chart/ChartComponent").then((mod) => mod.ChartComponent),
  { ssr: false }
);

export default function Home() {
  const data = useMemo(() => generateData(1000), []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#131722] text-[#d1d4dc]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1">
          <ChartComponent data={data} />
        </main>
      </div>
    </div>
  );
}
