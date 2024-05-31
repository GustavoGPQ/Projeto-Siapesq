import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer,FeatureGroup} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { TokenContext } from "../context/TokenContext";


export default function Index(){
    const {token} = useContext(TokenContext);
    const position = [-31.7642, -52.3376]
    const navigate = useNavigate();
    const [mapLayers,setMapLayers] = useState([]);

    useEffect(() =>{
        if(!token){
            navigate("/login");
        }
    },[navigate]);

    const _onCreate = (e) =>{
        const {layerType, layer} = e
        if(layerType === "polygon"){
            const {_leaflet_id} = layer
            setMapLayers(layers => [...layers, {
                id: _leaflet_id,
                latlngs: layer.getLatLngs()[0]
            },
        ])
        }
    }

    const _onEdited = (e) => {
        const { layers: { _layers } } = e;
        Object.values(_layers).map(({ _leaflet_id, editing }) => {
            setMapLayers(layers => layers.map(l => {
                if (l.id === _leaflet_id) {
                    return { ...l, latlngs: { ...editing.latlngs[0] } };
                } else {
                    return l;
                }
            }));
        });
    }; 

    const _onDeleted = (e) => {
        const { layers: { _layers } } = e;
        Object.values(_layers).map(({ _leaflet_id }) => {
            setMapLayers(layers => layers.filter(l => l.id !== _leaflet_id))
        });
    }

    return(
        <>
            <div className="map">

                <MapContainer style={{width:'50%',height:'30rem'}} center={position} zoom={13} scrollWheelZoom={false}>
                    <FeatureGroup>
                        <EditControl 
                            position="topright"
                            onCreated={_onCreate}
                            onEdited={_onEdited}
                            onDeleted={_onDeleted}
                            draw={{
                                rectangle:false,
                                polyline:false,
                                circle:false,
                                circlemarker:false,
                                marker:false
                            }}
                        />
                    </FeatureGroup>

                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                
                </MapContainer>
                <pre className="dataMap">{mapLayers.length > 0 && JSON.stringify(mapLayers, 0, 2)}</pre>
            </div>
        </>
    )
}