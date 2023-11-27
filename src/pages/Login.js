import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from "html5-qrcode";
import { setUserSession } from '../utils/common';
import axios from 'axios';

const Login = props => {
  const history = useNavigate();
  const name = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reader, setReader] = useState(false);

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios.post('http://localhost:4000/users/signin', { name: name.value, password: password.value }).then(response => {
      setLoading(false);
      setUserSession(response.data.token, response.data.user);
      history('/dashboard');
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError("You are not authorized to access this application");
      else setError("Something went wrong. Please try again later.");
    });
  }
  useEffect(() => {
    console.log(reader)
  }, [reader]);
  
  const readQR = () => {
    setReader(true);
    handelQrScan();
  }


  const handelQrScan = () => {
        console.log(reader);
      Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            const html5QrCode = new Html5Qrcode("reader", true);
            html5QrCode.start(
            { facingMode: { exact: "environment"} },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            qrCodeMessage => {
                if (qrCodeMessage.length> 1) {
                    setReader(false);
                    //this.readerSuccess = true;
                    var name = qrCodeMessage.split(":")[1].split(";")[0];
                    var password = qrCodeMessage.split(":")[2];
                    console.log(name, password);
                    document.getElementById('loginbtn').click();
                    //this.$refs.btnSubmit.$el.click()
                    //element.click();
                    html5QrCode.stop();
                    html5QrCode.clear();
                }
            },
            errorMessage => {
            })
            .catch(err => {
                console.log(`Unable to start scanning, error: ${err}`);
            });
        }
        }).catch(err => {
          setReader(false);
        });
    }
  
  return (
    <div>
      <div className="container center-screen">
        <div className="row">
          <h1 className="h1 mb-5 fw-normal">市場統合システム</h1>
          <div className="col-10">
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}
            <div className="row g-3 align-items-center mb-3">
              <div className="col-2">
                <label htmlFor="name" className="col-form-label">ログインID </label>
              </div>
              <div className="col-10">
                  <input type="text" className="form-control border-dark border-3" {...name} required="required" autoFocus={false} />
              </div>
            </div>
            <div className="row g-3 align-items-center mb-3">
                <div className="col-2">
                  <label htmlFor="password" className="col-form-label">パスワード </label>
                </div>
                <div className="col-10">
                    <input type="password" className="form-control border-dark border-3" {...password} required="required" />
                </div>
            </div>
            <button className="w-50 btn btn-outline-dark" type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading}>ログイン</button>
          </div>
          <div className="col-2">
            <svg
              width="160px"
              height="160px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={readQR}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 3H3V9H5V5H9V3ZM3 21V15H5V19H9V21H3ZM15 3V5H19V9H21V3H15ZM19 15H21V21H15V19H19V15ZM7 7H11V11H7V7ZM7 13H11V17H7V13ZM17 7H13V11H17V7ZM13 13H17V17H13V13Z"
                fill="black"
              />
            </svg>
            {reader && <div id="reader" style={{width: '250px', position: 'absolute',left: 'calc(50% - 500px)',top: 'calc(50% - 250px)'}}></div>}
            {/* //<div style={{width: '250px', position: 'absolute',left: 'calc(50% - 500px)',top: 'calc(50% - 250px)'}}></div> */}
          </div>
        </div>
      </div>
      <div className="text-center version">ver.1.00.01</div>
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;