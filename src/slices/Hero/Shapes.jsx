"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, Html } from "@react-three/drei";
import { useGesture } from "@use-gesture/react";
import { Suspense, useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import * as Tone from "tone";

// Daftar material/warna yang bisa dipilih secara acak
const materials = [
  new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.1 }),
  new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.1 }),
  new THREE.MeshStandardMaterial({ color: 0x2980b9, roughness: 0.1 }),
  new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.1 }),
  new THREE.MeshStandardMaterial({ color: 0x8e44ad, roughness: 0.1 }),
  new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.1 }),
];

// Komponen untuk menampilkan panel instruksi
function Instructions({ visible }) {
  const groupRef = useRef();
  const [messageIndex, setMessageIndex] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);

  const messages = [
    <div key="welcome">
      <h2 className="font-bold text-base md:text-lg mb-1 md:mb-2">Selamat Datang!</h2>
      <p className="text-xs md:text-sm">Ini adalah portfolio interaktif Farrelzv.</p>
    </div>,
    <div key="explore">
      <h2 className="font-bold text-base md:text-lg mb-1 md:mb-2">Ayo Cari Tahu!</h2>
      <p className="text-xs md:text-sm">Yuk, cari tahu lebih dalam tentang saya!</p>
    </div>,
    <div key="puzzle">
      <h2 className="font-bold text-base md:text-lg mb-1 md:mb-2">Puzzle Interaktif!</h2>
      <p className="text-xs md:text-sm">Susun potongan untuk membentuk huruf &apos;Fz&apos;.</p>
      <ul className="text-[10px] md:text-xs text-left mt-2 md:mt-3 list-disc list-inside space-y-1">
        <li><strong>Klik Kiri + Geser:</strong> Pindah</li>
        <li><strong>Klik Kanan + Geser:</strong> Putar</li>
        <li><strong>Klik:</strong> Ganti Warna</li>
      </ul>
    </div>,
  ];

  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        setTextOpacity(0);
        setTimeout(() => {
          setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
          setTextOpacity(1);
        }, 500);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [visible, messages.length]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Html 
        position={[0, 0, 0]} 
        center
        style={{
          transition: 'opacity 0.5s',
          opacity: visible ? 1 : 0,
          pointerEvents: 'none',
        }}
      >
        <div 
          className="bg-slate-900/80 text-slate-100 p-3 md:p-4 rounded-lg text-center shadow-xl w-[200px] md:w-[250px]"
        >
          <div style={{ transition: 'opacity 0.5s', opacity: textOpacity }}>
            {messages[messageIndex]}
          </div>
          <p className="text-[10px] md:text-xs mt-2 md:mt-3 italic opacity-70">Mulai berinteraksi untuk menghilangkan pesan ini.</p>
        </div>
      </Html>
    </group>
  );
}

// Komponen utama untuk menampilkan scene 3D
export function Shapes() {
  return (
    <div className="h-full w-full">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 18], fov: 30, near: 1, far: 40 }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Suspense fallback={null}>
          <LetterPuzzle />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Komponen utama untuk game puzzle
