import React, { useEffect } from 'react';
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
const url = "https://kouple.onrender.com/"

const showLoading = async () => {
  document.getElementById("registerCard").style.display = "none"
  document.getElementById("loading").style.display = "block";
}

const hideLoading = async () => {
  await delay(1000);
  document.getElementById("loading").style.display = "none";
  document.getElementById("registerCard").style.display = "block";
}

export default function Register() {
  var genders = null;
  useEffect(() => {
    showLoading()
    const token = localStorage.getItem('token')
    fetch(url + 'authen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          window.location = "/home";
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
        if (data.status === "ok") {
          hideLoading()
          genders = data.genders;
          // console.log(genders);
          var select = document.getElementById("gender");
          if (select.options.length < genders.length) {
            for (var i = 0; i < genders.length; i++) {
              var opt = document.createElement('option');
              opt.value = genders[i].g_id
              opt.innerHTML = genders[i].g_name;
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
  const showPassword = (event) => {
    var checkPass = document.getElementById("checkBoxPwd");
    var pass = document.getElementById("password");
    var cfPass = document.getElementById("cfPassword");
    if (checkPass.checked) {
      pass.type = "text";
      cfPass.type = "text";
      document.getElementById("eye").className = "bi bi-eye-fill";
      <i class="bi bi-eye-fill"></i>
    } else {
      pass.type = "password";
      cfPass.type = "password";
      document.getElementById("eye").className = "bi bi-eye-slash-fill";
    }
  }
  const toProfile = (event) => {
    var fname = document.getElementById("fname");
    var lname = document.getElementById("lname");
    var gender = document.getElementById("gender");
    var birthdate = document.getElementById("birthdate");
    if (!fname.value || !lname.value || !birthdate.value || gender.value < 0 || gender.value > genders.length) {
      document.getElementById("alertPerson").innerHTML = "กรุณากรอกข้อมูลให้ครบถ้วน";
      return;
    }
    var dob = new Date(birthdate.value);
    var month_diff = Date.now() - dob.getTime();
    var age_dt = new Date(month_diff);
    var year = age_dt.getUTCFullYear();
    var age = Math.abs(year - 1970);

    if (age < 18) {
      document.getElementById("alertPerson").innerHTML = "ขออภัยอายุของท่านยังไม่ถึง 18 ปี";
      return;
    }

    document.getElementById("alertPerson").innerHTML = "";
    document.getElementById("person").style.display = "none";
    document.getElementById("profile").style.display = "block"
  }

  const toPerson = (event) => {
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var cfPassword = document.getElementById("cfPassword");
    if (!username.value || !password.value || !cfPassword.value) {
      document.getElementById("alertUser").innerHTML = "กรุณากรอกข้อมูลให้ครบถ้วน";
      return;
    }
    if (password.value !== cfPassword.value) {
      document.getElementById("alertUser").innerHTML = "รหัสผ่านไม่ตรงกัน";
      return;
    }
    var select = document.getElementById("gender");
    if (select.options.length < genders.length) {
      for (var i = 0; i < genders.length; i++) {
        var opt = document.createElement('option');
        opt.value = genders[i].id
        opt.innerHTML = genders[i].name;
        select.appendChild(opt);
      }
    }
    document.getElementById("alertUser").innerHTML = "";
    document.getElementById("person").style.display = "block";
    document.getElementById("user").style.display = "none"
  }

  const backUser = (event) => {
    document.getElementById("user").style.display = "block";
    document.getElementById("person").style.display = "none"
  }

  const backPerson = (event) => {
    document.getElementById("person").style.display = "block";
    document.getElementById("profile").style.display = "none"
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

  const typeUsername = (event) => {
    var username = document.getElementById("username");
    username.value = username.value.replace(/[^a-zA-Z0-9_.]+/, '');
    username.value = username.value.toLowerCase();
  }

  const typePassword = (event) => {
    var password = document.getElementById("password");
    var cfPassword = document.getElementById("cfPassword");
    password.value = password.value.replace(/[^a-zA-Z0-9@!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/, '');
    cfPassword.value = cfPassword.value.replace(/[^a-zA-Z0-9@!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/, '');
  }

  const typeDate = (event) => {
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var day = 32 - new Date(year - 18, month, 32).getDate();
    month++;
    if (month < 10) {
      month = "0" + month;
    }
    var birthdate = document.getElementById("birthdate");
    birthdate.max = (year - 18) + "-" + month + "-" + day;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    var fname = document.getElementById("fname");
    var lname = document.getElementById("lname");
    var gender = document.getElementById("gender");
    var birthdate = document.getElementById('birthdate');
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var cfPassword = document.getElementById("cfPassword");
    if (!username.value || !password.value || !cfPassword.value) {
      document.getElementById("alert").innerHTML = "กรุณากรอกข้อมูลให้ครบถ้วน";
      return;
    }
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
    if (document.getElementById('password').value !== document.getElementById('cfPassword').value) {
      document.getElementById('alert').innerHTML = "รหัสผ่านทั้งสองไม่ตรงกัน"
      return;
    }

    const jsonData = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      fname: document.getElementById('fname').value,
      lname: document.getElementById('lname').value,
      gender: document.getElementById('gender').value,
      birthdate: document.getElementById('birthdate').value,
    }

    // console.log(jsonData)
    // showLoading()
    fetch(url + 'register', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          localStorage.setItem('token', data.token)
          window.location = "/profile"
          // alert('login success')
        } else {
          // hideLoading()
          if (data.message === "usernameUsed") {
            document.getElementById('alert').innerHTML = "ชื่อผู้ใช้งานนี้ถูกใช้แล้ว"
          } else {
            document.getElementById('alert').innerHTML = data.message
            console.log(data.message)
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        document.getElementById('alert').innerHTML = "เกิดข้อผิดพลาดในการสมัครสมาชิก"
      });
  };

  const login = (event) => {
    window.location = "/login"
  }

  return (
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-12 text-center">
          {/* <h1 class="text-center" style={{ fontSize: "60px" }}>KOUPLE</h1> */}
          <img src="/logo.png" height="100px" />
        </div>
        <div class="col col-lg-8 col-md-8 col-sm-12 mt-4" id="registerCard">
          <div class="card px-3">
            <div class="card-body">

              <form onSubmit={handleSubmit} class="mt-4">
                <h3 class="card-title">สมัครสมาชิก</h3>
                <div class="row">
                  <div class="col-lg-6 col-md-12 col-sm-12">
                    <div class="mb-3">
                      <label for="fname" class="form-label">ชื่อจริง (ภาษาอังกฤษ)</label>
                      <input type="text" id="fname" onKeyUp={typeName} autoComplete="fname" class="form-control" required />
                    </div>
                    <div class="mb-3">
                      <label for="lname" class="form-label">นามสกุล (ภาษาอังกฤษ)</label>
                      <input type="text" id="lname" onKeyUp={typeName} autoComplete="lname" class="form-control" required />
                    </div>
                    <div class="mb-3">
                      <label for="gender" class="form-label">เพศ</label>
                      <select class="form-select" id="gender" required>
                        <option selected disabled value="-1">เลือกเพศของคุณ</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label for="birthdate" class="form-label">วันเดือนปีเกิด</label>
                      <input type="date" id="birthdate" onClick={typeDate} autoComplete="birthdate" class="form-control" required />
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-12 col-sm-12">
                    <div class="mb-3">
                      <label for="username" class="form-label">ชื่อผู้ใช้งาน (ภาษาอังกฤษหรือตัวเลข)</label>
                      <input type="text" id="username" onKeyUp={typeUsername} autoComplete="username" class="form-control" required />
                    </div>
                    <div class="mb-3">
                      <label for="password" class="form-label">รหัสผ่าน</label>
                      <input type="password" id="password" onKeyUp={typePassword} autoComplete="password" class="form-control" required />
                    </div>
                    <div class="mb-3">
                      <label for="cfPassword" class="form-label">ยืนยันรหัสผ่าน</label>
                      <input type="password" id="cfPassword" onKeyUp={typePassword} autoComplete="cfPassword" class="form-control" required />
                    </div>
                    <div class="mb-3">
                      <div class="form-check">
                        <input class="form-check-input" onClick={showPassword} type="checkbox" id="checkBoxPwd" />
                        <label class="form-check-label" for="checkBoxPwd">แสดงรหัสผ่าน</label>
                      </div>
                    </div>
                  </div>
                </div>
                <p id="alert" style={{ fontSize: "12px" }} class="text-danger text-center"></p>
                <div class="row">
                  <div class="col text-center">
                    <button type="submit" class="btn btn-primary fs-5">สมัครสมาชิก</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <p class="text-center mt-4">หากมีบัญชีอยู่แล้ว <a href="#" class="link-dark" onClick={login}>เข้าสู่ระบบ</a></p>
        </div>
      </div>
    </div>

  );
}