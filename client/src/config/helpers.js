export const downloadCanvasToImage = () => {
  const canvas = document.querySelector("canvas");
  if (!canvas || !canvas.width || !canvas.height) throw new Error('Canvas indisponível');
  const dataURL = canvas.toDataURL();
  const link = document.createElement("a");

  link.href = dataURL;
  link.download = "canvas.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const reader = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = () => reject(new Error('Falha na leitura do arquivo'));
    fileReader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Imagem inválida'));
      image.onload = () => {
        const ratio = Math.min(1, 1024 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * ratio));
        canvas.height = Math.max(1, Math.round(image.height * ratio));
        const context = canvas.getContext('2d');
        if (!context) return reject(new Error('Canvas indisponível'));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      image.src = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  });

export const getContrastingColor = (color) => {
  // Remove the '#' character if it exists
  const hex = color.replace("#", "");

  // Convert the hex string to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white depending on the brightness
  return brightness > 128 ? "black" : "white";
};
