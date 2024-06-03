import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { TokenContext } from "../context/TokenContext";
import Header from "../components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useMap, useMapEvent } from 'react-leaflet/hooks'

export default function Index() {
  const { token } = useContext(TokenContext);
  const position = [-31.7642, -52.3376];
  const navigate = useNavigate();
  const [mapLayers, setMapLayers] = useState([]);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [switcher, setSwitcher] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const _onCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      setMapLayers((layers) => [
        ...layers,
        {
          title: "",
          id: _leaflet_id,
          latlngs: layer.getLatLngs()[0],
        },
      ]);
    }
  };

  const _onEdited = (e) => {
    const {
      layers: { _layers },
    } = e;
    Object.values(_layers).forEach(({ _leaflet_id, editing }) => {
      setMapLayers((layers) =>
        layers.map((l) => {
          if (l.id === _leaflet_id) {
            return { ...l, latlngs: editing.latlngs[0] };
          } else {
            return l;
          }
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
      // Um polígono precisa de pelo menos 3 pontos
      const newPolygon = {
        id: new Date().getTime(),
        latlngs: polygonCoords,
      };
      setMapLayers((layers) => [...layers, newPolygon]);
      setPolygonCoords([]);
    }
  };

  return (
    <>
      <Header />
      <div className="map">
        <MapContainer
          style={{ width: "50%", height: "30rem" }}
          center={position}
          zoom={13}
          scrollWheelZoom={false}
        >
          <Marker position={[-31.75896951044599,-52.36375808715821]}
            title="nao"
            draggable={true}
          >
  
          </Marker>
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
          <>
            <div className="formCordinatesContainer">
              <header className="headerForm">
                Formulário da localização: {elementMapLayers.title}
                <FontAwesomeIcon
                  icon={switcher ? faArrowUp : faArrowDown}
                  className="arrowDown"
                  onClick={() => setSwitcher(!switcher)}
                />
              </header>
              <form>
                <label>
                  <span>Titulo</span>
                  <input
                    type="text"
                    value={elementMapLayers.title}
                    onChange={(e) => {
                      setMapLayers((previous) => {
                        previous[indexMapLayers].title = e.target.value;
                        return [...previous];
                      });
                    }}
                  />
                </label>
                {elementMapLayers.latlngs.map((elementLngs, indexLngs) => {
                  return (
                    <>
                      <label>
                        <span>Latitude</span>
                        <input
                          type="number"
                          value={elementLngs.lat}
                          onChange={(e) => {
                            setMapLayers((previous) => {
                              previous[indexMapLayers].latlngs[indexLngs].lat =
                                e.target.value;
                              return [...previous];
                            });
                          }}
                        />
                      </label>
                      <label>
                        <span>longitude</span>
                        <input
                          type="number"
                          value={elementLngs.lng}
                          onChange={(e) => {
                            setMapLayers((previous) => {
                              previous[indexMapLayers].latlngs[indexLngs].lng =
                                e.target.value;
                              return [...previous];
                            });
                          }}
                        />
                      </label>
                    </>
                  );
                })}
              </form>
            </div>
          </>
        );
      })}
    </>
  );
}
