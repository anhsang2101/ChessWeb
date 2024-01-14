import { Routes, Route } from 'react-router-dom';

import './App.css';
import HomePage from './components/pages/HomePage/HomePage';
import SignUp from './components/pages/SignUp/SignUp';
import SignIn from './components/pages/SignIn/SignIn';
import PlayOnline from './components/pages/PlayOnline/PlayOnline';

function App() {
  return (
    <Routes>
      {/* home page - default */}
      <Route path="/" element={<HomePage />} />

      {/* play online / with computer / with a friend */}
      <Route path="/play/online" element={<PlayOnline />} />
      <Route path="/play/computer" element={<HomePage />} />
      <Route path="/play/friend" element={<HomePage />} />

      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
    </Routes>
  );
}

export default App;
