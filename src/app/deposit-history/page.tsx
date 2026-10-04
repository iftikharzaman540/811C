"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, PackageOpen, CheckCircle, Clock, XCircle } from "lucide-react";
import { apiRequest } from "@/utils/api";

type DepositRecord = {
  id: string;
  amount: string | number;
  status: string;
  created_at: string;
  provider: string;
  transaction_id?: string;
  reference_id?: string;
};

type DepositHistoryResponse = {
  range_start: string;
  range_end: string;
  total: number;
  records: DepositRecord[];
};

export default function DepositHistoryPage() {
  const [range, setRange] = useState<"1d" | "7d" | "30d">("1d");
  const [data, setData] = useState<DepositHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory(range);
  }, [range]);

  const fetchHistory = async (selectedRange: string) => {
    try {
      setLoading(true);
      const res = await apiRequest(`/payments/deposit-history?range=${selectedRange}`);
      setData(res);
    } catch (err) {
      console.error("Failed to fetch deposit history", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateString = (dateString: string) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  const displayRangeStart = data ? formatDateString(data.range_start) : formatDateString(new Date().toISOString());
  const displayRangeEnd = data ? formatDateString(data.range_end) : formatDateString(new Date().toISOString());

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'APPROVED':
      case 'SUCCESS':
        return "text-green-500";
      case 'REJECTED':
      case 'FAILED':
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'APPROVED':
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED':
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-white font-sans relative overflow-x-hidden bg-[#111]">
      {/* Background Image / Overlay mimicking purple casino theme */}
      
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-900 via-[#111] to-black opacity-90 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-neutral-800 shadow-md">
          <Link href="/profile" className="p-1 -ml-1 flex items-center justify-center">
            <ChevronLeft className="w-7 h-7 text-[#ffdf00]" />
          </Link>
          <h1 className="text-lg text-white font-normal absolute left-1/2 -translate-x-1/2">Deposit history</h1>
          <div className="w-8"></div>
        </header>

        {/* Tabs */}
        <div className="flex bg-[#1a1a1a] border-b border-neutral-800">
          <button 
            onClick={() => setRange("1d")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${range === "1d" ? "text-[#ffdf00] border-[#ffdf00]" : "text-neutral-400 border-transparent"}`}
          >
            1 Days
          </button>
          <button 
            onClick={() => setRange("7d")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${range === "7d" ? "text-[#ffdf00] border-[#ffdf00]" : "text-neutral-400 border-transparent"}`}
          >
            7 Days
          </button>
          <button 
            onClick={() => setRange("30d")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${range === "30d" ? "text-[#ffdf00] border-[#ffdf00]" : "text-neutral-400 border-transparent"}`}
          >
            30 Days
          </button>
        </div>

        {/* Info Bar */}
        <div className="flex justify-between items-center px-4 py-2 bg-[#1a1a1a] border-b border-neutral-800 text-xs">
          <span className="text-white">{displayRangeStart} to {displayRangeEnd}</span>
          <span className="text-[#a084e8]">Total: {data ? data.total.toLocaleString() : 0} PKR</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffdf00]"></div>
            </div>
          ) : !data || data.records.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-neutral-400">
              <PackageOpen className="w-20 h-20 mb-4 opacity-20 text-[#a084e8]" strokeWidth={1} />
              <p className="text-sm">It is empty here</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data.records.map((record) => (
                <div key={record.id} className="bg-[#1a1a1a]/80 backdrop-blur-sm rounded-lg p-4 border border-neutral-800 shadow-lg">
                  <div className="flex justify-between items-start mb-2 border-b border-neutral-800/50 pb-2">
                    <div>
                      <h3 className="font-bold text-[#ffdf00] text-lg">{Number(record.amount).toLocaleString()} PKR</h3>
                      <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">{record.provider}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(record.status)}
                        <span className={`text-sm font-bold capitalize ${getStatusColor(record.status)}`}>
                          {record.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-neutral-400">
                      <span>{formatDateString(record.created_at)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatTime(record.created_at)}</span>
                    </div>
                    <div className="text-xs text-neutral-500 truncate max-w-[120px]" title={record.transaction_id || record.reference_id || record.id}>
                      ID: {record.transaction_id || record.reference_id || record.id.slice(0,8)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
