import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchRecipes from './components/SearchRecipes'
import Home from './components/Home'

function App() {

  const apiKey = 'DE79GGe3hQ&aho3&!oJeA6sXDi!yMe';

  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home apiKey={apiKey} />}></Route>
          <Route exact path='/search' element={<SearchRecipes apiKey={apiKey} />}></Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
