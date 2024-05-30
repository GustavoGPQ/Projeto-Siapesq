import axios from "axios";

let connection = axios.create({
    baseURL: "http://localhost:3001"
})

export default connection;