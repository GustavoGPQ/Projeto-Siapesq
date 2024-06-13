import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { TokenContext } from "../context/TokenContext";
import Header from "../components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";
import Modal from "react-modal";
import ModalErrorContent from "../components/modalErrorContent";
import connection from "../server/axios.mjs";

Modal.setAppElement("#root");

export default function Index() {
  const { token } = useContext(TokenContext);
  const [position, setPosition] = useState([-31.7642, -52.3376]);
  const navigate = useNavigate();
  const [mapLayers, setMapLayers] = useState([]);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectPolygon, setSelectPolygon] = useState(null);
  const [selectSide, setSelectSide] = useState(null);
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [forceEditDivUpdate, setForceEditDivUpdate] = useState(0);
  const [modalErrorIsOpen,setModalErrorIsOpen] = useState(false);
  const [city,setCity] = useState("");

  const openModal = () => {
    setModalIsOpen(true);
    document.querySelector("#root").style.filter = "blur(5px)";
  };

  const closeModal = () => {
    setModalIsOpen(false);
    document.querySelector("#root").style.filter = "blur(0px)";
  };

  const openModalError = () => {
    setModalErrorIsOpen(true)
    document.querySelector("#root").style.filter = "blur(5px)";
  };

  const closeModalError = () => {
    setModalErrorIsOpen(false);
    document.querySelector("#root").style.filter = "blur(0px)";
  };

  const removeDuplicates = (layers) =>{
    const ids = new Set();
    const uniqueLayers = [];

    for (const layer of layers) {
        if (!ids.has(layer.id)) {
            ids.add(layer.id);
            uniqueLayers.push(layer);
        }
    }
    return uniqueLayers;
  }

  useEffect(() => {
    if(!localStorage.getItem("userToken")){
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (mapLayers.length === 0) {
      setSelectSide(null);
      setSelectPolygon(null);
    }
  }, [mapLayers]);

  //responsável por trazer todas as hidros quando a página for reatuazliada
  useEffect(() =>{
    connection.get("/gethidro",{
      headers:{
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    })
    .then((res) =>{
      const hidros = res.data.hidro;
      const hidroCordinates = res.data.hidroCord

      if(hidros && hidroCordinates){
        for (let i = 0; i < hidros.length; i++) {
          for (let j = 0; j < hidroCordinates.length; j++) {
            if (hidros[i].id === hidroCordinates[j].hidroid){
              const latitude = JSON.parse(hidroCordinates[j].latitude);
              const longitude = JSON.parse(hidroCordinates[j].longitude);
              let latlngs = [];
        
              for (let k = 0; k < latitude.length; k++) { 
                latlngs.push({ lat: latitude[k], lng: longitude[k] });
              }
        
              const bounds = L.latLngBounds(latlngs); 
        
              const newPolygon = {
                title: hidros[i].nome,
                id_type: "form",
                id: hidros[i].id,
                editing: false,
                latlngs: latlngs,
                center: bounds.getCenter()
              }
              setMapLayers((layers) => [...layers, newPolygon]);
              console.log(mapLayers)
            }
          }
        }
      }
      setMapLayers((layers) => removeDuplicates(layers));
    })

  },[]);

  const _onCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      const center = layer.getCenter();
      setMapLayers((layers) => [
        ...layers,
        {
          title: "",
          id_type: "manual",
          id: _leaflet_id,
          editing: true,
          latlngs: layer.getLatLngs()[0],
          center: center,
        },
      ]);
    }
  };

  const _onEdited = (e) => {
    const {
      layers: { _layers },
    } = e;
    Object.values(_layers).forEach((layer) => {
      
      setMapLayers((layers) =>
        layers.map((l) => {
            return {
              ...l,
              editing:true,
              latlngs: layer.getLatLngs()[0],
              center: layer.getCenter(),
            };
        })
      );
    });
  };

  const _onDeleted = (e) => {
    const {
      layers: { _layers },
    } = e;
    Object.values(_layers).forEach(({ _leaflet_id }) => {
      setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
    });
  };

  const handleCenter = () => {
    const bounds = L.latLngBounds(
      mapLayers[selectPolygon].latlngs.map((coord) =>
        L.latLng(coord.lat, coord.lng)
      )
    );
    const center = bounds.getCenter();
    return center;
  };

  const handleSubmitAddCordinatesModal = (e) => {
    e.preventDefault();
    const lat = parseFloat(e.target.latitude.value);
    const lng = parseFloat(e.target.longitude.value);

    if (!isNaN(lat) && !isNaN(lng)) {
      const newCoords = { lat, lng };
      setPolygonCoords((coords) => [...coords, newCoords]);
      e.target.reset();
    } else {
      alert("Por favor, insira coordenadas válidas.");
    }
  };

  const handleSelectedCity = (e) =>{
    e.preventDefault();
    setCity((previous) =>{
      previous.charAt(0).toUpperCase();
      return previous;
    })
    connection.get(`https://geocode.xyz/${city}?json=1&auth=176887045821824231851x65662`)
    .then((res) =>{
      setPosition([res.data.latt,res.data.longt]);
      setForceUpdate(forceUpdate + 1);
    })
    
  }

  const handleSavePolygon = () => {
    if (polygonCoords.length >= 3) {
      const newPolygon = {
        title: "",
        id_type: "form",
        id: new Date().getTime(),
        editing:true,
        latlngs: polygonCoords,
        center: L.latLngBounds(
          polygonCoords.map((coord) => L.latLng(coord.lat, coord.lng))
        ).getCenter(),
      };
      setMapLayers((layers) => [...layers, newPolygon]);
      setPolygonCoords([]);
    } else {
      alert("Adicione pelo menos três coordenadas.");
    }
  };

  const handleExit = () =>{
    localStorage.clear();
    navigate("/login");
  }

  const handleRemovePolygon = (e) => {
    e.preventDefault();
    
    connection.post("/del",{
      hidroId: mapLayers[selectPolygon].id
    },{
      headers:{
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    })
    
    mapLayers.splice(selectPolygon, 1);
    setForceUpdate(forceUpdate + 1);
    setForceEditDivUpdate(forceEditDivUpdate + 1);
    setSelectPolygon(null);
    setSelectSide(null);
  };

  const handleSaveEdit = (e) =>{
    e.preventDefault();
    setForceUpdate(forceUpdate + 1);
    setForceEditDivUpdate(forceEditDivUpdate + 1);
    setSelectPolygon(null);
    setSelectSide(null);
  }

  const handleSavePolygonDB = () =>{
    if(mapLayers.length === 0){
      openModalError();
      return;
    }

    if(mapLayers.some(element => element.title === "")){
      openModalError();
      return
    }

    if(mapLayers.every(element => element.editing === false)){
      openModalError();
      return;
    }

    mapLayers.forEach((element,index) =>{
      if(element.editing){
        connection.post("/crateHidro",{
          "nome": element.title,
          "iduser": localStorage.getItem("userId"),
          "id": element.id
        },
        {
          headers:{
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
        })

        let cordenadasX = [];
        let cordenadasY = [];

        for(let i = 0; i < element.latlngs.length; i++){
          cordenadasX.push(element.latlngs[i].lat);
          cordenadasY.push(element.latlngs[i].lng);
        }

        connection.post("/createHidroCord",{
          hidroid: element.id,
          poligono:{
           x: JSON.stringify(cordenadasX),
           y: JSON.stringify(cordenadasY)
          }
        },
      {
        headers:{
          Authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
      })
      }
      element.editing = false;
    })
  }

  return (
    <>
      <Header />
      <div className="map">

        {/** Section para redirecionamento de posição */}
        {mapLayers.length > 0 && 
            <section className="go-to">
                <select onChange={(e) =>{
                    setPosition((previous) => {
                        previous[0] = mapLayers[e.target.value].center.lat;
                        previous[1] = mapLayers[e.target.value].center.lng;
                        setForceUpdate(forceUpdate + 1);
                        return [...previous];
                    })
                }}>
                    <option disabled selected>Selecionar Ponto</option>
                    {mapLayers.map((element,index) =>{
                        return(
                            <option value={index}>{index + 1}° {element.title}</option>
                        )
                    })}
                </select>
            </section>        
        }

         {/*botão para saída do usuário*/}
         <div className="exit">
            <button className="exitButton" onClick={handleExit}>Sair</button>
          </div>

          {/*Seleção de cidade*/}
          <div className="city">
            <form onSubmit={handleSelectedCity}>
              <input 
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Digite a cidade"
                />
              <button type="submit">Selecionar</button>
            </form>
          </div>

        {/*Card para adição de polígonos*/}
        <div className="addPolygon">
          <button onClick={handleSavePolygonDB}>Adicionar Polígono ao Banco</button>
          <button onClick={openModal}>
            Adicionar Polígono{" "}
            <span
              style={{
                color: "green",
                fontWeight: "bolder",
                fontSize: "larger",
              }}
            >
              +
            </span>
          </button>
        </div>
        <div className="containerModal">
          <Modal
            isOpen={modalErrorIsOpen}
            onRequestClose={closeModalError}
            contentLabel="Ops, Ocorreu um erro..."
            overlayClassName="Modal-Error"
            className="Modal-Error-Content"
          >
             <ModalErrorContent
              closer={closeModalError}
             />
          </Modal>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Adicionar novo polígono"
            overlayClassName="Modal-Cordinates"
            className="modal-content"
          >
            <header className="headerModal">
              <h2>Adicionar novo polígono</h2>
            </header>
            <section className="bodyModal">
              <form onSubmit={handleSubmitAddCordinatesModal}>
                <label>
                  Latitude:
                  <input type="number" step="any" name="latitude" required />
                </label>
                <br />
                <label>
                  Longitude:
                  <input type="number" step="any" name="longitude" required />
                </label>
                <br />
                <button type="submit">Adicionar Coordenada</button>
              </form>
              <button
                onClick={handleSavePolygon}
                disabled={polygonCoords.length < 3}
                className="saveCordinatesModalButton"
              >
                Salvar
              </button>
              <button className="closeModal" onClick={closeModal}>
                Fechar
              </button>
              {polygonCoords.length > 0 && (
                <div>
                  <h3>Coordenadas Adicionadas:</h3>
                  <ul>
                    {polygonCoords.map((coord, index) => (
                      <li key={index}>
                        Lat: {coord.lat}, Lng: {coord.lng}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </Modal>
        </div>
        {/** card para edição dos polígonos*/}
        {mapLayers.length > 0 && (
          <div
            style={{ right: visible ? "2.4%" : "-12%" }}
            className="container-overlay-1"
          >
            <span onClick={() => setVisible(!visible)} className="ArrowPull">
              <FontAwesomeIcon icon={faArrowLeft} />
            </span>
            <section
              key={forceEditDivUpdate}
              style={{ visibility: visible ? "visible" : "hidden" }}
              className="floatDiv-addCordinates"
            >
              <h2 style={{ textAlign: "center" }}>Editar Cordenadas</h2>
              <select
                onChange={(e) => {
                  const selectedIndex = parseInt(e.target.value);
                  setSelectPolygon(selectedIndex);
                  setSelectedPolygonIndex(selectedIndex);
                  
                }}
              >
                <option disabled selected>
                  Qual polígono Editar
                </option>
                {mapLayers.map((element, index) => {
                  return (
                    <option key={index} value={index}>
                      {index + 1}° Polígono
                    </option>
                  );
                })}
              </select>
              {selectPolygon !== null && (
                <select onChange={(e) => setSelectSide(e.target.value)}>
                  <option selected disabled>
                    Escolha um par das coordenadas
                  </option>
                  {mapLayers[selectPolygon].latlngs.map((element, index) => {
                    return (
                      <option key={index} value={index}>
                        {index + 1}° par de cordenada
                      </option>
                    );
                  })}
                </select>
              )}
              {selectSide !== null && (
                <form className="form-lt-lg">
                   <label>
                    <span>Título da hidro</span>
                    <input 
                      type="text"
                      value={mapLayers[selectPolygon].title}
                      onChange={(e) => setMapLayers((previous) =>{
                        previous[selectPolygon].title = e.target.value;
                        return [...previous];
                      })} 
                    />
                  </label>
                  <label>
                    <span>Latitude</span>
                    <input
                      type="number"
                      value={mapLayers[selectPolygon].latlngs[selectSide].lat}
                      onChange={(e) =>
                        setMapLayers((previous) => {
                          mapLayers[selectPolygon].latlngs[selectSide].lat =
                            parseFloat(e.target.value);
                          previous[selectPolygon].center = handleCenter();
                          previous[selectPolygon].editing = true;
                          setForceUpdate(forceUpdate + 1);
                          return [...previous];
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Longitude</span>
                    <input
                      type="number"
                      value={mapLayers[selectPolygon].latlngs[selectSide].lng}
                      onChange={(e) =>
                        setMapLayers((previous) => {
                          mapLayers[selectPolygon].latlngs[selectSide].lng =
                            parseFloat(e.target.value);
                          previous[selectPolygon].center = handleCenter;
                          previous[selectPolygon].editing = true;
                          setForceUpdate(forceUpdate + 1);
                          return [...previous];
                        })
                      }
                    />
                  </label>
                  <button className="button-save-delet" onClick={handleRemovePolygon}>Remover Polígono</button>
                  <button className="button-save-delet save" onClick={handleSaveEdit}>Salvar Edição</button>
                </form>
              )}
            </section>
          </div>
        )}
        <MapContainer
          key={forceUpdate} // Forçar a re-renderização
          style={{ width: "100%", height: "53.4rem", position: "relative" }}
          center={position}
          zoom={13}
          scrollWheelZoom={false}
        >
          {mapLayers.map((element, index) => {
            return (
              <Marker
                key={index}
                title={element.title}
                position={element.center}
                draggable={true}
              >
                <Popup autoPan={true}>{element.title}</Popup>
              </Marker>
            );
          })}
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={_onCreate}
              onEdited={_onEdited}
              onDeleted={_onDeleted}
              draw={{
                rectangle: false,
                polyline: false,
                circle: false,
                circlemarker: false,
                marker: false,
              }}
            />
            {mapLayers.map((element, index) => (
              <Polygon
                key={element.id}
                positions={element.latlngs}
              />
            ))}
          </FeatureGroup>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </>
  );
}