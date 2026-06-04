/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DictionaryTerm, HelplineItem, RightsCategory } from "./types";

export const dictionaryTerms: DictionaryTerm[] = [
  {
    id: "fir",
    term: "FIR (First Information Report)",
    definition: "An official document recorded by the police when they receive information about the commission of a cognizable (serious) offence. It acts as the starting point for police investigation.",
    category: "Criminal Law"
  },
  {
    id: "bail",
    term: "Bail",
    definition: "The temporary release of an accused person awaiting trial in court, often on the condition of submitting a surety (bail bond) to guarantee their appearance in court when called.",
    category: "Criminal Law"
  },
  {
    id: "cognizable",
    term: "Cognizable Offence",
    definition: "A serious category of crime (like assault, theft, murder) where police officers have the authority to arrest a suspect immediately without an arrest warrant and can begin investigation without prior court approval.",
    category: "Criminal Law"
  },
  {
    id: "non-cognizable",
    term: "Non-Cognizable Offence",
    definition: "A less serious crime (like simple defamation or mild disputes) where the police cannot arrest a suspect without a court-issued warrant and cannot investigate without a judicial magistrate's order.",
    category: "Criminal Law"
  },
  {
    id: "chargesheet",
    term: "Chargesheet",
    definition: "The final report prepared by police after concluding their criminal investigation. It lists the formal accusations, items of evidence, and names of witnesses, and is submitted to the court to initiate the trial.",
    category: "Criminal Law"
  },
  {
    id: "affidavit",
    term: "Affidavit",
    definition: "A signed written statement of facts made voluntarily under oath or affirmation of truth, signed in front of a authorized legal representative (like a notary or magistrate). It is widely used as proof in legal settings.",
    category: "General"
  },
  {
    id: "jurisdiction",
    term: "Jurisdiction",
    definition: "The authorized power or legal boundary within which a court, police station, or government department has the right to hear, investigate, and decide a dispute.",
    category: "General"
  },
  {
    id: "petitioner",
    term: "Petitioner",
    definition: "The person or group who makes a formal, written request (a petition) to a court—especially higher courts like High Courts or the Supreme Court—asking for a specific legal relief or judgment.",
    category: "General"
  },
  {
    id: "respondent",
    term: "Respondent",
    definition: "The party in a legal proceeding against whom a petition is filed. They are required by the court to answer the allegations and defend their position.",
    category: "General"
  },
  {
    id: "plaintiff",
    term: "Plaintiff",
    definition: "The person or entity who files a civil lawsuit in a court of law against another party, claiming they suffered harm or damage and are seeking legal remedies.",
    category: "General"
  },
  {
    id: "defendant",
    term: "Defendant",
    definition: "The person, business, or institution being sued in a civil lawsuit, or the individual formally accused of a crime in a criminal trial.",
    category: "General"
  },
  {
    id: "writ",
    term: "Writ",
    definition: "A formal written order issued by a higher court, such as the Supreme Court of India or a High Court, directing lower courts, officers, or persons to act or stop acting in a certain way to protect citizens' fundamental rights.",
    category: "Constitutional Law"
  },
  {
    id: "habeas_corpus",
    term: "Habeas Corpus",
    definition: "An important writ or court order that provides protection against unlawful detention. It directs the detaining authority to bring the arrested person to court and explain the legal basis of detention.",
    category: "Constitutional Law"
  },
  {
    id: "pil",
    term: "PIL (Public Interest Litigation)",
    definition: "A legal suit filed in a court of law for the protection of public interest or societal well-being (e.g. pollution, public safety). It allows any responsible citizen to seek justice for people who cannot approach court themselves.",
    category: "Constitutional Law"
  },
  {
    id: "consumer_forum",
    term: "Consumer Forum",
    definition: "Specialized, semi-judicial commissions established under the Consumer Protection Act in India at District, State, and National levels to address and settle disputes of consumers who receive defective items or sub-standard service.",
    category: "Consumer Law"
  },
  {
    id: "deficiency_service",
    term: "Deficiency of Service",
    definition: "Under consumer protection laws, it refers to any fault, shortcoming, or continuous failure to perform standard services by a business, service provider, or utility.",
    category: "Consumer Law"
  },
  {
    id: "cyber_stalking",
    term: "Cyber Stalking",
    definition: "The offensive act of using electronic devices, social media platforms, or emails to track, monitor, or harass an individual repeatedly, which constitutes a critical offense under cybersecurity laws.",
    category: "Cyber Law"
  },
  {
    id: "it_act",
    term: "IT Act 2000",
    definition: "The primary cyber legislation in India that provides legal recognition to electronic commerce and addresses cybercrimes like system hacking, identity theft, dynamic online fraud, and publication of obscene materials.",
    category: "Cyber Law"
  },
  {
    id: "dowry_prohibition",
    term: "Dowry Prohibition Act",
    definition: "An important social welfare law that completely criminalizes the act of giving, taking, or inciting the exchange of dowry during, before, or anytime after marriage in India, featuring rigid jail sentences.",
    category: "Women's Rights"
  },
  {
    id: "pocso",
    term: "POCSO Act",
    definition: "The Protection of Children from Sexual Offences Act, 2012, designed to protect children under 18 years of age from sexual abuse, assault, and exploitation, with child-friendly recording and trial procedures.",
    category: "Child Protection"
  },
  {
    id: "rti",
    term: "RTI (Right to Information)",
    definition: "A powerful right under the RTI Act, 2005, which enables citizens of India to formally request information from any government body or public authority, who must respond to the query within 30 days.",
    category: "Civic Rights"
  },
  {
    id: "legal_aid",
    term: "Legal Aid",
    definition: "Providing free legal representation, advice, and paperwork assistance to poorer or marginalized citizens who cannot afford to hire lawyers, mostly organized under nationwide government-backed committees like NALSA.",
    category: "General"
  },
  {
    id: "anticipatory_bail",
    term: "Anticipatory Bail",
    definition: "A special court order issued by a Sessions Court or High Court directing police to release a person on bail immediately in physical event of an arrest. It is applied when a person fears they might be arrested on false or fabricated charges.",
    category: "Criminal Law"
  },
  {
    id: "stay_order",
    term: "Stay Order",
    definition: "A temporary suspension of a trial, lawsuit, or execution of an order that is granted by a court. It holds the active state of an activity to ensure fairness while deeper review takes place.",
    category: "General"
  },
  {
    id: "summons",
    term: "Summons",
    definition: "A formal written notice sent by a court of law or an investigating officer requiring a specific individual to attend court or visit a police station on a designated day to present evidence or testify.",
    category: "General"
  }
];

