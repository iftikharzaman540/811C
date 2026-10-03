"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { apiRequest } from "@/utils/api";

type RecordItem = {
  id: string;
  record_type: "DEPOSIT" | "WITHDRAWAL";
  amount: string | number;
  status: string;
  created_at: string;
  provider: string;
};

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "DEPOSIT" | "WITHDRAWAL">("ALL");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/payments/records");
      setRecords(res);
    } catch (err) {
      console.error("Failed to fetch records", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(r => activeTab === "ALL" || r.record_type === activeTab);

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'APPROVED':
        return "text-green-500";
      case 'REJECTED':
      case 'FAILED':
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white font-sans pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-neutral-800">
        <Link href="/profile" className="p-1">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-lg font-bold text-[#ffdf00]">My Records</h1>
        <div className="w-8"></div>
      </header>

      {/* Tabs */}
      <div className="flex px-4 py-3 gap-2 overflow-x-auto bg-[#141414] no-scrollbar">
        <button 
          onClick={() => setActiveTab("ALL")}
          className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "ALL" ? "bg-[#cc0000] text-white" : "bg-[#1a1a1a] text-neutral-400 border border-neutral-800"}`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveTab("DEPOSIT")}
          className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "DEPOSIT" ? "bg-[#cc0000] text-white" : "bg-[#1a1a1a] text-neutral-400 border border-neutral-800"}`}
        >
          Deposits
        </button>
        <button 
          onClick={() => setActiveTab("WITHDRAWAL")}
          className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "WITHDRAWAL" ? "bg-[#cc0000] text-white" : "bg-[#1a1a1a] text-neutral-400 border border-neutral-800"}`}
        >
          Withdrawals
        </button>
      </div>

      {/* List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffdf00]"></div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-neutral-500">
            <FileText className="w-12 h-12 mb-3 opacity-20" />
            <p>No records found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredRecords.map((record) => (
              <div key={record.id + record.record_type} className="bg-[#1a1a1a] rounded-xl p-4 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.record_type === "DEPOSIT" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                    {record.record_type === "DEPOSIT" ? (
                      <ArrowDownRight className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white capitalize">{record.record_type.toLowerCase()}</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">{new Date(record.created_at).toLocaleString()}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{record.provider}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`font-bold ${record.record_type === "DEPOSIT" ? "text-green-500" : "text-white"}`}>
                    {record.record_type === "DEPOSIT" ? "+" : "-"} Rs {Number(record.amount).toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    {getStatusIcon(record.status)}
                    <span className={`text-xs font-bold ${getStatusColor(record.status)}`}>
                      {record.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
