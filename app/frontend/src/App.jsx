import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ClustersPage from './pages/ClustersPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-skillmap-bg bg-mesh font-body text-skillmap-text">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clusters" element={<ClustersPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
