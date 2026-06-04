/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserSession {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
}

export interface DictionaryTerm {
  id: string;
  term: string;
  definition: string;
  category: "Criminal Law" | "Civil Law" | "Constitutional Law" | "Consumer Law" | "Cyber Law" | "Women's Rights" | "Child Protection" | "Civic Rights" | "General";
}

export interface HelplineItem {
  name: string;
  number: string;
  purpose: string;
  category: "Police" | "Women" | "Child" | "Medical" | "General" | "Cyber" | "Legal" | "Transit" | "Senior" | "Consumer" | "Crisis";
}

export interface RightsArticle {
  id: string;
  title: string;
  act?: string;
  summary: string;
  details: string[];
}

export interface RightsCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  articles: RightsArticle[];
}

export interface JavaCodeFile {
  name: string;
  path: string;
  language: "java" | "jsp" | "xml" | "sql";
  content: string;
  explanation: string;
}

export interface CourtOrderHistory {
  date: string;
  action: string;
  notes: string;
}

export interface CourtCase {
  cnrNumber: string;
  caseNumber: string;
  caseType: string;
  filingDate: string;
  court: string;
  petitioner: string;
  respondent: string;
  judge: string;
  status: "PENDING" | "DECIDED" | "UNDER INVESTIGATION";
  nextHearingDate?: string;
  stage: string;
  advocate: string;
  actSection: string;
  history: CourtOrderHistory[];
}

export interface CauseListItem {
  serialNo: number;
  caseNumber: string;
  partyName: string;
  advocate: string;
  stage: string;
  courtroom: string;
}

