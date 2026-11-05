import { useState } from 'react';
import { reader } from '../config/helpers';
import state from '../store';

export default function FilerPicker() {
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function selectFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage('');
    setError('');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError('Escolha uma imagem PNG, JPG ou WebP de até 5 MB.');
      return;
    }
    setLoading(true);
    try { setImage(await reader(file)); }
    catch { setError('Não foi possível abrir essa imagem.'); }
    finally { setLoading(false); }
  }
  function apply(full) {
    state[full ? 'fullDecal' : 'logoDecal'] = image;
    state[full ? 'isFullTexture' : 'isLogoTexture'] = true;
  }
  return <div className="editor-panel">
    <label className="filepicker-label" htmlFor="image-file">Escolher imagem</label>
    <input id="image-file" type="file" accept="image/png,image/jpeg,image/webp" onChange={selectFile} disabled={loading} />
    <p className="text-xs">PNG, JPG ou WebP, até 5 MB. Imagens grandes são reduzidas para o 3D.</p>
    {loading && <p role="status">Preparando imagem…</p>}
    {image && <img className="h-20 object-contain" src={image} alt="Prévia da estampa" />}
    {error && <p role="alert">{error}</p>}
    <button disabled={!image || loading} onClick={() => apply(false)}>Aplicar como logo</button>
    <button disabled={!image || loading} onClick={() => apply(true)}>Aplicar como estampa</button>
  </div>;
}
