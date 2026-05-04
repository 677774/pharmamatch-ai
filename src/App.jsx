import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
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
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
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
