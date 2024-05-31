import React,{createContext, useState } from "react";

export const TokenContext = createContext();
export default function TokenProvider({children}){

    const [token,setToken] = useState(() =>{
        const data = localStorage.getItem("userToken");
        if(data){
            return data;
        }
    });

    return(
        <TokenContext.Provider value={{token,setToken}}>
            {children}
        </TokenContext.Provider>
    )
}