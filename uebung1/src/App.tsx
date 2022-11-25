import './App.css'
import Navbar from './components/navbar/navbar.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import List1 from './components/pages/list1.js';
import List2 from './components/pages/list2.js';
import ADD from './components/functions/addItem.js';
import UpdateItem from './components/functions/updateItem';

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<List2 />} />
          <Route path='/list 2' element={<List2 />} />
          <Route path='/list 1' element={<List1 />} />
          <Route path='/add' element={<ADD />} />
          <Route path='/updateItem' element={<UpdateItem />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
