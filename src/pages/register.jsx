import React, {useState} from "react";
import "../style/App.css"
import avatar from "../img/avatar.png"
import { useNavigate } from 'react-router-dom';
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
        <div className="registro-container">
          <div>
          <img src={avatar} alt="Logo" className="logo" />
          </div>
          <h2>Seja bem vindo!</h2>
          <form onSubmit={handleSubmit}>
              <label>
                <span>
                  Nome de usuário
                </span>
                <input
                  type="text"
                  id="username"
                  placeholder="Digite o seu nome"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Digite o seu email"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label>
                <span>Telefone</span>
                <InputMask
                    mask="(99) 99999-9999"
                    maskChar=""
                    id="telefone"
                    type="tel"
                    value={tel}
                    onChange={handleChange}
                    placeholder="(xx) xxxxx-xxxx"
                />
                </label>
              <label htmlFor="password">
                <span>Senha</span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
            <button type="submit" className="registerButton" onClick={handlehome}>Registrar</button>
          </form>
        </div>
      </>
    )
}