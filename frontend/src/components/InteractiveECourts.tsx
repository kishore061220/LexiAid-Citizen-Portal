import React, { useState, useEffect } from "react";
import { 
  Scale, 
  Search, 
  Printer, 
  Download, 
  Calendar, 
  Info, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ChevronRight, 
  Building2, 
  Check, 
  User,
  Bookmark
} from "lucide-react";

// Types
interface CaseRecord {
  cnr: string;
  caseNumber: string;
  title: string;
  type: string;
  status: "Pending" | "Decided" | "Under Investigation";
  nextHearing: string;
  court: string;
  judge: string;
  petitioner: string;
  respondent: string;
  summary: string;
  timeline: { date: string; event: string }[];
  extendedVerdict?: string;
  decreeDate?: string;
}

interface CauseListItem {
  serial: number;
  caseNumber: string;
  parties: string;
  advocates: string;
  courtroom: string;
  stage: string;
}

// Prefilled interactive datasets
const mockCasesData: CaseRecord[] = [
  {
    cnr: "MHOS010024682025",
    caseNumber: "WP/4821/2026",
    title: "Ananya Sharma vs. State of Maharashtra & Ors.",
    type: "Writ Petition (Civil)",
    status: "Pending",
    nextHearing: "July 15, 2026",
    court: "Bombay High Court, Bench VII",
    judge: "Hon'ble Justice S. K. Patel",
    petitioner: "Ananya Sharma (Citizen Advocate)",
    respondent: "State of Maharashtra & Local Municipal Authority",
    summary: "Writ of Mandamus directing the local municipal officer to halt an illegal demolition threat and ensure immediate personal tenement protections under domestic residency law.",
    timeline: [
      { date: "2026-03-15", event: "Case officially filed and registered in high court administrative side." },
      { date: "2026-04-10", event: "Interim stay application argued. Notice sent to respondent municipal commissioner." },
      { date: "2026-05-18", event: "Interim Protection Order Passed. The Court hereby directs the local protection officer to ensure the petitioner is not dispossessed from her shared lodging and remains protected under domestic residency clauses pending final review." }
    ],
    decreeDate: "2026-05-18",
    extendedVerdict: `IN THE HIGH COURT OF JUDICATURE AT BOMBAY
APPELLATE CIVIL JURISDICTION / WRIT PETITION NO. 4821 OF 2026

Ananya Sharma                                            ... Petitioner
    v/s
State of Maharashtra & Ors.                              ... Respondents

CORAM: HON'BLE JUSTICE S. K. PATEL.

INTERIM PROTECTIVE DECREE DIRECTIVES:
Upon heating contentions put forth by the petitioner in person, and evaluating the immediate material threat of dispossession from standard tenement block (Bandra West complex) without due process of law:

1. The Court hereby directs the local municipal corporation and land revenue officers to keep any pending eviction or demolition processes strictly in abeyance till the next date of hearing of this petition.
2. The protection department and local Station House Officer (SHO) are mandated to ensure the petitioner is not dispossessed from her shared lodging.
3. Any violation of this interim order shall denote direct contempt of court under Article 215, liable for statutory prosecution.

BY ORDER OF THE HON'BLE COURT,
DEPUTY REGISTRAR (JUDICIAL SECTIONS)`
  },
  {
    cnr: "DLHC020089152025",
    caseNumber: "CS/309/2025",
    title: "Rahul Gupta vs. Apex Electronics Ltd.",
    type: "Civil Suit (Consumer Appeal)",
    status: "Decided",
    nextHearing: "N/A (Disposed)",
    court: "Delhi National Consumer Forum",
    judge: "President Judge R. N. Sahay",
    petitioner: "Rahul Gupta (Citizen Consumer)",
    respondent: "Apex Electronics Ltd. (Retail & Service Hub)",
    summary: "Lawsuit filed seeking hardware compensation and refund regarding deficiency of system repairs services and high-pressure deceptive commerce tactics.",
    timeline: [
      { date: "2025-11-05", event: "Grievance dispute filed and verified at the Consumer Commission registry." },
      { date: "2026-02-14", event: "Apex Electronics submitted their written argument admitting service delay but contesting motherboard cost." },
      { date: "2026-04-10", event: "Final Order Pronounced. Deficiency of service established. Opposite party directed to replace the defective motherboard or pay complete refund of ₹45,000." }
    ],
    decreeDate: "2026-04-10",
    extendedVerdict: `IN THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION
NEW DELHI (REGISTRATION NO. CS/309/2025)

Rahul Gupta, Resident of Saket, Delhi                   ... Complainant
    v/s
Apex Electronics Ltd., Service Hub Branch                ... Opposite Party

PRESIDING CORAM: PRESIDENT JUDGE R. N. SAHAY.

FINAL DIRECTIVES AND DECREE SHEETS:
This is a complaint under Section 35 of the Consumer Protection Act, 2019. The complainant argues hardware redundancy and absolute service failures by the hub. 

1. Deficiency of service is hereby established. The system hub had locked user equipment for 90 days without providing concrete diagnosis.
2. The Opposite Party is directed to replace the defective motherboard with a brand-new certified replacement, or pay a complete refund of ₹45,000 with 9% annual interest from the registration date.
3. A litigation expense fee of ₹10,000 shall be dispatched to the complainant's verified holding account within 30 calendar days.

DISPOSED ACCORDINGLY under Commission Signatures,
COURT SECRETARY AND SEAL COMPTROLLER`
  },
  {
    cnr: "TNHC050041232026",
    caseNumber: "BA/195/2026",
    title: "State of Tamil Nadu vs. Prakash Kumar",
    type: "Bail Application (Criminal)",
    status: "Under Investigation",
    nextHearing: "June 25, 2026",
    court: "Madras High Court, Bench III",
    judge: "Hon'ble Justice M. Elangovan",
    petitioner: "State of Tamil Nadu (Cyber Crime Division)",
    respondent: "Prakash Kumar (Accused Lead Admin)",
    summary: "Criminal investigation regarding remote database manipulation and unauthorized credential harvesting compiled under IT Act Section 66.",
    timeline: [
      { date: "2026-04-02", event: "First Information Report registered and accused arrested under cyber warrant." },
      { date: "2026-05-10", event: "Bail application argued in High Court. Defense counsel argued for bail. Standard prosecution opposed stating threat to electronic forensic logs. Bail rejected by the Bench to safeguard statutory IT audit protocols." }
    ],
    decreeDate: "2026-05-10",
    extendedVerdict: `IN THE HIGH COURT OF JUDICATURE AT MADRAS
CRIMINAL APPELLATE SECTION / BAIL PETITION NO. 195 OF 2026

Prakash Kumar Rathinam, Accused Lead Admin             ... Petitioner
    v/s
State of Tamil Nadu (Bandra Cyber Cell division)          ... Complainant

PRESIDING CORAM: HON'BLE JUSTICE M. ELANGOVAN.

BAIL REJECTION ORDER & MOTIVATION:
This is a miscellaneous application for bail pending trial coordinates under IT Act, 2000 Section 66. The petitioner is accused of deploying high-level query scripts to copy security parameters.

1. Defense counsel argued for bail on accounts of family ties and clean antecedents.
2. The standard prosecution heavily opposed, citing that the suspect holds master cloud infrastructure credentials and represents a potential threat to active electronic forensic logs and server configurations.
3. Therefore, Bail is hereby rejected to safeguard statutory IT audit protocols. The investigative head is ordered to file the final chargesheet within 30 days.

BAIL SCHEDULING CLOSED,
REGISTRAR OF HIGH COURT APENDICES`
  }
];

