import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, useMap, Popup, Marker} from 'react-leaflet'

const position = [51.505, -0.09]

export default function Index(){

    const navigate = useNavigate();

    // useEffect(() =>{
    //     if(!localStorage.getItem("user")){
    //         navigate("/login");
    //     }
    // },[navigate]);

    return(
        <>
     
        </>
    )
}