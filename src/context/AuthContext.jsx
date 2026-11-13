import { createContext, useContext, useEffect, useState } from 'react'
import { api, tokenStore } from '../lib/api.js'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(!!tokenStore.get())

    useEffect(() => {
        if (!tokenStore.get()) return
        api.me().then(setUser).catch(() => tokenStore.clear()).finally(() => setLoading(false))
    }, [])

    const login = async (email, password) => {
        const { token, user } = await api.login(email, password)
        tokenStore.set(token)
        setUser(user)
        return user
    }
    const logout = () => { tokenStore.clear(); setUser(null) }

    return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}