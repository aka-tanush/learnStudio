export enum UserRole {
  EDUCATOR = 'EDUCATOR',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Plain text for demo purposes only
  role: UserRole;
  department?: string;
  employeeId?: string;
  studentCourse?: string;
  studentYear?: string;
  studentId?: string;
  joinedAt: string;
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED'
}

export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'VIDEO' | 'DOC' | 'LINK';
  url: string;
}

export interface Module {
  id: string;
  title: string;
  content: string; // Could be markdown or text
  resources?: Resource[];
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  maxPoints: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string; // Added for educator view convenience
  fileUrl?: string; // Mock url
  content?: string;
  grade?: number;
  feedback?: string;
  plagiarismScore?: number;
  status: SubmissionStatus;
  submittedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  author: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface ForumPost {
  id: string;
  studentName: string;
  title: string;
  content: string;
  date: string;
  replies: { id: string; author: string; content: string; date: string }[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string; // lucide icon name or emoji
  description: string;
  earnedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'DEADLINE' | 'ANNOUNCEMENT' | 'GRADE' | 'BADGE';
}

export interface Message {
  id: string;
  sender: string;
  avatar: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  content: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'ASSIGNMENT' | 'CLASS' | 'EXAM' | 'REMINDER';
  courseName: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string; // Added category
  instructor: string;
  modules: Module[];
  assignments: Assignment[];
  quizzes?: Quiz[];
  forumPosts?: ForumPost[];
  submissions?: Submission[];
  announcements?: Announcement[];
  enrolledCount: number;
  imageUrl?: string;
}

export interface GeneratedCourseData {
  title: string;
  description: string;
  category: string;
  modules: { title: string; content: string }[];
}