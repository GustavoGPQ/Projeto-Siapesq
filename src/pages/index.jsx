import React, { useEffect, useState, useContext, useRef, useDebugValue } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { TokenContext } from "../context/TokenContext";
import Header from "../components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function Index() {
  const { token } = useContext(TokenContext);
  const position = [-31.7642, -52.3376];
  const navigate = useNavigate();
  const [mapLayers, setMapLayers] = useState([]);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0); 
  const [visible,setVisible] = useState(false);
  const [selectPolygon,setSelectPolygon] = useState(null);
  const [selectSide, setSelectSide] = useState(null);
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(null); // Adicionando estado para rastrear o índice do polígono selecionado
  const [modalIsOpen,setModalIsOpen] = useState(false);

  const openModal = () =>{
    setModalIsOpen(true);
    document.querySelector("#root").style.filter = "blur(5px)";
  }

  const closeModal = () =>{
    setModalIsOpen(false);
    document.querySelector("#root").style.filter = "blur(0px)";
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() =>{
    console.log(mapLayers);
  },[mapLayers]);

  useEffect(() =>{
    if(mapLayers.length === 0) {
      setSelectSide(null);
      setSelectPolygon(null)
    }
  },[mapLayers]);

  const _onCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      const center = layer.getCenter(); 
      setMapLayers((layers) => [
        ...layers,
        {
          title: "",
          id: _leaflet_id,
          latlngs: layer.getLatLngs()[0],
          center : center,
        },
      ]);
    }
  };

  const _onEdited = (e) => {
    const { layers: { _layers } } = e;
    Object.values(_layers).forEach(layer => {
        const { _leaflet_id } = layer;
        setMapLayers(layers => layers.map(l => {
            if (l.id === _leaflet_id) {
                return {
                    ...l,
                    latlngs: layer.getLatLngs()[0],
                    center: layer.getCenter()
                };
            } else {
                return l;
            }
        }));
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

  const handleCenter = () =>{
    const bounds = L.latLngBounds(mapLayers[selectPolygon].latlngs.map(coord => L.latLng(coord.lat, coord.lng)));
    const center = bounds.getCenter();
    return center;
  }

  const handleAddCoordinate = (e) => {
    e.preventDefault();
    const lat = parseFloat(e.target.latitude.value);
    const lng = parseFloat(e.target.longitude.value);
    let title = "";

    setPolygonCoords([...polygonCoords, { title, lat, lng }]);
    e.target.reset();
  };

  const handleSavePolygon = () => {
    if (polygonCoords.length > 2) {
      const newPolygon = {
        id: new Date().getTime(),
        latlngs: polygonCoords.map(coord => ({ lat: coord.lat, lng: coord.lng })),
        center: L.polygon(polygonCoords.map(coord => [coord.lat, coord.lng])).getCenter()
      };
      setMapLayers((layers) => [...layers, newPolygon]);
      setPolygonCoords([]);
    }
  };

  const handleSubmitCordinates = (e) =>{
    e.preventDefault();
    mapLayers.splice(selectPolygon,1);
    setForceUpdate(forceUpdate + 1);
    setSelectPolygon(null);
    setSelectSide(null);
  }

  // Função para alterar a cor do polígono selecionado
  const changePolygonColor = (index) => {
    setMapLayers((prevLayers) => {
      return prevLayers.map((layer, i) => {
        if (i === index) {
          // Se este for o polígono selecionado, definir a cor como vermelho
          return { ...layer, color: 'red', fillColor: 'red' };
        } else {
          // Caso contrário, manter a cor original
          return { ...layer, color: 'blue', fillColor: 'blue' };
        }
      });
    });
  };

  return (
    <>
      <Header />
      <div className="map">
      {/*Card para adição de polígonos*/}
      <div className="addPolygon">
        <button onClick={openModal}>Adicionar Polígono <span style={{color:"green", fontWeight:"bolder", fontSize:"larger"}}>+</span></button>
      </div>
      <div className="containerModal">
        <Modal 
            isOpen={modalIsOpen}
            onAfterClose={modalIsOpen}
            contentLabel="Adicionar novo polígono"
            overlayClassName="Modal-Cordinates"
            className="modal-content"
          >
          <header className="headerModal">
            <h2>Adicionar novo polígono</h2>
          </header>
          <button onClick={closeModal}>Fechar</button>
        </Modal>
      </div>
      {/** card para edição dos polígonos*/}
      {mapLayers.length > 0 && 
        <div style={{right: visible ? "2.4%" : "-14.2%"}} className="container-overlay-1">
          <span onClick={() => setVisible(!visible)}className="ArrowPull"><FontAwesomeIcon
            icon={faArrowLeft}
          /></span>
          <section style={{visibility: visible ? "visible" : "hidden"}} className="floatDiv-addCordinates">
            <h2 style={{textAlign:"center"}}>Editar Cordenadas</h2>
            <select onChange={e => {
              const selectedIndex = parseInt(e.target.value);
              setSelectPolygon(selectedIndex);
              setSelectedPolygonIndex(selectedIndex);
              // Chamada para alterar a cor do polígono selecionado
              changePolygonColor(selectedIndex);
            }}>
              <option selected disabled>Qual polígono Editar</option>
              {mapLayers.map((element,index) =>{
                return(
                  <option key={index} value={index}>{index + 1}° Polígono</option>               
                );
              })}
            </select>
            {selectPolygon !== null && 
              <select onChange={e => setSelectSide(e.target.value)}>
                <option selected disabled>Escolha um par das coordenadas</option>
                {mapLayers[selectPolygon].latlngs.map((element,index) =>{
                  return(
                    <option key={index} value={index}>
                      {index + 1}° par de cordenada
                    </option>
                  );
                })}
              </select>
            }
            {selectSide !== null && 
              <form onSubmit={handleSubmitCordinates}>
                <label>
                  <span>
                    Latitude
                  </span>
                  <input 
                    type="number"
                    value={mapLayers[selectPolygon].latlngs[selectSide].lat}
                    onChange={e => setMapLayers((previous) =>{
                      mapLayers[selectPolygon].latlngs[selectSide].lat = parseFloat(e.target.value);
                      previous[selectPolygon].center = handleCenter();
                      setForceUpdate(forceUpdate + 1);
                      return [...previous];
                    })} 
                  />
                </label>
                <label>
                  <span>Longitude</span>
                  <input 
                    type="number"
                    value={mapLayers[selectPolygon].latlngs[selectSide].lng}
                    onChange={e => setMapLayers((previous) => {
                      mapLayers[selectPolygon].latlngs[selectSide].lng = parseFloat(e.target.value);
                      previous[selectPolygon].center = handleCenter;
                      setForceUpdate(forceUpdate + 1);
                      return [...previous];
                    })} 
                  />
                </label>
                <button type="submit">Remover Polígono</button>
              </form>
            }
          </section>
        </div> 
      }
        <MapContainer
          key={forceUpdate} // Forçar a re-renderização
          style={{ width: "80%", height: "45rem", position: 'relative' }}
          center={position}
          zoom={13}
          scrollWheelZoom={false}
        >
          {mapLayers.map((element,index) =>{
            return(
              <Marker 
                key={index}
                title={element.title}
                position={element.center}
                draggable={true}
              >
                <Popup
                  autoPan={true}
                >
                  {element.title}
                </Popup>
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
            {mapLayers.map((layer, index) => (
              <Polygon key={layer.id} positions={layer.latlngs} pathOptions={{ color: layer.color, fillColor: layer.fillColor }} />
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