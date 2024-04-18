
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

let favNum = 0

const showLoading = async () => {
  document.getElementById("genderCard").style.display = "none"
  document.getElementById("musicCard").style.display = "none"
  document.getElementById("favCard").style.display = "none"
  document.getElementById("loading").style.display = "block";
  document.getElementById("footer").style.position = "fixed";
}

const hideLoading = async () => {
  document.getElementById("favCard").style.display = "block"
  document.getElementById("loading").style.display = "none";
  // document.getElementById("footer").style.position = "relative";
  document.getElementById("footer").style.position = "relative";
}

const toGender = async () => {
  document.getElementById("genderCard").style.display = "block"
  document.getElementById("musicCard").style.display = "none"
  document.getElementById("favCard").style.display = "none";
  document.getElementById("footer").style.position = "relative";
}

const toMusic = async () => {
  document.getElementById("musicCard").style.display = "block"
  document.getElementById("genderCard").style.display = "none"
  document.getElementById("favCard").style.display = "none";
  document.getElementById("footer").style.position = "relative";
}

const backFav = async () => {
  document.getElementById("favCard").style.display = "block"
  document.getElementById("genderCard").style.display = "none";
  document.getElementById("musicCard").style.display = "none"
  document.getElementById("footer").style.position = "relative";
}

const showMusic = async () => {
  let url = document.getElementById("musicUrl").value;
  let text = ""
  if (url !== "") {
    let code = url.substring(31, 53);
    text = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/` + code + `?utm_source=generator&theme=0" width="100%" height="200" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
  } else {
    text = ""
  }
  document.getElementById("previewMusic").innerHTML = text
}

const url = "https://kouple.onrender.com/"

