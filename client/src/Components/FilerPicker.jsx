import { useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import { reader } from '../config/helpers';
import state from '../store';

export default function FilerPicker() {
  const snap = useSnapshot(state);
  const inputRef = useRef(null);
  const [placement, setPlacement] = useState('logo');
  const [image, setImage] = useState('');
  const [filename, setFilename] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function selectFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImage('');
    setError('');
    setMessage('');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError('Escolha uma imagem PNG, JPG ou WebP de até 5 MB.');
      return;
    }
    setLoading(true);
    try { setImage(await reader(file)); setFilename(file.name); }
    catch { setError('Não foi possível abrir essa imagem.'); }
    finally { setLoading(false); }
  }
  function apply() {
    const full = placement === 'full';
    state[full ? 'fullDecal' : 'logoDecal'] = image;
    state[full ? 'isFullTexture' : 'isLogoTexture'] = true;
    setImage('');
    setMessage(full ? 'Estampa aplicada.' : 'Logo aplicado.');
  }
  return <div className="editor-panel image-panel">
    <strong>Suas imagens</strong>
    <button disabled={loading} onClick={() => inputRef.current?.click()}>{image ? 'Escolher outra imagem' : 'Enviar imagem'}</button>
    <input ref={inputRef} id="image-file" type="file" accept="image/png,image/jpeg,image/webp" onChange={selectFile} disabled={loading} tabIndex={-1} aria-label="Escolher imagem" />
    <p className="image-help">PNG, JPG ou WebP, até 5 MB.<br />Para logos, prefira PNG com fundo transparente.</p>
    {snap.product === 'shirt' && <fieldset>
      <legend>Posição do logo no peito</legend>
      <div className="logo-position">
        {[{ value: 'center', label: 'Centro' },
          { value: 'left', label: 'Esquerdo' },
          { value: 'right', label: 'Direito' }].map((option) =>
          <label key={option.value}>
            <input type="radio" name="logo-position" value={option.value}
              checked={snap.logoPosition === option.value}
              onChange={() => { state.logoPosition = option.value; state.logoOffsetX = 0; state.logoOffsetY = 0; }} /> {option.label}
          </label>)}
      </div>
      <p className="image-help">Lados de quem veste a camiseta.</p>
      <div className="logo-adjustments">
        <label htmlFor="logo-size">Tamanho <output>{Math.round(snap.logoScale * 100)}%</output></label>
        <input id="logo-size" type="range" min="0.5" max="1.5" step="0.05" value={snap.logoScale}
          onChange={(event) => { state.logoScale = Number(event.target.value); }} />
        <label htmlFor="logo-horizontal">Posição horizontal</label>
        <input id="logo-horizontal" type="range" min="-0.03" max="0.03" step="0.001" value={snap.logoOffsetX}
          aria-valuetext={snap.logoOffsetX === 0 ? 'Centralizado na posição escolhida' : snap.logoOffsetX > 0 ? 'À esquerda de quem veste' : 'À direita de quem veste'}
          onChange={(event) => { state.logoOffsetX = Number(event.target.value); }} />
        <div className="logo-range-hints"><span>Direito</span><span>Esquerdo</span></div>
        <label htmlFor="logo-vertical">Posição vertical</label>
        <input id="logo-vertical" type="range" min="-0.03" max="0.03" step="0.001" value={snap.logoOffsetY}
          aria-valuetext={snap.logoOffsetY === 0 ? 'Altura padrão' : snap.logoOffsetY > 0 ? 'Acima da altura padrão' : 'Abaixo da altura padrão'}
          onChange={(event) => { state.logoOffsetY = Number(event.target.value); }} />
        <div className="logo-range-hints"><span>Baixo</span><span>Cima</span></div>
        <button onClick={() => { state.logoScale = 1; state.logoOffsetX = 0; state.logoOffsetY = 0; }}>Restaurar ajustes do logo</button>
      </div>
    </fieldset>}
    {loading && <p role="status">Preparando imagem…</p>}
    {image && <div className="image-draft">
      <img className="image-preview" src={image} alt="Prévia da imagem escolhida" />
      <p className="image-filename" title={filename}>{filename}</p>
      <fieldset>
        <legend>Aplicar como</legend>
        <div className="image-placement">
          <label><input type="radio" name="placement" value="logo" checked={placement === 'logo'} onChange={() => setPlacement('logo')} /> Logo</label>
          <label><input type="radio" name="placement" value="full" checked={placement === 'full'} onChange={() => setPlacement('full')} /> Estampa</label>
        </div>
      </fieldset>
      <button className="image-apply" disabled={loading} onClick={apply}>Aplicar imagem</button>
      <button className="image-cancel" disabled={loading} onClick={() => setImage('')}>Cancelar</button>
    </div>}
    {error && <p role="alert">{error}</p>}
    <p className="image-status" role="status">{message}</p>
    {(snap.isLogoTexture || snap.isFullTexture) && <div className="applied-images">
      <strong className="text-xs">No produto</strong>
      {[{ name: 'Logo', target: 'logo', visible: 'isLogoTexture', decal: 'logoDecal' },
        { name: 'Estampa', target: 'full', visible: 'isFullTexture', decal: 'fullDecal' }].map((item) => snap[item.visible] &&
        <div className="applied-image" key={item.target}>
          <img src={snap[item.decal]} alt={`${item.name} aplicado`} />
          <div><strong>{item.name}</strong><div className="applied-image-actions">
            <button disabled={loading} aria-label={`Trocar ${item.name.toLowerCase()}`} onClick={() => { setPlacement(item.target); inputRef.current?.click(); }}>Trocar</button>
            <button aria-label={`Remover ${item.name.toLowerCase()}`} onClick={() => { state[item.visible] = false; setMessage(`${item.name} removido.`); }}>Remover</button>
          </div></div>
        </div>)}
    </div>}
  </div>;
}
