import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Editor from './pages/Editor';


// Lazy load the components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Templates = lazy(() => import('./pages/Templates'));
const AllCVs = lazy(() => import('./pages/AllCVs'));
const Register = lazy(() => import('./pages/Register'));
const AllCVTwo = lazy(() => import('./utils/two/AllCVTwo'));
const AllCVOne = lazy(() => import('./utils/one/AllCVOne'));
const Login = lazy(() => import('./pages/Login'));



const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);



  return (
    <Router>
      {/* <Header /> */}
      <Header token={token} userName={userName} setToken={setToken} setUserName={setUserName} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Show Login and Register routes only if not authenticated */}
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login setToken={setToken} setUserName={setUserName} />} />
              <Route path="/register" element={<Register />} />
               <Route path="*" element={<Navigate to="/login" />} />
              <Route path="/" element={<Home/>} /> 
            </>
          ) : (
            <>
              {/* Authenticated routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/all-cvs" element={<AllCVs />} />
              <Route path="/AllCVTwo/:id" element={<AllCVTwo />} />
              <Route path="/Editor/:id" element={<Editor/>} />

              <Route path="/AllCVOne" element={<AllCVOne />} />
              <Route path="/AllCVOne/:id" element={<AllCVOne />} />

              <Route path="*" element={<Navigate to="/" />} /> 
              <Route path="/" element={<Home/>} /> 


            </>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
