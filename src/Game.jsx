import { useMatcapTexture, Center, PerspectiveCamera, MeshReflectorMaterial, Float, Text, Text3D, Html, PivotControls, TransformControls, OrbitControls } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32)
const planeGeometry = new THREE.PlaneGeometry(1.5,1.5)
const material = new THREE.MeshMatcapMaterial()

function Experience( {visible, status} )
{
    const donuts = useRef([])

    const [ matcapTexture ] = useMatcapTexture('E6BF3C_5A4719_977726_FCFC82', 256)

    useFrame((state, delta) =>
    {
        for(const donut of donuts.current)
        {
            donut.rotation.y += delta * 2
            donut.position.y += -delta * 5

        }
    })

    useEffect(() =>
    {
        matcapTexture.colorSpace = THREE.SRGBColorSpace
        matcapTexture.needsUpdate = true

        material.matcap = matcapTexture
        material.needsUpdate = true
    }, [])

    return <>

        <OrbitControls makeDefault />
            <Text3D visible={visible}
                material={ material }
                font="./fonts/helvetiker_regular.typeface.json"
                size={ 2.75 }
                height={ 0.4 }
                curveSegments={ 12 }
                bevelEnabled
                bevelThickness={ 0.02 }
                bevelSize={ 0.02 }
                bevelOffset={ 0 }
                bevelSegments={ 5 }
                position-x={ -15 }
                position-y={ 5 }
                position-z={ -10 }
            >
                {status}
            </Text3D>


        { [...Array(1000)].map((value, index) =>
            <mesh
                visible={visible}
                ref={ (element) => donuts.current[index] = element }
                key={ index }
                geometry={ planeGeometry }
                material={ material }
                position={ [
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 100
                ] }
                scale={ 0.2 + Math.random() * 0.2 }
                rotation={ [
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    0
                ] }
            />
        ) }

    </>
}

function Square({x, z, color, onSquareClick}){
    return (
        <mesh position-x={ x } position-y={ -10 } position-z={ z }  scale={ 10 } onClick={onSquareClick}>
            <boxGeometry args={[1, 0.2]}/>
            <meshStandardMaterial 
                color={color}
            />
        </mesh> 
    );
} 

function Board( {xIsNext, squares, onPlay} )
{
    // const cube = useRef()
    // const sphere = useRef()

    function handleClick(i) {
        
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "lightcoral";
        } else {
            nextSquares[i] = "lightblue";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    let visible;
    let statusVisible;
    if(winner) {
        status = `Winner is ${winner} !`   
        visible = true; 
        statusVisible = false;
    } else {
        status = `Next player: ${(xIsNext ? "lightcoral" : "lightblue")}`
        visible = false; 
        statusVisible = true;
    }

    return <>
        <PerspectiveCamera makeDefault fov={75} position={[0, 10, 20]} />
        <OrbitControls  />
        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <Float
            speed={ 5 }
            floatIntensity={ 2 }
        >
        <Text
            visible={ statusVisible }
            font="./bangers-v20-latin-regular.woff"
            fontSize={ 5 }
            color={status.includes("Winner") ? "yellow" : status.includes("lightcoral") ? "lightcoral" : "lightblue"}
            position-x={ 0 }
            position-y={ 5 }
            position-z={ -10 }
            textAlign="center"
        >
            {status}
        </Text>
        </Float>

        <Square x='-11' z='1' color={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square x='0' z='1' color={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square x='11' z='1' color={squares[2]} onSquareClick={() => handleClick(2)}/>
        <Square x='-11' z='-10' color={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square x='0' z='-10' color={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square x='11' z='-10' color={squares[5]} onSquareClick={() => handleClick(5)}/>
        <Square x='-11' z='-21' color={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square x='0' z='-21' color={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square x='11' z='-21' color={squares[8]} onSquareClick={() => handleClick(8)}/>
        

        <Experience visible={visible} status={status}/>
        
    </>
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);

    }

    const moves = history.map((squares,move) => {
        let description;
        let position = move * 3.5;
        if(move > 0){
            description = `Go to move # ${move}`;
        }else{
            description = `Go to game start`;
        }
        return(
            <></>
            // <Html  position-x={position} key={move}>
            //     <li>
            //         <button onClick={() => jumpTo(move)}>{description}</button>
            //     </li>
            // </Html>

        );
    });

    return (
        <>
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            {moves}
        </>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
