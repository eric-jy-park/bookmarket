import React from "react";

export const useVanishingInput = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const newDataRef = React.useRef<
    Array<{ x: number; y: number; r: number; color: string }>
  >([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [canvasValue, setCanvasValue] = React.useState("");
  const [animating, setAnimating] = React.useState(false);

  const draw = React.useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    canvas.width = inputRect.width;
    canvas.height = inputRect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(canvasValue, 32, canvas.height / 2 + fontSize / 3);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;
    const newData: Array<{ x: number; y: number; color: number[] }> = [];

    for (let y = 0; y < canvas.height; y++) {
      const i = 4 * y * canvas.width;
      for (let x = 0; x < canvas.width; x++) {
        const e = i + 4 * x;
        if (
          pixelData[e] !== 0 ||
          pixelData[e + 1] !== 0 ||
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x,
            y,
            color: [
              pixelData[e]!,
              pixelData[e + 1]!,
              pixelData[e + 2]!,
              pixelData[e + 3]!,
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [canvasValue]);

  React.useEffect(() => {
    draw();
  }, [canvasValue, draw]);

  const animate = (start: number) => {
    const animateFrame = (pos = 0) => {
      requestAnimationFrame(() => {
        const newArr: Array<{
          x: number;
          y: number;
          r: number;
          color: string;
        }> = [];
        for (const current of newDataRef.current) {
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, ctx.canvas.width, ctx.canvas.height);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 1.5);
        } else {
          setCanvasValue("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  const vanishAndSubmit = () => {
    setAnimating(true);
    draw();

    const value = inputRef.current?.value ?? "";
    if (value && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0,
      );
      animate(maxX);
    }
  };

  return {
    canvasRef,
    inputRef,
    canvasValue,
    setCanvasValue,
    animating,
    vanishAndSubmit,
  };
};
