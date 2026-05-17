import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import KnowledgeBase from './pages/KnowledgeBase'
import NewPrediction from './pages/NewPrediction'
import CompatibilityReport from './pages/CompatibilityReport'
import LabValidation from './pages/LabValidation'
import MoleculeDatabase from './pages/MoleculeDatabase'
import Projects from './pages/Projects'
import ModelInsights from './pages/ModelInsights'
import ProfileSettings from './pages/ProfileSettings'

export default function App() {
  useEffect(() => {
    // Persist Dark Mode Globally
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('dark-mode-hack');
      if (!document.getElementById('dark-mode-style')) {
        const style = document.createElement('style');
        style.id = 'dark-mode-style';
        style.innerHTML = `
          .dark-mode-hack { filter: invert(1) hue-rotate(180deg) contrast(0.9); }
          .dark-mode-hack img, .dark-mode-hack video { filter: invert(1) hue-rotate(180deg); }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/new-prediction" element={<NewPrediction />} />
        <Route path="/report" element={<CompatibilityReport />} />
        <Route path="/lab-validation" element={<LabValidation />} />
        <Route path="/molecules" element={<MoleculeDatabase />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/model-insights" element={<ModelInsights />} />
        <Route path="/profile" element={<ProfileSettings />} />
      </Route>
    </Routes>
  )
}
