import axios from "axios"

async function getIpAddress() {
    const ip = await fetch("https://checkip.amazonaws.com/").then(res => res.text())
    return ip
}

function getApi() {
    const api = axios.create({
        baseURL: process.env.VUE_APP_BACKEND_URL,
    })

    return api
}

function isDevMode() {
    return process.env.NODE_ENV === 'development'
}

export default { getIpAddress, getApi, isDevMode }
export { getIpAddress, getApi, isDevMode }