export const helplineItems: HelplineItem[] = [
  { name: "Police", number: "100", purpose: "Immediate general police assistance and crime reporting.", category: "Police" },
  { name: "Women Helpline", number: "1091", purpose: "Dedicated 24/7 support line for women facing threat, danger, or violence.", category: "Women" },
  { name: "Women Helpline (Domestic Abuse)", number: "181", purpose: "State-level emergency helpline for domestic abuse, safety shelter, and dynamic rescue support.", category: "Women" },
  { name: "Child Helpline", number: "1098", purpose: "All-day support lines for children in physical danger, abandonment, or child abuse.", category: "Child" },
  { name: "Ambulance", number: "108", purpose: "Emergency ambulance dispatch, critical medical situations, and accident responses.", category: "Medical" },
  { name: "National Emergency Number", number: "112", purpose: "Integrated single emergency response number for police, fire, medical services.", category: "General" },
  { name: "Cybercrime Helpline", number: "1930", purpose: "State-integrated hotline to report online financial fraud, account hacking, and cybercrimes.", category: "Cyber" },
  { name: "Anti-Corruption Helpline", number: "1064", purpose: "Lodge state-level alerts regarding government bribery or public sector corruption.", category: "General" },
  { name: "Legal Aid Helpline", number: "15100", purpose: "Contact NALSA for free legal counsel and defense matching for marginalized citizens.", category: "Legal" },
  { name: "Railway Protection", number: "182", purpose: "Security and safety helpline for railway travelers inside Indian rail networks.", category: "Transit" },
  { name: "Senior Citizen Helpline", number: "14567", purpose: "Elder Line for elder support, safety guides, legal counseling, and physical rescue.", category: "Senior" },
  { name: "Consumer Helpline", number: "1915", purpose: "National helpline to register grievances and complaints against services and sellers.", category: "Consumer" },
  { name: "Road Accident Emergency", number: "1073", purpose: "Assistance and report coordination during state and national highway road accidents.", category: "Transit" },
  { name: "HIV/AIDS Helpline", number: "1097", purpose: "National health, testing information, and support regarding HIV transmission.", category: "Medical" },
  { name: "Suicide Prevention", number: "9152987821", purpose: "Mental health crisis counseling and suicide mitigation support run by iCall.", category: "Crisis" }
];

