import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motions';
import { CustomButton, AIPicker, ColorPicker, FilerPicker, Tab } from '../Components';

const Customizer = () => {
  const snap = useSnapshot(state);
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.nav
            kay='custom'
            className='absolute top-0 left-0 z-10'
            {...slideAnimation('left')}
          >
            <div className='flex items-center min-h-screen'>
              <div className='editortabs-container tabs'>
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => { }}
                  />
                ))}
              </div>
            </div>
          </motion.nav>

          <motion.div
            className='absolute z-10 top-5 right-5'
            {...fadeAnimation}
          //significa que estamos expandindo o objeto fadeAnimation para o objeto atual. Isso significa que estamos adicionando todas as propriedades e valores do objeto fadeAnimation ao objeto atual.
          >
            <CustomButton
              type='filled'
              title=' Voltar'
              handleClick={() => state.intro = true}
              // Essa função faz com o state.intro seja alterado para true.
              // fazendo com que retorn para aba inicial.
              customStyles='w-fit px-4 py-2.5 font-bold text-sm'
            />
          </motion.div>

          <motion.div
            className='filtertabs-container'
            {...slideAnimation('up')}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab=''
                handleClick={() => { }}
              />
            ))}

          </motion.div>
        </>
      )}

    </AnimatePresence>
  )
}

export default Customizer