import React from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state from '../store';

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb')

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  return (
    <group>
      <mesh
       castShadow
       geometry={nodes.T_Shirt_male.geometry}
       material={materials.lambert1}
       material-roughness={1}
       dispose={null}

      >

      </mesh>
    </group>
  )
}

export default Shirt

//O componente Shirt renderiza um modelo 3D de uma camisa com dois decalques: 
//um decalque do logotipo e um decalque completo. Os decalques são carregados usando os módulos useTexture e useSnapshot. 
//O estado da aplicação é usado para determinar quais decalques devem ser carregados.

//Esta linha usa o módulo useGLTF para carregar o modelo 3D da camisa. 
//O modelo 3D é carregado do arquivo shirt_baked.glb