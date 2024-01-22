import { Routes, Route } from 'react-router-dom';

import './App.css';

import HomePage from './components/pages/client/HomePage/HomePage';
import SignUp from './components/pages//SignUp/SignUp';
import SignIn from './components/pages/SignIn/SignIn';
import Admin from './components/pages/Admin/Admin';
import PlayOnline from './components/pages/client/PlayOnline/PlayOnline';
import PlayWithComputer from './components/pages/client/PlayWithComputer/PlayWithComputer';

function App() {
  return (
    <Routes>
      {/* home page - default */}
      <Route path="/" element={<HomePage />} />
      {/* admin */}
      <Route path="/admin" element={<Admin />} />

      {/* authentication */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />

      {/* play online / with computer / with a friend */}
      <Route path="/play/online" element={<PlayOnline />} />
      <Route path="/play/computer" element={<PlayWithComputer />} />
      <Route path="/play/friend" element={<HomePage />} />
    </Routes>
  );
}

export default App;
