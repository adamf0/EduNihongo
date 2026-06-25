import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

interface DrawingCanvasProps {
  strokeColor?: string;
  lineWidth?: number;
}

export interface DrawingCanvasRef {
  clear: () => void;
  undo: () => void;
  getImage: () => string | null;
}

export const DrawingCanvas = forwardRef<
  DrawingCanvasRef,
  DrawingCanvasProps
>(({ strokeColor = "#2D486D", lineWidth = 5 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const historyRef = useRef<ImageData[]>([]);

  const saveState = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;

    historyRef.current.push(
      ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      )
    );
  };

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      if (!canvas || !ctx) return;

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      historyRef.current = [];
    },

    undo: () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      if (!canvas || !ctx) return;

      if (historyRef.current.length === 0) {
        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );
        return;
      }

      historyRef.current.pop();

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const previous =
        historyRef.current[
          historyRef.current.length - 1
        ];

      if (previous) {
        ctx.putImageData(previous, 0, 0);
      }
    },

    getImage: () => {
      const canvas = canvasRef.current;

      if (!canvas) return null;

      return canvas.toDataURL("image/png");
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;

      if (!parent) return;

      const oldImage = canvas.toDataURL();

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = strokeColor;

      ctxRef.current = ctx;

      const img = new Image();

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };

      img.src = oldImage;
    };

    resize();

    window.addEventListener("resize", resize);

    return () =>
      window.removeEventListener("resize", resize);
  }, [strokeColor, lineWidth]);

  const getCoordinates = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;

      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const coords = getCoordinates(e);

    if (!coords) return;

    saveState();

    const ctx = ctxRef.current;

    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    setIsDrawing(true);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    e.preventDefault();

    const coords = getCoordinates(e);

    if (!coords) return;

    const ctx = ctxRef.current;

    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    const ctx = ctxRef.current;

    if (ctx) {
      ctx.closePath();
    }
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 kanji-canvas-grid pointer-events-none rounded-lg overflow-hidden" />

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="absolute inset-0 w-full h-full rounded-lg z-10 touch-none cursor-crosshair"
      />
    </div>
  );
});

DrawingCanvas.displayName = "DrawingCanvas";

export default DrawingCanvas;