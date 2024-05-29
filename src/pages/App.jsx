import React from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";

import Home from "./home";
import Register from "./Register";


export default function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/register" element={<Register/>}/>

            </Routes>
        </BrowserRouter>
    )
}