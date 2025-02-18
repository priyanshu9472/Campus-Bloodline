import React from 'react'

export default function LoadingSpinner() {
    return (
        <div style={{width: "100%", height: "100%", display: "grid", placeItems: 'center', background: "white"}}>
            <div className="spinner-border text-danger" role="status" >
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
