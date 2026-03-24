import Layouts from './components/Layouts';
import { Navigate, Route, Routes } from 'react-router-dom';
import PartyRegistration from './pages/PartyRegistration';
import CastVote from './pages/CastVote';
import LiveResult from './pages/LiveResult';
import AdminPanel from './pages/AdminPanel';
import VoterRegistration from './pages/VoterRegistration';

const App = () => {
  return (
    <Layouts>
      <Routes>
        <Route path='/' element={<Navigate to="/register-party" replace />} />
        <Route path='/register-party' element={<PartyRegistration />} />
        <Route path="/register-voter" element={<VoterRegistration />} />
        <Route path='/vote' element={<CastVote />} />
        <Route path='/results' element={<LiveResult />} />
        <Route path='/admin' element={<AdminPanel />} />
      </Routes>
    </Layouts>
  )
}

export default App;