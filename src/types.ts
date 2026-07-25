export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  timestamp: string;
}

export interface BoardItem {
  id: string;
  name: string;
  commentsCount: number;
  commentsList: Comment[];
  csBack: string;
  csBackColor: string; // 'purple' | 'green' | 'gray'
  dateCreated: string;
  duration: string; // e.g. "May 22 - Jun 22"
  durationBadgeColor?: 'orange' | 'blue' | 'gray';
  
  // Week 1
  w1Industry: string;
  w1CompanySize: string;
  w1Titles: string;
  w1Region: string;

  // Week 2
  w2Industry: string;
  w2CompanySize: string;
  w2Titles: string;
  w2Region: string;

  // Week 3
  w3Industry: string;
  w3CompanySize: string;
  w3Titles: string;
  w3Region: string;

  // Week 4
  w4Industry: string;
  w4CompanySize: string;
  w4Titles: string;
  w4Region: string;

  // Final columns
  clientEmail: string;
  sendToClientStatus: 'Sent' | 'Pending' | 'Draft' | '';
  selected?: boolean;
}

export interface BoardGroup {
  id: string;
  title: string;
  color: string;
  items: BoardItem[];
  collapsed?: boolean;
}

export type ViewTab = 'main' | 'week1' | 'week2' | 'week3' | 'week4' | 'vibe';

// PLM Specific Interfaces
export interface PLMItem {
  id: string;
  name: string;
  commentsCount: number;
  commentsList?: Comment[];
  startDate: string;
  totalDays: string;
  dateCreated?: string;
  endDate?: string;
  currentStatus: string;
  state: string;
  companySize: string;
  spreadsheetLink: string;
  dashboardLink: string;
  contentLink: string;
  pc: string;
  csFront: string;
  csBack: string;
  country: string;
  analyst: string;
  industry: string;
  emailEngine: string;
  projectType: string;
  contactDetails: string;
  emailIds: string;
  gtmLink: string;
  fortnight: string;
  emailWarmup: string;
  emailTrigger: string;
  domainHealthLink: string;
  domainHealth: string;
  whatsApp: string;
  emailIdPass: string;
  calendly: string;
  linkedIn: string;
  bd: string;
  reasonOfHold: string;
  backupCx: string;
  selected?: boolean;
}

export interface PLMGroup {
  id: string;
  title: string;
  color: string;
  items: PLMItem[];
  collapsed?: boolean;
}

export type BoardType = 'project-plan' | 'plm' | 'data-request';
