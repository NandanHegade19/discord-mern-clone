import axios from 'axios';

const instance = axios.create({
    baseURL: "https://discord-mern-backend.herokuapp.com"
})

export default instance;