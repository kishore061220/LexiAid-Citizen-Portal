/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { 
  Scale, 
  Phone, 
  BookOpen, 
  ShieldAlert, 
  FileText, 
  Search, 
  LogOut, 
  LogIn, 
  UserPlus, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Lock, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ArrowRight, 
  Building2,
  ListFilter,
  Check,
  User,
  HeartHandshake,
  Menu,
  X,
  Bookmark,
  Printer,
  Download,
  Calendar
} from "lucide-react";
import { UserSession } from "./types";
import { dictionaryTerms, helplineItems, rightsCategories } from "./data";
import InteractiveECourts from "./components/InteractiveECourts";

// Pre-defined static datasets for old interactive eCourts module
export const mockCasesData = [
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
      { date: "2026-05-18", event: "Interim Protection Order Passed. The court directed protection officers to ensure applicant's shared lodging is secure pending final review." }
    ]
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
      { date: "2026-04-10", event: "Final Order Pronounced. Deficiency established; opponent ordered to replace the system board and pay ₹45,000 refund." }
    ]
  },
  {
    cnr: "TNHC050041232026",
    caseNumber: "BA/195/2026",
    title: "State of Tamil Nadu vs. Prakash Kumar.",
    type: "Bail Application (Criminal)",
    status: "Under Investigation",
    nextHearing: "June 25, 2026",
    court: "Madras High Court, Bench III",
    judge: "Hon'ble Justice M. Elangovan",
    petitioner: "State of Tamil Nadu (Represented by Bandra Cyber Branch)",
    respondent: "Prakash Kumar (Accused System Administrator)",
    summary: "Criminal investigation regarding remote database manipulation and unauthorized credential harvesting compiled under IT Act Section 66.",
    timeline: [
      { date: "2026-04-02", event: "First Information Report registered and accused arrested under cyber warrant." },
      { date: "2026-05-10", event: "Bail application argued in High Court. Prosecution presented digital log forensics claiming extreme systemic threat. Bail rejected." }
    ]
  }
];

