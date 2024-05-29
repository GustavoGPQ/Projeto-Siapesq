const axios = require("axios");

let connection = axios.create({
    baseURL: "http://localhost:3001"
})

export default connection