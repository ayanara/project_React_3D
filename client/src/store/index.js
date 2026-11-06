import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  product: 'shirt',
  color: '#EFBD48',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './cute_shiba.png',
  logoPosition: 'center',
  fullDecal: './cute_shiba.png',
});

export default state;
