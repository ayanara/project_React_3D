import { useSnapshot } from 'valtio';
import state from '../store';
export default function ColorPicker() {
  const { color } = useSnapshot(state);
  return <div className="editor-panel">
    <label htmlFor="product-color">Cor do produto</label>
    <input id="product-color" type="color" value={color}
      onChange={(event) => { state.color = event.target.value; }} />
    <span>{color.toUpperCase()}</span>
  </div>;
}
