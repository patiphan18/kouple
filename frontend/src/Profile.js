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

let profile = null;
let genders = null;
const delay = ms => new Promise(res => setTimeout(res, ms));
const url = "https://kouple.onrender.com/"

export default function Profile() {

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === "") {
      window.location = "/login";
    }
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
          fetch(url + 'profile', {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "ok") {
                profile = data.profile
                console.log(profile)
                var dob = new Date(profile[0].u_birthdate);
                var month_diff = Date.now() - dob.getTime();
                var age_dt = new Date(month_diff);
                var year = age_dt.getUTCFullYear();
                var age = Math.abs(year - 1970);
                document.getElementById("showFname").innerHTML = profile[0].u_fname;
                document.getElementById("showLname").innerHTML = profile[0].u_lname;
                document.getElementById("showGender").innerHTML = profile[0].g_name;
                document.getElementById("showAge").innerHTML = age;

                if (profile[0].u_image !== null) {
                  document.getElementById("imgPro").src = url + "images/" + profile[0].u_image;
                  document.getElementById("imgChange").src = url + "images/" + profile[0].u_image;
                }
                if (profile[0].u_bio !== null) {
                  document.getElementById("showBio").innerHTML = profile[0].u_bio;
                }

                document.getElementById("genderNow").innerHTML = profile[0].g_name;
                document.getElementById("genderNow").value = profile[0].u_gender;
                document.getElementById("fname").value = profile[0].u_fname;
                document.getElementById("lname").value = profile[0].u_lname;
                document.getElementById("birthdate").value = profile[0].u_birthdate.substring(0, 10);
                document.getElementById("bio").value = profile[0].u_bio;

              } else {
                // alert('authen failed')
                localStorage.removeItem('token');
                window.location = "/login";
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        } else {
          // alert('authen failed')
          localStorage.removeItem('token');
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(url + 'genders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // waiting()
        if (data.status === "ok") {
          genders = data.genders;
          // console.log(genders);
          var select = document.getElementById("gender");
          if (select.options.length < genders.length) {
            for (var i = 0; i < genders.length; i++) {
              var opt = document.createElement('option');
              opt.value = genders[i].g_id
              opt.innerHTML = genders[i].g_name;
              // if(genders[i].id === profile[0].gender) {
              //   opt.setAttribute('selected', 'selected');
              // }    
              select.appendChild(opt);
            }
          }
        } else {
          document.getElementById('alert').innerHTML = "เกิดข้อผิดพลาดบางอย่าง"
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [])

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userFound');
    window.location = "/login";
  }

  const toImage = (event) => {
    document.getElementById("formImage").style.display = "block";
    document.getElementById("myProfile").style.display = "none"
  }

  const toInfo = (event) => {
    document.getElementById("formInfo").style.display = "block";
    document.getElementById("myProfile").style.display = "none"
  }

  const toProfile = (event) => {
    document.getElementById("myProfile").style.display = "block";
    document.getElementById("formImage").style.display = "none"
    document.getElementById("formInfo").style.display = "none"
  }

  const typeName = (event) => {
    // var input = document.getElementById("username");
    var fname = document.getElementById("fname");
    var lname = document.getElementById("lname");
    fname.value = fname.value.replace(/[^a-zA-Z]+/, '');
    lname.value = lname.value.replace(/[^a-zA-Z]+/, '');
    fname.value = fname.value.toUpperCase();
    lname.value = lname.value.toUpperCase();
  }

  const uploadImage = (event) => {
    event.preventDefault();
    const image = document.getElementById('image').files[0];
    const formData = new FormData();
    formData.append('image', image, image.name)
    formData.append('token', 'Bearer ' + localStorage.getItem('token'))
    fetch(url + 'upload', {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          window.location = "/profile";
        }
      })
      .catch((error) => {
        console.error('Error: ', error);
      });

  }

  const updateInfo = (event) => {
    event.preventDefault();
    var fname = document.getElementById("fname");
    var lname = document.getElementById("lname");
    var gender = document.getElementById("gender");
    var birthdate = document.getElementById('birthdate');

    if (!fname.value || !lname.value || !birthdate.value || gender.value < 0 || gender.value > genders.length) {
      document.getElementById("alert").innerHTML = "กรุณากรอกข้อมูลให้ครบถ้วน";
      return;
    }
    var dob = new Date(birthdate.value);
    var month_diff = Date.now() - dob.getTime();
    var age_dt = new Date(month_diff);
    var year = age_dt.getUTCFullYear();
    var age = Math.abs(year - 1970);

    if (age < 18) {
      document.getElementById("alert").innerHTML = "ขออภัยอายุของท่านยังไม่ถึง 18 ปี";
      return;
    }

    const jsonData = {
      token: 'Bearer ' + localStorage.getItem('token'),
      fname: document.getElementById('fname').value,
      lname: document.getElementById('lname').value,
      gender: document.getElementById('gender').value,
      bio: document.getElementById('bio').value,
      birthdate: document.getElementById('birthdate').value,
    }

    // console.log(jsonData)

    fetch(url + 'updateinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        // waiting()
        if (data.status === "ok") {
          window.location = "/profile"
        } else {
          console.log(data.message)
          alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล")
        }
      })
      .catch((error) => {
        // console.error('Error:', error);
        console.log(error)
        alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล")
      });

  }

  const loadFile = (event) => {
    var image = document.getElementById('imgChange');
    image.src = URL.createObjectURL(event.target.files[0]);
  };

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
          <div class="card px-3" id="myProfile">
            <div class="card-body">
              <h3 class="card-title">ข้อมูลส่วนตัว</h3>
              <form class="mt-4">
                <div id="profile">
                  <div class="mb-3 text-center">
                    <img id="imgPro" class="profile" style={{ borderRadius: "50%", objectFit: "cover" }} src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" width="150" height="150" />
                    <br /><button type="button" onClick={toImage} class="btn btn-outline-primary mt-2" style={{ fontSize: "12px" }}>แก้ไขรูปโปรไฟล์</button>
                  </div>
                  <h3 class="card-title text-center"><b id="showFname"></b> <b id="showLname"></b></h3>
                  <h4 class="card-title text-center"><span id="showGender"></span>, <span id="showAge"></span></h4>
                  <p class="card-title text-center" id="showBio">รายละเอียดเพิ่มเติมเกี่ยวกับตัวคุณ</p>
                </div>
                <div class="col text-end">
                  <button type="button" onClick={toInfo} class="btn btn-outline-primary">แก้ไขข้อมูล</button>
                </div>
              </form>
            </div>
          </div>
          <div class="card px-3" id="formImage" style={{ display: "none" }}>
            <div class="card-body">
              <h3 class="card-title"><button class="btn-outline-primary" onClick={toProfile} type="button" style={{ borderRadius: "15px", fontSize: "20px" }}><i class="bi bi-arrow-left back"></i></button> แก้ไขรูปโปรไฟล์</h3>
              <form class="mt-4" onSubmit={uploadImage}>
                <div class="mb-3 text-center">
                  <img id="imgChange" class="profile" style={{ borderRadius: "50%", objectFit: "cover" }} src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" width="200" height="200" />
                </div>
                <div class="mb-3 text-center">
                  <label for="image" class="btn btn-outline-primary text-white" style={{ fontSize: "12px" }}>เลือกรูปภาพ</label>
                  <input type="file" accept="image/*" name="image" id="image" onChange={loadFile} style={{ display: "none" }} />
                </div>
                <div class="col text-center pt-3">
                  <a href="profile" class="btn btn-outline-primary mx-3">ยกเลิก</a>
                  <button type="submit" class="btn btn-primary fs-5">บันทึกข้อมูล</button>
                </div>
              </form>
            </div>
          </div>
          <div class="card px-3" id="formInfo" style={{ display: "none" }}>
            <div class="card-body">
              <h3 class="card-title"><button class="btn-outline-primary" onClick={toProfile} type="button" style={{ borderRadius: "15px", fontSize: "20px" }}><i class="bi bi-arrow-left back"></i></button> แก้ไขรายละเอียด</h3>
              <form class="mt-4" onSubmit={updateInfo}>
                <div class="mb-3">
                  <label for="fname" class="form-label">ชื่อจริง (ภาษาอังกฤษ)</label>
                  <input type="text" id="fname" onKeyUp={typeName} autoComplete="fname" class="form-control" />
                </div>
                <div class="mb-3">
                  <label for="lname" class="form-label">นามสกุล (ภาษาอังกฤษ)</label>
                  <input type="text" id="lname" onKeyUp={typeName} autoComplete="lname" class="form-control" />
                </div>
                <div class="mb-3">
                  <label for="gender" class="form-label">เพศ</label>
                  <select class="form-select" id="gender">
                    <option selected id="genderNow" disabled value="-1">เลือกเพศของท่าน</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="birthdate" class="form-label">วันเดือนปีเกิด</label>
                  <input type="date" id="birthdate" autoComplete="birthdate" class="form-control" />
                </div>
                <div class="mb-3">
                  <label for="bio" class="form-label">คำอธิบายตัวคุณ (ไม่เกิน 70 ตัวอักษร)</label>
                  <textarea class="form-control" id="bio" rows="2" maxlength="70"></textarea>
                </div>
                <p id="alert" class="text-danger"></p>
                <div class="col text-center pt-3">
                  <a href="profile" class="btn btn-outline-primary mx-3">ยกเลิก</a>
                  <button type="submit" class="btn btn-primary fs-5">บันทึกข้อมูล</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="footer" id="footer">
        <div class="row">
          <div class="col text-center pt-3 mb-5">
            <a href='/' class="btn btn-outline-primary me-2 px-1">หน้าหลัก</a>
            <a href='/matched' class="btn btn-outline-primary me-2 px-1">ข้อความ</a>
            <a href='/favorite' class="btn btn-outline-primary me-2 px-1">ความสนใจ</a>
            <a href='/profile' class="btn btn-primary p-2">โปรไฟล์</a>
          </div>
        </div>
      </div>
    </div>
  );
}