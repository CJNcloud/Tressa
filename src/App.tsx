import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/hooks/useTheme"
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { Register } from '@/pages/Register'
import { Login } from '@/pages/Login'
import { CreateTress } from '@/pages/CreateTress'
import { ViewTress } from '@/pages/ViewTress'
import { Profile } from '@/pages/Profile'
import { AuthProvider } from '@/hooks/useAuth'
function App() {
  return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create" element={<CreateTress />} />
                <Route path="/tress/:id" element={<ViewTress />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </ThemeProvider>
  )
}

export default App

