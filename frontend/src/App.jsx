import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Home from './pages/Home';
import HomeDashboard from './pages/HomeDashboard';
import Admin from './pages/Admin';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import OwnerLayout from './pages/OwnerLayout';
import Projects from './pages/owner/Projects';
import ProjectDetail from './pages/owner/ProjectDetail';
import Team from './pages/owner/Team';

import UserProjects from './pages/user/Projects';
import UserProjectDetail from './pages/user/UserProjectDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Redirect root to login for now */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />}>
          <Route index element={<HomeDashboard />} />
          <Route path="projects" element={<UserProjects />} />
          {/* Add more routes here later like documents, chat etc */}
        </Route>

        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<Navigate to="projects" replace />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="team" element={<Team />} />
        </Route>

        <Route path="/home/" element={<Home />}>
          <Route path="projects/:id" element={<UserProjectDetail />} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