function LetterPuzzle() {
  // Potongan untuk huruf F
  const [piece1Pos, setPiece1Pos] = useState([-5, 2, 0]);
  const [piece1Rot, setPiece1Rot] = useState([0, 0, 0]);
  const [piece2Pos, setPiece2Pos] = useState([-5, -1, 0]);
  const [piece2Rot, setPiece2Rot] = useState([0, 0, 0]);
  const [piece3Pos, setPiece3Pos] = useState([-5, -3, 0]);
  const [piece3Rot, setPiece3Rot] = useState([0, 0, 0]);
  
  // Potongan untuk huruf Z
  const [piece4Pos, setPiece4Pos] = useState([5, 3, 0]);
  const [piece4Rot, setPiece4Rot] = useState([0, 0, 0]);
  const [piece5Pos, setPiece5Pos] = useState([5, 0, 0]);
  // PERBAIKAN: Rotasi awal potongan diagonal disesuaikan dengan cetakannya
  const [piece5Rot, setPiece5Rot] = useState([0, 0, -Math.PI / 4]);
  const [piece6Pos, setPiece6Pos] = useState([5, -3, 0]);
  const [piece6Rot, setPiece6Rot] = useState([0, 0, 0]);

  const [isSolved, setIsSolved] = useState(false);
  const groupRef = useRef();

  const piece1SoundPlayed = useRef(false);
  const piece2SoundPlayed = useRef(false);
  const piece3SoundPlayed = useRef(false);
  const piece4SoundPlayed = useRef(false);
  const piece5SoundPlayed = useRef(false);
  const piece6SoundPlayed = useRef(false);
  
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSolved) {
        setShowInstructions(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isSolved]);

  const placeSynth = useRef(null);
  useEffect(() => {
    placeSynth.current = new Tone.Synth().toDestination();
  }, []);

  // Target untuk huruf F (digeser ke kiri)
  const target1 = { pos: new THREE.Vector3(-2.5, 0, 0) };
  const target2 = { pos: new THREE.Vector3(-1.4, 1.6, 0) };
  const target3 = { pos: new THREE.Vector3(-1.7, -0.2, 0) };
  
  // Target untuk huruf Z (diletakkan di kanan)
  const target4 = { pos: new THREE.Vector3(2, 1.6, 0) };
  const target5 = { pos: new THREE.Vector3(2, 0, 0), rot: new THREE.Euler(0, 0, -Math.PI / 4) };
  const target6 = { pos: new THREE.Vector3(2, -1.6, 0) };

  useEffect(() => {
    if (isSolved) {
      console.log("Puzzle Selesai! Memainkan suara kemenangan.");
      setShowInstructions(false);
      placeSynth.current?.triggerAttackRelease("C6", "4n", Tone.now());
      
      setTimeout(() => {
        window.location.href = "/about";
      }, 1500);
    }
  }, [isSolved]);

  const checkWinCondition = useCallback(() => {
    if (isSolved) return;

    const posTolerance = 0.4;
    const rotTolerance = 0.2;

    const isRotationCorrect = (rot, targetRot = new THREE.Euler(0,0,0)) => 
        Math.abs(rot.x % (Math.PI * 2) - targetRot.x) < rotTolerance &&
        Math.abs(rot.y % (Math.PI * 2) - targetRot.y) < rotTolerance &&
        Math.abs(rot.z % (Math.PI * 2) - targetRot.z) < rotTolerance;

    // Cek potongan F
    const piece1Correct = new THREE.Vector3(...piece1Pos).distanceTo(target1.pos) < posTolerance && isRotationCorrect(new THREE.Euler(...piece1Rot));
    const piece2Correct = new THREE.Vector3(...piece2Pos).distanceTo(target2.pos) < posTolerance && isRotationCorrect(new THREE.Euler(...piece2Rot));
    const piece3Correct = new THREE.Vector3(...piece3Pos).distanceTo(target3.pos) < posTolerance && isRotationCorrect(new THREE.Euler(...piece3Rot));
    
    // Cek potongan Z
    const piece4Correct = new THREE.Vector3(...piece4Pos).distanceTo(target4.pos) < posTolerance && isRotationCorrect(new THREE.Euler(...piece4Rot));
    const piece5Correct = new THREE.Vector3(...piece5Pos).distanceTo(target5.pos) < posTolerance && isRotationCorrect(new THREE.Euler(...piece5Rot), target5.rot);
    const piece6Correct = new THREE.Vector3(...piece6Pos).distanceTo(target6.pos) < posTolerance && isRotationCorrect(new THREE.Euler(...piece6Rot));

    if (piece1Correct && piece2Correct && piece3Correct && piece4Correct && piece5Correct && piece6Correct) {
      if (!isSolved) setIsSolved(true);
      return;
    }

    // Logika suara untuk setiap potongan
    [
      {correct: piece1Correct, soundPlayed: piece1SoundPlayed, note: "C5"},
      {correct: piece2Correct, soundPlayed: piece2SoundPlayed, note: "D5"},
      {correct: piece3Correct, soundPlayed: piece3SoundPlayed, note: "E5"},
      {correct: piece4Correct, soundPlayed: piece4SoundPlayed, note: "F5"},
      {correct: piece5Correct, soundPlayed: piece5SoundPlayed, note: "G5"},
      {correct: piece6Correct, soundPlayed: piece6SoundPlayed, note: "A5"},
    ].forEach(({correct, soundPlayed, note}) => {
      if (correct && !soundPlayed.current) {
        soundPlayed.current = true;
        placeSynth.current?.triggerAttackRelease(note, "8n", Tone.now());
      } else if (!correct && soundPlayed.current) {
        soundPlayed.current = false;
      }
    });

  }, [isSolved, piece1Pos, piece1Rot, piece2Pos, piece2Rot, piece3Pos, piece3Rot, piece4Pos, piece4Rot, piece5Pos, piece5Rot, piece6Pos, piece6Rot]);

  useEffect(() => {
    checkWinCondition();
  }, [checkWinCondition]);

  useFrame((state, delta) => {
    if (isSolved && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls enabled={false} />
      
      {/* Potongan Huruf F */}
      <DraggablePiece position={piece1Pos} rotation={piece1Rot} onDrag={setPiece1Pos} onRotate={setPiece1Rot} args={[0.8, 4, 0.8]} isSolved={isSolved} onInteract={() => setShowInstructions(false)} />
      <DraggablePiece position={piece2Pos} rotation={piece2Rot} onDrag={setPiece2Pos} onRotate={setPiece2Rot} args={[2.2, 0.8, 0.8]} isSolved={isSolved} onInteract={() => setShowInstructions(false)} />
      <DraggablePiece position={piece3Pos} rotation={piece3Rot} onDrag={setPiece3Pos} onRotate={setPiece3Rot} args={[1.6, 0.8, 0.8]} isSolved={isSolved} onInteract={() => setShowInstructions(false)} />
      
      {/* Potongan Huruf Z */}
      <DraggablePiece position={piece4Pos} rotation={piece4Rot} onDrag={setPiece4Pos} onRotate={setPiece4Rot} args={[2.5, 0.8, 0.8]} isSolved={isSolved} onInteract={() => setShowInstructions(false)} />
      <DraggablePiece position={piece5Pos} rotation={piece5Rot} onDrag={setPiece5Pos} onRotate={setPiece5Rot} args={[3.5, 0.8, 0.8]} isSolved={isSolved} onInteract={() => setShowInstructions(false)} />
      <DraggablePiece position={piece6Pos} rotation={piece6Rot} onDrag={setPiece6Pos} onRotate={setPiece6Rot} args={[2.5, 0.8, 0.8]} isSolved={isSolved} onInteract={() => setShowInstructions(false)} />

      <Instructions visible={showInstructions} />

      {/* Target visual untuk F */}
      <mesh position={target1.pos}> <boxGeometry args={[0.8, 4, 0.8]} /> <meshBasicMaterial color="grey" transparent opacity={0.2} /> </mesh>
      <mesh position={target2.pos}> <boxGeometry args={[2.2, 0.8, 0.8]} /> <meshBasicMaterial color="grey" transparent opacity={0.2} /> </mesh>
      <mesh position={target3.pos}> <boxGeometry args={[1.6, 0.8, 0.8]} /> <meshBasicMaterial color="grey" transparent opacity={0.2} /> </mesh>
      
      {/* Target visual untuk Z */}
      <mesh position={target4.pos}> <boxGeometry args={[2.5, 0.8, 0.8]} /> <meshBasicMaterial color="grey" transparent opacity={0.2} /> </mesh>
      <mesh position={target5.pos} rotation={target5.rot}> <boxGeometry args={[3.5, 0.8, 0.8]} /> <meshBasicMaterial color="grey" transparent opacity={0.2} /> </mesh>
      <mesh position={target6.pos}> <boxGeometry args={[2.5, 0.8, 0.8]} /> <meshBasicMaterial color="grey" transparent opacity={0.2} /> </mesh>

    </group>
  );
}

// Komponen untuk setiap bagian yang bisa di-drag
function DraggablePiece({ position, rotation, onDrag, onRotate, args, isSolved, onInteract }) {
  const ref = useRef();
  const [material, setMaterial] = useState(() => gsap.utils.random(materials));
  
  const clickSynth = useRef(null);
  useEffect(() => {
    clickSynth.current = new Tone.Synth().toDestination();
  }, []);

  const bind = useGesture({
    onDragStart: () => onInteract(),
    onDrag: ({ offset: [x, y], delta: [dx], event, buttons }) => {
      if (isSolved) return;
      event.stopPropagation();

      if (buttons === 1) {
        const [, , z] = ref.current.position;
        const newPos = [x / 50, -y / 50, z];
        ref.current.position.set(...newPos);
        onDrag(newPos);
      }
      if (buttons === 2) {
        const [rx, ry, rz] = ref.current.rotation.toArray();
        const newRot = [rx, ry, rz + dx * 0.02];
        ref.current.rotation.set(...newRot);
        onRotate(newRot);
      }
    },
    onClick: async ({ event }) => {
        if (isSolved) return;
        event.stopPropagation();
        onInteract();
        
        await Tone.start();
        clickSynth.current?.triggerAttackRelease("C4", "8n", Tone.now());

        setMaterial(gsap.utils.random(materials));
    }
  }, {
      drag: { filterTaps: true, taps: true }
  });
  
  return (
    <mesh ref={ref} {...bind()} position={position} rotation={rotation} castShadow material={material}>
      <boxGeometry args={args} />
    </mesh>
  );
}
