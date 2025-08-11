import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotePage from './components/NotePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/note/new" element={<NotePage isNewNote={true} />} />
        <Route path="/note/:id" element={<NotePage />} />
      </Routes>
    </Router>
  );
};

export default App;
