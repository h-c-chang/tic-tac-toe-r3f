import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Game from './Game.jsx'
import React, { StrictMode } from "react";
import { Loader } from '@react-three/drei'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>
        <Canvas
        camera={ {
            fov: 100,
            near: 0.1,
            far: 300,
            position: [ 0, 0, 0 ]
        } }
        >
            <Game />
        </Canvas>
        <Loader />
    </>

)