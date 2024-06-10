import React, { useState, useEffect } from "react";
import "../style/App.css";
import siapesq from "../img/siapesq.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import connection from "../server/axios.mjs";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [switcher, setSwitcher] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() =>{
    if(localStorage.getItem("userToken")){
      navigate("/");
    }
  },[]);

  const handleSubmit = (event) => {
    event.preventDefault();
    connection
      .post("/login", {
        "senha": password,
        "email": email
      })
      .then((res) => {
        //tratamento para caso o usuário não exista
        if (res.data.message === "Esse usuario não existe") {
          setErrorMessage("Esse usuario não existe !");
          return;
        }

        // //tratamento para caso a senha esteja incorreta
        if (res.data.message === "Senha incorreta") {
          setErrorMessage("Senha incorreta !");
          return;
        }

        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("userId", res.data.id);
         navigate("/");
      })
      .catch((err) => {
        setErrorMessage("Dados incorretos !");
        return;
      });
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
              <span className="password-input">
                <input
                  type={switcher ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <FontAwesomeIcon
                  icon={switcher ? faEye : faEyeSlash}
                  onClick={() => setSwitcher(!switcher)}
                  style={{ cursor: "pointer" }}
                />
              </span>
            </label>
          </div>
          <button className="loginButton" type="submit">
            Login
          </button>
          <br />
          <br />
          <p className="registerLink">
            Não tem conta ? <Link to={"/register"}>Clique aqui !</Link>
          </p>
          <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
            {errorMessage}
          </p>
        </form>
      </div>
    </>
  );
}
