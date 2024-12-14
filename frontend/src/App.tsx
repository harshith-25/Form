import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import FormBuilder from './components/FormBuilder'
import FormView from './components/FormView'
import SubmissionsView from './components/SubmissionsView'
import Layout from './components/Layout/Layout'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/form/new" element={<FormBuilder />} />
          <Route path="/form/:id" element={<FormBuilder />} />
          <Route path="/form/:id/submissions" element={<SubmissionsView />} />
          <Route path="/share/:shareableLink" element={<FormView />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App