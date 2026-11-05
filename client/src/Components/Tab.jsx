import PropTypes from 'prop-types';
import { useSnapshot } from 'valtio';

import state from '../store';

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  const newState = useSnapshot(state);

  const activeStyles = isActiveTab
  ? {backgroundColor: newState.color, opacity: 0.5 }
  : {backgroundColor: 'transparent', opacity: 1 } 

  //activeStyles que contém os estilos a serem aplicados à aba quando ela estiver ativa. Se a aba for uma aba de filtro e estiver ativa, o objeto activeStyles conterá a cor atual do aplicativo com uma opacidade de 50%. Caso contrário, o objeto activeStyles conterá uma cor transparente com uma opacidade de 100%.



  return (
    <button
      type="button"
      aria-label={({ colorpicker: 'Cor', filepicker: 'Enviar imagem', aipicker: 'IA', logoShirt: 'Exibir logo', stylishShirt: 'Exibir estampa' })[tab.name]}
      aria-pressed={Boolean(isActiveTab)}
      key={tab.name}
      className={`tab-btn ${isFilterTab ? 'rounded-full glassmorphism' : 'rounded-md'}`}
      onClick={handleClick}
      style={activeStyles}
    >
      <img
        src={tab.icon}
        alt={tab.name}
        className={`${isFilterTab ? 'w-2/3 h-2/3' : 'w-11/12 h-11/12 object-contain'}`}
      ></img>

    </button>
  )
}

export default Tab
Tab.propTypes = {
  tab: PropTypes.shape({ name: PropTypes.string.isRequired, icon: PropTypes.string.isRequired }).isRequired,
  isFilterTab: PropTypes.bool,
  isActiveTab: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
};
