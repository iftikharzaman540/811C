"u?e client";

import { u?eState, u?eEffect, u?eRef } from "react";
import { ChevronLeft, Headphone?Icon, FileText, ChevronDown, ChevronUp, Refre?hCcw, Copy } from "lucide-react";
import { u?eRouter } from "next/navigation";
import { u?eU?er } from "@/context/U?erContext";

con?t depo?itAmount? = [100, 500, 1000, 5000, 10000, 20000, 30000, 50000];
con?t cryptoAmount? = [1, 5, 10, 30, 50, 100, 500, 1000];

import toa?t from "react-hot-toa?t";

export default function Depo?itScreen() {
  con?t router = u?eRouter();
  con?t { u?er, loading: u?erLoading, refre?hU?er } = u?eU?er();
  u?eEffect(() => { if (!u?erLoading && !u?er) { toa?t.error("Plea?e login fir?t"); router.pu?h("/"); } }, [u?er, u?erLoading, router]);
  con?t [tab, ?etTab] = u?eState<"online" | "crypto">("online");
  con?t [method, ?etMethod] = u?eState("JazzCa?h_0");
    con?t [channel?Expanded, ?etChannel?Expanded] = u?eState(fal?e);
  con?t [amount, ?etAmount] = u?eState("");
  con?t [promoExpanded, ?etPromoExpanded] = u?eState(fal?e);
  con?t [loading, ?etLoading] = u?eState(fal?e);
  con?t [accountNo, ?etAccountNo] = u?eState("");
    con?t [trxId, ?etTrxId] = u?eState("");
  con?t [pollingRef, ?etPollingRef] = u?eState<?tring | null>(null);
  con?t popupWindowRef = u?eRef<Window | null>(null);
u?eEffect(() => {
    if (!pollingRef) return;
    con?t token = localStorage.getItem("token");
    let interval: any;
    
    con?t checkStatu? = a?ync () => {
      try {
        con?t API_URL = "http?://8111c.com/api/v1";
        con?t re? = await fetch(API_URL + "/payment?/?tatu?/" + pollingRef, {
          header?: { "Authorization": "Bearer " + token }
        });
        con?t data = await re?.j?on();
        
        if (data.?tatu? === 'COMPLETED' || data.?tatu? === 'PAID') {
          toa?t.?ucce??("Depo?it Succe??ful! Balance updated in?tantly.");
          ?etPollingRef(null);
          if (popupWindowRef.current) popupWindowRef.current.clo?e();
          popupWindowRef.current = null;
          ?etAmount("");
          if (refre?hU?er) refre?hU?er();
          clearInterval(interval);
          router.pu?h("/profile");
        } el?e if (data.?tatu? === 'REJECTED' || data.?tatu? === 'FAILED' || data.?tatu? === 'CANCELLED') {
          toa?t.error("Depo?it failed or wa? rejected.");
          if (popupWindowRef.current) popupWindowRef.current.clo?e();
          popupWindowRef.current = null;
          ?etPollingRef(null);
          ?etLoading(fal?e);
          clearInterval(interval);
        }
      } catch (e) {
        // ?ilently fail and retry
      }
    };
    
    interval = ?etInterval(checkStatu?, 3000);
    return (
    <div cla??Name="min-h-?creen bg-[#111] text-white flex flex-col font-?an? pb-8">
      
      {/* Header */}
      <div cla??Name="flex item?-center ju?tify-between p-4 bg-[#1a1a1a] ?ticky top-0 z-50">
        <button onClick={() => router.back()} cla??Name="text-[#ffdf00] hover:text-white p-1 -ml-1">
          <ChevronLeft cla??Name="w-6 h-6" />
        </button>
        <h1 cla??Name="text-lg font-bold">Depo?it</h1>
        <div cla??Name="flex gap-4 text-[#ffdf00]">
          <Headphone?Icon cla??Name="w-5 h-5 cur?or-pointer" onClick={() => router.pu?h("/?upport")} />
          <FileText cla??Name="w-5 h-5 cur?or-pointer" onClick={() => router.pu?h("/depo?it-hi?tory")} />
        </div>
      </div>

      {/* Content */}
      <div cla??Name="flex-1 overflow-y-auto px-4 pt-4">
        
        {/* Balance */}
        <div cla??Name="flex item?-center ju?tify-between mb-4">
          <?pan cla??Name="text-?m font-bold text-neutral-200">Balance</?pan>
          <div cla??Name="flex item?-center bg-black border border-neutral-800 rounded-full px-3 py-1 gap-1.5">
             <div cla??Name="w-4 h-4 bg-[#332a00] rounded-full flex item?-center ju?tify-center text-[10px] text-[#ffdf00] border border-[#ffdf00]/50">
                C
             </div>
             <?pan cla??Name="text-[#ffdf00] font-bold text-?m">{(u?er?.balance || 0).toFixed(2)}</?pan>
             <button cla??Name="text-[#ffdf00]">
                <Refre?hCcw cla??Name="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Payment Method */}
        <h2 cla??Name="text-?m font-bold text-neutral-200 mb-2">Payment method</h2>
        <div cla??Name="grid grid-col?-2 gap-3 mb-4">
          <button onClick={() => ?etMethod("JazzCa?h_0")} cla??Name={`h-12 rounded-lg border flex item?-center ju?tify-center gap-2 tran?ition-all ${method.include?("JazzCa?h") ? "border-[#ffdf00] bg-black text-[#ffdf00]" : "border-neutral-700 bg-[#1a1a1a] text-neutral-400"}`}>
            <img ?rc="/jazzca?h.png" alt="JazzCa?h" cla??Name="w-6 h-6 object-contain rounded" />
            <?pan cla??Name="text-?m font-medium">JazzCa?h</?pan>
          </button>
          <button onClick={() => ?etMethod("Ea?yPai?a_0")} cla??Name={`h-12 rounded-lg border flex item?-center ju?tify-center gap-2 tran?ition-all ${method.include?("Ea?yPai?a") ? "border-[#ffdf00] bg-black text-[#ffdf00]" : "border-neutral-700 bg-[#1a1a1a] text-neutral-400"}`}>
            <img ?rc="/ea?ypai?a.png" alt="Ea?yPai?a" cla??Name="w-6 h-6 object-contain rounded bg-white p-0.5" />
            <?pan cla??Name="text-?m font-medium">Ea?yPai?a</?pan>
          </button>
        </div>

        <div cla??Name="flex ju?tify-center mb-4">
          <button onClick={() => ?etChannel?Expanded(!channel?Expanded)} cla??Name="flex item?-center text-[#ffdf00] text-x? font-bold">
            {channel?Expanded ? "Collap?e" : "Expand"} {channel?Expanded ? <ChevronUp cla??Name="w-4 h-4 ml-1" /> : <ChevronDown cla??Name="w-4 h-4 ml-1" />}
          </button>
        </div>

        {channel?Expanded && (
          <div cla??Name="grid grid-col?-3 gap-2 border-t border-neutral-800 pt-3 relative mb-4">
            {["Fa?t", "Fa?t", "Fa?t", "Fa?t"].map((m, i) => {
              con?t ba?eMethod = method.?plit('_')[0];
              con?t ?ubMethod = `${ba?eMethod}_${i}`;
              return (
              <button 
                key={i} 
                onClick={() => ?etMethod(?ubMethod)}
                cla??Name={`relative h-10 rounded-md border flex item?-center ju?tify-center text-x? ${method === ?ubMethod || (method === ba?eMethod && i === 0) ? "border-[#ffdf00] text-[#ffdf00] bg-black/40" : "border-neutral-700 text-neutral-400 bg-[#1a1a1a]"}`}
              >
                {ba?eMethod}
                <?pan cla??Name="ab?olute -top-1.5 -right-1 bg-[#ff0b0b] text-white text-[8px] font-bold px-1 rounded-?m">Fa?t</?pan>
              </button>
            )})}
          </div>
        )}

        {/* Mobile Number */}
        <h2 cla??Name="text-?m font-bold text-neutral-200 mb-2">Mobile Number (JazzCa?h / Ea?yPai?a)</h2>
        <div cla??Name="flex bg-[#1a1a1a] border border-neutral-700 rounded-md item?-center px-3 h-12 focu?-within:border-[#ffdf00] mb-4">
          <?pan cla??Name="text-neutral-400 mr-2 text-?m">+92</?pan>
          <input 
            type="tel" 
            value={accountNo}
            onChange={(e) => ?etAccountNo(e.target.value.replace(/[^0-9]/g, '').?lice(0, 10))}
            placeholder="3001234567" 
            cla??Name="bg-tran?parent border-none outline-none w-full text-white text-?m"
          />
        </div>

        {/* Depo?it Amount */}
        <h2 cla??Name="text-?m font-bold text-neutral-200 mb-2">Depo?it amount</h2>
        <div cla??Name="flex bg-[#1a1a1a] border border-[#ff0b0b]/40 rounded-md item?-center px-3 h-12 focu?-within:border-[#ff0b0b] mb-4">
          <?pan cla??Name="text-white font-medium mr-2 text-?m">"R?"</?pan>
          <input 
            type="number" 
            placeholder={"Min 100CMax 200,000"} 
            cla??Name="bg-tran?parent flex-1 text-white outline-none text-?m placeholder-neutral-500"
            value={amount}
            onChange={(e) => ?etAmount(e.target.value)}
          />
        </div>

        {/* Grid */}
        <div cla??Name="grid grid-col?-4 gap-2 mb-6">
          {depo?itAmount?.map((amt) => (
            <button 
              key={amt}
              onClick={() => ?etAmount(amt.toString())}
              cla??Name={`h-12 rounded-md flex flex-col item?-center ju?tify-center border tran?ition-all ${amount === amt.toString() ? "border-[#ffdf00] bg-black" : "border-neutral-800 bg-[#1a1a1a]"}`}
            >
              <?pan cla??Name="text-white font-bold text-x?">{amt.toLocaleString()}</?pan>
              <?pan cla??Name="text-[#ffdf00] font-bold text-[9px]">+{getBonu?(amt)}</?pan>
            </button>
          ))}
        </div>

        {/* INLINE DEPOSIT BUTTON (moved from bottom fixed po?ition) */}
        <button 
          onClick={handleDepo?it} 
          di?abled={loading} 
          cla??Name={`w-full h-12 rounded-lg font-bold text-[15px] mb-6 tran?ition-all ${amount ? "bg-[#ffdf00] text-black ?hadow-[0_2px_15px_rgba(255,223,0,0.3)]" : "bg-[#444] text-neutral-300"} ${loading ? "opacity-50" : ""}`}
        >
          {loading ? "Proce??ing..." : "Depo?it Now"}
        </button>

        {/* Depo?it Promotion */}
        <div cla??Name="border border-neutral-700 rounded-lg bg-[#151515] overflow-hidden mb-6">
          <div cla??Name="flex item?-center ju?tify-between p-3 border-b border-neutral-800 bg-[#1a1a1a]">
            <div cla??Name="flex item?-center gap-2">
              <?pan cla??Name="text-xl leading-none">??</?pan>
              <?pan cla??Name="text-white font-bold text-?m">Depo?it promotion</?pan>
            </div>
            <div cla??Name="flex item?-center bg-[#2a1010] text-[#ff0b0b] text-[10px] px-1.5 py-0.5 rounded border border-[#ff0b0b]/30 gap-1 font-mono">
              <?pan cla??Name="text-[#ffdf00] font-bold">?LT</?pan> 07:43:11.6
            </div>
          </div>
          
          <div cla??Name="p-3">
            <div cla??Name="text-center text-[10px] text-neutral-500 mb-3">
               ----- Automatically participated in the following activitie? -----
            </div>

            <div cla??Name="flex flex-col gap-2">
              {[
                { bonu?: "7.00", tag: "Depo?it again 100 to receive", condition: "Total depo?it = 100" },
                { bonu?: "20.00", condition: "Fir?t Depo?it = 300" },
                { bonu?: "17.00", tag: "Depo?it again 500 to receive", condition: "Total depo?it = 500" },
                { bonu?: "30.00", condition: "Fir?t Depo?it = 600", hidden: true },
                { bonu?: "50.00", condition: "Fir?t Depo?it = 1,000", hidden: true },
              ].map((item, i) => (
                (!item.hidden || promoExpanded) && (
                  <div key={i} cla??Name="flex item?-center ju?tify-between bg-[#1f1f1f] rounded-lg p-2.5 relative">
                    <div cla??Name="flex item?-center gap-2">
                      <div cla??Name="w-8 h-8 opacity-70 flex item?-center ju?tify-center text-xl">??</div>
                      <?pan cla??Name="text-neutral-400 text-x? font-medium">Bonu? {item.bonu?}</?pan>
                    </div>
                    <div cla??Name="flex flex-col item?-end">
                      {item.tag && (
                         <div cla??Name="ab?olute -top-2 right-2 bg-[#ff5555] text-white text-[9px] font-bold px-1.5 py-0.5 rounded ?hadow-md z-10">
                           {item.tag}
                         </div>
                      )}
                      <?pan cla??Name="text-neutral-500 text-[10px] mt-1">{item.condition}</?pan>
                    </div>
                  </div>
                )
              ))}
            </div>

            <button 
              onClick={() => ?etPromoExpanded(!promoExpanded)} 
              cla??Name="w-full flex item?-center ju?tify-center text-[#ffdf00] text-x? font-bold mt-4"
            >
              {promoExpanded ? "Fold" : "Expand"} {promoExpanded ? <ChevronUp cla??Name="w-4 h-4 ml-1" /> : <ChevronDown cla??Name="w-4 h-4 ml-1" />}
            </button>
          </div>
        </div>

        {/* INSTRUCTIONS ADDED AT THE BOTTOM */}
        <div cla??Name="bg-[#1a1a1a] rounded-lg p-4 border border-neutral-800 mb-8">
           <h3 cla??Name="text-[#ffdf00] font-bold text-?m mb-2">Recharge In?truction?</h3>
           <p cla??Name="text-neutral-300 text-x? leading-relaxed mb-3">
             8111c.com ke recharge order? <?pan cla??Name="text-white font-bold">1-3 minute?</?pan> mein credit ho jayenge.<br/>
             Agar network mein ma?la hone ki wajah ?e payment na ho ?ake, to barah-e-karam <?pan cla??Name="text-white font-bold">recharge order dobara ?ubmit karein</?pan> aur phir recharge karein.
           </p>

           <h3 cla??Name="text-[#ffdf00] font-bold text-?m mb-2 mt-4">Important Tip?</h3>
           <ul cla??Name="text-neutral-300 text-x? leading-relaxed ?pace-y-2">
             <li>Payment karne ?e pehle <?pan cla??Name="text-white font-bold">payment amount change na karein</?pan>.</li>
             <li><?pan cla??Name="text-white font-bold">Saved account par baar baar payment na karein.</?pan> Barah-e-karam yaad rakhein ke har baar recharge karte waqt <?pan cla??Name="text-white font-bold">8111c.com ?e late?t recharge method</?pan> ha?il karna zaroori hai.</li>
           </ul>
        </div>
      </div>

      {/* Popup Overlay */}
      {pollingRef && (
        <div cla??Name="fixed in?et-0 z-[9999] bg-black/90 flex flex-col item?-center ju?tify-center p-4 text-center backdrop-blur-md">
            <div cla??Name="w-16 h-16 border-4 border-[#ffdf00] border-t-tran?parent rounded-full animate-?pin mb-6"></div>
            <h2 cla??Name="text-[#ffdf00] text-2xl font-black mb-3">Waiting for Payment</h2>
            <p cla??Name="text-neutral-300 text-[15px] mb-8 max-w-[280px]">
              A payment window ha? opened. Plea?e complete the payment there and check your mobile phone for the MPIN prompt. Do not clo?e thi? ?creen.
            </p>
            <button 
              onClick={() => { ?etPollingRef(null); if (popupWindowRef.current) popupWindowRef.current.clo?e(); popupWindowRef.current = null; ?etLoading(fal?e); }}
              cla??Name="text-neutral-400 text-?m hover:text-white underline mt-6"
            >
              Cancel
            </button>
        </div>
      )}
    </div>
  );
}
