import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const delay = ms => new Promise(res => setTimeout(res, ms));
const url = "https://kouple.onrender.com/"

const showLoading = async () => {
  document.getElementById("userCard").style.display = "none"
  document.getElementById("notFound").style.display = "none"
  document.getElementById("loading").style.display = "block";
  document.getElementById("footer").style.position = "fixed";
}

const foundUser = async () => {
  await delay(1000);
  // document.getElementById("footer").style.position = "relative";
  document.getElementById("loading").style.display = "none";
  document.getElementById("userCard").style.display = "block"
}

const notFoundUser = async () => {
  await delay(1000);
  document.getElementById("footer").style.position = "fixed";
  document.getElementById("loading").style.display = "none";
  document.getElementById("notFound").style.display = "block"
}


const matching = async () => {
  let token = localStorage.getItem('token')
  showLoading()
  if (token === "") {
    window.location = "/login";
  }
  var jsonData = {
    token: 'Bearer ' + localStorage.getItem('token')
  }
  fetch(url + 'matched', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        if (data.profile1.length > 0 || data.profile2.length > 0) {
          foundUser()
          let profile1 = data.profile1
          let profile2 = data.profile2
          console.log(profile2)
          let text = "";
          for (let i = 0; i < profile1.length; i++) {
            var dob = new Date(profile1[i].u_birthdate);
            var month_diff = Date.now() - dob.getTime();
            var age_dt = new Date(month_diff);
            var year = age_dt.getUTCFullYear();
            var age = Math.abs(year - 1970);
            text += `<div class="col-12 list pt-2" onClick={{showChat}}><div class="row"><div class="col-3">`
            if (profile1[i].u_image !== null) {
              text += `<img style={{borderRadius:"50px", objectFit:"cover"}} class="profile" src="` + url + `images/` + profile1[i].u_image + `" width="70" height="70"/>`
            } else {
              text += `<img style={{borderRadius:"50px", objectFit:"cover"}} class="profile" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" width="70" height="70"/>`
            }
            text += `</div><div class="col-9"><h4><span>` + profile1[i].u_fname + `</span> <span>` + profile1[i].u_lname + `</span></h4>`
            text += `<p>` + profile1[i].g_name + `, <span>` + age + `</span></p></div></div></div></div>`
          }
          for (let i = 0; i < profile2.length; i++) {
            var dob = new Date(profile2[i].u_birthdate);
            var month_diff = Date.now() - dob.getTime();
            var age_dt = new Date(month_diff);
            var year = age_dt.getUTCFullYear();
            var age = Math.abs(year - 1970);
            text += `<div class="col-12 list pt-2" onClick={{showChat}}><div class="row"><div class="col-3">`
            if (profile2[i].u_image !== null) {
              text += `<img style={{borderRadius:"50px", objectFit:"cover"}} class="profile" src="` + url + `images/` + profile2[i].u_image + `" width="70" height="70"/>`
            } else {
              text += `<img style={{borderRadius:"50px", objectFit:"cover"}} class="profile" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" width="70" height="70"/>`
            }
            text += `</div><div class="col-9"><h4><span>` + profile2[i].u_fname + `</span> <span>` + profile2[i].u_lname + `</span></h4>`
            text += `<p>` + profile2[i].g_name + `, <span>` + age + `</span></p></div></div></div></div>`
          }
          document.getElementById("matched").innerHTML = text;
        } else {
          notFoundUser()
          // document.getElementById("matched").innerHTML = "<h4 class='text-center card-title'>ยังไม่มีใครตรงกันกับคุณในขณะนี้</h4>";
        }
      } else {
        console.log(data.message)
        alert(data.message)
        localStorage.removeItem('token');
        window.location = "/login";
      }
    })
    .catch((error) => {
      console.log(error)
      alert('authen failed')

      console.error('Error:', error);
    });

}


export default function Matched() {
  useEffect(() => {
    // findUser()
    matching()
  }, [])


  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userFound');
    window.location = "/login";
  }

  const refresh = (event) => {
    matching()
  }

  return (
    <div class="container">
      <div class="position-relative mt-3">
          <div class="position-absolute top-0 end-0">
            <button class="btn btn-outline-primary text-white" onClick={handleLogout}>ออกจากระบบ</button>
          </div>
        </div>
        
      <div class="row justify-content-md-center">
        <div class="col-12 text-center mt-5">
          <img src="/logo.png" height="100px" />
        </div>
        <div class="col col-lg-4 col-md-8 col-sm-12 mb-5">
          <div class="card px-2 mb-5 matched" id="userCard">
            <div class="card-body">
              <div class="row" id="matched">
              </div>
            </div>
          </div>
          <div class="card p-2 text-center" style={{ marginTop: "100px" }} id="notFound">
            <h3 class="card-title text-center">ไม่พบผู้ใช้งาน!</h3>
            <p class="card-title text-center">ยังไม่มีผู้ใช้งานที่แมตช์กับคุณในขณะนี้</p>
            <p class="card-title text-center">โปรดลองใหม่อีกครั้งในภายหลัง</p>
            <button class="btn btn-outline-primary mt-4" onClick={refresh}>รีเฟรช <i class="bi bi-arrow-repeat"></i></button>
          </div>
        </div>
      </div>
      <div class="footer" id="footer">
        <div class="row">
          <div class="col text-center mb-5">
            <a href='/' class="btn btn-outline-primary me-2 px-1">หน้าหลัก</a>
            <a href='/matched' class="btn btn-primary p-2 me-2">ข้อความ</a>
            <a href='/favorite' class="btn btn-outline-primary me-2 px-1">ความสนใจ</a>
            <a href='/profile' class="btn btn-outline-primary px-1">โปรไฟล์</a>
          </div>
        </div>
      </div>
    </div>
  );
}