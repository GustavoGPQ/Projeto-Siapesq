import React, {useState} from "react";
import "../pages/App.css"
import avatar from "../img/avatar.png"
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import InputMask from 'react-input-mask';


export default function Register(){

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tel, setTelefone] = useState('');
    const navigate = useNavigate();

    const handlehome= () =>{
        navigate("/");
    }

    const handleChange = (e) =>{
        setTelefone(e.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aqui você pode adicionar a lógica para enviar os dados do formulário para o backend
        console.log('Usuário:', username);
        console.log('Email:', email);
        console.log('Senha:', password);
        console.log('Telefone:', tel);
    };

    return(
        <>
             <>
      <div className="registro-container">
        <div>
        <img src={avatar} alt="Logo" className="logo" />
        </div>
        <h2>Seja bem vindo!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nome de usuário:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
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
            <label htmlFor="tel">Telefone:</label>
            <InputMask
                mask="(99) 99999-9999"
                maskChar=""
                id="telefone"
                type="tel"
                value={tel}
                onChange={handleChange}
                placeholder="(xx) xxxxx-xxxx"
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
          <button type="submit" onClick={handlehome}>Registrar</button>
        </form>
      </div>
    </>
        </>
    )
}