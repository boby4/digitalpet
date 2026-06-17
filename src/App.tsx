import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pet from './pages/Pet';
import Garden from './pages/Garden';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pet" element={<Pet />} />
        <Route path="/garden" element={<Garden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
