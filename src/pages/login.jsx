import React, { useState } from 'react';
import "../style/App.css"
import siapesq from "../img/siapesq.png"
import { Link } from 'react-router-dom';

export default function Login() {
  //const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

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
              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
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

