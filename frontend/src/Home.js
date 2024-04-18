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


const showLoading = async () => {
  document.getElementById("userCard").style.display = "none"
  document.getElementById("notFound").style.display = "none"
  document.getElementById("favoriteCard").style.display = "none"
  document.getElementById("loading").style.display = "block";
  document.getElementById("footer").style.position = "fixed";
}

const foundUser = async () => {
  await delay(1000);
  document.getElementById("footer").style.position = "relative";
  document.getElementById("loading").style.display = "none";
  document.getElementById("userCard").style.display = "block"
}

const notFoundUser = async () => {
  await delay(1000);
  document.getElementById("footer").style.position = "fixed";
  document.getElementById("loading").style.display = "none";
  document.getElementById("notFound").style.display = "block"
}

const noFavorite = async () => {
  await delay(1000);
  document.getElementById("footer").style.position = "fixed";
  document.getElementById("loading").style.display = "none";
  document.getElementById("favoriteCard").style.display = "block"
}

let like = null;
let dataProfile = null;
const url = "https://kouple.onrender.com/"

const findUser = async () => {
  
  showLoading();
  var token = localStorage.getItem('token')
  if (!token) {
    window.location = "/login";
    return
  }
  // var jsonData = {
  //   token: 'Bearer ' + localStorage.getItem('token')
  // }

  console.log(url)
  fetch(url + 'authen', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        var jsonData = {
          token: 'Bearer ' + localStorage.getItem('token')
        }
        fetch(url + 'getinterests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "ok") {
              if (data.interests.length < 1) {
                noFavorite()
              } else {
                fetch(url + 'find', {
                  method: 'POST', // or 'PUT'
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(jsonData),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.status === "ok") {
                      console.log("test")
                      foundUser()
                      var dob = new Date(data.profile.u_birthdate);
                      var month_diff = Date.now() - dob.getTime();
                      var age_dt = new Date(month_diff);
                      var year = age_dt.getUTCFullYear();
                      var age = Math.abs(year - 1970);
                      document.getElementById("fname").innerHTML = data.profile.u_fname;
                      document.getElementById("lname").innerHTML = data.profile.u_lname;
                      document.getElementById("gender").innerHTML = data.profile.g_name;
                      document.getElementById("age").innerHTML = age;
                      document.getElementById("bio").innerHTML = data.profile.u_bio;
                      if (data.profile.u_image !== null) {
                        document.getElementById("imgPro").src = url + "images/" + data.profile.u_image;
                      } else {
                        document.getElementById("imgPro").src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";
                      }
                      if(data.profile.u_music !== null) {
                        let text = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/` + data.profile.u_music;
                        text += `?utm_source=generator&theme=0" width="100%" height="200" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
                        document.getElementById("previewMusic").innerHTML = text
                      } else {
                        document.getElementById("previewMusic").innerHTML = "<p class='card-title'>ผู้ใช้รายนี้ยังไม่ได้เลือกเพลงที่ชอบ</p>"
                      }
                      localStorage.setItem('userFound', data.profile.u_username)
                      // dataProfile = null
                    } else {
                      notFoundUser()
                    }
                  })
                  .catch((error) => {
                    alert('error')
                    console.log(error)
                    console.error('Error:', error);
                  });
              }
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    })
    .catch((error) => {
      // localStorage.removeItem('token');
      window.location = "/login";
      // console.error('Error:', error);
    });
}


export default function Home() {
  useEffect(() => {
    // showLoading()      
    findUser()
  }, [])


  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userFound');
    window.location = "/login";
  }

  const notChoose = () => {
    like = 0;
    addChoose()
  }

  const choose = () => {
    like = null;
    addChoose()
  }

  const refresh = () => {
    findUser()
  }

  const addChoose = (event) => {
    showLoading()
    console.log(dataProfile)
    const jsonData = {
      token: 'Bearer ' + localStorage.getItem('token'),
      usersecond: localStorage.getItem('userFound'),
      matched: like,
    }
    console.log(jsonData)
    fetch(url + 'choose', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          // window.location = "/home"
          findUser()
        } else {
          alert("NOOO")
        }
      })
      .catch((error) => {
        alert("NOOO")
        console.error('Error:', error);
        window.location = "/home"
      });
  }
  const toDetail = () => {
    document.getElementById("userCard").style.display = "none"
    document.getElementById("detailCard").style.display = "block"
  }
  const backUser = () => {
    document.getElementById("userCard").style.display = "block"
    document.getElementById("detailCard").style.display = "none"
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
        <div class="col col-lg-4 col-md-8 col-sm-12">
          <div class="card" id="userCard">
            <div class="card-body">
              {/* <form class="mt-2"> */}
              <button type="button" class="btn btn-outline-primary mx-3" onClick={toDetail}>รายละเอียด</button>
              <div id="profile">
                <div class="mb-3 text-center">
                  <img id="imgPro" class="profile" style={{ borderRadius: "50%", objectFit: "cover" }} src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" width="200" height="200" />
                </div>
                <h3 class="card-title text-center"><b id="fname"></b> <b id="lname"></b></h3>
                <h4 class="card-title text-center"><span id="gender"></span>, <span id="age"></span></h4>
                {/* <div style={{ height: "50px" }}> */}
                <p class="text-center" id="bio"></p>
                {/* </div> */}
              </div>
              <div class="col text-end">
                <i class="bi bi-check-circle-fill mx-3 choose" onClick={choose}></i>
                <i class="bi bi-x-circle-fill notChoose" onClick={notChoose}></i>
              </div>
              {/* </form> */}
            </div>
          </div>
          <div class="card" id="detailCard" style={{ display: "none" }}>
            <div class="card-body">
              <h3 class="card-title"><button class="btn-outline-primary" onClick={backUser} type="button" style={{ borderRadius: "15px", fontSize: "20px" }}><i class="bi bi-arrow-left back"></i></button> รายละเอียด</h3>
              <div class="col-12" id="previewMusic"></div>
            </div>
          </div>
          <div class="card p-3 text-center" style={{ marginTop: "100px" }} id="notFound">
            <h3 class="card-title text-center">ไม่พบผู้ใช้งาน!</h3>
            <p class="card-title text-center">ระบบค้นหาผู้ใช้งานไม่พบในขณะนี้</p>
            <p class="card-title text-center">โปรดลองใหม่อีกครั้งในภายหลัง</p>
            <button class="btn btn-outline-primary mt-4" onClick={refresh}>ค้นหาอีกครั้ง <i class="bi bi-arrow-repeat"></i></button>
          </div>
          <div class="card p-3 text-center" style={{ marginTop: "100px" }} id="favoriteCard">
            <h3 class="card-title text-center">โปรดระบุเพศที่คุณสนใจ</h3>
            <p class="card-title text-center">ระบบจำเป็นต้องเก็บข้อมูลเพศที่คุณสนใจ</p>
            <p class="card-title text-center">เพื่อช่วยใจการค้นหา</p>
            <a class="btn btn-outline-primary mt-4" href='/favorite'>ความสนใจ</a>
          </div>
        </div>
      </div>
      <div class="footer" id="footer">
        <div class="row">
          <div class="col text-center pt-2 mb-5">
            <a href='/' class="btn btn-primary p-2 me-2">หน้าหลัก</a>
            <a href='/matched' class="btn btn-outline-primary me-2 px-1">ข้อความ</a>
            <a href='/favorite' class="btn btn-outline-primary me-2 px-1">ความสนใจ</a>
            <a href='/profile' class="btn btn-outline-primary px-1">โปรไฟล์</a>
          </div>
        </div>
      </div>
    </div>

  );
}