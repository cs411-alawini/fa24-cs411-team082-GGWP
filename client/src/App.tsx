import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import RecPage from './pages/RecPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/searchRecreation/:RecName" element={<RecPage />} />
      </Routes>
    </Router>
  );
}

export default App;