const mockCauseList: CauseListItem[] = [
  {
    serial: 1,
    caseNumber: "WP/4821/2026",
    parties: "Ananya Sharma vs. State of Maharashtra & Ors.",
    advocates: "Adv. D. S. Mehta vs. Govt. Pleader",
    courtroom: "Courtroom 3, Bench VII",
    stage: "Hearing (Admission/Directions)"
  },
  {
    serial: 2,
    caseNumber: "CS/309/2025",
    parties: "Rahul Gupta vs. Apex Electronics Ltd.",
    advocates: "Adv. Pooja Rao vs. Adv. Vignesh Kumar",
    courtroom: "Courtroom 5, National Commission",
    stage: "Final Judgment Pronouncement"
  },
  {
    serial: 3,
    caseNumber: "BA/195/2026",
    parties: "State of Tamil Nadu vs. Prakash Kumar",
    advocates: "Public Prosecutor vs. Adv. Kiran Saxena",
    courtroom: "Courtroom 2, Madras High Court",
    stage: "Warrant/Hearing for Bail"
  },
  {
    serial: 4,
    caseNumber: "PIL/88/2025",
    parties: "Green Earth Association vs. Union of India",
    advocates: "Adv. Swetha Nair vs. Additional Solicitor General",
    courtroom: "Courtroom 1 (Chief Justice Bench)",
    stage: "Public Safety Review"
  }
];

interface InteractiveECourtsProps {
  triggerAlert: (text: string, type: "success" | "error") => void;
  session: any;
}

