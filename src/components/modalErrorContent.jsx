import React from "react";

export default function ModalErrorContent({closer}){
    return(
        <>
            <header>
                <h2>Polygon Error</h2>
            </header>
            <section>
                <p>Ops, Parece que ocorreu algum erro ao tentar enviar os polígonos ao banco de dados.</p>
                <p>Verifique se todos os polígonos estão preenchidos corretamente</p>
                <br/>
                <p>Tente novamente !</p>
                <button onClick={closer}>Fechar</button>
            </section>
        </>
    )
}