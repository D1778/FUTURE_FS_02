import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadDetailPage from './pages/LeadDetailPage';
import ContactPage from './pages/ContactPage';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token')
    ? children
    : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/" element={
          <PrivateRoute><DashboardPage /></PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute><DashboardPage /></PrivateRoute>
        } />
        <Route path="/leads/:id" element={
          <PrivateRoute><LeadDetailPage /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;