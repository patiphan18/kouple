import React, {useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const delay = ms => new Promise(res => setTimeout(res, ms));
const waiting = async () => {
  document.getElementById("loginCard").style.display = "none"
  document.getElementById("loading").style.display = "block";
  await delay(900);
  // console.log("Waited 5s");
  document.getElementById("loading").style.display = "none";
  document.getElementById("loginCard").style.display = "block";
  // await delay(5000);
  // console.log("Waited an additional 5s");
};

const showLoading = async () => {
  document.getElementById("loginCard").style.display = "none"
  document.getElementById("loading").style.display = "block";
}

const hideLoading = async () => {
  document.getElementById("loginCard").style.display = "block"
  document.getElementById("loading").style.display = "none";
}

const url = "https://kouple.onrender.com/"

export default function Login() {
  useEffect(() => {
    showLoading()
    const token = localStorage.getItem('token')
    if(token !== "") {
      fetch(url + 'authen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token, 
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.status === "ok") {
          window.location = "/home";
        } else {
          hideLoading()
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    }
}, [])

  const showPassword = (event) => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      document.getElementById("eye").className = "bi bi-eye-fill";
      <i class="bi bi-eye-fill"></i>
    } else {
      x.type = "password";
      document.getElementById("eye").className = "bi bi-eye-slash-fill";
    }
  }

  const typeUsername = (event) => {
    var username = document.getElementById("username");
    username.value = username.value.replace(/[^a-zA-Z0-9_.]+/, '/');
    username.value = username.value.toLowerCase();
  }

  const handleSubmit = (event) => {
    
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // console.log(document.getElementById('email').value)
    
    const jsonData = {
        // email: data.get('email'),
        // password: data.get('password'),
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    }
    
    showLoading()
    fetch(url + 'login', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
    .then((response) => response.json())
    .then((data) => {
        waiting()
        if(data.status === "ok") {
            localStorage.setItem('token', data.token)
            window.location = "/home"
            // alert('login success')
        } else {
          hideLoading()
          document.getElementById('alert').innerHTML = "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง"
        }
    })
    .catch((error) => {
        waiting()
        console.error('Error:', error);
        document.getElementById('alert').innerHTML = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
    });
  };

  const register = (event) => {
    window.location = "/register"
  }

  return (    
    <div class="container">
      <div class="row justify-content-md-center mt-5">
        <div class="col-12 text-center">
          {/* <h1 class="text-center" style={{fontSize:"60px"}}>KOUPLE</h1> */}
          <img src="/logo.png" height="100px" />
        </div>
        <div class="col col-lg-4 col-md-6 col-sm-12 mt-4" id="loginCard">
        <div class="card px-3 mt-5">
            <div class="card-body">
            <h3 class="card-title">เข้าสู่ระบบ</h3>
              <form onSubmit={handleSubmit} class="mt-4">
                <p id="alert" class="text-danger"></p>
                <div class="mb-3">
                  <label for="username" class="form-label">ชื่อผู้ใช้งาน</label>
                  <input type="text" id="username" onKeyUp={typeUsername} autoComplete="username" class="form-control" required/>
                </div>
                <label for="password" class="form-label">รหัสผ่าน</label>
                <div class="input-group mb-3">
                  <input type="password" id="password" autoComplete="password" class="form-control passwordLogin" required/>
                  <span class="input-group-text" id="basic-addon1" onClick={showPassword}><i id="eye" class="bi bi-eye-slash-fill"></i></span>
                </div>
                <div class="row mt-4">
                  <div class="col text-center">
                  <button type="submit" class="btn btn-primary fs-5">เข้าสู่ระบบ</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <p class="text-center mt-4">หากยังไม่มีบัญชี <a href="#" class="link-dark" onClick={register}>สมัครใช้งาน</a></p>
        </div>
      </div>
    </div>
  );
}