export default function InteractiveECourts({ triggerAlert, session }: InteractiveECourtsProps) {
  const [eCourtActiveSubtab, setECourtActiveSubtab] = useState<"status" | "causeList" | "orders" | "efiling">("status");
  
  // Tab 1: Case Status search states
  const [caseSearchType, setCaseSearchType] = useState<"cnr" | "party" | "caseNumber">("cnr");
  const [caseSearchQuery, setCaseSearchQuery] = useState("");
  const [searchedCaseResult, setSearchedCaseResult] = useState<CaseRecord | null>(null);
  const [caseSearchError, setCaseSearchError] = useState("");

  // Tab 2: Cause List states
  const [causeListComplex, setCauseListComplex] = useState("Bombay High Court");
  const [causeListJudge, setCauseListJudge] = useState("Hon'ble Justice S. K. Patel");
  const [causeListDate, setCauseListDate] = useState("2026-06-04");
  const [causeListSearch, setCauseListSearch] = useState("");

  // Tab 3: Order search states
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"All" | "Pending" | "Decided" | "Under Investigation">("All");

  // Tab 4: Sandbox eFiling states
  const [eCourtEfilingTitle, setECourtEfilingTitle] = useState("");
  const [eCourtEfilingDetail, setECourtEfilingDetail] = useState("");
  const [eCourtEfilingSubmitting, setECourtEfilingSubmitting] = useState(false);
  const [eCourtEfilingHistory, setECourtEfilingHistory] = useState(() => {
    return [
      { title: "Kishore V vs. Ramesh Patil (Section 24 Lease Dispute Reply)", date: "2026-05-24", status: "DRAFT-SECURED", cnr: "LEGALFIL8921B" },
      { title: "Draft Grievance Writ - Unauthorized credit surge against Apex retail", date: "2026-04-18", status: "SUBMITTED-ARCHIVED", cnr: "LEGALFIL3094G" }
    ];
  });

  // Certified Decree Popup Modal state
  const [activeDecreeModalCase, setActiveDecreeModalCase] = useState<CaseRecord | null>(null);

  // Auto-fill Case search when clicking suggestion
  const triggerQuickSearch = (type: "cnr" | "party" | "caseNumber", query: string) => {
    setCaseSearchType(type);
    setCaseSearchQuery(query);
    // Directly matched search execution
    const matched = mockCasesData.find(c => {
      if (type === "cnr") {
        return c.cnr.toLowerCase().includes(query.toLowerCase());
      } else if (type === "party") {
        return c.title.toLowerCase().includes(query.toLowerCase());
      } else {
        return c.caseNumber.toLowerCase().includes(query.toLowerCase());
      }
    });

    if (matched) {
      setSearchedCaseResult(matched);
      setCaseSearchError("");
      triggerAlert(`Matched case record: ${matched.caseNumber}`, "success");
    } else {
      setSearchedCaseResult(null);
      setCaseSearchError("Suggestion match error inside localized sandbox database.");
    }
  };

  const handleCaseSearch = () => {
    setCaseSearchError("");
    const trimmed = caseSearchQuery.trim();
    if (!trimmed) {
      setCaseSearchError("Please enter a valid search string first.");
      setSearchedCaseResult(null);
      return;
    }

    const query = trimmed.toLowerCase();
    const matched = mockCasesData.find(c => {
      if (caseSearchType === "cnr") {
        return c.cnr.toLowerCase().includes(query);
      } else if (caseSearchType === "party") {
        return c.title.toLowerCase().includes(query) || 
               c.petitioner.toLowerCase().includes(query) || 
               c.respondent.toLowerCase().includes(query);
      } else {
        return c.caseNumber.toLowerCase().includes(query);
      }
    });

    if (matched) {
      setSearchedCaseResult(matched);
      triggerAlert(`Found matched case: ${matched.caseNumber}`, "success");
    } else {
      setSearchedCaseResult(null);
      setCaseSearchError("No case found. Verify keywords or try suggestions below (Sharma, Gupta, etc.).");
      triggerAlert("No match found in sandbox.", "error");
    }
  };

  // Filter certified orders
  const filteredOrders = mockCasesData.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(orderSearchQuery.toLowerCase()) || 
                          c.caseNumber.toLowerCase().includes(orderSearchQuery.toLowerCase());
    const matchesStatus = orderStatusFilter === "All" || c.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter daily cause list
  const filteredCauseList = mockCauseList.filter(item => {
    const matchesSearch = item.parties.toLowerCase().includes(causeListSearch.toLowerCase()) || 
                          item.caseNumber.toLowerCase().includes(causeListSearch.toLowerCase()) ||
                          item.advocates.toLowerCase().includes(causeListSearch.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      
      {/* Header and description */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold font-mono uppercase bg-amber-500 text-slate-950 px-2.5 py-1 rounded-md">
            🔒 Sandbox Environment
          </span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Interactive e-Courts Module
          </span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2.5">
          🏛️ In-App eCourt Services Center
        </h2>
        <p className="text-sm text-slate-600 max-w-4xl font-normal leading-relaxed">
          Access online case status trackers, review cause list rosters, print digitally certified judicial decreetal orders, and explore sandbox pleading compilations directly in-app.
        </p>
      </div>

      {/* Grid holding the 4 core Interactive eCourt Services Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Case Status */}
        <button 
          id="ecourt-card-status"
          onClick={() => { setECourtActiveSubtab("status"); }}
          className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-48 w-full ${
            eCourtActiveSubtab === "status"
              ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400"
              : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2 w-full text-2xl">
            <span>🔍</span>
            <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full select-none">
              ACTIVE MODULE
            </span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-base">Case Status</h3>
            <p className={`text-xs mt-1.5 leading-relaxed font-normal ${eCourtActiveSubtab === "status" ? "text-slate-300" : "text-slate-500"}`}>
              Check status, hearings schedules, and history of active civil or criminal cases.
            </p>
          </div>
          <span className={`inline-block text-xs font-bold mt-2 ${eCourtActiveSubtab === "status" ? "text-amber-400" : "text-amber-600"}`}>
            Check Status →
          </span>
        </button>

        {/* Card 2: Cause List */}
        <button 
          id="ecourt-card-causelist"
          onClick={() => { setECourtActiveSubtab("causeList"); }}
          className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-48 w-full ${
            eCourtActiveSubtab === "causeList"
              ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400"
              : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2 w-full text-2xl">
            <span>📋</span>
            <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full select-none">
              ACTIVE MODULE
            </span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-base">Cause List</h3>
            <p className={`text-xs mt-1.5 leading-relaxed font-normal ${eCourtActiveSubtab === "causeList" ? "text-slate-300" : "text-slate-500"}`}>
              Monitor daily judge hearing rosters and listed courtroom agendas live.
            </p>
          </div>
          <span className={`inline-block text-xs font-bold mt-2 ${eCourtActiveSubtab === "causeList" ? "text-amber-400" : "text-amber-600"}`}>
            View Cause List →
          </span>
        </button>

        {/* Card 3: Court Orders */}
        <button 
          id="ecourt-card-orders"
          onClick={() => { setECourtActiveSubtab("orders"); }}
          className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-48 w-full ${
            eCourtActiveSubtab === "orders"
              ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400"
              : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2 w-full text-2xl">
            <span>⚖️</span>
            <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full select-none">
              ACTIVE MODULE
            </span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-base">Court Orders</h3>
            <p className={`text-xs mt-1.5 leading-relaxed font-normal ${eCourtActiveSubtab === "orders" ? "text-slate-300" : "text-slate-500"}`}>
              Download certified copy texts transcribing final judgments and judge decrees.
            </p>
          </div>
          <span className={`inline-block text-xs font-bold mt-2 ${eCourtActiveSubtab === "orders" ? "text-amber-400" : "text-amber-600"}`}>
            View Orders →
          </span>
        </button>

        {/* Card 4: eFiling Drafts */}
        <button 
          id="ecourt-card-efiling"
          onClick={() => { setECourtActiveSubtab("efiling"); }}
          className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-48 w-full ${
            eCourtActiveSubtab === "efiling"
              ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400"
              : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2 w-full text-2xl">
            <span>📝</span>
            <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full select-none">
              ACTIVE MODULE
            </span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-base">eFiling Drafts</h3>
            <p className={`text-xs mt-1.5 leading-relaxed font-normal ${eCourtActiveSubtab === "efiling" ? "text-slate-300" : "text-slate-500"}`}>
              Draft litigation pleadings and compile evidence inside your secure profile history.
            </p>
          </div>
          <span className={`inline-block text-xs font-bold mt-2 ${eCourtActiveSubtab === "efiling" ? "text-amber-400" : "text-amber-600"}`}>
            eFile Now →
          </span>
        </button>

      </div>

      {/* Primary Subtab Contents Workplace Area */}
      <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* ==============================================
             SUBTAB 1: CASE STATUS INQUIRY
           ============================================== */}
        {eCourtActiveSubtab === "status" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4 space-y-1">
              <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-bold uppercase">
                Interactive Court Records Inquiry
              </span>
              <h4 className="font-serif font-bold text-slate-900 text-xl flex items-center gap-2 pt-1">
                🔍 Case Status Tracking Desk
              </h4>
              <p className="text-xs text-slate-500">Query legal records in the sandbox by CNR Number, party names, or Case filings coordinates.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left query building pane (5 cols) */}
              <div className="lg:col-span-5 space-y-5 bg-slate-50 border p-5 rounded-2xl">
                <h5 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Search Configuration</h5>
                
                {/* Selector Type Tabs */}
                <div className="flex rounded-lg border bg-white p-0.5 gap-0.5">
                  <button
                    onClick={() => { setCaseSearchType("cnr"); setCaseSearchError(""); }}
                    className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all ${
                      caseSearchType === "cnr" ? "bg-slate-905 text-slate-950 font-bold bg-amber-50" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    CNR Code
                  </button>
                  <button
                    onClick={() => { setCaseSearchType("party"); setCaseSearchError(""); }}
                    className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all ${
                      caseSearchType === "party" ? "bg-slate-905 text-slate-950 font-bold bg-amber-50" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Party Name
                  </button>
                  <button
                    onClick={() => { setCaseSearchType("caseNumber"); setCaseSearchError(""); }}
                    className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all ${
                      caseSearchType === "caseNumber" ? "bg-slate-905 text-slate-950 font-bold bg-amber-50" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Case Number
                  </button>
                </div>

                {/* Input Text search bar */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {caseSearchType === "cnr" && "Enter 16-Character CNR Code"}
                    {caseSearchType === "party" && "Enter Petitioner or Respondent Name"}
                    {caseSearchType === "caseNumber" && "Enter Official Case Index (e.g. WP/4821/2026)"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-2.5 pl-8 pr-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:border-amber-400 outline-none"
                      placeholder={
                        caseSearchType === "cnr" ? "e.g. MHOS010024682025" : 
                        caseSearchType === "party" ? "e.g. Ananya Sharma or Gupta" : "e.g. WP/4821/2026"
                      }
                      value={caseSearchQuery}
                      onChange={(e) => setCaseSearchQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleCaseSearch(); }}
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
                  </div>
                  {caseSearchError && (
                    <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {caseSearchError}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCaseSearch}
                    className="flex-1 bg-slate-900 hover:bg-slate-850 text-white font-bold py-2 px-3 rounded-xl text-xs transition-all uppercase tracking-wide cursor-pointer"
                  >
                    Inquire Records
                  </button>
                  <button
                    onClick={() => {
                      setCaseSearchQuery("");
                      setSearchedCaseResult(null);
                      setCaseSearchError("");
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                {/* Suggestions Quick Buttons */}
                <div className="border-t pt-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Quick Demo Suggestive Parameters</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => triggerQuickSearch("party", "Sharma")}
                      className="text-left py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:border-amber-400 hover:bg-amber-50/20 transition-all flex justify-between items-center"
                    >
                      <span>👤 Sharma (Civil Writ)</span>
                      <span className="text-[9px] font-mono text-slate-400">Search by Name</span>
                    </button>
                    <button
                      onClick={() => triggerQuickSearch("cnr", "DLHC020089152025")}
                      className="text-left py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:border-amber-400 hover:bg-amber-50/20 transition-all flex justify-between items-center"
                    >
                      <span>🏛️ DLHC020089152025</span>
                      <span className="text-[9px] font-mono text-slate-400">Search by CNR</span>
                    </button>
                    <button
                      onClick={() => triggerQuickSearch("caseNumber", "BA/195/2026")}
                      className="text-left py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:border-amber-400 hover:bg-amber-50/20 transition-all flex justify-between items-center"
                    >
                      <span>👮 BA/195/2026 (Bail App)</span>
                      <span className="text-[9px] font-mono text-slate-400">Search by No.</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Output pane (7 cols) */}
              <div className="lg:col-span-7">
                {searchedCaseResult ? (
                  <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm relative animate-fade-in">
                    
                    {/* Badge and Title */}
                    <div className="flex flex-wrap justify-between items-start gap-4 border-b pb-3.5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                          {searchedCaseResult.type}
                        </span>
                        <h4 className="font-serif font-bold text-slate-900 text-lg sm:text-xl">
                          {searchedCaseResult.title}
                        </h4>
                      </div>
                      
                      <span className={`text-[10px] font-mono uppercase font-bold px-3 py-1 rounded-full border shadow-sm ${
                        searchedCaseResult.status === "Decided" 
                          ? "bg-teal-50 text-teal-700 border-teal-200" 
                          : searchedCaseResult.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        ● {searchedCaseResult.status}
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">CNR Number</span>
                        <span className="font-mono font-medium text-slate-800">{searchedCaseResult.cnr}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Case Code / Index</span>
                        <span className="font-bold text-slate-800">{searchedCaseResult.caseNumber}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Presiding Bench & Hall</span>
                        <span className="font-medium text-slate-800">{searchedCaseResult.court}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Hon'ble Judge name</span>
                        <span className="font-medium text-slate-800">{searchedCaseResult.judge}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Petitioner / Applicant</span>
                        <span className="font-medium text-slate-800 truncate block">{searchedCaseResult.petitioner}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Next Hearing / Disposed Date</span>
                        <span className="font-serif font-bold text-slate-805 text-slate-900">{searchedCaseResult.nextHearing}</span>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-slate-50 rounded-2xl p-4 border space-y-1">
                      <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Plain English Matter Summary</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {searchedCaseResult.summary}
                      </p>
                    </div>

                    {/* Timeline History */}
                    <div className="space-y-4">
                      <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest border-b pb-1">Judicial Proceedings History</span>
                      <div className="space-y-4 pl-3 relative border-l border-slate-200">
                        {searchedCaseResult.timeline.map((act, idx) => (
                          <div key={idx} className="relative space-y-1">
                            <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full border border-white bg-slate-800 ring-2 ring-slate-200" />
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-slate-400 font-bold">{act.date}</span>
                              {idx === searchedCaseResult.timeline.length - 1 && (
                                <span className="text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.2 rounded font-mono uppercase font-bold animate-pulse">LATEST</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-normal">{act.event}</p>
                            
                            {/* Special download action button for orders details */}
                            {idx === searchedCaseResult.timeline.length - 1 && searchedCaseResult.extendedVerdict && (
                              <button
                                onClick={() => {
                                  setActiveDecreeModalCase(searchedCaseResult);
                                  triggerAlert("Preparing certified digital copy for download...", "success");
                                }}
                                className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-800 hover:underline cursor-pointer"
                              >
                                <Download className="w-3 h-3 shrink-0" /> Download certified copy of this Order Sheet (PDF)
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-slate-50 border rounded-3xl p-8 text-center h-full min-h-[350px] flex flex-col justify-center items-center space-y-3.5">
                    <span className="text-5xl">🏛️</span>
                    <div className="space-y-1.5">
                      <h4 className="font-serif font-bold text-slate-900 text-base">Inquire eCourts Database</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-normal">
                        Type a keyword in the query panel on the left, or click on any Suggestion Pill to immediately see dynamic case tracking data and timelines!
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ==============================================
             SUBTAB 2: DAILY CAUSE LIST ROSTER LISTINGS
           ============================================== */}
        {eCourtActiveSubtab === "causeList" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4 space-y-1 flex flex-wrap justify-between items-end gap-4">
              <div>
                <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-bold uppercase">
                  Daily presides scheduling
                </span>
                <h4 className="font-serif font-bold text-slate-900 text-xl flex items-center gap-2 pt-1">
                  📋 Listed Courtroom Cause Lists
                </h4>
                <p className="text-xs text-slate-500">Monitor morning and afternoon rosters published by the respective metropolitan registrar office.</p>
              </div>

              {/* Print roster quick tool */}
              <button
                onClick={() => {
                  triggerAlert("Roster printing format initialized. Press Ctrl+P or save as PDF.", "success");
                  setTimeout(() => { window.print(); }, 200);
                }}
                className="px-3.5 py-2 hover:bg-slate-100 border text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Print Cause List
              </button>
            </div>

            {/* Filters panel */}
            <div className="bg-slate-50 border p-4.5 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs">
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono select-none">Court Complex</span>
                <select 
                  value={causeListComplex}
                  onChange={(e) => setCauseListComplex(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-white font-medium focus:border-amber-400 cursor-pointer"
                >
                  <option>Bombay High Court</option>
                  <option>Delhi National Consumer Forum</option>
                  <option>Madras High Court</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono select-none">Presiding Coram</span>
                <select 
                  value={causeListJudge}
                  onChange={(e) => setCauseListJudge(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-white font-medium focus:border-amber-400 cursor-pointer"
                >
                  <option>Hon'ble Justice S. K. Patel</option>
                  <option>President Judge R. N. Sahay</option>
                  <option>Hon'ble Justice M. Elangovan</option>
                  <option>Full Division Bench I</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono select-none">Roster Listing Date</span>
                <input 
                  type="date"
                  value={causeListDate}
                  onChange={(e) => setCauseListDate(e.target.value)}
                  className="w-full p-2 rounded-xl border bg-white font-medium focus:border-amber-400 outline-none"
                />
              </div>

              {/* Roster Search */}
              <div className="space-y-1 font-normal">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono select-none">Search Parties / Advocates</span>
                <div className="relative">
                  <input 
                    type="text"
                    value={causeListSearch}
                    onChange={(e) => setCauseListSearch(e.target.value)}
                    placeholder="Search listed row..."
                    className="w-full p-2 pl-7.5 rounded-xl border bg-white focus:border-amber-400 outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

            </div>

            {/* Table of listings */}
            <div className="border rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white font-mono uppercase tracking-wider text-[10px] border-b">
                      <th className="py-3 px-4 text-center font-bold">Ser No</th>
                      <th className="py-3 px-4 font-bold">Case No</th>
                      <th className="py-3 px-4 font-bold">Parties Involved</th>
                      <th className="py-3 px-4 font-bold">Counsel Advocates</th>
                      <th className="py-3 px-4 font-bold">Presiding Hall</th>
                      <th className="py-3 px-4 font-bold">Purpose / Stage</th>
                      <th className="py-3 px-4 text-center font-bold">Action Inquiry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-slate-700">
                    {filteredCauseList.length > 0 ? (
                      filteredCauseList.map((item) => (
                        <tr key={item.serial} className="hover:bg-amber-500/5 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-center font-mono text-slate-400">{item.serial}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 font-mono select-all">{item.caseNumber}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{item.parties}</td>
                          <td className="py-3.5 px-4 text-slate-500">{item.advocates}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-mono">{item.courtroom}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold rounded-lg border border-amber-100">
                              {item.stage}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => {
                                setECourtActiveSubtab("status");
                                triggerQuickSearch("caseNumber", item.caseNumber);
                              }}
                              className="px-2.5 py-1 text-[10px] bg-slate-950 hover:bg-amber-500 hover:text-slate-950 font-bold text-white rounded-lg transition-all cursor-pointer uppercase tracking-wider scale-95"
                            >
                              Inspect Status
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 p-4 text-center text-slate-400 select-none">
                          <span className="text-2xl block">📋</span>
                          <p className="font-semibold text-slate-500 mt-1">No matches found matching filter "{causeListSearch}"</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Roster disclaimer warning */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed flex gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong>Notice regarding listing boards updates:</strong> Roster boards shown are temporary compilations. Daily updates are synchronized with the supreme registrar's desk at 09:30 AM every business day. For certified urgency, please consult with your registered registry attorney.
              </div>
            </div>

          </div>
        )}

        {/* ==============================================
             SUBTAB 3: COURT ORDERS & CERTIFIED REGISTER COPIES
           ============================================== */}
        {eCourtActiveSubtab === "orders" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4 space-y-1">
              <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-bold uppercase">
                Decrees & verdicts directory
              </span>
              <h4 className="font-serif font-bold text-slate-900 text-xl flex items-center gap-2 pt-1">
                ⚖️ Certified Judicial Orders Registry
              </h4>
              <p className="text-xs text-slate-500">Search and download certified copy files of court final verdicts and judge decrees signed digitally.</p>
            </div>

            {/* Quick search filter search bar */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex-1 relative min-w-[240px]">
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search orders by title, party names, or Case number..."
                  className="w-full text-xs p-2.5 pl-8 rounded-xl border focus:border-amber-400 outline-none font-medium"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
              </div>

              {/* Status picker layout */}
              <div className="flex gap-1 bg-slate-50 border rounded-xl p-1 text-[11px] font-semibold">
                {(["All", "Pending", "Decided", "Under Investigation"] as const).map((stat) => (
                  <button
                    key={stat}
                    onClick={() => setOrderStatusFilter(stat)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      orderStatusFilter === stat
                        ? "bg-slate-900 text-white font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {stat}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards grid list match the user's screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((itm) => (
                  <div 
                    key={itm.cnr}
                    className="bg-white border rounded-2xl p-5 hover:border-slate-350 shadow-sm transition-all flex flex-col justify-between hover:shadow-md space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                          itm.status === "Decided" 
                            ? "bg-teal-50 text-teal-700 border-teal-200" 
                            : itm.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {itm.status}
                        </span>
                        
                        <span className="text-[10px] font-semibold text-slate-400 font-mono">
                          Released: {itm.decreeDate || "N/A"}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-sm text-slate-900 leading-normal">
                        {itm.title}
                      </h4>

                      <div className="bg-slate-50 rounded-xl p-3 border font-normal border-slate-100">
                        <p className="text-[11px] text-slate-600 italic leading-relaxed line-clamp-4">
                          "{itm.timeline[itm.timeline.length - 1]?.event || itm.summary}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t mt-4 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">{itm.caseNumber}</span>
                      <button
                        onClick={() => {
                          setActiveDecreeModalCase(itm);
                          triggerAlert(`Preparing digitally signed decree for copy: ${itm.caseNumber}`, "success");
                        }}
                        className="px-3 py-1.5 bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer select-none"
                      >
                        <Download className="w-3 h-3 text-amber-400 shrink-0" /> Download certified decree
                      </button>
                    </div>

                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-3 text-center py-12 border bg-slate-50 rounded-2xl p-6 text-slate-400 space-y-1.5">
                  <span className="text-2xl">⚖️</span>
                  <p className="font-semibold text-slate-500">No certified orders matched</p>
                  <p className="text-xs text-slate-400">Try modifying your search or checking another filter status.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==============================================
             SUBTAB 4: SANDBOX COMPLAINT BUILDING & EFILING
           ============================================== */}
        {eCourtActiveSubtab === "efiling" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4 space-y-1">
              <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-bold uppercase">
                Citizen Interactive Area
              </span>
              <h4 className="font-serif font-bold text-slate-900 text-xl flex items-center gap-2 pt-1">
                📝 Interactive eFiling Sandbox & Complaint Builder
              </h4>
              <p className="text-xs text-slate-500 font-sans">Assemble basic civil / criminal petition abstracts, pre-review OCR files integration, and draft files.</p>
            </div>

            {/* Sandbox Informative box */}
            <div className="bg-amber-500/15 border border-amber-300 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed flex gap-3">
              <Info className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Sandbox Drafting Protocols:</strong> This utility enables litigants to organize draft complaints offline safely. Once completed, your compiled case history is stored securely in standard storage below, from where it can be exported or printed for official registry filing.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Form panel */}
              <div className="space-y-4 bg-slate-50 border p-5 sm:p-6 rounded-2xl shadow-xs">
                <h5 className="font-serif font-bold text-slate-950 text-sm uppercase border-b pb-2 select-none text-slate-800">
                  Compose Pleading Summon
                </h5>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Select Dispute Act Authority</label>
                  <select className="w-full text-xs p-2.5 rounded-xl border bg-white focus:border-amber-400 cursor-pointer">
                    <option>Article 226, Constitution Mandamus Appeal</option>
                    <option>Section 35, Consumer Protection Code, 2019</option>
                    <option>Section 24, Rent Control Premises Eviction Act</option>
                    <option>Criminal Procedural complaint Under Section 154</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Matter Title (Petitioner vs Respondent)</label>
                  <input
                    type="text"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border bg-white focus:border-amber-400 outline-none font-medium"
                    placeholder="e.g. Ananya Sharma vs. Municipal Commissioner"
                    value={eCourtEfilingTitle}
                    onChange={(e) => setECourtEfilingTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Statement of facts / Pleadings Summary</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full text-xs p-2.5 rounded-xl border bg-white focus:border-amber-400 outline-none leading-relaxed font-normal"
                    placeholder="Provide a clear chronological list of dispute details, grievance indices, and required judicial remedy..."
                    value={eCourtEfilingDetail}
                    onChange={(e) => setECourtEfilingDetail(e.target.value)}
                  />
                </div>

                {/* Simulated file uploader */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Signed Affidavit Evidence Attachment</span>
                  <div className="border-2 border-dashed border-slate-250 p-4 text-center rounded-xl bg-white hover:bg-slate-100/50 cursor-pointer transition-colors select-none">
                    <span className="text-xl block">📂</span>
                    <span className="text-[11px] font-bold text-slate-700 block mt-1">Upload verified evidence sheets</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">supporting formats: PDF, JPG, PNG (Max 10MB)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const t = eCourtEfilingTitle.trim();
                    const d = eCourtEfilingDetail.trim();
                    if (!t || !d) {
                      triggerAlert("Pleadings title and narrative summary are mandatory.", "error");
                      return;
                    }
                    setECourtEfilingSubmitting(true);
                    setTimeout(() => {
                      const newCNR = "LEGALFIL" + Math.floor(1000 + Math.random() * 9000) + "S";
                      setECourtEfilingHistory(prev => [
                        { title: t, date: new Date().toISOString().split("T")[0], status: "DRAFT-SECURED", cnr: newCNR },
                        ...prev
                      ]);
                      setECourtEfilingTitle("");
                      setECourtEfilingDetail("");
                      setECourtEfilingSubmitting(false);
                      triggerAlert(`Sandbox draft registered under CNR: ${newCNR}`, "success");
                    }, 800);
                  }}
                  disabled={eCourtEfilingSubmitting}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {eCourtEfilingSubmitting ? "Syncing secured drafting files..." : "Save Draft inside Legal Sandbox Profile"}
                </button>
              </div>

              {/* Historical Lists panel */}
              <div className="space-y-4">
                <h5 className="font-serif font-bold text-slate-900 text-sm select-none">
                  Your Sandbox Filings Tracking
                </h5>

                {eCourtEfilingHistory.length > 0 ? (
                  <div className="space-y-3 font-normal">
                    {eCourtEfilingHistory.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                        <div className="flex justify-between items-start gap-4">
                          <h6 className="font-bold text-slate-900 text-xs truncate max-w-[200px]">{item.title}</h6>
                          <span className={`text-[8px] font-mono tracking-wider uppercase font-bold px-2 py-0.5 rounded border ${
                            item.status === "SUBMITTED-ARCHIVED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                          <span>CNR Code: <strong className="text-slate-650 font-bold">{item.cnr}</strong></span>
                          <span>Saved: {item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded-2xl bg-slate-50 text-slate-40 display-block space-y-1.5 text-xs text-slate-400">
                    <span className="text-xl block">📁</span>
                    <p className="font-semibold text-slate-500">No active sandbox drafts findable</p>
                    <p className="px-6 max-w-xs mx-auto text-slate-400 leading-relaxed">Draft complaints on the left pane to initialize dynamic temporary court registries.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Note banner at bottom */}
      <div id="gov-gateway-disclosure" className="bg-amber-500/10 border-2 border-amber-400/40 rounded-2xl p-5 space-y-2 lg:flex items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-900">
            <Info className="w-4.5 h-4.5 text-amber-700 shrink-0" />
            <span className="font-serif font-bold text-sm">Official Government Gateway Access Protocol</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-normal">
            Official judicial proceedings, daily roster lists, and authoritative petitions are administered by the Department of Justice, Ministry of Law and Justice, Govt of India. LexiAid provides a secure gateway context — redirections open securely inside verified external encryption tabs.
          </p>
        </div>

        <a 
          href="https://services.ecourts.gov.in/ecourtindia_v6/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl tracking-wider text-center uppercase shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0"
        >
          OFFICIAL ECOURTS WEBSITE 🌐
        </a>
      </div>

      {/* ==============================================
           WATERMARKED HIGH-FIDELITY OFFICIAL MODAL OVERLAY
         ============================================== */}
      {activeDecreeModalCase && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border-t-8 border-amber-500 animate-slide-up">
            
            {/* Close button */}
            <button
              onClick={() => setActiveDecreeModalCase(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-1.5 rounded-lg hover:bg-slate-105 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              title="Close Decree overlay"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Emblem and Court identity */}
            <div className="text-center space-y-1 border-b pb-4">
              <div className="mx-auto w-12 h-12 bg-amber-500/15 text-amber-500 rounded-full flex items-center justify-center border-2 border-amber-500 border-dashed">
                <Scale className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-serif font-extrabold text-slate-900 text-base uppercase tracking-wider block">
                Official Judicial Copy / Certified Decree
              </h3>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                Ministry of Law & Justice • Govt. of India
              </p>
            </div>

            {/* Backdrop watermarked visual watermark container */}
            <div className="relative p-1 rounded-2xl bg-amber-500/[0.01] border border-amber-500/10 max-h-[320px] overflow-y-auto">
              {/* Translucent absolute watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.045] rotate-[-25deg] select-none">
                <span className="text-6xl font-serif font-extrabold tracking-widest text-slate-950 block">CERTIFIED COPIED</span>
              </div>
              
              <pre className="text-[11px] leading-relaxed font-mono text-slate-700 whitespace-pre-wrap select-all font-medium break-all p-3.5">
                {activeDecreeModalCase.extendedVerdict}
              </pre>
            </div>

            {/* Verification attributes and stamps footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 items-center border-t border-slate-100 text-xs">
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono select-none">Verification DigiStamp Seal</span>
                <p className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" /> Verified Cryptographic Signature
                </p>
                <span className="text-[9px] font-mono text-slate-400 block select-all">SHA256: 0x981A...F892</span>
              </div>

              <div className="space-y-1 text-left sm:text-right">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono select-none">Electronic Certificate Registry</span>
                <p className="text-[11px] font-semibold text-slate-700 italic">
                  Granted: {activeDecreeModalCase.decreeDate || "2026-06-04"}
                </p>
                <span className="text-[9px] font-mono text-slate-400 block">Section 65B Indian Evidence Act Valid</span>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-2.5 pt-1.5 font-semibold text-xs justify-end">
              <button
                onClick={() => {
                  triggerAlert("Digital decree exported successfully as PDF.", "success");
                }}
                className="px-4 py-2.5 bg-slate-950 text-white hover:bg-slate-800 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 shrink-0 text-amber-400" /> Save Offline PDF
              </button>
              
              <button
                onClick={() => {
                  triggerAlert("Decree copy sent to print channel.", "success");
                  window.print();
                }}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 shrink-0" /> Print Decree
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
