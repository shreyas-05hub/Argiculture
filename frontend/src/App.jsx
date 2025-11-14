import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import ModelHub from './pages/ModelHub'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import Authentication from './pages/Authentication'
import Contact from './pages/ContactUs'
import Footer from './components/Footer'
import "bootstrap/dist/css/bootstrap.min.css";
import FarmerDashboard from './components/FarmerDashboard'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'

const App = () => {
  return (
    <div className='container-fluid'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/modelhub' element={<ModelHub/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/marketplace' element={<Marketplace/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/authentication' element={<Authentication/>}/>
        <Route path='/dashboard' element={<FarmerDashboard/>}/>
        <Route path='/dashboard' element={<UserDashboard/>}/>
        <Route path='/dashboard' element={<AdminDashboard/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