export default function Home() {

  useEffect(() => {
    showLoading()
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
          fetch(url + 'profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "ok") {
                if (data.profile[0].u_music !== null) {
                  let text = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/` + data.profile[0].u_music + `?utm_source=generator&theme=0" width="100%" height="200" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
                  document.getElementById("listMusic").innerHTML = text
                  document.getElementById("previewMusic").innerHTML = text
                  document.getElementById("footer").style.position = "fixed";
                } else {
                  document.getElementById("listMusic").innerHTML = "<div class='col-12 card-title'>คุณยังไม่ได้เลือกเพลงที่ชอบ</div>"
                  document.getElementById("previewMusic").innerHTML = "<div class='col-12 card-title'>คุณยังไม่ได้เลือกเพลงที่ชอบ</div>"
                }

              }
            })
            .catch((error) => {
              // console.error('Error:', error);
              console.log(error)
              alert("เกิดข้อผิดพลาด")
            });

          let favorite = data.interests
          fetch(url + 'genders', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "ok") {
                let genders = data.genders;
                console.log(genders);

                var listGender = document.getElementById("listGender");
                var listFav = document.getElementById("listFav");
                let text = ""
                let check = 0
                let text2 = ""
                document.getElementById("genNum").value = genders.length;
                for (let i = 0; i < genders.length; i++) {
                  text += `<div class="col-12 my-1">`
                  check = 0
                  for (let j = 0; j < favorite.length; j++) {
                    if (favorite[j].i_g_id === genders[i].g_id) {
                      text += `<input class="form-check-input fs-4" checked style='cursor:pointer;' type="checkbox" name="genderFav" value="` + genders[i].g_id + `" id="gender` + genders[i].g_id + `" />`
                      text2 += `<div class="col-6 listBox me-2 mb-1">` + genders[i].g_name + `</div>`
                      check = 1
                      break;
                    }

                  }
                  if (check === 0) {
                    text += `<input class="form-check-input fs-4" style='cursor:pointer;' type="checkbox" name="genderFav" value="` + genders[i].g_id + `" id="gender` + genders[i].g_id + `" />`
                  }
                  text += `<label class="form-check-label fs-5 ms-2" style='cursor:pointer;' for="gender` + genders[i].g_id + `">` + genders[i].g_name + `</label></div>`
                }
                listGender.innerHTML = text
                favNum = favorite.length
                if (favorite.length < 1) {
                  text2 = "<div class='card-title'>คุณยังไม่ได้ทำการระบุเพศที่คุณสนใจในขณะนี้ โปรดกดที่ปุ่มแก้ไขเพื่อระบุเพศที่คุณสนใจ</div>"
                }
                listFav.innerHTML = text2
                hideLoading()

              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        } else {
          document.getElementById('alert').innerHTML = "เกิดข้อผิดพลาดบางอย่าง"
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });



  }, [])

  const updateGenders = (event) => {
    event.preventDefault();
    let valueData = []
    let genderFav = document.getElementsByName('genderFav');
    for (var checkbox of genderFav) {
      if (checkbox.checked)
        valueData.push(checkbox.value)
    }
    console.log(valueData)
    var jsonData = {
      token: 'Bearer ' + localStorage.getItem('token'),
      listGender: valueData
    }

    fetch(url + 'addinterests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          window.location = "/favorite"
        } else {
          console.log(data.message)
          alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล")
        }
      })
      .catch((error) => {
        // console.error('Error:', error);
        console.log(error)
        alert("เกิดข้อผิดพลาด")
      });
  }

  const updateMusic = (event) => {
    event.preventDefault();
    let musicUrl = document.getElementById("musicUrl").value;
    let code = musicUrl.substring(31, 53);
    if (code.length < 22) {
      document.getElementById("alertMusic").innerHTML = "รูปแบบของลิงก์ไม่ถูกต้อง"
      return;
    }
    var jsonData = {
      token: 'Bearer ' + localStorage.getItem('token'),
      music: code
    }

    fetch(url + 'music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          window.location = "/favorite"
        } else {
          console.log(data.message)
          alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล")
        }
      })
      .catch((error) => {
        // console.error('Error:', error);
        console.log(error)
        alert("เกิดข้อผิดพลาด")
      });
  }

  const checkAllGen = (event) => {
    event.preventDefault();
    let num = document.getElementById("genNum").value
    console.log(document.getElementById("genNum").value)
    for (let i = 1; i <= num; i++) {
      document.getElementById("gender" + i).checked = true
    }
  }

  const clearAllGen = (event) => {
    event.preventDefault();
    let num = document.getElementById("genNum").value
    console.log(document.getElementById("genNum").value)
    for (let i = 1; i <= num; i++) {
      document.getElementById("gender" + i).checked = false
    }
  }

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userFound');
    window.location = "/login";
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
          <div class="card" id="favCard">
            <div class="card-body">
              <h3 class="card-title">เพศที่คุณสนใจ<button type='button' class="btn btn-outline-primary mx-3" onClick={toGender}>แก้ไข</button></h3>
              <div class="row mx-1 mt-3" id="listFav">
              </div>
              <h3 class="card-title mt-3">เพลงที่คุณชอบ<button type='button' class="btn btn-outline-primary mx-3" onClick={toMusic}>แก้ไข</button></h3>
              <div class="row mt-3" id="listMusic">
              </div>
            </div>
          </div>
          <div class="card" id="genderCard">
            <div class="card-body">
              <form onSubmit={updateGenders}>
                <h3 class="card-title"><button class="btn-outline-primary" onClick={backFav} type="button" style={{ borderRadius: "15px", fontSize: "20px" }}><i class="bi bi-arrow-left back"></i></button> แก้ไขเพศที่สนใจ</h3>
                <div class="row mx-1">
                  <div class="col-12">
                    <input type="hidden" id="genNum" />
                    {/* <input class="form-check-input fs-4" style={{cursor:"pointer"}} type="checkbox" onClick={checkAllGen} id="allGen" /> */}
                    <span class="form-check-label fs-5 card-title" style={{ cursor: "pointer" }} onClick={checkAllGen}>เลือกทั้งหมด</span>
                    <span class="form-check-label fs-5 card-title float-end" style={{ cursor: "pointer" }} onClick={clearAllGen}>เอาออกทั้งหมด</span>
                  </div>
                </div>
                <div class="row mx-1" id="listGender">
                </div>
                <p id="alert" class="text-danger"></p>
                <div class="col text-center pt-3">
                  <a href="/favorite" class="btn btn-outline-primary mx-3">ยกเลิก</a>
                  <button type="submit" class="btn btn-primary fs-5">บันทึกข้อมูล</button>
                </div>
              </form>
            </div>
          </div>
          <div class="card" id="musicCard">
            <div class="card-body">
              <form onSubmit={updateMusic}>
                <h3 class="card-title"><button class="btn-outline-primary" onClick={backFav} type="button" style={{ borderRadius: "15px", fontSize: "20px" }}><i class="bi bi-arrow-left back"></i></button> แก้ไขเพลงที่ชอบ</h3>
                <div class="row mx-1">
                  <div class="col-12">
                    <div class="mb-3">
                      <label for="username" class="form-label">ลิงก์เพลงจาก Spotify</label>
                      <input type="text" id="musicUrl" onChange={showMusic} class="form-control" required />
                      <p>ตัวอย่าง : https://open.spotify.com/track/0ZcyX8hFV1jdJNWOI8mMXF?si=c8cebcb0ff32477a</p>
                    </div>
                  </div>
                  <div class="col-12" id="previewMusic"></div>
                </div>
                <p id="alertMusic" class="text-danger"></p>
                <div class="col text-center pt-3">
                  <a href="/favorite" class="btn btn-outline-primary mx-3">ยกเลิก</a>
                  <button type="submit" class="btn btn-primary fs-5">บันทึกข้อมูล</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="footer" id="footer">
        <div class="row">
          <div class="col text-center pt-2 mb-5">
            <a href='/' class="btn btn-outline-primary me-2 px-1">หน้าหลัก</a>
            <a href='/matched' class="btn btn-outline-primary me-2 px-1">ข้อความ</a>
            <a href='/favorite' class="btn btn-primary p-2 me-2">ความสนใจ</a>
            <a href='/profile' class="btn btn-outline-primary px-1">โปรไฟล์</a>
          </div>
        </div>
      </div>
    </div>
  );
}