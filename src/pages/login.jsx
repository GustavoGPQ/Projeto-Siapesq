import React, { useState } from 'react';
import "../style/App.css"
import siapesq from "../img/siapesq.png"
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  //const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [switcher,setSwitcher] = useState(false);
  

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados do formulário para o backend
    // console.log('Usuário:', username);
    // console.log('Email:', email);
    // console.log('Senha:', password);
  };

  return (
    <>
      <div className="registro-container">
        <div>
        <img src={siapesq} alt="Logo" className="logo" />
        </div>
        <h2>Seja bem vindo!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <span>Email</span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              <span>Senha</span>
              <span className='password-input'>
                <input
                  type={switcher? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <FontAwesomeIcon 
                  icon={switcher ? faEye : faEyeSlash }
                  onClick={() => setSwitcher(!switcher)}
                  style={{cursor:"pointer"}}
                />
              </span>
            </label>
          </div>
          <button className='loginButton' type="submit">Login</button>
          <br />
          <br />
          <p className='registerLink'>Não tem conta ? <Link to={"/register"}>Clique aqui !</Link></p>
        </form>
      </div>
    </>
  );
}

