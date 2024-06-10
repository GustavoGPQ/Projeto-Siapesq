import axios from "axios";

let connection = axios.create({
    baseURL: "http://localhost:3005",
})

export default connection;