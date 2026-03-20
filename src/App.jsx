import Layouts from './components/Layouts';
import { Navigate, Route, Routes } from 'react-router-dom';
import PartyRegistration from './pages/PartyRegistration';
import CastVote from './pages/CastVote';
import LiveResult from './pages/LiveResult';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  return (
    <Layouts>
      <Routes>
        <Route path='/' element={<Navigate to="/register" replace />} />
        <Route path='/register' element={<PartyRegistration />} />
        <Route path='/vote' element={<CastVote />} />
        <Route path='/results' element={<LiveResult />} />
        <Route path='/admin' element={<AdminPanel />} />
      </Routes>
    </Layouts>
  )
}

export default App;