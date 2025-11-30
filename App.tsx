import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { EducatorView } from './components/EducatorView';
import { StudentView } from './components/StudentView';
import { AdminView } from './components/AdminView';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Welcome } from './components/Welcome';
import { UserRole, Course, SubmissionStatus, Notification, Badge, Message, CalendarEvent, User } from './types';
import { db } from './services/db';

const NOTIFICATIONS: Notification[] = [
    { id: 'n1', title: 'Assignment Due Soon', message: 'The assignment "Component Composition" is due tomorrow.', date: '2023-11-14', read: false, type: 'DEADLINE' },
    { id: 'n2', title: 'New Grade Posted', message: 'Your grade for "Hooks Deep Dive" is now available.', date: '2023-11-12', read: true, type: 'GRADE' },
    { id: 'n3', title: 'New Course Announcement', message: 'Dr. Sarah Smith posted: Welcome to the course!', date: '2023-10-01', read: true, type: 'ANNOUNCEMENT' }
];

const BADGES: Badge[] = [
    { id: 'b1', name: 'Fast Learner', icon: '🚀', description: 'Completed first module in record time.' },
    { id: 'b2', name: 'Quiz Master', icon: '🧠', description: 'Scored 100% on a quiz.' },
    { id: 'b3', name: 'Contributor', icon: '💬', description: 'Posted 5 helpful comments in forums.' }
];

const MESSAGES: Message[] = [
    { id: 'm1', sender: 'Alice Johnson', avatar: 'AJ', subject: 'Question about Assignment 1', preview: 'Hi Professor, I was wondering if...', date: '10:30 AM', read: false, content: 'Hi Professor,\n\nI was wondering if we can use functional components for the entire assignment or if class components are required for specific parts?\n\nThanks,\nAlice' },
    { id: 'm2', sender: 'Bob Smith', avatar: 'BS', subject: 'Extension Request', preview: 'I have a medical emergency...', date: 'Yesterday', read: true, content: 'Dear Professor,\n\nI have a medical emergency and might need a 1-day extension on the upcoming deadline. Attached is my medical certificate.\n\nRegards,\nBob' },
    { id: 'm3', sender: 'System', avatar: 'SY', subject: 'Maintenance Schedule', preview: 'LMS will be down on Sunday...', date: 'Nov 10', read: true, content: 'The LMS will be undergoing scheduled maintenance on Sunday from 2 AM to 4 AM UTC.' }
];

const EVENTS: CalendarEvent[] = [
    { id: 'e1', title: 'Component Composition Due', date: '2023-11-15', type: 'ASSIGNMENT', courseName: 'Modern React Development' },
    { id: 'e2', title: 'Live Q&A Session', date: '2023-11-16', type: 'CLASS', courseName: 'Modern React Development' },
    { id: 'e3', title: 'Hooks Deep Dive Due', date: '2023-11-22', type: 'ASSIGNMENT', courseName: 'Modern React Development' },
    { id: 'e4', title: 'Pandas Dataframes Due', date: '2023-12-01', type: 'ASSIGNMENT', courseName: 'Data Science Fundamentals' }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  // Load courses from DB on mount
  useEffect(() => {
    const loadedCourses = db.getCourses();
    setCourses(loadedCourses);
  }, []);

  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setAuthView('login');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveView('dashboard');
    // Refresh courses just in case
    setCourses(db.getCourses());
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthView('welcome');
  };

  const handleAddCourse = (newCourse: Course) => {
    db.saveCourse(newCourse);
    setCourses(db.getCourses());
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    db.updateCourse(updatedCourse);
    setCourses(db.getCourses());
  };

  const handleEnroll = (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
      
      const course = courses.find(c => c.id === courseId);
      if (course) {
        const updated = { ...course, enrolledCount: course.enrolledCount + 1 };
        db.updateCourse(updated);
        setCourses(db.getCourses());
      }
    }
  };

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    setActiveView('dashboard'); // Reset view on role switch
  };

  if (!isAuthenticated) {
    if (authView === 'welcome') {
        return <Welcome onSelectRole={handleSelectRole} />;
    }
    if (authView === 'signup') {
      return (
        <Signup 
            role={role}
            onSignup={handleLogin} 
            onNavigateToLogin={() => setAuthView('login')} 
            onBack={() => setAuthView('welcome')}
        />
      );
    }
    // Default to login
    return (
        <Login 
            role={role}
            onLogin={handleLogin} 
            onNavigateToSignup={() => setAuthView('signup')} 
            onBack={() => setAuthView('welcome')}
        />
    );
  }

  return (
    <Layout 
      role={role} 
      setRole={handleSetRole} 
      activeView={activeView}
      setActiveView={setActiveView}
      onLogout={handleLogout}
    >
      {role === UserRole.ADMIN ? (
        <AdminView 
          courses={courses}
          activeView={activeView === 'dashboard' ? 'dashboard' : activeView}
        />
      ) : role === UserRole.EDUCATOR ? (
        <EducatorView 
          userName={currentUser?.name || 'Educator'}
          courses={courses} 
          addCourse={handleAddCourse} 
          updateCourse={handleUpdateCourse}
          activeView={activeView}
          messages={MESSAGES}
          events={EVENTS}
        />
      ) : (
        <StudentView 
          userName={currentUser?.name || 'Student'}
          allCourses={courses}
          enrolledCourseIds={enrolledCourseIds}
          enrollInCourse={handleEnroll}
          activeView={activeView}
          notifications={NOTIFICATIONS}
          badges={BADGES}
          messages={MESSAGES}
          events={EVENTS}
        />
      )}
    </Layout>
  );
};

export default App;