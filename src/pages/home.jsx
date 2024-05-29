import React, { useState } from 'react';
import "../pages/App.css"
import siapesq from "../img/siapesq.png"
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';

import connection from '..//server/axios';

export default function Home() {
  //const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () =>{
    navigate("/register");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados do formulário para o backend
    // console.log('Usuário:', username);
    // console.log('Email:', email);
    // console.log('Senha:', password);

    connection.post("/login",{
      "email" : email,
      "senha" : password
    })
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
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="submit">Login</button>
          <br />
          <br />
          <button type="submit" onClick={handleRegister}>Registre-se</button>
        </form>
      </div>
    </>
  );
}

