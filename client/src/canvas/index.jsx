import { Canvas } from '@react-three/fiber';
import { Environment, Center } from '@react-three/drei';

import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

const CanvasModel = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <Environment preset='city'/>

      
        <Center>
          <Shirt />
        </Center>
     


    </Canvas>
  )
}

export default CanvasModel

//O componente Canvas é usado para renderizar cenas 3D em React. 
//O componente Environment fornece um ambiente de iluminação realista para a cena. 
//O componente Center posiciona a cena no centro da viewport.


// O componente ambientLight é usado para adicionar uma luz ambiente à cena. 
//A luz ambiente ilumina todos os objetos na cena igualmente, independentemente de sua orientação. 
//A intensidade da luz ambiente é controlada pelo prop intensity.


//O componente Environment é usado para adicionar um ambiente pré-definido à cena. 
//O ambiente pré-definido fornece um conjunto de luzes e texturas que podem ser usados para criar rapidamente uma cena realista. 
//O ambiente pré-definido city fornece um ambiente urbano realista, com luzes de rua e edifícios.