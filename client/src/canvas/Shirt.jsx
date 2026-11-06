import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state from '../store';

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  const logoSize = (snap.logoPosition === 'left' || snap.logoPosition === 'right' ? 0.075 : 0.15) * snap.logoScale;
  const logoAspect = logoTexture.image.width / logoTexture.image.height;

  useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta));


  return (
    <group>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        // The baked AO texture contains a large dark patch on the back.
        // Keep the fabric normal map, but use scene lighting for shading.
        material-aoMapIntensity={0}
        dispose={null}
        position={[0, -0.2, 0]}
      >
        {snap.isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
            depthTest={true}
            material-depthWrite={false}
          />
        )}

        {snap.isLogoTexture && (
          <Decal 
            position={[
              (snap.logoPosition === 'left' ? 0.09 : snap.logoPosition === 'right' ? -0.09 : 0) + snap.logoOffsetX,
              0.04 + snap.logoOffsetY,
              0.15,
            ]}
            rotation={[0, 0, 0]}
            // Keep projection depth independent of logo size so the curved chest
            // stays inside the projector, and preserve the image's proportions.
            scale={[
              logoSize * Math.min(1, logoAspect),
              logoSize / Math.max(1, logoAspect),
              0.4,
            ]}
            map={logoTexture}
            /* map-anisotropy={fullTexture ? 16 : undefined} */
            depthTest={true}
            material-depthWrite={false}
          />
        )}
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
