import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import { downloadCanvasToImage } from '../config/helpers';
import { EditorTabs, FilterTabs } from '../config/constants';
import { fadeAnimation } from '../config/motions';
import { CustomButton, AIPicker, ColorPicker, FilerPicker, Tab } from '../Components';

export default function Customizer() {
  const snap = useSnapshot(state);
  const [activeTab, setActiveTab] = useState('');
  const [error, setError] = useState('');
  const panels = { colorpicker: <ColorPicker />, filepicker: <FilerPicker />, aipicker: <AIPicker /> };
  function download() {
    try { downloadCanvasToImage(); setError(''); }
    catch { setError('Aguarde o modelo carregar e tente baixar novamente.'); }
  }
  return <AnimatePresence>{!snap.intro && <motion.section key="customizer" {...fadeAnimation}>
    <div className="product-actions absolute z-10 top-5 left-5 flex gap-2">
      <label htmlFor="product" className="sr-only">Produto</label>
      <select id="product" value={snap.product} onChange={(event) => { state.product = event.target.value; }}>
        <option value="shirt">Camiseta</option><option value="hat">Boné</option>
      </select>
      <button className="rounded-md bg-white px-3 py-2" onClick={download}>Baixar PNG</button>
    </div>
    <nav aria-label="Personalização" className="absolute top-1/2 -translate-y-1/2 left-0 z-10 flex items-center">
      <div className="editortabs-container">
        {EditorTabs.map((tab) => <Tab key={tab.name} tab={tab} isActiveTab={activeTab === tab.name}
          handleClick={() => setActiveTab(activeTab === tab.name ? '' : tab.name)} />)}
      </div>
      {panels[activeTab]}
    </nav>
    <div className="absolute z-10 top-5 right-5"><CustomButton type="filled" title="Voltar"
      handleClick={() => { state.intro = true; }} customStyles="px-4 py-2.5 font-bold text-sm" /></div>
    <div className="filtertabs-container">
      <p className="w-full text-center text-xs text-gray-600" role="status">{snap.saveStatus}</p>
      <p className="w-full text-center text-sm text-gray-600 pointer-events-none">Arraste para girar e ver as costas.</p>
      {FilterTabs.map((tab) => {
        const property = tab.name === 'logoShirt' ? 'isLogoTexture' : 'isFullTexture';
        return <Tab key={tab.name} tab={tab} isFilterTab isActiveTab={snap[property]}
          handleClick={() => { state[property] = !state[property]; }} />;
      })}
    </div>
    {error && <p role="alert" className="absolute bottom-24 left-5 z-10 bg-white p-2">{error}</p>}
  </motion.section>}</AnimatePresence>;
}
