import React from "react";
import { Link } from "react-router-dom";

export default function Header(){
    return(
        <header>
            <ul>
                <li>
                    <Link to={"/"}>Págian principal</Link>
                </li>
                <li>
                    <Link to={"/register"}>Registro</Link>
                </li>
                <li>
                    
                </li>
            </ul>
        </header>
    )
}