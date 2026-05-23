import React from 'react';
import Sidebar from './components/Sidebar/Sidebar'; // Đảm bảo đường dẫn đúng
import Header from './components/Header/Header';
import UserDetail from './pages/UserDetail/UserDetail';
import './App.css';

function App() {
  return (
    <div className="admin-app">
      <Sidebar /> {/* Sidebar luôn ở bên trái */}
      
      <div className="content-wrapper">
        <Header /> {/* Header nằm trên cùng bên phải */}
        
        <main>
          <UserDetail /> {/* Nội dung trang ở dưới */}
        </main>
      </div>
    </div>
  );
}

export default App;