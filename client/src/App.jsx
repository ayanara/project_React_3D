import Canvas from './canvas';
import Customizer from './pages/Customizer';
import Home from './pages/Home';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import state, { initializePersonalization } from './store';

function App() {
  const { ready } = useSnapshot(state);
  useEffect(() => { initializePersonalization(); }, []);
  if (!ready) return <main className="app flex items-center justify-center" role="status">Carregando personalização…</main>;
  return (
    <main className='app transition-all-ease-in'>
      <Home />
      <Canvas />
      <Customizer />
    </main>
    
  )
}

export default App
