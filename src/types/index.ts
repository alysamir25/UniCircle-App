export type UserRole = 'member' | 'committee' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  universityId?: string;
  avatarUrl?: string;
  eventsAttended?: number;
  joinDate?: string;
  lastActive?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  category: 'announcement' | 'event' | 'resource' | 'opportunity';
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  organizerId: number;
  attendees: number[];
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
}

// Extended Event interface for admin view
export interface AdminEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  registeredUsers: number[];
  waitlist: number[];
  status: "open" | "almost_full" | "full";
  createdAt: string;
  organizerId: number;
  organizerName: string;
}

export interface Attendee {
  id: number;
  name: string;
  email: string;
  universityId?: string;
  registrationDate: string;
  status: 'registered' | 'waitlisted' | 'attended' | 'cancelled';
  position?: number; // For waitlist position
}

// Analytics interfaces
export interface AnalyticsData {
  totalMembers: number;
  committeeMembers: number;
  activeMembers: number;
  totalEvents: number;
  totalRegistrations: number;
  totalPosts: number;
  totalEngagement: number;
  avgEventAttendance: number;
  dateRange: string;
  registrationRate: number;
  capacityUtilization: number;
}

export interface ChartDataPoint {
  month: string;
  registrations: number;
  events: number;
}

export interface PopularEventData {
  name: string;
  registrations: number;
  capacity: number;
  fill: string;
}

export interface MemberEngagementData {
  name: string;
  value: number;
  color: string;
}

export interface EventStatusData {
  name: string;
  value: number;
  color: string;
}

export interface TopMemberData {
  name: string;
  events: number;
  role: UserRole;
}

export interface ReportData {
  events: Array<{
    title: string;
    date: string;
    registered: number;
    capacity: number;
    waitlist: number;
    status: string;
  }>;
  members: Array<{
    name: string;
    email: string;
    role: UserRole;
    eventsAttended: number;
    joinDate: string;
    lastActive: string;
  }>;
  posts: Array<{
    title: string;
    author: string;
    date: string;
    likes: number;
    comments: number;
    category: string;
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'json' | 'excel';
  reportType: 'summary' | 'detailed' | 'custom';
  dateRange: 'week' | 'month' | 'quarter' | 'year';
}