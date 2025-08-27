import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css'; // Tailwind styles
import Sidebar from './pages/Sidebar';
import Content from './pages/Content';
import Reminders from './pages/reminders';
import Settings from './pages/settings';
import Newform  from './pages/reminder/new';
import Dashboards from './pages/Dashboards';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';




function AppLayout() {
  return (
    <div className="flex min-h-screen text-gray-800">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/new" element={<Newform />} />
        <Route path="/dashboards" element={<Dashboards />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

