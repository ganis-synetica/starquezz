import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ChildDashboard } from './pages/ChildDashboard'
import { StarStore } from './pages/StarStore'
import { ParentLogin } from './pages/ParentLogin'
import { ParentSignUp } from './pages/ParentSignUp'
import { ApprovalQueue } from './pages/ApprovalQueue'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { Onboarding } from './pages/Onboarding'
import { ParentSetupWizard } from './pages/ParentSetupWizard'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ChildProtectedRoute } from './components/auth/ChildProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/signup" element={<ParentSignUp />} />
        <Route path="/login" element={<ParentLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/parent/setup"
          element={
            <ProtectedRoute>
              <ParentSetupWizard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/child/:id"
          element={
            <ChildProtectedRoute>
              <ChildDashboard />
            </ChildProtectedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <ChildProtectedRoute>
              <StarStore />
            </ChildProtectedRoute>
          }
        />

        <Route
          path="/parent/approvals"
          element={
            <ProtectedRoute>
              <ApprovalQueue />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
