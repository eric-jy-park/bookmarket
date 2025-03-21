export const randomAlphaStringGenerator = (length: number) =>
  Array.from({ length }, () => {
    const charType = Math.floor(Math.random() * 2);
    if (charType === 0) {
      return String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }).join('');
