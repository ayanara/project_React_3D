import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#EFBD48',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './cute_shiba.png',
  fullDecal: './cute_shiba.png',
});

export default state;