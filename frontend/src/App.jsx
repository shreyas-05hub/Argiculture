import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import ModelHub from './pages/ModelHub'
import FarmerDash from './pages/FarmerDash'
import Marketplace from './pages/Marketplace'
import Authentication from './pages/Authentication'
import Contact from './pages/ContactUs'
import Footer from './components/Footer'
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/modelhub' element={<ModelHub/>}/>
        <Route path='/farmerdash' element={<FarmerDash/>}/>
        <Route path='/marketplace' element={<Marketplace/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/authentication' element={<Authentication/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
