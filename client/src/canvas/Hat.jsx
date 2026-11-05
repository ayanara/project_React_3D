import { useEffect, useMemo } from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import state from '../store';
import { prepareHatGeometry } from './hatGeometry';

export default function Hat() {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/baseball_hat_028.glb');
  const { parts, placement, logoScale, fullScale } = useMemo(() => prepareHatGeometry(nodes), [nodes]);
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  useEffect(() => () => parts.forEach(({ geometry }) => geometry.dispose()), [parts]);
  useFrame((_, delta) => easing.dampC(materials.baseball_hat_028__Mat.color, snap.color, 0.25, delta));

  return <group>
    {parts.map(({ name, geometry }) => <mesh key={name} geometry={geometry}
      material={materials.baseball_hat_028__Mat} material-roughness={1} dispose={null}>
      {name === 'Object_5' && <>
        {snap.isFullTexture && <Decal {...placement} scale={fullScale} map={fullTexture}
          depthTest material-depthWrite={false} polygonOffsetFactor={-4} />}
        {snap.isLogoTexture && <Decal {...placement} scale={logoScale} map={logoTexture}
          depthTest material-depthWrite={false} polygonOffsetFactor={-8} />}
      </>}
    </mesh>)}
  </group>;
}
