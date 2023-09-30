import React from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state from '../store';

const Hat = () => {
  const newState = useSnapshot(state);
  const { nodes, materials } = useGLTF('/scene.gltf');

  const logoTexture = useTexture(newState.logoDecal);
  const fullTexture = useTexture(newState.fullDecal);

  useFrame((state, delta) => easing.dampC(materials.StrapBuckle.color, newState.color, 0.25, delta));

  const stateString = JSON.stringify(newState);
  console.log(materials)
  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.head_StrapBuckle_0.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
        scale={0.1}
      >
        {newState.isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={0.5}
            map={fullTexture}
          />
        )}

        {newState.isLogoTexture && (
          <Decal 
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            /* map-anisotropy={fullTexture ? 16 : undefined} */
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  )
}

export default Hat

//O componente Shirt renderiza um modelo 3D de uma camisa com dois decalques: 
//um decalque do logotipo e um decalque completo. Os decalques são carregados usando os módulos useTexture e useSnapshot. 
//O estado da aplicação é usado para determinar quais decalques devem ser carregados.

//Esta linha usa o módulo useGLTF para carregar o modelo 3D da camisa. 
//O modelo 3D é carregado do arquivo shirt_baked.glb