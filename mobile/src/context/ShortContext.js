import React, { useState, createContext } from 'react'

export const ShortContext = createContext();

export const ShortProvider = ({ children }) => {
    const [shorts, setShorts] = useState([]);
    return (
        <ShortContext.Provider value={{ shorts, setShorts }}>
            {children}
        </ShortContext.Provider>
    )
}
