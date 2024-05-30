import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index(){

    const navigate = useNavigate();

    useEffect(() =>{
        if(!localStorage.getItem("user")){
            navigate("/login");
        }
    },[navigate]);

    return(
        <>
        </>
    )
}