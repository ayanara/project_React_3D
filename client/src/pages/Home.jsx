import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import { CustomButton } from '../Components';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '../config/motions';
const Home = () => {
  const snap = useSnapshot(state);
  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className='home' {...slideAnimation('left')}>
          <motion.header {...slideAnimation('down')}>
            <img
              src='./cute_shiba.png'
              alt='logo'
              className="w-15 h-16 object-fit"
              height='100px'
            ></img>

          </motion.header>

          <motion.div className='home-content' {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h1 className='head-text'>
                MÃO <br className='xl:block hidden' /> NA MASSA.
              </h1>
            </motion.div>
            <motion.div
              {...headContentAnimation}
              className='flex flex-col gap-5'
            >
              <p className="max-w-md font-normal text-gray-600 text-base">
                Personalize sua camiseta ou boné em 3D. <strong>Escolha as cores, envie sua estampa</strong>{" "} e crie seu próprio estilo.
              </p>

              <CustomButton
                type="filled"
                title="Personalizar"
                handleClick={() => state.intro = false}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />

            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

export default Home
