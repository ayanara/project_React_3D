import React from 'react'
import { useSnapshot } from 'valtio';

import state from '../store';

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  const newState = useSnapshot(state);

  const activeStyles = isFilterTab && isActiveTab 
  ? {backgroundColor: newState.color, opacity: 0.5 }
  : {backgroundColor: 'transparent', opacity: 1 } 

  //activeStyles que contém os estilos a serem aplicados à aba quando ela estiver ativa. Se a aba for uma aba de filtro e estiver ativa, o objeto activeStyles conterá a cor atual do aplicativo com uma opacidade de 50%. Caso contrário, o objeto activeStyles conterá uma cor transparente com uma opacidade de 100%.



  return (
    <div
      key={tab.name}
      className={`tab-btn ${isFilterTab ? 'rounded-full glassmorhism' : 'rounded-4'}`}
      onClick={handleClick}
      style={activeStyles}
    >
      <img
        src={tab.icon}
        alt={tab.name}
        className={`${isFilterTab ? 'w-2/3 h-2/3' : 'w-11/12 h-11/12 object-contain'}`}
      ></img>

    </div>
  )
}

export default Tab