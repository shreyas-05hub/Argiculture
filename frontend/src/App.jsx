import React from 'react'
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import ModelHub from './pages/ModelHub'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import Authentication from './pages/Authentication'
import Contact from './pages/ContactUs'
import Footer from './components/Footer'
import "bootstrap/dist/css/bootstrap.min.css";
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import UserProfile from './pages/UserProfile'
// import UserManagement from './pages/UserManagement'
import MarketManagement from './pages/MarketManagement'
import Reports from './pages/Reports'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './components/AdminDashboard'
import FarmerDashboard from './components/FarmerDashboard'
// import UserDashboard from './components/UserDashboard'
import Orders from './pages/Orders';
import Query from './pages/Query';
import "./styles/style.css"
import ScrollToTop from './components/ScrollToTop';
const App = () => {

  useEffect(() => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const adminExists = users.some((u) => u.role === "admin");

  if (!adminExists) {
    users.push({
      username: "admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
    });

    localStorage.setItem("users", JSON.stringify(users));
    console.log("Default admin created!");
  }
}, []);

  return (
    <div>
      <ScrollToTop/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<AboutUs/>}/>
        <Route path='/modelhub' element={<ModelHub/>}/>
        <Route path='/marketplace' element={<Marketplace/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/authentication' element={<Authentication/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>        
        <Route path="/farmer-dashboard" element={
            <ProtectedRoute role="farmer">
              <FarmerDashboard />
            </ProtectedRoute>}/>
        {/* <Route path="/user-dashboard" element={
            <ProtectedRoute role="enduser">
              <UserDashboard />
            </ProtectedRoute>}/> */}
        <Route path="/admin-dashboard" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>}/>        
        <Route path='/profile' element={<UserProfile/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/marketmanagement' element={<MarketManagement/>}/>
        <Route path='/reports' element={<Reports/>}/>
        <Route path='/query' element={<Query/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
