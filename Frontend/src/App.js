import './App.css';
import Customers from './Customers';
import Home from './Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyNavbar from './components/MyNavbar';
import Products from './Products';
import Cars from './Cars';
import Receipt from './components/Receipt';
 
function App() {
  return (
    <div className="App">
      <Router>
        <MyNavbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers/>}></Route>
          <Route path="/products" element={<Products />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/reciept" element={<Receipt />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;