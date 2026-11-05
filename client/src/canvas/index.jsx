import { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, Html } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import state from '../store';
import CameraRig from './CameraRig';

const Shirt = lazy(() => import('./Shirt'));
const Hat = lazy(() => import('./Hat'));

export default function CanvasModel() {
  const { product } = useSnapshot(state);
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 2], fov: 25 }}
    gl={{ preserveDrawingBuffer: true, powerPreference: 'high-performance' }}>
    <color attach="background" args={['#f5f5f5']} />
    <ambientLight intensity={0.8} />
    <directionalLight position={[3, 4, 5]} intensity={1.5} />
    <Suspense fallback={<Html center><p role="status">Carregando modelo…</p></Html>}>
      <CameraRig><Center key={product}>{product === 'shirt' ? <Shirt /> : <Hat />}</Center></CameraRig>
    </Suspense>
  </Canvas>;
}
