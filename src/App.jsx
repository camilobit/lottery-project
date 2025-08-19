/* eslint-disable react/no-unknown-property */
// src/App.jsx
import './App.css'
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Element } from 'react-scroll';
import Navbar from './components/Navbar';
import AboutMe from './components/SobreMi/AboutMe';
import Inicio from './components/Inicio/Inicio';
import Footer from './components/Footer/Footer';
import NumerosRifa from './components/NumerosRifa/NumerosRifa';
import RifaInfo from './components/RifaInfo/RifaInfo';

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <AboutMe/>
        <Element name="inicio">
          <Inicio />
        </Element>
        <Element name="rifa">
          <NumerosRifa />
        </Element>
        <Element>
          <br></br>
          <br></br>
          <br></br>
        </Element>
        <Element name="RifaInfo">
          <RifaInfo />
        </Element>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </div>
    </Router>
    
  )
}

export default App;
