import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login"
import Home from "./Home"
import Register from "./Register"
import Profile from "./Profile"
import Matched from "./Matched"
import Blank from "./Blank"
import Favorite from "./Favorite"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/matched" element={<Matched/>} />
      <Route path="/favorite" element={<Favorite/>} />
      <Route path="*" element={<Blank/>} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
