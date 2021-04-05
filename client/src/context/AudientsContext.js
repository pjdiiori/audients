import React, { useState, createContext} from 'react'

export const AudientsContext = createContext();

export const AudientsContextProvider = (props) => {
    const [audients, setAudients] = useState([]);
    const [selectedAudient, setSelectedAudient] = useState(null);

    const addAudients = (audient) => {
        setAudients([...audients, audient])
    }

    return (

        <AudientsContext.Provider
            value={{
                audients,
                setAudients,
                selectedAudient,
                setSelectedAudient,
                addAudients,
            }}
        >
            {props.children}
        </AudientsContext.Provider>
    )
}