export const rightsCategories: RightsCategory[] = [
  {
    id: "women",
    title: "Women's Rights",
    description: "Protection against domestic violence, harassments, details of personal freedom, work rights, and safety laws.",
    icon: "ShieldAlert",
    articles: [
      {
        id: "dv-act",
        title: "Right Against Domestic Violence",
        act: "Protection of Women from Domestic Violence Act, 2005",
        summary: "Guarantees full protection of women from physical, emotional, sexual, and financial abuse inside domestic households.",
        details: [
          "The law covers wives, female live-in partners, mothers, sisters, and single living women.",
          "Protects against physical beating, verbal insults, continuous dowry demands, and locking women in rooms.",
          "Enables a magistrate to issue protection orders, residency orders (so women cannot be locked out of the house), and monetary reliefs.",
          "Allows women to register free complaints through protection officers near them."
        ]
      },
      {
        id: "zero-fir",
        title: "Right to File a Zero FIR",
        act: "Section 154 of Code of Criminal Procedure / BNSS equivalent",
        summary: "A critical right to file an emergency FIR at any police station regardless of whether the crime occurred in their range.",
        details: [
          "If a crime occurs, you can visit the nearest police station to report it, even if they claim it is beyond their 'jurisdiction'.",
          "The station must accept the complaint and write down a 'Zero FIR' (numbered 00) to secure swift evidence tracking.",
          "They are legally bound to transfer the physical files later to the correct station, preventing any delays in registration."
        ]
      },
      {
        id: "female-officer",
        title: "Right to Have a Female Police Officer During Interrogation",
        act: "Code of Criminal Procedure (CrPC)",
        summary: "Protects comfort and modesty of women by mandating female presence during any questioning or arrests.",
        details: [
          "Women suspects can only be questioned by or in the immediate presence of a female police officer.",
          "Strictly limits the questioning of women to daytime hours unless exceptional orders from a judicial magistrate are granted.",
          "A woman cannot be arrested after sunset (6 PM) and before sunrise (6 AM) without a written order from a Judicial Magistrate."
        ]
      },
      {
        id: "posh-act",
        title: "Right Against Sexual Harassment at Workplace",
        act: "Sexual Harassment of Women at Workplace (POSH Act), 2013",
        summary: "Protects women's safety at their workplaces, creating mechanisms to address complaints securely.",
        details: [
          "All private and public institutions with 10 or more employees are legally forced to form an Internal Complaints Committee (ICC).",
          "Sexual harassment includes unwelcome touch, demand for sexual favors, sexist remarks, and showing pornographic contents.",
          "Complaints can be submitted to the committee in brief, and they must resolve or complete investigative actions confidentially inside 90 days."
        ]
      },
      {
        id: "maintenance",
        title: "Right to Maintenance After Divorce",
        act: "Section 125, CrPC / Personal Laws",
        summary: "Provides financial safety to divorced, separated, or abandoned women, ensuring they do not fall into poverty.",
        details: [
          "Divorced women who cannot support themselves can file a claim to seek monthly basic lifestyle allowance.",
          "The calculation depends on the husband's income, property assets, and the basic living costs of the woman.",
          "This support right extends to children and old parents who are dependent on the earner."
        ]
      }
    ]
  },
  {
    id: "consumer",
    title: "Consumer Rights",
    description: "Your protections as a customer, product safety rules, and direct steps to resolve business fraud.",
    icon: "ShoppingBag",
    articles: [
      {
        id: "consumer-basic",
        title: "Fundamental Six Consumer Rights",
        act: "Consumer Protection Act, 2019",
        summary: "Defines the core protections that allow clients to trade, buy, and register complaints safely inside India.",
        details: [
          "Right to Safety: Guard against products and services hazardous to human life and health.",
          "Right to Information: Know the quality, weight, date of manufacture, and price of products prior to purchase.",
          "Right to Choose: Make free choices among competitive products without monopoly force.",
          "Right to be Heard: Be represented at governmental tables or customer boards to share grievances.",
          "Right to Seek Redressal: Seek compensation or refund against unfair markets, cheat methods, or defective services."
        ]
      },
      {
        id: "consumer-complain",
        title: "How to File a Consumer Complaint",
        act: "District, State & National Forums",
        summary: "Easy step-by-step guide to log complaints without needing a high-fee advocate.",
        details: [
          "Send a written notice to the seller or service partner highlighting the specific material defect or service loss.",
          "If they refuse, file a case at the Consumer-Commission (e-Daakhil portal or physical office).",
          "Jurisdiction limits: District Commission (Up to Rs. 50 Lakhs), State Commission (Rs. 50 Lakhs to Rs. 2 Crores), National Commission (Above Rs. 2 Crores).",
          "You can draft and represent the complaint yourself (no lawyer necessary) in very simple formats."
        ]
      },
      {
        id: "mrp-rights",
        title: "Right Against Overcharging and MRP Rights",
        act: "Legal Metrology Act, 2009",
        summary: "Protects buyers from paying extra margins beyond what is written as the Maximum Retail Price.",
        details: [
          "No retail outlet, airport store, hotel, or roadside shop can charge more than the printed Maximum Retail Price (MRP).",
          "Dual pricing (printing two different MRPs for identical products depending on the place) is strictly illegal.",
          "You can lodge complaints to the local Legal Metrology controller if an establishment overcharges."
        ]
      }
    ]
  },
  {
    id: "cybercrime",
    title: "Cybercrime Rights",
    description: "Protection from dynamic digital frauds, online bullies, account hacking, and social media harassments.",
    icon: "Lock",
    articles: [
      {
        id: "cybercam-hot",
        title: "Right to Report Cybercrime Online",
        act: "Information Technology Act, 2000 & Ministry of Home Affairs",
        summary: "Allows victims to submit evidence and complaints of online fraud remotely and anonymously.",
        details: [
          "You can log cases anytime from anywhere in India at the National Cyber Crime Reporting Portal: cybercrime.gov.in.",
          "In cases of cyber financial thefts (bank hacking, phishing links), immediately call '1930' within 2-3 golden hours to freeze transfer pipelines of the scammer.",
          "Allows women and child victims to file complaints anonymously to prevent online identity leaks."
        ]
      },
      {
        id: "social-haras",
        title: "Online Harassment, Cyberstalking, and Morphing Protection",
        act: "Section 66E (Privacy violation) & Section 67 (Obscene content) under IT Act",
        summary: "Criminalizes non-consensual online stalk behaviour, sharing private pictures or morphing pictures.",
        details: [
          "Taking, uploading, or circulating photos/videos of any individual's private parts without permission is a serious cybercrime.",
          "Creating fake profiles using another's images to cause threat, defame, or blackmail carries 3 to 5 years of prison terms.",
          "Social media companies are required to remove non-consensual sexual images or morphed images within 24 hours of reporting."
        ]
      },
      {
        id: "financial-safe",
        title: "Protection Against Online Financial Fraud",
        act: "RBI Circular on Zero Liability of Customers",
        summary: "The critical Reserve Bank of India policy regarding zero consumer loss during swift cyber thefts.",
        details: [
          "If a card clone or OTP fraud takes place, you must report it to your bank within 3 working days.",
          "On reporting unauthorized transactions inside 3 days, the consumer has 'Zero Liability' and the bank is legally bound to refund the sum.",
          "If reported inside 4-7 days, consumer liability is limited to a small nominal value (about Rs. 5,000 to Rs. 25,000 depending on account)."
        ]
      }
    ]
  },
  {
    id: "student",
    title: "Student Rights",
    description: "Rights related to free basic education, strict campus anti-ragging protections, and fee safety.",
    icon: "GraduationCap",
    articles: [
      {
        id: "rte-act",
        title: "Right to Education (RTE)",
        act: "Article 21A, Indian Constitution & Right to Education Act, 2009",
        summary: "Enforces free and compulsory primary and secondary education for kids aging between 6 and 14.",
        details: [
          "Every child has a fundamental right to receive simple education in a neighboring state-backed school.",
          "Private schools are legally bound to reserve 25% of entry-level seats for children of weaker and disadvantaged groups.",
          "Absolutely prohibits physical punishment, verbal abuse, or detention of children during elementary school years."
        ]
      },
      {
        id: "anti-raging",
        title: "Right Against Ragging Inside Campuses",
        act: "UGC Anti-Ragging Regulations",
        summary: "Absolute zero-tolerance ban on physical or psychological bullying of students in residential and day institutes.",
        details: [
          "Ragging is a fully cognizable criminal offence in India. Every college must form dynamic anti-ragging squads.",
          "Students can file anonymous complaints online at lower-risk lines (anti-ragging helpline: 1800-180-5522).",
          "Colleges must immediately report ragging items to local police stations; failure to act results in loss of university affiliation."
        ]
      },
      {
        id: "grievance-col",
        title: "Right to Institutional Grievance Redressal",
        act: "UGC Grievance Redressal Regulations",
        summary: "Enforces standard processes for colleges to handle marks issues, fee problems, and internal staff problems.",
        details: [
          "Every university/college must maintain a clear Student Grievance Redressal Committee (SGRC).",
          "Colleges cannot withhold or refuse to return student original certificates (Aadhaar, marks cards) to force payments.",
          "Protects students against charging of extra unreceipted campus capitation fees or abrupt fee hikes mid-semester."
        ]
      }
    ]
  }
];