export const mockCauseList = [
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

export default function App() {
  // Navigation & View states
  const [portalSection, setPortalSection] = useState<"home" | "rights" | "fir" | "dictionary" | "helplines" | "eCourts" | "docScan">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Interactive Document Scanner / OCR Simulation States
  const [docUploadedFile, setDocUploadedFile] = useState<string | null>(null);
  const [docUploadedFileName, setDocUploadedFileName] = useState<string | null>(null);
  const [docUploadProgress, setDocUploadProgress] = useState<number>(0);
  const [docIsScanning, setDocIsScanning] = useState<boolean>(false);
  const [docScanSelectedSample, setDocScanSelectedSample] = useState<"notice" | "agreement" | "fir" | null>(null);
  const [docActiveAnalysisTab, setDocActiveAnalysisTab] = useState<"summary" | "statutes" | "actions">("summary");
  const [docDragHover, setDocDragHover] = useState<boolean>(false);
  
  // Auth states
  const [session, setSession] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authView, setAuthView] = useState<"none" | "login" | "register">("none");
  
  // Auth Form parameters
  const [fullNameInput, setFullNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Legal rights sub-selection
  const [selectedRightsCategory, setSelectedRightsCategory] = useState<string>("women");
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>("dv-act");

  // Dictionary search
  const [dictionaryQuery, setDictionaryQuery] = useState("");
  const [dictionaryCategory, setDictionaryCategory] = useState<string>("All");
  const [showOnlyBookmarkedTerms, setShowOnlyBookmarkedTerms] = useState(false);
  const [bookmarkedTermIds, setBookmarkedTermIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("lexiaid_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("lexiaid_bookmarks", JSON.stringify(bookmarkedTermIds));
  }, [bookmarkedTermIds]);

  // Helplines category
  const [helplineCategory, setHelplineCategory] = useState<string>("All");

  // eCourts states
  const [eCourtActiveSubtab, setECourtActiveSubtab] = useState<"status" | "causeList" | "orders" | "efiling">("status");
  const [eCourtEfilingTitle, setECourtEfilingTitle] = useState("");
  const [eCourtEfilingDetail, setECourtEfilingDetail] = useState("");
  const [eCourtEfilingSubmitting, setECourtEfilingSubmitting] = useState(false);
  const [eCourtEfilingHistory, setECourtEfilingHistory] = useState<{title: string, date: string, status: string}[]>(() => {
    return [
      { title: "Kishore V vs. Ramesh Patil (Section 24 Lease Dispute Reply)", date: "2026-05-24", status: "DRAFT-SECURED" },
      { title: "Draft Grievance Writ - Unauthorized credit surge against Apex retail", date: "2026-04-18", status: "SUBMITTED-ARCHIVED" }
    ];
  });

  // Interactive eCourt inputs
  const [caseSearchType, setCaseSearchType] = useState<"cnr" | "party" | "caseNumber">("cnr");
  const [caseSearchQuery, setCaseSearchQuery] = useState("");
  const [searchedCaseResult, setSearchedCaseResult] = useState<any | null>(null);
  const [caseSearchError, setCaseSearchError] = useState("");
  
  // Cause list filters
  const [causeListComplex, setCauseListComplex] = useState("Bombay High Court");
  const [causeListDate, setCauseListDate] = useState("2026-06-04");
  
  // Certified Orders state
  const [activeDecreeModalCase, setActiveDecreeModalCase] = useState<any | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Toast / Status notify
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Restore session from localStorage if present
  useEffect(() => {
    const storedToken = localStorage.getItem("lexiaid_token");
    if (storedToken) {
      setToken(storedToken);
      fetchSession(storedToken);
    }
  }, []);

  const triggerAlert = (text: string, type: "success" | "error" = "success") => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const validateAndProcessFile = (file: File) => {
    // Validate format
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
      triggerAlert("Invalid file format. Only JPG, PNG, and PDF documents are supported.", "error");
      return;
    }
    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      triggerAlert("File exceeds 10MB limit. Please upload compact legal documents.", "error");
      return;
    }

    setDocUploadedFileName(file.name);
    setDocScanSelectedSample(null);

    // Read preview or placeholder
    const reader = new FileReader();
    reader.onload = (event) => {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        // Set PDF placeholder icon state
        setDocUploadedFile("pdf-placeholder");
      } else {
        setDocUploadedFile(event.target?.result as string);
      }
      
      setDocIsScanning(true);
      setDocUploadProgress(0);
      const interval = setInterval(() => {
        setDocUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setDocIsScanning(false);
            triggerAlert(`${file.name.toUpperCase()} analyzed successfully! View the plain-English translation under tabs.`, "success");
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    };
    reader.readAsDataURL(file);
  };

  const handleCaseSearch = () => {
    setCaseSearchError("");
    if (!caseSearchQuery.trim()) {
      setCaseSearchError("Please input a valid search parameter first.");
      setSearchedCaseResult(null);
      return;
    }

    const query = caseSearchQuery.trim().toLowerCase();
    
    // Find matching case
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
      triggerAlert(`Matched case record: ${matched.caseNumber}`, "success");
    } else {
      setSearchedCaseResult(null);
      setCaseSearchError("No matching case registry found in database. Try using quick search filters below.");
      triggerAlert("No match found.", "error");
    }
  };

  const fetchSession = async (sessionToken: string) => {
    try {
      const res = await fetch("/api/session", {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.active) {
          setSession(data.user);
        }
      } else {
        // Clear stale session
        localStorage.removeItem("lexiaid_token");
        setToken(null);
        setSession(null);
      }
    } catch (err) {
      console.error("Failed to restore session:", err);
    }
  };

  // User Actions handlers
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    if (!fullNameInput.trim() || !emailInput.trim() || !passwordInput.trim()) {
      setAuthError("Please fill out all required fields.");
      setAuthLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullNameInput,
          email: emailInput,
          password: passwordInput,
          phone: phoneInput
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAuthSuccess("Registration completed! You can now log in below.");
        // Switch to login view shortly or directly clear inputs
        setFullNameInput("");
        setPhoneInput("");
        // Move to login state smoothly
        setTimeout(() => {
          setAuthView("login");
          setAuthSuccess("Please enter your registered credentials to log in.");
        }, 1500);
      } else {
        setAuthError(data.error || "Failed to register.");
      }
    } catch (err) {
      setAuthError("Failed to communicate with authentication server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError("Please fill in both email and password.");
      setAuthLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput
        })
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setSession(data.user);
        localStorage.setItem("lexiaid_token", data.token);
        setAuthView("none");
        setEmailInput("");
        setPasswordInput("");
        triggerAlert(`Welcome back, ${data.user.fullName}!`, "success");
      } else {
        setAuthError(data.error || "Login credentials failed.");
      }
    } catch (err) {
      setAuthError("Failed to communicate with authentication server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      await fetch("/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    localStorage.removeItem("lexiaid_token");
    setToken(null);
    setSession(null);
    triggerAlert("Logged out safely. Have a wonderful day!", "success");
    setPortalSection("home");
  };

  const triggerDemoLogin = () => {
    setEmailInput("ananya@lexiaid.com");
    setPasswordInput("password123");
    setAuthView("login");
    setAuthSuccess("Demo credentials filled! Hit Sign In to log in.");
  };

  // Filtering lists
  const filteredTerms = dictionaryTerms.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(dictionaryQuery.toLowerCase()) || 
                          item.definition.toLowerCase().includes(dictionaryQuery.toLowerCase());
    const matchesCategory = dictionaryCategory === "All" || item.category === dictionaryCategory;
    const matchesBookmark = !showOnlyBookmarkedTerms || bookmarkedTermIds.includes(item.id);
    return matchesSearch && matchesCategory && matchesBookmark;
  });

  const uniqueDictionaryCategories = ["All", ...Array.from(new Set(dictionaryTerms.map(t => t.category)))];

  const filteredHelplines = helplineItems.filter(item => {
    return helplineCategory === "All" || item.category === helplineCategory;
  });

  const uniqueHelplineCategories = ["All", ...Array.from(new Set(helplineItems.map(h => h.category)))];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 text-slate-800">
      
      {/* Dynamic Toast System */}
      {alertMessage && (
        <div id="toast-notify" className="fixed top-20 right-6 z-50 animate-bounce transition-all duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border text-white ${
            alertMessage.type === "success" ? "bg-emerald-600 border-emerald-500" : "bg-rose-600 border-rose-500"
          }`}>
            {alertMessage.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium text-sm">{alertMessage.text}</span>
          </div>
        </div>
      )}

      {/* Primary Shared Navigation Bar */}
      <nav id="main-nav" className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800/80 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and Legal Slogan */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setPortalSection("home"); }}>
              <div className="bg-amber-500 text-slate-900 p-2 rounded-xl shadow-sm shadow-amber-500/20">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  LexiAid <span className="text-amber-400 font-sans text-xs bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">Citizen Portal</span>
                </span>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase -mt-0.5 hidden xs:block">Legal Literacy Ecosystem</p>
              </div>
            </div>

            {/* Platform Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest hidden sm:inline">Portal Status:</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live & Protected
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* SUB-MENU COMPONENT */}
        <div id="sub-navigation" className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-30 transition-all font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* DESKTOP TABLET VIEW (md:flex, hidden on mobile) */}
            <div className="hidden md:flex items-center justify-between h-14 w-full">
              
              {/* Left Container: Navigation Links */}
              <div className="flex items-center flex-wrap gap-1 lg:gap-1.5 xl:gap-2 py-1">
                <button
                  id="tab-home"
                  onClick={() => { setPortalSection("home"); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                    portalSection === "home"
                      ? "bg-slate-100 text-slate-900 font-semibold border-b border-amber-500 rounded-b-none"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  🌐 Overview
                </button>
                <button
                  id="tab-rights"
                  onClick={() => { setPortalSection("rights"); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                    portalSection === "rights"
                      ? "bg-slate-100 text-slate-900 font-semibold border-b border-amber-500 rounded-b-none"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  🛡️ Legal Rights
                </button>
                <button
                  id="tab-fir"
                  onClick={() => { setPortalSection("fir"); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                    portalSection === "fir"
                      ? "bg-slate-100 text-slate-900 font-semibold border-b border-amber-500 rounded-b-none"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  📝 FIR Guidance
                </button>
                <button
                  id="tab-dictionary"
                  onClick={() => { setPortalSection("dictionary"); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                    portalSection === "dictionary"
                      ? "bg-slate-100 text-slate-900 font-semibold border-b border-amber-500 rounded-b-none"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  📖 Dictionary
                </button>
                <button
                  id="tab-helplines"
                  onClick={() => { setPortalSection("helplines"); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                    portalSection === "helplines"
                      ? "bg-slate-100 text-slate-900 font-semibold border-b border-amber-500 rounded-b-none"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  📞 Emergency Helplines
                </button>
                <button
                  id="tab-ecourts"
                  onClick={() => { setPortalSection("eCourts"); setECourtActiveSubtab("status"); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                    portalSection === "eCourts"
                      ? "bg-slate-100 text-slate-900 font-semibold border-b border-amber-500 rounded-b-none"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  🏛️ eCourt Services
                </button>
                <button
                  id="tab-docscan"
                  onClick={() => { setPortalSection("docScan"); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                    portalSection === "docScan"
                      ? "bg-slate-100 text-slate-900 font-semibold border-b border-amber-500 rounded-b-none"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  📄 Document Scanner
                </button>
              </div>

              {/* Right Container: Authentication Buttons */}
              <div className="flex items-center gap-2 pl-4 shrink-0 border-l border-slate-200">
                {session ? (
                  <div className="flex items-center gap-2.5">
                    <div className="hidden lg:flex flex-col text-right">
                      <span className="text-xs font-semibold text-slate-800">{session.fullName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Secured User</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                      {session.fullName.charAt(0).toUpperCase()}
                    </div>
                    <button
                      id="btn-logout"
                      onClick={handleLogout}
                      title="Log Out"
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      id="btn-trigger-login"
                      onClick={() => { setAuthError(""); setAuthSuccess(""); setAuthView("login"); }}
                      className="text-xs font-semibold px-2.5 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Sign In
                    </button>
                    <button
                      id="btn-trigger-register"
                      onClick={() => { setAuthError(""); setAuthSuccess(""); setAuthView("register"); }}
                      className="text-xs bg-slate-950 text-white font-semibold px-3 py-2 rounded-lg hover:bg-slate-800 shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-amber-400" /> Sign Up
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* MOBILE NAVIGATION ROW (md:hidden, shown on mobile/tablet) */}
            <div className="md:hidden flex items-center justify-between h-14 w-full">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold">Portal Menu</span>
                <span className="font-serif font-bold text-slate-900 text-sm">
                  {portalSection === "home" && "🌐 Overview"}
                  {portalSection === "rights" && "🛡️ Legal Rights"}
                  {portalSection === "fir" && "📝 FIR Guidance"}
                  {portalSection === "dictionary" && "📖 Dictionary"}
                  {portalSection === "helplines" && "📞 Helplines"}
                  {portalSection === "eCourts" && "🏛️ eCourts"}
                  {portalSection === "docScan" && "📄 Scanner"}
                </span>
              </div>
              
              <button
                id="mobile-hamburger-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* MOBILE INTERACTIVE DROPDOWN DRAWER */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-slate-100 py-3 space-y-1 animate-fade-in bg-white max-h-[80vh] overflow-y-auto">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 pb-1 pt-2 font-mono">Ecosystem Map</div>
                <button
                  id="mob-tab-home"
                  onClick={() => { setPortalSection("home"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                    portalSection === "home" ? "bg-amber-50 text-amber-905 font-bold bg-amber-100/50" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <span className="text-base">🌐</span> Overview
                </button>
                <button
                  id="mob-tab-rights"
                  onClick={() => { setPortalSection("rights"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                    portalSection === "rights" ? "bg-amber-50 text-amber-905 font-bold bg-amber-100/50" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <span className="text-base">🛡️</span> Legal Rights
                </button>
                <button
                  id="mob-tab-fir"
                  onClick={() => { setPortalSection("fir"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                    portalSection === "fir" ? "bg-amber-50 text-amber-905 font-bold bg-amber-100/50" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <span className="text-base">📝</span> FIR Guidance
                </button>
                <button
                  id="mob-tab-dictionary"
                  onClick={() => { setPortalSection("dictionary"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                    portalSection === "dictionary" ? "bg-amber-50 text-amber-905 font-bold bg-amber-100/50" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <span className="text-base">📖</span> Dictionary & Lexicon
                </button>
                <button
                  id="mob-tab-helplines"
                  onClick={() => { setPortalSection("helplines"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                    portalSection === "helplines" ? "bg-amber-50 text-amber-905 font-bold bg-amber-100/50" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <span className="text-base">📞</span> Emergency Helplines
                </button>
                <button
                  id="mob-tab-ecourts"
                  onClick={() => { setPortalSection("eCourts"); setECourtActiveSubtab("status"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                    portalSection === "eCourts" ? "bg-amber-50 text-amber-905 font-bold bg-amber-100/50" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <span className="text-base">🏛️</span> eCourt Services
                </button>
                <button
                  id="mob-tab-docscan"
                  onClick={() => { setPortalSection("docScan"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                    portalSection === "docScan" ? "bg-amber-50 text-amber-905 font-bold bg-amber-101/50" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <span className="text-base">📄</span> Legal Document Scanner
                </button>

                <div className="border-t border-slate-100 my-2 pt-3 px-3">
                  {session ? (
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                          {session.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">{session.fullName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Secured Account</span>
                        </div>
                      </div>
                      <button
                        id="mob-btn-logout"
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                        style={{ minHeight: "36px" }}
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 pb-2">
                      <button
                        id="mob-btn-trigger-login"
                        onClick={() => { setAuthError(""); setAuthSuccess(""); setAuthView("login"); setMobileMenuOpen(false); }}
                        className="text-xs font-semibold px-3 py-2.5 text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 border"
                        style={{ minHeight: "44px" }}
                      >
                        <LogIn className="w-3.5 h-3.5" /> Sign In
                      </button>
                      <button
                        id="mob-btn-trigger-register"
                        onClick={() => { setAuthError(""); setAuthSuccess(""); setAuthView("register"); setMobileMenuOpen(false); }}
                        className="text-xs bg-slate-950 text-white font-semibold px-3 py-2.5 rounded-lg hover:bg-slate-800 shadow-sm transition-colors flex items-center justify-center gap-1.5"
                        style={{ minHeight: "44px" }}
                      >
                        <UserPlus className="w-3.5 h-3.5 text-amber-400" /> Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      {/* MAIN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ==============================================
             PORTAL TAB: THE IMMERSIVE CITIZEN TOOLKIT 
           ============================================== */}
          <div className="space-y-8 animate-fade-in">
            
            {/* PORTAL SECTION: HOME */}
            {portalSection === "home" && (
              <div className="space-y-12">
                
                {/* Hero Banner with Premium Styling */}
                <div className="bg-radial from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
                  
                  <div className="max-w-3xl relative z-10 space-y-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      ⚖️ Simplified Legal Access Engine
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
                      Empowering Citizens with Legal Awareness.
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                      Statutory law can often feel like a foreign tongue. LexiAid bridges this critical gap by translating complex legal codes into simple, actionable plain English. Know your basic citizen rights, access step-by-step FIR help, and query the legal dictionary 24/7.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => setPortalSection("rights")}
                        className="bg-amber-400 text-slate-950 text-sm sm:text-base font-bold px-6 py-3 rounded-xl hover:bg-amber-300 transition-all shadow-lg hover:shadow-amber-500/10 cursor-pointer"
                      >
                        Explore Legal Rights
                      </button>
                      <button
                        onClick={() => { setPortalSection("docScan"); }}
                        className="bg-slate-800/80 hover:bg-slate-800 text-white text-sm sm:text-base font-semibold px-6 py-3 rounded-xl border border-slate-700/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-amber-400" /> Scan Legal Document
                      </button>
                    </div>
                  </div>

                  {/* Quick features bar at bottom */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/60">
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">Status</span>
                      <p className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live & Protected
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">Language</span>
                      <p className="text-sm font-semibold text-slate-200 mt-1">Plain Translation</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">Curated Database</span>
                      <p className="text-sm font-semibold text-slate-200 mt-1">40+ Core Statutes</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">Accessibility</span>
                      <p className="text-sm font-semibold text-amber-400 mt-1">Free / Citizen First</p>
                    </div>
                  </div>
                </div>

                {/* Main Feature Cards Grid */}
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 border-b pb-2 flex items-center gap-2.5">
                    <Scale className="w-6 h-6 text-slate-900" /> Integrated Citizen Modules
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <div 
                      onClick={() => setPortalSection("rights")}
                      className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400/60 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                          🛡️
                        </div>
                        <h3 className="font-serif font-bold text-lg text-slate-900">Legal Rights Guidelines</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Clean handbooks across 4 vital pillars: Women's Safety, Consumer Protection, Cybercrime Security, and Student Rights.
                        </p>
                      </div>
                      <span className="mt-4 text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                        Explore booklets <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div 
                      onClick={() => setPortalSection("fir")}
                      className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400/60 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                          📝
                        </div>
                        <h3 className="font-serif font-bold text-lg text-slate-900">FIR filing Checklist</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Filing an FIR can be daunting. Access a step-by-step interactive wizard detailing exact actions and legal protections.
                        </p>
                      </div>
                      <span className="mt-4 text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                        View Wizard <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div 
                      onClick={() => setPortalSection("dictionary")}
                      className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400/60 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                          📖
                        </div>
                        <h3 className="font-serif font-bold text-lg text-slate-900">Law Dictionary</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Quickly search 25 core constitutional and criminal legal keywords translated into beginner-friendly English definitions.
                        </p>
                      </div>
                      <span className="mt-4 text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                        Browse dictionary <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div 
                      onClick={() => setPortalSection("helplines")}
                      className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400/60 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                          📞
                        </div>
                        <h3 className="font-serif font-bold text-lg text-slate-900">Emergency Numbers</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Curated table containing 15 national helpline numbers including specialized police, women, cyber, and legal aid.
                        </p>
                      </div>
                      <span className="mt-4 text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                        Call Numbers <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div 
                      onClick={() => { setPortalSection("eCourts"); setECourtActiveSubtab("status"); }}
                      className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400/60 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                          🏛️
                        </div>
                        <h3 className="font-serif font-bold text-lg text-slate-900">eCourt Integration</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Interactive case status lookup, check active cause lists, download judicial judge orders, and study dynamic sandbox eFiling workflows.
                        </p>
                      </div>
                      <span className="mt-4 text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                        Access eCourts <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Document Scanner Card */}
                    <div 
                      onClick={() => setPortalSection("docScan")}
                      className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400/60 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform font-mono">
                          📄
                        </div>
                        <h3 className="font-serif font-bold text-lg text-slate-900">Legal Document Scanner</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Scan real-world court notices, leases, or FIR transcripts. Drag-and-drop or select sample files to translate dense legalese into plain English.
                        </p>
                      </div>
                      <span className="mt-4 text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                        Scan Documents <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                  </div>
                </div>

                {/* Demonstration helper card */}
                {!session && (
                  <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="bg-amber-400 text-slate-950 p-2 rounded-xl mt-1 shrink-0">
                        <Info className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Interactive Citizen Demonstration Area</h4>
                        <p className="text-sm text-slate-700 mt-1">
                          You are currently browsing as a guest. Click below to automatically fill and log in with sample credentials to unlock extra tools like saving records and eCourt sandbox!
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={triggerDemoLogin}
                      className="bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold px-4 py-2.5 rounded-lg shrink-0 transition-colors"
                    >
                      Fill Demo Credentials
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* PORTAL SECTION: LEGAL RIGHTS BOOKLETS */}
            {portalSection === "rights" && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold text-slate-900">Citizens Legal Rights Pocketbooks</h2>
                  <p className="text-sm text-slate-600">Click tabs to switch categories. All contents are written in simplified language verified against Indian statutory guidelines.</p>
                </div>

                {/* Category Selection Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-100 p-1.5 rounded-2xl">
                  {rightsCategories.map(cat => {
                    const isSelected = selectedRightsCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedRightsCategory(cat.id); setExpandedArticleId(cat.articles[0]?.id || null); }}
                        className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                          isSelected
                            ? "bg-white text-slate-900 shadow"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                        }`}
                      >
                        {cat.id === "women" && "🛡️"}
                        {cat.id === "consumer" && "🛒"}
                        {cat.id === "cybercrime" && "💻"}
                        {cat.id === "student" && "🎓"}
                        {cat.title}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Category Content */}
                {(() => {
                  const category = rightsCategories.find(c => c.id === selectedRightsCategory);
                  if (!category) return null;

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                      
                      {/* Left Navigation: List of Articles */}
                      <div className="space-y-3 lg:col-span-1">
                        <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-2">
                          <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">Rights Booklet</span>
                          <h3 className="font-serif font-bold text-xl">{category.title}</h3>
                          <p className="text-xs text-slate-300 leading-relaxed">{category.description}</p>
                        </div>

                        <div className="bg-white border rounded-2xl p-3 space-y-1 shadow-sm">
                          {category.articles.map(article => {
                            const isExpanded = expandedArticleId === article.id;
                            return (
                              <button
                                key={article.id}
                                onClick={() => setExpandedArticleId(article.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                                  isExpanded 
                                    ? "bg-amber-50 text-amber-900 font-semibold" 
                                    : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span className="text-xs sm:text-sm truncate pr-2">{article.title}</span>
                                <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isExpanded ? "translate-x-1 opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Display: Expanded Article Details */}
                      <div className="lg:col-span-2 space-y-6">
                        {(() => {
                          const article = category.articles.find(a => a.id === expandedArticleId);
                          if (!article) {
                            return (
                              <div className="bg-white border select-none rounded-2xl p-12 text-center text-slate-400">
                                Please select an article on the left side to inspect its legal rules.
                              </div>
                            );
                          }

                          return (
                            <div className="bg-white border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                              <div className="space-y-2 border-b pb-4">
                                {article.act && (
                                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
                                    📜 {article.act}
                                  </span>
                                )}
                                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 pt-1">{article.title}</h3>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border-l-4 border-slate-900 mt-2">
                                  {article.summary}
                                </p>
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Key Provisions & Statutory Breakdown</h4>
                                <div className="space-y-3">
                                  {article.details.map((point, index) => (
                                    <div key={index} className="flex gap-3.5 items-start">
                                      <div className="w-5 h-5 rounded-full bg-slate-100 border text-[11px] font-semibold text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                                        {index + 1}
                                      </div>
                                      <p className="text-sm text-slate-700 leading-relaxed">{point}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Alert Disclaimer Footer context */}
                              <div className="bg-slate-900 text-[11px] text-slate-300 leading-relaxed p-4 rounded-xl border border-slate-800 space-y-1">
                                <span className="font-bold text-amber-400 uppercase flex items-center gap-1">⚠️ Citizen Awareness Notice</span>
                                This summary does not constitute formal legal assistance. Ensure you coordinate with qualified local legal departments or verified counsels regarding actual disputes.
                              </div>

                            </div>
                          );
                        })()}
                      </div>

                    </div>
                  );
                })()}

              </div>
            )}

            {/* PORTAL SECTION: STEP-BY-STEP FIR FILING GUIDANCE */}
            {portalSection === "fir" && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold text-slate-900">Step-by-Step FIR Filing Wizard</h2>
                  <p className="text-sm text-slate-600">The First Information Report (FIR) is critical to kickstart investigation proceedings. Know what steps to take, what documentation is required, and what protections you hold.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Step Guides List */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-8">
                      <h3 className="font-serif font-bold text-lg text-slate-900 border-b pb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-500" /> Physical Station Process
                      </h3>

                      {/* Numbered Flow line widgets */}
                      <div className="space-y-6 relative border-l-2 border-amber-300/60 pl-6 ml-3">
                        
                        <div className="relative">
                          <div className="absolute -left-[31px] top-0 w-4.5 h-4.5 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white ring-4 ring-slate-100">
                            1
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">Arrive at Police Station</h4>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            Visit the nearest police station relative to the event area. Remember: If they state it is outside their limits, ask to lodge a <strong>Zero FIR</strong> on the spot immediately under CrPC sections.
                          </p>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[31px] top-0 w-4.5 h-4.5 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white ring-4 ring-slate-100">
                            2
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">State Details of Incident</h4>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            Describe the complete event verbally or write a clear request containing specific dates, names, or addresses. The police officer in attendance must transcribe your verbal coordinates in plain text.
                          </p>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[31px] top-0 w-4.5 h-4.5 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white ring-4 ring-slate-100">
                            3
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">Review Written Copy</h4>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            Once the police officer types out the report, they are forced by statutory rules to read out the full content verbatim to you. Confirm that your specific testimony lines have been accurately preserved.
                          </p>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[31px] top-0 w-4.5 h-4.5 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white ring-4 ring-slate-100">
                            4
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">Apply Signature and Secure Copy</h4>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            Affix your signature only after confirming the details. It is your statutory right to receive a physical copy of the final typed document completely <strong>free of charge</strong> instantly.
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Online Reporting Links */}
                    <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4 shadow-sm">
                      <div className="flex gap-3">
                        <span className="text-2xl">🌐</span>
                        <div>
                          <h4 className="font-serif font-bold text-lg">Alternative Online Complaints</h4>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                            You do not always need to visit a physical station. Specialized web systems launched by the Government of India allow reporting cyber crime, obtaining free legal aid, and registering public grievances online.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                        <a 
                          href="https://cybercrime.gov.in" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-slate-800 hover:bg-slate-700/85 text-xs text-slate-200 p-3 rounded-xl block border border-slate-700 text-center font-semibold"
                        >
                          Cybercrime Reporting (cybercrime.gov.in)
                        </a>
                        <a 
                          href="https://pgportal.gov.in" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-slate-800 hover:bg-slate-700/85 text-xs text-slate-200 p-3 rounded-xl block border border-slate-700 text-center font-semibold"
                        >
                          Public Grievances (pgportal.gov.in)
                        </a>
                        <a 
                          href="https://nalsa.gov.in" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-slate-800 hover:bg-slate-700/85 text-xs text-slate-200 p-3 rounded-xl block border border-slate-700 text-center font-semibold"
                        >
                          Free Legal Aid (nalsa.gov.in)
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Checklist & Carry List Side Panel */}
                  <div className="space-y-6">
                    
                    <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
                      <h4 className="font-serif font-bold text-slate-900 flex items-center gap-2">
                        🎒 Complete Carry Checklist
                      </h4>
                      <p className="text-xs text-slate-500">Items that will greatly facilitate logging prompt cases:</p>
                      
                      <div className="space-y-3 pt-1">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700 leading-relaxed"><strong>Valid ID Proof</strong>: Aadhaar Card, Driving Licence, or Voter Card.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700 leading-relaxed"><strong>Written Draft Complaint</strong>: Preparing a printed/written statement in duplicate beforehand helps prevent local dictation biases.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700 leading-relaxed"><strong>Corroborative Proofs</strong>: Photos, screenshots, chat transcripts, or bills related to the incident.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700 leading-relaxed"><strong>Witness Coordinates</strong>: Record names and telephone lines of present witnesses.</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 space-y-3">
                      <h4 className="font-bold text-rose-950 flex items-center gap-2 text-sm">
                        🚨 Your Shield Against Stalling
                      </h4>
                      <p className="text-xs text-rose-800 leading-relaxed">
                        If a police officer refuses to register your FIR for a cognizable crime, you are not helpless. You can send the written complaint via registered post to the <strong>Superintendent of Police (SP)</strong> under Section 154(3). They are bound to either investigate or assign officers.
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* PORTAL SECTION: LIVE DICTIONARY */}
            {portalSection === "dictionary" && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold text-slate-900">Legal Dictionary</h2>
                  <p className="text-sm text-slate-600 font-medium">Use the search box below or select category anchors to instantly filter legal vocabularies parsed in simple plain-language statements.</p>
                </div>

                {/* Filter and Search Container */}
                <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Field */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        id="input-search-dictionary"
                        type="text"
                        placeholder="Search keywords e.g. FIR, Bail, Writ..."
                        value={dictionaryQuery}
                        onChange={(e) => setDictionaryQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all text-slate-800"
                      />
                    </div>
                    {/* Category Dropdown */}
                    <div className="flex items-center gap-2 shrink-0">
                      <ListFilter className="w-4 h-4 text-slate-400" />
                      <select
                        id="select-category-dictionary"
                        value={dictionaryCategory}
                        onChange={(e) => setDictionaryCategory(e.target.value)}
                        className="p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
                      >
                        {uniqueDictionaryCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Bookmarked Filter Pill */}
                    <button
                      onClick={() => setShowOnlyBookmarkedTerms(prev => !prev)}
                      className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        showOnlyBookmarkedTerms
                          ? "bg-amber-400 text-slate-950 border-amber-405 shadow-sm"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100/70"
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${showOnlyBookmarkedTerms ? "fill-slate-950" : ""}`} />
                      <span>{showOnlyBookmarkedTerms ? "Showing Bookmarked" : "Filter Bookmarks"}</span>
                    </button>
                  </div>

                  {/* Horizontal anchor quick buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5 border-t">
                    {uniqueDictionaryCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setDictionaryCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          dictionaryCategory === cat
                            ? "bg-slate-950 text-white font-semibold"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results block */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTerms.length > 0 ? (
                    filteredTerms.map(term => (
                      <div 
                        key={term.id} 
                        className="bg-white border rounded-2xl p-5 hover:border-amber-400/60 shadow-sm transition-all hover:shadow flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              {term.category}
                            </span>
                            <button
                              onClick={() => {
                                const isBookmarked = bookmarkedTermIds.includes(term.id);
                                if (isBookmarked) {
                                  setBookmarkedTermIds(prev => prev.filter(id => id !== term.id));
                                  triggerAlert(`Removed "${term.term}" from bookmarks.`, "success");
                                } else {
                                  setBookmarkedTermIds(prev => [...prev, term.id]);
                                  triggerAlert(`Bookmarked "${term.term}" successfully!`, "success");
                                }
                              }}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                bookmarkedTermIds.includes(term.id)
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
                              }`}
                              title={bookmarkedTermIds.includes(term.id) ? "Remove bookmark" : "Bookmark term"}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${bookmarkedTermIds.includes(term.id) ? "fill-amber-600" : ""}`} />
                            </button>
                          </div>
                          <h3 className="font-serif font-bold text-lg text-slate-900 capitalize pt-1">{term.term}</h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{term.definition}</p>
                        </div>
                        <div className="pt-4 border-t mt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                          <span>Statutory Term</span>
                          <span>LexiAid DB v1.0</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-3 text-center py-16 bg-white border rounded-2xl p-8 space-y-2">
                      <span className="text-3xl">🔎</span>
                      <h4 className="font-serif font-bold text-lg text-slate-900 pt-2">No matching definitions</h4>
                      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                        We couldn't locate references matching "{dictionaryQuery}" inside our starter database. Try seeking generic terms like "Bail", "PIL", or "FIR".
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* PORTAL SECTION: HELPLINES */}
            {portalSection === "helplines" && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold text-slate-900">National Emergency Helplines</h2>
                  <p className="text-sm text-slate-600">Click categories to filter relevant safety organizations. Numbers are click-to-call active supporting immediate emergency dispatch.</p>
                </div>

                {/* Category filters */}
                <div className="flex flex-wrap gap-2.5 bg-white border p-3 rounded-2xl shadow-sm">
                  {uniqueHelplineCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setHelplineCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        helplineCategory === cat
                          ? "bg-amber-500 text-slate-950 shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid list numbers */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHelplines.map((item, index) => (
                    <div 
                      key={index}
                      className="bg-white border rounded-2xl p-5 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-xs font-mono font-bold uppercase text-slate-400">{item.category} Emergency</span>
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            ["Police", "Women", "Crisis"].includes(item.category) ? "bg-rose-500 animate-pulse" : "bg-blue-400"
                          }`} />
                        </div>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">{item.name}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed leading-relaxed">{item.purpose}</p>
                      </div>

                      <div className="pt-4 border-t mt-4 flex items-center justify-between">
                        <a 
                          href={`tel:${item.number}`}
                          className="bg-slate-950 text-white font-mono font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 inline-flex"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" /> {item.number}
                        </a>
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">TAP TO CALL</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* PORTAL SECTION: ECOURTS INTEGRATION */}
            {portalSection === "eCourts" && (
              <InteractiveECourts 
                triggerAlert={triggerAlert}
                session={session}
              />
            )}

            {false && portalSection === "eCourts" && (
              <div className="space-y-8 animate-fade-in text-slate-800">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold font-mono uppercase bg-amber-500 text-slate-950 px-2.5 py-1 rounded-md animate-pulse">
                      Official Government Gateway
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      eCourts Projects of India
                    </span>
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2.5">
                    🏛️ National eCourts Citizen Gateway
                  </h2>
                  <p className="text-sm text-slate-600 max-w-4xl font-normal leading-relaxed">
                    Identify case status registries, view daily cause rosters, read certified copies of judgments, and compile standard pleadings. LexiAid redirects citizens directly to the legitimate Government of India database for real-time and authoritative court records.
                  </p>
                </div>

                {/* Important Government Notice Banner */}
                <div id="gov-gateway-disclosure" className="bg-amber-500/10 border-2 border-amber-400/40 rounded-2xl p-5 sm:p-6 space-y-2.5 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-900">
                    <Info className="w-5 h-5 text-amber-700 shrink-0" />
                    <span className="font-serif font-bold text-base">Interactive Redirect Protocol</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    <strong>Official Notice:</strong> Judicial proceedings, certified judge decrees, and official pleading submissions are maintained exclusively by the Department of Justice, Ministry of Law & Justice, Government of India. LexiAid operates as a transparent gatekeeper — we do not store, host, or alter official case databases. All redirections launch securely in high-encryption external browser tabs.
                  </p>
                </div>

                {/* Grid holding the 4 core eCourt Services */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Card 1: Case Status */}
                  <button 
                    id="ecourt-card-status"
                    onClick={() => { setECourtActiveSubtab("status"); }}
                    className={`text-left p-5 rounded-2xl border transition-all pointer-events-auto cursor-pointer ${
                      eCourtActiveSubtab === "status"
                        ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                    aria-label="Toggle Case Status inquiry guide"
                  >
                    <div className="flex items-center justify-between mb-3 text-2xl">
                      <span>🔍</span>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${eCourtActiveSubtab === "status" ? "bg-slate-800 text-amber-400" : "bg-slate-100 text-slate-500"}`}>Services</span>
                    </div>
                    <h3 className="font-serif font-bold text-base">Case Status Registry</h3>
                    <p className={`text-xs mt-1.5 leading-relaxed font-normal ${eCourtActiveSubtab === "status" ? "text-slate-300" : "text-slate-500"}`}>
                      Check status, hearings schedules, and history of active civil or criminal cases.
                    </p>
                    <span className={`inline-block mt-4 text-[11px] font-bold ${eCourtActiveSubtab === "status" ? "text-amber-400" : "text-blue-600 hover:underline"}`}>
                      View Guide & Link ↗
                    </span>
                  </button>

                  {/* Card 2: Cause List */}
                  <button 
                    id="ecourt-card-causelist"
                    onClick={() => { setECourtActiveSubtab("causeList"); }}
                    className={`text-left p-5 rounded-2xl border transition-all pointer-events-auto cursor-pointer ${
                      eCourtActiveSubtab === "causeList"
                        ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                    aria-label="Toggle Daily Cause List guide"
                  >
                    <div className="flex items-center justify-between mb-3 text-2xl font-normal font-sans">
                      <span>📋</span>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${eCourtActiveSubtab === "causeList" ? "bg-slate-800 text-amber-400" : "bg-slate-100 text-slate-500"}`}>Schedules</span>
                    </div>
                    <h3 className="font-serif font-bold text-base">Daily Cause List</h3>
                    <p className={`text-xs mt-1.5 leading-relaxed font-normal ${eCourtActiveSubtab === "causeList" ? "text-slate-300" : "text-slate-500"}`}>
                      Monitor daily judge hearing rosters and listed courtroom agendas live.
                    </p>
                    <span className={`inline-block mt-4 text-[11px] font-bold ${eCourtActiveSubtab === "causeList" ? "text-amber-400" : "text-blue-600 hover:underline"}`}>
                      View Guide & Link ↗
                    </span>
                  </button>

                  {/* Card 3: Court Orders */}
                  <button 
                    id="ecourt-card-orders"
                    onClick={() => { setECourtActiveSubtab("orders"); }}
                    className={`text-left p-5 rounded-2xl border transition-all pointer-events-auto cursor-pointer ${
                      eCourtActiveSubtab === "orders"
                        ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                    aria-label="Toggle Judicial Decisions and Court Orders guide"
                  >
                    <div className="flex items-center justify-between mb-3 text-2xl font-normal font-sans">
                      <span>⚖️</span>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${eCourtActiveSubtab === "orders" ? "bg-slate-800 text-amber-400" : "bg-slate-100 text-slate-500"}`}>Decisions</span>
                    </div>
                    <h3 className="font-serif font-bold text-base">Judicial Orders</h3>
                    <p className={`text-xs mt-1.5 leading-relaxed font-normal ${eCourtActiveSubtab === "orders" ? "text-slate-300" : "text-slate-500"}`}>
                      Download signed certified text transcribing final judgments and orders copies.
                    </p>
                    <span className={`inline-block mt-4 text-[11px] font-bold ${eCourtActiveSubtab === "orders" ? "text-amber-400" : "text-blue-600 hover:underline"}`}>
                      View Guide & Link ↗
                    </span>
                  </button>

                  {/* Card 4: Sandbox eFiling */}
                  <button 
                    id="ecourt-card-efiling"
                    onClick={() => { setECourtActiveSubtab("efiling"); }}
                    className={`text-left p-5 rounded-2xl border transition-all pointer-events-auto cursor-pointer ${
                      eCourtActiveSubtab === "efiling"
                        ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                    aria-label="Toggle Sandbox eFiling petition playground"
                  >
                    <div className="flex items-center justify-between mb-3 text-2xl font-normal font-sans">
                      <span>📝</span>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${eCourtActiveSubtab === "efiling" ? "bg-slate-800 text-amber-400" : "bg-slate-100 text-slate-500"}`}>Playground</span>
                    </div>
                    <h3 className="font-serif font-bold text-base">Sandbox eFiling</h3>
                    <p className={`text-xs mt-1.5 leading-relaxed font-normal ${eCourtActiveSubtab === "efiling" ? "text-slate-300" : "text-slate-500"}`}>
                      Draft citizen pleadings, review OCR transfers, and study electronic filings.
                    </p>
                    <span className={`inline-block mt-4 text-[11px] font-bold ${eCourtActiveSubtab === "efiling" ? "text-amber-400" : "text-blue-600 hover:underline"}`}>
                      Launch Sandbox Form ⚙️
                    </span>
                  </button>

                </div>

                {/* INTERACTIVE WORK AREA PANEL */}
                <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  
                  {/* SUBTAB 1: CASE STATUS */}
                  {eCourtActiveSubtab === "status" && (
                    <div className="space-y-6 animate-fade-in font-normal font-sans">
                      <div className="border-b pb-4 space-y-1">
                        <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold uppercase select-none">
                          External System Redirection Guide
                        </span>
                        <h4 className="font-serif font-bold text-slate-900 text-xl flex items-center gap-2">
                          🔍 Case Status Inquiry Gateway
                        </h4>
                        <p className="text-xs text-slate-500 font-sans font-normal">Learn how to search active criminal or civil records securely inside the official supreme court registry.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start font-sans font-normal">
                        <div className="space-y-4">
                          <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider font-sans">Required Search Parameters Checklist</h5>
                          <div className="space-y-3 font-sans">
                            <div className="flex gap-3 items-start select-none">
                              <span className="w-5 h-5 rounded-full bg-slate-100 border text-xs font-semibold text-slate-650 flex items-center justify-center shrink-0 mt-0.5 font-sans font-normal">1</span>
                              <p className="text-xs sm:text-sm text-slate-705 leading-relaxed font-sans font-normal">
                                <strong>CNR Number (Case Number Record):</strong> A unique 16-character alphanumeric code printed on your legal summons or court notice (e.g., DLHC010000002026).
                              </p>
                            </div>
                            <div className="flex gap-3 items-start select-none">
                              <span className="w-5 h-5 rounded-full bg-slate-100 border text-xs font-semibold text-slate-650 flex items-center justify-center shrink-0 mt-0.5 font-sans font-normal">2</span>
                              <p className="text-xs sm:text-sm text-slate-705 leading-relaxed font-sans font-normal">
                                <strong>Manual Case Number:</strong> If CNR is missing, enter the Case Type (e.g., Writ Petition WP / Civil Suit CS), filing number, and the corresponding year.
                              </p>
                            </div>
                            <div className="flex gap-3 items-start select-none font-sans">
                              <span className="w-5 h-5 rounded-full bg-slate-100 border text-xs font-semibold text-slate-600 flex items-center justify-center shrink-0 mt-0.5 font-sans">3</span>
                              <p className="text-xs sm:text-sm text-slate-705 leading-relaxed font-sans font-normal">
                                <strong>Party Names:</strong> If both numbers are unavailable, you may search by matching the Petitioner or Respondent's full name alongside the relevant filing dates.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border rounded-2xl p-6 space-y-4 text-center font-sans">
                          <span className="text-4xl block font-serif">🌐</span>
                          <h5 className="font-serif font-bold text-slate-900 text-base">Proceed to Official Case Registry</h5>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            Open the secure, government-hosted eCourts Services inquiry page to input your CNR or party parameters directly into the judicial database.
                          </p>
                          <a 
                            href="https://services.ecourts.gov.in/ecourts_v1/"
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => { triggerAlert("Redirecting to the official National Case Status registry in a new tab.", "success"); }}
                            className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl border border-slate-700/50 block tracking-wide text-center uppercase shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 w-full font-serif"
                            aria-label="Redirect to official eCourts Case Status services registry inside a secure window tab"
                          >
                            Launch Case Status Service 🔍 ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: CAUSE LIST */}
                  {eCourtActiveSubtab === "causeList" && (
                    <div className="space-y-6 animate-fade-in font-normal font-sans">
                      <div className="border-b pb-4 space-y-1">
                        <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold uppercase select-none">
                          External System Redirection Guide
                        </span>
                        <h4 className="font-serif font-bold text-slate-900 text-xl flex items-center gap-2">
                          📋 Daily Courtroom Cause List Gateway
                        </h4>
                        <p className="text-xs text-slate-500 font-sans font-normal">Monitor active rosters, listed judge hearing boards, and judicial schedules for the day.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start font-sans">
                        <div className="space-y-4">
                          <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider font-sans">Roster Lookup Instructions</h5>
                          <div className="space-y-3 font-sans">
                            <div className="flex gap-3 items-start select-none font-sans">
                              <span className="w-5 h-5 rounded-full bg-slate-100 border text-xs font-semibold text-slate-600 flex items-center justify-center shrink-0 mt-0.5 font-sans">1</span>
                              <p className="text-xs sm:text-sm text-slate-705 leading-relaxed font-sans font-normal">
                                <strong>Select Complex:</strong> Filter the system by State, District, and Court Establishment corresponding to your dispute location.
                              </p>
                            </div>
                            <div className="flex gap-3 items-start select-none font-sans">
                              <span className="w-5 h-5 rounded-full bg-slate-100 border text-xs font-semibold text-slate-600 flex items-center justify-center shrink-0 mt-0.5 font-sans">2</span>
                              <p className="text-xs sm:text-sm text-slate-705 leading-relaxed font-sans font-normal">
                                <strong>Judge/Bench Name:</strong> Roster daily cause lists are indexed by the specific Hon'ble Judge or metropolitan magistrate presiding over the courtroom.
                              </p>
                            </div>
                            <div className="flex gap-3 items-start select-none font-sans">
                              <span className="w-5 h-5 rounded-full bg-slate-100 border text-xs font-semibold text-slate-600 flex items-center justify-center shrink-0 mt-0.5 font-sans">3</span>
                              <p className="text-xs sm:text-sm text-slate-705 leading-relaxed font-sans font-normal">
                                <strong>Roster Date:</strong> Enter the target schedule date to view the morning and afternoon listing boards, serialized by priority.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border rounded-2xl p-6 space-y-4 text-center font-sans">
                          <span className="text-4xl block font-serif">🌐</span>
                          <h5 className="font-serif font-bold text-slate-900 text-base">Proceed to Daily Court Schedule</h5>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            Redirect to the legitimate eCourts Daily Cause List service to check if your matter is listed on the magistracy hearing board today.
                          </p>
                          <a 
                            href="https://services.ecourts.gov.in/ecourts_v1/index.php?p=services/causelist"
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => { triggerAlert("Redirecting to the official National Cause List repository in a new tab.", "success"); }}
                            className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl border border-slate-700/50 block tracking-wide text-center uppercase shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 w-full font-serif"
                            aria-label="Redirect to official eCourts Daily Cause List registry inside a secure window tab"
                          >
                            Launch Cause List Service 📋 ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 3: COURT ORDERS */}
                  {eCourtActiveSubtab === "orders" && (
                    <div className="space-y-6 animate-fade-in font-normal font-sans">
                      <div className="border-b pb-4 space-y-1">
                        <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold uppercase font-sans select-none">
                          External System Redirection Guide
                        </span>
                        <h4 className="font-serif font-bold text-slate-900 text-xl flex items-center gap-2">
                          ⚖️ Certified Judgments and Orders Downloads
                        </h4>
                        <p className="text-xs text-slate-500 font-sans font-normal font-sans">Query and download certified electronic PDFs of final judgments, decrees, and official orders.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start font-sans">
                        <div className="space-y-4">
                          <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider font-sans font-sans font-bold">Judgment Retrieving Protocol</h5>
                          <div className="space-y-3 font-sans">
                            <div className="flex gap-3 items-start select-none font-sans">
                              <span className="w-5 h-5 rounded-full bg-slate-100 border text-xs font-semibold text-slate-600 flex items-center justify-center shrink-0 mt-0.5 font-sans">1</span>
                              <p className="text-xs sm:text-sm text-slate-705 leading-relaxed font-sans font-normal">
                                <strong>Input Order Attributes:</strong> Access orders lists by querying the Order Date, Order Number, or Case Number.
                              </p>
                            </div>
                            <div className="flex gap-3 items-start select-none font-sans">
                              <span className="w-5 h-5 rounded-full bg-slate-100 border text-xs font-semibold text-slate-600 flex items-center justify-center shrink-0 mt-0.5 font-sans">2</span>
                              <p className="text-xs sm:text-sm text-slate-705 leading-relaxed font-sans font-normal font-sans text-slate-700">
                                <strong>Digital Copy Validation:</strong> The digital copies of decrees signed by presiding judges are published as authorized PDFs, legally valid across government complexes.
                              </p>
                            </div>
                            <div className="flex gap-3 items-start select-none font-sans">
                              <span className="w-5 h-5 rounded-full bg-slate-100 border text-xs font-semibold text-slate-600 flex items-center justify-center shrink-0 mt-0.5 font-sans">3</span>
                              <p className="text-xs sm:text-sm text-slate-705 leading-relaxed font-sans font-normal font-sans font-normal font-sans">
                                <strong>PDF Compatibility:</strong> Ensure your mobile device or operating system has secure PDF reader packages installed to view downloaded dossiers safely.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border rounded-2xl p-6 space-y-4 text-center font-sans font-normal">
                          <span className="text-4xl block font-serif">🌐</span>
                          <h5 className="font-serif font-bold text-slate-900 text-base">Proceed to Certified Orders Portal</h5>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans font-sans font-normal">
                            Redirect to the certified National eCourts Orders search system to browse, verify, and store court decisions copies safely.
                          </p>
                          <a 
                            href="https://services.ecourts.gov.in/"
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => { triggerAlert("Redirecting to the official National Judicial Orders Search registry in a new tab.", "success"); }}
                            className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl border border-slate-700/50 block tracking-wide text-center uppercase shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 w-full font-serif"
                            aria-label="Redirect to official eCourts Certified Judgments search index inside a secure window tab"
                          >
                            Launch Orders Service ⚖️ ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 4: SANDBOX EFILING */}
                  {eCourtActiveSubtab === "efiling" && (
                    <div className="space-y-6 animate-fade-in font-normal font-sans">
                      <div className="border-b pb-4 space-y-1">
                        <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold uppercase font-sans select-none">
                          Citizen Interactive Area
                        </span>
                        <h4 className="font-serif font-bold text-slate-900 text-xl flex items-center gap-2">
                          📝 Interactive eFiling Sandbox & Complaint Builder
                        </h4>
                        <p className="text-xs text-slate-500 font-sans">Assemble basic civil / criminal petition abstracts, verify extracted OCR analyses, and review official submission procedures.</p>
                      </div>

                      {/* Instructions */}
                      <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed flex gap-3 font-normal font-sans">
                        <Info className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5 font-sans" />
                        <div>
                          <strong>Filing Sandbox Instructions:</strong> This system acts as a standard drafting environment. Once you copy your structured texts, you are instructed to proceed to the official Government eFiling Portal using the redirection link below to paste your formal summons.
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start text-slate-705 font-sans">
                        {/* Interactive Form */}
                        <div className="space-y-4 bg-slate-50 border p-5 sm:p-6 rounded-2xl shadow-xs font-sans">
                          <h5 className="font-serif font-bold text-slate-900 text-sm uppercase border-b pb-1.5 font-serif select-none">New Pleadings Draft</h5>
                          
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono font-sans font-bold select-none">Dispute / Act Category</label>
                            <select className="w-full p-2.5 rounded-xl border text-xs focus:border-amber-400 bg-white cursor-pointer hover:bg-slate-50 text-slate-700 font-sans font-sans">
                              <option>Protection of Women (Domestic Violence Act, 2005)</option>
                              <option>Consumer Grievances (Consumer Protection Act, 2019)</option>
                              <option>Financial Cyber Theft (Information Technology Act, 2000)</option>
                              <option>Student Grievances & Campus Rights (Education Law)</option>
                            </select>
                          </div>

                          <div className="space-y-1 font-sans">
                            <label className="text-[10px] font-bold text-slate-505 uppercase font-mono font-sans font-bold select-none">Matter Title / Parties (Petitioner vs Respondent)</label>
                            <input 
                              type="text"
                              required
                              placeholder="e.g. Ananya Sharma vs. State of Maharashtra"
                              value={eCourtEfilingTitle}
                              onChange={(e) => setECourtEfilingTitle(e.target.value)}
                              className="w-full p-2.5 rounded-xl border text-xs focus:border-amber-400 bg-white"
                            />
                          </div>

                          <div className="space-y-1 font-sans font-sans font-normal">
                            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono font-sans font-bold select-none">Pleadings & Testimony Verbatim Abstract</label>
                            <textarea 
                              required
                              rows={5}
                              placeholder="Draft or copy your exact description of dispute event, date of incidence, relevant witness accounts, and requested relief..."
                              value={eCourtEfilingDetail}
                              onChange={(e) => setECourtEfilingDetail(e.target.value)}
                              className="w-full p-2.5 rounded-xl border text-xs focus:border-amber-450 bg-white outline-none leading-relaxed font-sans font-normal"
                            />
                          </div>

                          {/* File drag-and-drop or manual selection for eFiling */}
                          <div className="space-y-1 font-sans">
                            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono font-sans select-none">Upload Signed Affidavit Proofs</label>
                            <div className="border border-dashed border-slate-300 pointer-events-auto rounded-xl p-3.5 text-center cursor-pointer hover:bg-slate-100/50 hover:border-slate-400 transition-all font-sans select-none font-sans">
                              <span className="text-xl block font-sans">📂</span>
                              <span className="text-[11px] font-bold text-slate-700 block mt-1 font-sans font-sans">Drag case dossier proofs here</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5 font-sans font-mono font-normal">JPG, PNG, PDF (Max 10MB)</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (!eCourtEfilingTitle.trim() || !eCourtEfilingDetail.trim()) {
                                triggerAlert("Please fill draft title and detail text before saving in sandbox.", "error");
                                return;
                              }
                              setECourtEfilingSubmitting(true);
                              setTimeout(() => {
                                const newCNR = "LEGALFIL" + Math.random().toString(36).substring(2, 10).toUpperCase() + "2026";
                                triggerAlert(`Draft saved in your secure sandbox profile! CNR: ${newCNR}`, "success");
                                setECourtEfilingHistory(prev => [
                                  {
                                    title: eCourtEfilingTitle.trim(),
                                    date: new Date().toISOString().split('T')[0],
                                    status: "DRAFT-SECURED"
                                  },
                                  ...prev
                                ]);
                                setECourtEfilingTitle("");
                                setECourtEfilingDetail("");
                                setECourtEfilingSubmitting(false);
                              }, 1200);
                            }}
                            disabled={eCourtEfilingSubmitting}
                            className="bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs w-full transition-colors uppercase tracking-wide cursor-pointer pointer-events-auto shadow-sm font-sans"
                          >
                            {eCourtEfilingSubmitting ? "Encrypting and backing up draft..." : "Save Draft inside Legal Sandbox Profile"}
                          </button>
                        </div>

                        {/* Submitted filings lists */}
                        <div className="space-y-4">
                          <h5 className="font-serif font-bold text-slate-900 text-sm">Your Sandbox Filings Tracking</h5>
                          
                          {eCourtEfilingHistory.length > 0 ? (
                            <div className="space-y-3 font-normal">
                              {eCourtEfilingHistory.map((item, idx) => (
                                <div key={idx} className="bg-white border rounded-xl p-4 space-y-1.5 shadow-xs">
                                  <div className="flex justify-between items-start gap-4">
                                    <h6 className="font-bold text-slate-900 text-xs truncate max-w-[180px]">{item.title}</h6>
                                    <span className="text-[9px] font-mono uppercase bg-amber-50 text-amber-700 font-bold border border-amber-200 px-2 py-0.5 rounded">
                                      {item.status}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                    <span>Date filed: {item.date}</span>
                                    <span>Roster Tracking v1.0</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-10 border rounded-2xl bg-slate-50 text-slate-400 select-none text-xs leading-relaxed space-y-1.5">
                              <span className="text-xl">📁</span>
                              <p className="font-semibold text-slate-500">No active sandbox filings</p>
                              <p className="px-6 max-w-xs mx-auto text-slate-400">Pleaded data drafted in the left panel will generate dynamic temporary tracking registries here.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* PORTAL SECTION: DOCUMENT SCANNER / OCR SIMULATOR */}
            {portalSection === "docScan" && (
              <div className="space-y-8 animate-fade-in text-slate-800">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold text-slate-905 flex items-center gap-2.5 text-slate-900">
                    📄 Legal Document Scanner (OCR Hub)
                  </h2>
                  <p className="text-sm text-slate-600 font-medium font-sans">
                    Upload photos/scans of court notices, tenancy pacts, or FIR copies. Translate dense "legalese" jargon into clear, plain-English summaries instantly.
                  </p>
                </div>

                {/* Main Scanning Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Image Upload UI & Preset Samples (lg:col-span-5) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 font-serif border-b pb-2 flex items-center gap-2">
                        📥 Document Source Input
                      </h3>

                      {/* File Upload drag and drop widget */}
                      <div 
                        onDragOver={(e) => { e.preventDefault(); setDocDragHover(true); }}
                        onDragLeave={() => setDocDragHover(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDocDragHover(false);
                          const files = e.dataTransfer.files;
                          if (files && files.length > 0) {
                            validateAndProcessFile(files[0]);
                          }
                        }}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all relative overflow-hidden ${
                          docDragHover 
                            ? "border-amber-500 bg-amber-500/10" 
                            : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/70"
                        }`}
                      >
                        <input 
                          type="file"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              validateAndProcessFile(files[0]);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        
                        {docUploadedFile ? (
                          <div className="space-y-3 relative z-20">
                            <span className="text-3xl block">{docUploadedFile === "pdf-placeholder" ? "📄" : "🖼️"}</span>
                            <p className="text-xs font-bold text-slate-800 truncate px-4">Uploaded: {docUploadedFileName}</p>
                            <span className="text-[10px] text-emerald-600 font-semibold block bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 max-w-max mx-auto">
                              {docUploadedFile === "pdf-placeholder" ? "PDF Document Loaded" : "Image File Loaded"}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setDocUploadedFile(null);
                                setDocUploadedFileName(null);
                                setDocScanSelectedSample(null);
                              }}
                              className="text-[10px] font-bold text-rose-600 hover:underline inline-block mt-1 relative z-30 cursor-pointer pointer-events-auto"
                            >
                              Clear and Remove Upload
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-3xl block">📤</span>
                            <span className="text-xs font-bold text-slate-700 block">Drag & Drop legal notice, lease, or FIR here</span>
                            <span className="text-[10px] text-slate-400 block">Or click to select an image or PDF from your device</span>
                            <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded inline-block mt-1">PNG, JPG, PDF up to 10MB</span>
                          </div>
                        )}
                        
                        {/* Dynamic Scanning Laser Animation */}
                        {docIsScanning && (
                          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-30">
                            {/* Scanning Ray effect */}
                            <div className="absolute left-0 right-0 h-1 bg-amber-400 animate-pulse top-1/2 shadow-lg shadow-amber-400/50" />
                            <div className="space-y-3 text-center">
                              <p className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest animate-pulse">Scanning Document OCR...</p>
                              <div className="w-40 bg-slate-700 h-1.5 rounded-full overflow-hidden mx-auto">
                                <div className="bg-amber-400 h-full transition-all duration-150" style={{ width: `${docUploadProgress}%` }} />
                              </div>
                              <span className="text-[10px] text-slate-300 block">{docUploadProgress}% Processing Matrices</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Alternate Trial Samples selector */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Or Try with Preloaded Samples</span>
                        <div className="grid grid-cols-1 gap-2.5">
                          {[
                            { id: "notice", title: "🏛️ Bombay High Court Show-Cause Notice", subtitle: "Writ Petition (WP) 4821 of 2026" },
                            { id: "agreement", title: "📜 Residential Tenancy Lease Covenant", subtitle: "Maharashtra Rent Act lease limits" },
                            { id: "fir", title: "👮 First Information Report (FIR - Theft)", subtitle: "FIR registered under IPC Section 379" }
                          ].map((item) => {
                            const isSelected = docScanSelectedSample === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setDocUploadedFile(null);
                                  setDocUploadedFileName(null);
                                  setDocScanSelectedSample(item.id as any);
                                  setDocIsScanning(true);
                                  setDocUploadProgress(0);
                                  const interval = setInterval(() => {
                                    setDocUploadProgress((prev) => {
                                      if (prev >= 100) {
                                        clearInterval(interval);
                                        setDocIsScanning(false);
                                        triggerAlert(`${item.id === "notice" ? "High Court Notice" : item.id === "agreement" ? "Tenancy Agreement" : "FIR Complaint"} parsed! Check details on right.`, "success");
                                        return 100;
                                      }
                                      return prev + 10;
                                    });
                                  }, 150);
                                }}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex flex-col gap-0.5 ${
                                  isSelected 
                                    ? "bg-amber-50 border-amber-500 shadow-sm" 
                                    : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                                }`}
                              >
                                <span className={`font-bold ${isSelected ? "text-amber-900" : "text-slate-800"}`}>{item.title}</span>
                                <span className="text-[10px] text-slate-500 font-normal">{item.subtitle}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: OCR Result Breakdown Dashboard (lg:col-span-7) */}
                  <div className="lg:col-span-7">
                    {(() => {
                      // Grab appropriate content database based on selection or custom upload trigger
                      const isPreloaded = docScanSelectedSample !== null;
                      
                      let sampleData = null;
                      if (docScanSelectedSample === "notice") {
                        sampleData = {
                          title: "Bombay High Court Summon (WP 4821 of 2026)",
                          legaleseText: `IN THE HIGH COURT OF JUDICATURE AT BOMBAY\nAPPELLATE SIDE / WRIT PETITION NO. 4821 OF 2026\n\nAnanya Sharma                                            ... Petitioner\n     v/s\nABC Retail Corporation Ltd.                              ... Respondent\n\nTO,\nTHE COMPLIANCE OFFICER, ABC RETAIL CORP, BOMBAY.\n\nWHEREAS the above-named Petitioner has filed a petition under Article 226 of the Constitution of India praying for issuance of writ or directions in the nature of mandamus, you are hereby summoned to show cause on or before 15-July-2026 as to why ad-interim reliefs prayed herein should not be granted. Failure to appear will yield an ex-parte decree order under Code of Civil Procedure (CPC) Order IX Rule 8.`,
                          summary: "You have been officially summoned to the Bombay High Court because Ananya Sharma filed a Writ Petition against your retail business. You must file a written response/defense ('show cause') by July 15, 2026, or the judge might rule in favor of the opponent in your absence.",
                          statutes: [
                            { code: "Article 226, Constitution of India", desc: "Citizen power to petition the High Court directly for enforcement of vital statutory/fundamental rights.", severity: "High Warning", bailable: "N/A" },
                            { code: "CPC Order IX Rule 8", desc: "Ex-parte decree consequence. If you do not show up, the court can legally dismiss or decree against you in your absence.", severity: "High Warning", bailable: "N/A" }
                          ],
                          actions: [
                            "Engage a registered High Court advocate immediately to represent you.",
                            "Draft a formal 'Written Statement' answering each paragraph of the petition under oath.",
                            "Assemble all business and consumer transactional receipts as evidence of fulfillment of obligations.",
                            "Pleadings must be formally verified and submitted to the High Court registry before July 15, 2026."
                          ],
                          linkWord: "WP/4821/2026",
                          linkTitle: "Ananya Sharma vs ABC Retail",
                          extractedNames: "Ananya Sharma (Petitioner), ABC Retail Corporation Ltd. (Respondent)",
                          extractedDates: "Summon Response Deadline: July 15, 2026"
                        };
                      } else if (docScanSelectedSample === "agreement") {
                        sampleData = {
                          title: "Standard Tenancy Deed (Maharashtra Rent Control)",
                          legaleseText: `LANDLORD-TENANT COVENANT / LEASE AGREEMENT\n\nThis deed of Lease is executed on this 01-Jan-2025 by Shri. Ramesh Patil (Lessor) and Shri. Kishore V (Lessee).\n\nThe Lessee covenants that in the event of default of payment of rent for two consecutive calendar months, the Lessor reserves the absolute right of ingress and immediate eviction under Section 24 of the Maharashtra Rent Control Act, 1899, notwithstanding any security deposit covenants. Subletting represents material breach and yields summarily forfeiture of occupancy claims.`,
                          summary: "A lease contract between Landlord Ramesh Patil and Tenant Kishore V. It states that if Kishore fails to pay rent for 2 months in a row, the landlord holds the absolute legal right to evict him immediately. Also, Kishore is strictly prohibited from subletting the apartment.",
                          statutes: [
                            { code: "Section 24, Maharashtra Rent Control Act", desc: "Gives landlords unilateral summary rights to recover possession of flat premises under certified leave-and-license parameters.", severity: "Medium Action", bailable: "N/A" }
                          ],
                          actions: [
                            "Ensure bank transfer transactions of rent are sent and recorded strictly before the 5th of each calendar month.",
                            "Never sublet or offer any room/fractional space of the apartment to third parties without a signed deed addendum.",
                            "Keep records of security deposit ledger proofs to counter eviction threats."
                          ],
                          linkWord: "Section 24",
                          linkTitle: "Rent Act evictions study",
                          extractedNames: "Shri. Ramesh Patil (Lessor/Landlord), Shri. Kishore V (Lessee/Tenant)",
                          extractedDates: "Execution Date: January 1, 2025"
                        };
                      } else if (docScanSelectedSample === "fir") {
                        sampleData = {
                          title: "First Information Report (FIR 0105/2026 - Theft)",
                          legaleseText: `FIRST INFORMATION REPORT (Under Section 154 CrPC)\nDISTRICT: MUMBAI CITY. POLICE STATION: BANDRA WEST.\n\nFIR Number: 0105/2026. Date of Information: 12-Feb-2026.\nOffence Reported: Criminal Breach of Trust & Larceny (Theft).\n\nDetails: Complainant states that on 11-Feb-2026 at 20:30 Hrs, inside Bandra metro retail plaza, an unknown delinquent abstractively removed one laptop bag containing legal dossiers and hard disks, valued at ₹45,000. Registered under Section 379 and 406 of the Indian Penal Code (IPC).`,
                          summary: "An official police record of a theft event. An unknown person stole a laptop bag holding sensitive legal dossiers and hard disks worth ₹45,000 at the Bandra metro plaza. Police registered it under law sections IPC 379 and IPC 406.",
                          statutes: [
                            { code: "Section 379, Indian Penal Code", desc: "Theft punishment of up to 3 years imprisonment or fine or both.", severity: "Cognizable & Non-Bailable", bailable: "Requires magistrate's approval for bail" },
                            { code: "Section 406, Indian Penal Code", desc: "Criminal Breach of Trust charge. Carries prison sentence warnings.", severity: "Cognizable & Non-Bailable", bailable: "Requires magistrate's approval" }
                          ],
                          actions: [
                            "Request a free certified copy of this FIR from the Station House Officer under Section 157 CrPC.",
                            "Track the active investigative roster in the local magistrate court.",
                            "Record serial numbers of stolen gadgets and secure digital login portals instantly."
                          ],
                          linkWord: "CC/105/2026",
                          linkTitle: "Metro Theft Inquiry",
                          extractedNames: "Complainant: Bandra Metro Retail Plaza Authority, Suspect: Unknown Delinquent",
                          extractedDates: "Incident Date: Feb 11, 2026, Registration Date: Feb 12, 2026"
                        };
                      } else if (docUploadedFile) {
                        // User customized file scenario
                        sampleData = {
                          title: docUploadedFileName || "Parsed Custom Document",
                          legaleseText: `[LEXIAID AI SIMULATED OCR LINE-BY-LINE DUMP]\n\nProcessing user-submitted image document: "${docUploadedFileName}"\nAnalyzing graphic matrix...\nDetected Paragraph 1 containing: Legal notification/notice guidelines...\nDetected Clause 2 containing: Redressal liabilities, arbitration clauses, and local sovereign jurisdiction.\nSuggested act: Indian Contract Act Section 73 & Code of Civil Procedure directives.`,
                          summary: `We successfully extracted the text structures from your uploaded file. The document is identified as a legal agreement or notice highlighting statutory compliance bounds, damages responsibility, and jurisdictional court clauses.`,
                          statutes: [
                            { code: "Section 73, Indian Contract Act", desc: "Rules and bounds regarding compensation/damages for breach of contract situations.", severity: "Informative", bailable: "N/A" },
                            { code: "Section 20, Code of Civil Procedure", desc: "Determines the appropriate local courts structure where suits can legally be instituted.", severity: "Informative", bailable: "N/A" }
                          ],
                          actions: [
                            "Carefully review the jurisdiction clause to see where lawsuits must be filed (e.g. only Mumbai courts or Chennai courts).",
                            "Consult an advocate if the damages mentioned represent material financial exposure.",
                            "Always respond within the stipulated timeline (usually 15-30 days) to prevent defaults."
                          ],
                          linkWord: "Notice",
                                                linkTitle: "Custom draft upload folder",
                          extractedNames: "Detected Parties: Self / Citizen Uploader, Third-Party Signatory",
                          extractedDates: `Scanned on: ${new Date().toLocaleDateString("en-IN")}`
                        };
                      }

                      if (docIsScanning) {
                        return (
                          <div className="bg-white border rounded-3xl p-8 shadow-sm h-full flex flex-col items-center justify-center text-center space-y-3 min-h-[400px]">
                            <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                            <h4 className="font-serif font-bold text-slate-800 text-lg">OCR Matrix Decryption active...</h4>
                            <p className="text-xs text-slate-500 max-w-xs font-normal">Our localized computer vision parser is isolating characters, mapping paragraph shapes, and stripping redundant legalese terminology.</p>
                          </div>
                        );
                      }

                      if (!sampleData) {
                        return (
                          <div className="bg-white border rounded-3xl p-8 shadow-sm h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                            <span className="text-5xl">📄</span>
                            <div className="space-y-1.5">
                              <h4 className="font-serif font-bold text-slate-900 text-lg">No Active Analytical Feed</h4>
                              <p className="text-xs text-slate-500 max-w-sm font-normal leading-relaxed mx-auto">
                                Please drag & drop your legal document photo in the left workspace, or select one of our preloaded High Court notice/tenancy covenants to inspect the immediate visual analyzer!
                              </p>
                            </div>
                            <div className="pt-2">
                              <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-3 py-1 rounded inline-block border border-amber-200">
                                Powered by LexiAid OCR decrypter
                              </span>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                          
                          {/* Analyzed document header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-4">
                            <div>
                              <span className="text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase">
                                Analysis Feed v1.0
                              </span>
                              <h4 className="font-serif font-bold text-slate-900 text-lg mt-1.5">
                                {sampleData.title}
                              </h4>
                              <p className="text-xs text-slate-500 font-normal">Decrypted Plain-English breakdown of official text lines</p>
                            </div>

                            {/* Deep link button direct into eFiling */}
                            <button
                              onClick={() => {
                                setECourtEfilingTitle(`Draft for Notice / ${sampleData.title}`);
                                setECourtEfilingDetail(`Extracted Details: ${sampleData.summary}\n\nIdentified Statutes: ${sampleData.statutes.map(s => s.code).join(", ")}`);
                                setPortalSection("eCourts");
                                setECourtActiveSubtab("efiling");
                                triggerAlert("Information populated inside eFiling sandbox! Check drafting form.", "success");
                              }}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] px-3.5 py-2 rounded-xl transition-all shadow-sm border border-amber-400 shrink-0 cursor-pointer"
                            >
                              ✍️ Transfer to eFiling Draft
                            </button>
                          </div>

                          {/* Raw Decrypted Text drawer (Collapsable simulated OCR readout) */}
                          <div className="space-y-2 bg-slate-50 border p-4 rounded-xl">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Text lines extracted via simulated OCR</span>
                              <span className="text-[9px] font-mono text-emerald-600 font-bold">Accuracy rate: 99.4%</span>
                            </div>
                            <pre className="text-[11px] text-slate-600 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto bg-white border border-slate-200/60 p-3 rounded-lg">
                              {sampleData.legaleseText}
                            </pre>
                          </div>

                          {/* Detail analysis tab selector */}
                          <div className="flex border-b text-xs">
                            {[
                              { id: "summary", label: "🎯 Plain English Summary" },
                              { id: "statutes", label: "📕 Identified Statutes" },
                              { id: "actions", label: "📋 Recommended Action Guidelines" }
                            ].map(tab => (
                              <button
                                key={tab.id}
                                onClick={() => setDocActiveAnalysisTab(tab.id as any)}
                                className={`pb-2.5 px-4 font-bold transition-all border-b-2 -mb-[1px] cursor-pointer ${
                                  docActiveAnalysisTab === tab.id 
                                    ? "border-amber-500 text-slate-900" 
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>

                          {/* Tab Content Display */}
                          <div className="space-y-4 pt-1 font-normal text-slate-700">
                            
                            {/* Summary view */}
                            {docActiveAnalysisTab === "summary" && (
                              <div className="space-y-3 leading-relaxed">
                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs sm:text-sm text-amber-900 font-medium">
                                  <strong>Simplified Terminology:</strong> {sampleData.summary}
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl font-normal">
                                  Note: Our cognitive parser has stripped redundant legal pronouns, Latin formatting, and repetitive phrases like "notwithstanding anything to the contrary herein before mentioned" to clarify the core legal responsibilities and deadlines.
                                </p>
                              </div>
                            )}

                            {/* Statutes view */}
                            {docActiveAnalysisTab === "statutes" && (
                              <div className="space-y-3">
                                {sampleData.statutes.map((item, idx) => (
                                  <div key={idx} className="bg-slate-50 border p-4 rounded-xl space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-mono font-bold text-slate-900 block">{item.code}</span>
                                      <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded border ${
                                        item.severity.includes("High") 
                                          ? "bg-rose-50 text-rose-700 border-rose-200" 
                                          : item.severity.includes("Medium")
                                          ? "bg-amber-50 text-amber-700 border-amber-200"
                                          : "bg-blue-50 text-blue-700 border-blue-200"
                                      }`}>
                                        {item.severity}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{item.desc}</p>
                                    <div className="flex gap-4 items-center text-[10px] font-mono text-slate-400">
                                      <span>Bail Status: <strong>{item.bailable}</strong></span>
                                      <span>|</span>
                                      <span>Authority: <strong>Indian Gazette Code</strong></span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Actions view */}
                            {docActiveAnalysisTab === "actions" && (
                              <div className="space-y-2">
                                {sampleData.actions.map((act, idx) => (
                                  <div key={idx} className="flex gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-100 font-sans items-start">
                                    <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] shrink-0 text-slate-600">
                                      {idx + 1}
                                    </span>
                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{act}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>

              </div>
            )}

          </div>

      </main>

      {/* ==============================================
           AUTH MODUAL SYSTEM (POPUP DRAWER ENGINE) 
         ============================================== */}
      {authView !== "none" && (
        <div id="auth-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border shadow-2xl relative space-y-6">
            
            {/* Close trigger anchor */}
            <button
              onClick={() => { setAuthView("none"); setAuthError(""); setAuthSuccess(""); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header info */}
            <div className="text-center space-y-1">
              <span className="text-3xl">⚖️</span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                {authView === "login" ? "Sign In to LexiAid" : "Register Citizen Account"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect and check simulated authentication states linked to dynamic Servlet routes.
              </p>
            </div>

            {/* Messages alerts */}
            {authError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex gap-2.5 items-start">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-relaxed">{authError}</span>
              </div>
            )}
            
            {authSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex gap-2.5 items-start">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="leading-relaxed">{authSuccess}</span>
              </div>
            )}

            {/* Forms body */}
            {authView === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="Enter email e.g. ananya@lexiaid.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:border-amber-400 text-slate-800 transition-all font-medium"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="Enter account password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:border-amber-400 text-slate-800 transition-all font-medium"
                  />
                </div>

                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-slate-950 text-white font-bold py-3 px-4 rounded-xl text-sm hover:bg-slate-800 transition-colors uppercase disabled:opacity-50"
                >
                  {authLoading ? "Checking Credentials..." : "Authenticate Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name <span className="text-rose-500">*</span></label>
                  <input
                    id="reg-fullname"
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none focus:border-amber-400 text-slate-800 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address <span className="text-rose-500">*</span></label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="e.g. ananya@lexiaid.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none focus:border-amber-400 text-slate-800 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Key Password <span className="text-rose-500">*</span></label>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    placeholder="Create security password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none focus:border-amber-400 text-slate-800 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Contact Telephone (Optional)</label>
                  <input
                    id="reg-phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none focus:border-amber-400 text-slate-800 transition-all font-medium"
                  />
                </div>

                <button
                  id="btn-register-submit"
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-slate-950 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm hover:bg-slate-800 transition-colors uppercase disabled:opacity-50 mt-2"
                >
                  {authLoading ? "Writing Record..." : "Register Account"}
                </button>
              </form>
            )}

            {/* Alternator button links */}
            <div className="pt-4 border-t text-center text-xs text-slate-500 space-y-2">
              {authView === "login" ? (
                <p>
                  Don't hold an account?{" "}
                  <button 
                    onClick={() => { setAuthError(""); setAuthSuccess(""); setAuthView("register"); }}
                    className="text-amber-600 font-bold hover:underline"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p>
                  Already maintain an account?{" "}
                  <button 
                    onClick={() => { setAuthError(""); setAuthSuccess(""); setAuthView("login"); }}
                    className="text-amber-600 font-bold hover:underline"
                  >
                    Login here
                  </button>
                </p>
              )}
              
              {/* Reset to demo */}
              <button
                onClick={triggerDemoLogin}
                className="block text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg mx-auto font-bold transition-all"
              >
                Autofill Demonstration Credentials
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER METADATA DISCLOSURE */}
      <footer className="bg-slate-900 border-t border-slate-800 text-white mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-amber-400" />
              <span className="font-serif font-bold text-base">LexiAid</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md text-center md:text-right leading-relaxed">
              LexiAid is a citizen-focused digital legal literacy platform. All visual guides and translation modules are made public to promote statutory awareness and community knowledge.
            </p>
          </div>
          
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-center space-y-2 text-[10.5px] text-slate-300">
            <p className="font-bold uppercase tracking-wider text-amber-500 flex items-center justify-center gap-1">
              ⚠️ General Legal Awareness Disclaimer Notice
            </p>
            <p className="max-w-4xl mx-auto leading-relaxed text-slate-400">
              The information provided on LexiAid is for general awareness and educational purposes only. It does not constitute formal legal advice. LexiAid is not a registered legal practitioner, court agent, or substitutory support system for qualified legal counsel. Laws differ by dynamic local states and always require verification against official Government gazettes.
            </p>
          </div>

          <div className="text-center pt-2 text-[10px] font-mono text-slate-500">
            Copyright &copy; {new Date().getFullYear()} LexiAid ecosystem partners. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
