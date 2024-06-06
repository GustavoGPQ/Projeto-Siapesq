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

Modal.setAppElement("#root");

export default function Index() {
  const { token } = useContext(TokenContext);
  const [position,setPosition] = useState([-31.7642, -52.3376]);
  const navigate = useNavigate();
  const [mapLayers, setMapLayers] = useState([]);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectPolygon, setSelectPolygon] = useState(null);
  const [selectSide, setSelectSide] = useState(null);
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(null); // Adicionando estado para rastrear o índice do polígono selecionado
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [forceEditDivUpdate, setForceEditDivUpdate] = useState(0);
  const [latitude,setLatitude] = useState("");
  const [longitude,setLongitude] = useState("");
  const [mapLayersLength,setMapLayersLength] = useState(0);

  const openModal = () => {
    setModalIsOpen(true);
    document.querySelector("#root").style.filter = "blur(5px)";
  };

  const closeModal = () => {
    setModalIsOpen(false);
    document.querySelector("#root").style.filter = "blur(0px)";
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() => {
    if (mapLayers.length === 0) {
      setSelectSide(null);
      setSelectPolygon(null);
    }

    setMapLayersLength(mapLayers.length);
  }, [mapLayers]);

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
          id_type: "manual",
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

  const handleSavePolygon = () => {
    if (polygonCoords.length >= 3) {
      const newPolygon = {
        title: "",
        id: new Date().getTime(),
        id_type: "form",
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

  const handleRemovePolygon = (e) => {
    e.preventDefault();
    mapLayers.splice(selectPolygon, 1);
    setForceUpdate(forceUpdate + 1);
    setForceEditDivUpdate(forceEditDivUpdate + 1);
    setSelectPolygon(null);
    setSelectSide(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setForceUpdate(forceUpdate + 1);
    setForceEditDivUpdate(forceEditDivUpdate + 1);
    setSelectPolygon(null);
    setSelectSide(null);
  };

  // Função para alterar a cor do polígono selecionado
  const changePolygonColor = (index) => {
    setMapLayers((prevLayers) => {
      return prevLayers.map((layer, i) => {
        if (i === index) {
          // Se este for o polígono selecionado, definir a cor como vermelho
          return { ...layer, color: "red", fillColor: "red" };
        } else {
          // Caso contrário, manter a cor original
          return { ...layer, color: "blue", fillColor: "blue" };
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
                  <input type="number" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} name="latitude" required />
                </label>
                <br />
                <label>
                  Longitude:
                  <input type="number" step="any" name="longitude" value={longitude} onChange={e => setLongitude(e.target.value)} required />
                </label>
                <br />
                <button       
                  type="submit"
                  disabled={(latitude === "" || longitude === "")}
                  className="addCordinateButton"
                >
                Adicionar Coordenada
                </button>
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
                <div className="cordinatesAdded" style={{marginTop:"3rem",width:"46%",height:"53%",overflow:"auto"}}>
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
            style={{ right: visible ? "2.4%" : "-14.2%" }}
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
                  // Chamada para alterar a cor do polígono selecionado
                  changePolygonColor(selectedIndex);
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
                <form>
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
                          setForceUpdate(forceUpdate + 1);
                          return [...previous];
                        })
                      }
                    />
                  </label>
                  <button onClick={handleRemovePolygon}>
                    Remover Polígono
                  </button>
                  <button onClick={handleSaveEdit}>Salvar Edição</button>
                </form>
              )}
            </section>
          </div>
        )}
        <MapContainer
          key={forceUpdate} // Forçar a re-renderização
          style={{ width: "80%", height: "45rem", position: "relative" }}
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
            {mapLayers.map((element, index) => {
              if (element.id_type === "form") {
                return <Polygon key={element.id} positions={element.latlngs} />;
              }
              return 0;
            })}
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