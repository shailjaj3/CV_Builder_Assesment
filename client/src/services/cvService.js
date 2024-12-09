





































// // src/components/ProtectedRoute.js
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('token');

//   // If there is a token, redirect to dashboard
//   if (token) {
//     return <Navigate to="/dashboard" />;
//   }

//   // If no token, allow access to children (Login or Register)
//   return children;
// };

// export default ProtectedRoute;
