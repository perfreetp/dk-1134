import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import PublishPage from './pages/Publish';
import OrderPage from './pages/Order';
import MessagePage from './pages/Message';
import ProfilePage from './pages/Profile';
import TabBar from './components/layout/TabBar';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/publish" element={<PublishPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/message" element={<MessagePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <TabBar />
      </div>
    </Router>
  );
}
