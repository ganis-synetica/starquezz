import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ChildDashboard } from './pages/ChildDashboard'
import { ChildDashboardEricCarle } from './pages/ChildDashboardEricCarle'
import { StarStore } from './pages/StarStore'
import { MyRewards } from './pages/MyRewards'
import { ParentLogin } from './pages/ParentLogin'
import { ParentSignUp } from './pages/ParentSignUp'
import { ApprovalQueue } from './pages/ApprovalQueue'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { Onboarding } from './pages/Onboarding'
import { ParentSetupWizard } from './pages/ParentSetupWizard'
import { ParentPinEntry } from './pages/ParentPinEntry'
import { AddChildWizard } from './pages/AddChildWizard'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ChildProtectedRoute } from './components/auth/ChildProtectedRoute'
import { ParentPinProtectedRoute } from './components/auth/ParentPinProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<ParentSignUp />} />
        <Route path="/login" element={<ParentLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Parent PIN entry */}
        <Route
          path="/parent/pin"
          element={
            <ProtectedRoute>
              <ParentPinEntry />
            </ProtectedRoute>
          }
        />
        
        {/* Parent setup wizard */}
        <Route
          path="/parent/setup"
          element={
            <ProtectedRoute>
              <ParentSetupWizard />
            </ProtectedRoute>
          }
        />

        {/* Add child wizard (requires PIN) */}
        <Route
          path="/parent/add-child"
          element={
            <ParentPinProtectedRoute>
              <AddChildWizard />
            </ParentPinProtectedRoute>
          }
        />

        {/* Child routes */}
        <Route
          path="/child/:id"
          element={
            <ChildProtectedRoute>
              <ChildDashboard />
            </ChildProtectedRoute>
          }
        />
        
        {/* Design preview - Eric Carle style */}
        <Route
          path="/preview/eric-carle/:id"
          element={
            <ChildProtectedRoute>
              <ChildDashboardEricCarle />
            </ChildProtectedRoute>
          }
        />
        <Route
          path="/store/:id"
          element={
            <ChildProtectedRoute>
              <StarStore />
            </ChildProtectedRoute>
          }
        />
        <Route
          path="/rewards/:id"
          element={
            <ChildProtectedRoute>
              <MyRewards />
            </ChildProtectedRoute>
          }
        />

        {/* Parent dashboard (requires PIN) */}
        <Route
          path="/parent/approvals"
          element={
            <ParentPinProtectedRoute>
              <ApprovalQueue />
            </ParentPinProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
