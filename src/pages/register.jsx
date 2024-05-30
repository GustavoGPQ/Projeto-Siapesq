import React, {useState} from "react";
import "../style/App.css"
import avatar from "../img/avatar.png"
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

export default function Register(){

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tel, setTelefone] = useState('');
    const [switcher,setSwitcher] = useState(false);
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
              <label>
                <span>Senha</span>
                <span className="password-input">
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
            <button type="submit" className="registerButton" onClick={handlehome}>Registrar</button>
            <p className='loginLink'>Já tem uma conta ? <Link to={"/login"}>Clique aqui !</Link></p>
          </form>
        </div>
      </>
    )
}