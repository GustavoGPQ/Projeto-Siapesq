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
import { faArrowDown, faArrowUp, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";


export default function Index() {
  const { token } = useContext(TokenContext);
  const position = [-31.7642, -52.3376];
  const navigate = useNavigate();
  const [mapLayers, setMapLayers] = useState([]);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0); 
  const [switcher,setSwitcher] = useState(false);
  const [visible,setVisible] = useState(false);
  const [selectPolygon,setSelectPolygon] = useState(null);
  const [selectSide, setSelectSide] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

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
          switcher: false
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

  return (
    <>
      <Header />
      <div className="map">
      {/** card para edição dos polígonos*/}
      {mapLayers.length > 0 && 
        <div style={{right: visible ? "2.4%" : "-14.2%"}} className="container-overlay-1">
          <span onClick={() => setVisible(!visible)}className="ArrowPull"><FontAwesomeIcon
            icon={faArrowLeft}
          /></span>
          <section style={{visibility: visible ? "visible" : "hidden"}} className="floatDiv-addCordinates">
            <h2 style={{textAlign:"center"}}>Editar Cordenadas</h2>
            <select onChange={e => setSelectPolygon(e.target.value)}>
              <option selected disabled>Qual polígono Editar</option>
              {mapLayers.map((element,index) =>{
                return(
                  <>
                    <option value={index}>{index + 1}° Polígono</option>               
                  </>
                )
              })}
            </select>
            {selectPolygon !== null && 
              <select onChange={e => setSelectSide(e.target.value)}>
                <option selected disabled>Escolha um par das coordenadas</option>
                {mapLayers[selectPolygon].latlngs.map((element,index) =>{
                  return(
                    <option value={index}>
                      {index + 1}° par de cordenada
                    </option>
                  )
                })}
              </select>
            }
            {selectSide !== null && 
              <form>
                <label>
                  <span>
                    Latitude
                  </span>
                  <input 
                    type="number"
                    value={mapLayers[selectPolygon].latlngs[selectSide].lat}
                    onChange={e => setMapLayers((previous) =>{
                      mapLayers[selectPolygon].latlngs[selectSide].lat = parseFloat(e.target.value);
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
                      setForceUpdate(forceUpdate + 1);
                      return [...previous];
                    })} 
                  />
                </label>
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
            {mapLayers.map((layer) => (
              <Polygon key={layer.id} positions={layer.latlngs} />
            ))}
          </FeatureGroup>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
      {mapLayers.map((elementMapLayers, indexMapLayers) => {
        return (
          <div key={indexMapLayers} className="formCordinatesContainer">
            <header className="headerForm">
              Formulário da localização: {elementMapLayers.title}
              <FontAwesomeIcon
                icon={elementMapLayers.switcher ? faArrowUp : faArrowDown}
                className="arrowDown"
                onClick={() => setMapLayers((previous) =>{
                  previous[indexMapLayers].switcher = !previous[indexMapLayers].switcher;
                  setForceUpdate(forceUpdate + 1);
                  return[...previous];
                })}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="trash"
                onClick={() => {
                  setMapLayers((previous) => {
                    previous.splice(indexMapLayers, 1);
                    setForceUpdate(forceUpdate + 1);
                    return [...previous];
                  });
                }}
                style={{ cursor: "pointer" }}
              />
            </header>
            <form style={{transition:"all .8s",height: elementMapLayers.switcher? "auto" : "0px"}}>
              <label>
                <span>Titulo</span>
                <input
                  type="text"
                  value={elementMapLayers.title}
                  onChange={(e) => {
                    setMapLayers((previous) => {
                      previous[indexMapLayers].title = e.target.value;
                      setForceUpdate(forceUpdate + 1);
                      return [...previous];
                    });
                  }}
                />
              </label>
              {elementMapLayers.latlngs.map((elementLngs, indexLngs) => {
                return (
                  <div className="separeted_input_cordinates" key={indexLngs}>
                    <label>
                      <span>Latitude</span>
                      <input
                        type="number"
                        value={elementLngs.lat}
                        onChange={(e) => {
                          setMapLayers((previous) => {
                            previous[indexMapLayers].latlngs[indexLngs].lat = parseFloat(e.target.value);
                            return [...previous];
                          });
                        }}
                      />
                    </label>
                    <label>
                      <span>Longitude</span>
                      <input
                        type="number"
                        value={elementLngs.lng}
                        onChange={(e) => {
                          setMapLayers((previous) => {
                            previous[indexMapLayers].latlngs[indexLngs].lng = parseFloat(e.target.value);
                            setForceUpdate(forceUpdate + 1); // Forçar a re-renderização
                            return [...previous];
                          });
                        }}
                      />
                    </label>
                  </div>
                );
              })}
            </form>
          </div>
        );
      })}
    </>
  );
}
