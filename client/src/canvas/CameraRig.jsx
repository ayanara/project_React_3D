import { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import state from '../store';

const CameraRig = ({ children }) => {
  const group = useRef();
  const { intro, product } = useSnapshot(state);
  const { camera, size } = useThree();
  const isMobile = size.width <= 600;

  // Start each editing session/product from the front. During editing only
  // OrbitControls owns the camera, so the animation cannot undo a drag.
  useLayoutEffect(() => {
    if (!intro) {
      camera.position.set(0, 0, isMobile ? 2.5 : 2);
      camera.lookAt(0, 0, 0);
      group.current.rotation.set(0, 0, 0);
    }
  }, [camera, intro, product, isMobile]);

  useFrame(({ pointer }, delta) => {
    if (!intro) return;
    const targetPosition = isMobile ? [0, 0.2, 2.5]
      : size.width <= 1260 ? [0, 0, 2] : [-0.4, 0, 2];
    easing.damp3(camera.position, targetPosition, 0.25, delta);
    camera.lookAt(0, 0, 0);
    easing.dampE(group.current.rotation,
      [pointer.y / 10, -pointer.x / 5, 0], 0.25, delta);
  });

  return <>
    <group ref={group}>{children}</group>
    {!intro && <OrbitControls key={product} makeDefault
      enablePan={false} enableZoom={false}
      enableDamping dampingFactor={0.08} rotateSpeed={0.8}
      minPolarAngle={Math.PI / 3} maxPolarAngle={2 * Math.PI / 3}
      target={[0, 0, 0]} />}
  </>;
};

CameraRig.propTypes = { children: PropTypes.node.isRequired };
export default CameraRig;
