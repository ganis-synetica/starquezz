import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ChildDashboard } from './pages/ChildDashboard'
import { StarStore } from './pages/StarStore'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/child/:id" element={<ChildDashboard />} />
        <Route path="/store" element={<StarStore />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
