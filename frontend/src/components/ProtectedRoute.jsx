import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import {REFRESH_TOKEN, ACCESS_TOKEN} from "../constants"
import {useState, useEffect} from "react"

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(()=> setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try{
            const res = await api.post("/api/token/refresh", {
                refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }

    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 < Date.now()) {
            await refreshToken()
        } else {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return <div>Loading.....</div>
    }

    return isAuthorized ? children : <Navigate to="/Login"/>
}

export default ProtectedRoute