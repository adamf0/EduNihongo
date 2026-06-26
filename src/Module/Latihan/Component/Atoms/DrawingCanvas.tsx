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
  getGoogleOcrText: () => Promise<string | null>;
}

// Struktur data stroke untuk Google Input Tools API
// Format: [[[x1, x2, ...], [y1, y2, ...], [t1, t2, ...]], [stroke2], ...]
type StrokeData = [number[], number[], number[]];

export const DrawingCanvas = forwardRef<
  DrawingCanvasRef,
  DrawingCanvasProps
>(({ strokeColor = "#2D486D", lineWidth = 5 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);

  // Menggunakan useRef untuk menyimpan state gambar dan koordinat agar selalu sinkron secara real-time
  const historyRef = useRef<ImageData[]>([]);
  const strokesRef = useRef<StrokeData[]>([]);
  const currentStrokeRef = useRef<StrokeData | null>(null);
  const strokeHistoryRef = useRef<StrokeData[][]>([]);

  const saveState = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;

    // Simpan gambar canvas untuk undo
    historyRef.current.push(
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    );
    
    // Simpan salinan mendalam (deep copy) koordinat stroke saat ini untuk undo
    strokeHistoryRef.current.push(JSON.parse(JSON.stringify(strokesRef.current)));
  };

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Bersihkan semua histori data
      historyRef.current = [];
      strokesRef.current = [];
      strokeHistoryRef.current = [];
    },

    undo: () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      if (!canvas || !ctx) return;

      if (historyRef.current.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokesRef.current = [];
        return;
      }

      // Kembalikan histori gambar
      historyRef.current.pop();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const previousImage = historyRef.current[historyRef.current.length - 1];
      if (previousImage) {
        ctx.putImageData(previousImage, 0, 0);
      }

      // Kembalikan histori data stroke koordinat
      const previousStrokes = strokeHistoryRef.current.pop();
      strokesRef.current = previousStrokes || [];
    },

    getImage: () => {
      const canvas = canvasRef.current;

      if (!canvas) return null;

      return canvas.toDataURL("image/png");
    },

    getGoogleOcrText: async () => {
      // Validasi jika user belum menulis apa pun di canvas
      if (strokesRef.current.length === 0) return null;

      const canvas = canvasRef.current;
      if (!canvas) return null;

      const payload = {
        app: "demopage",
        device: "desktop",
        input_type: "0",
        languages: ["ja"], // Mengunci target ke bahasa Jepang
        requests: [
          {
            writing_guide: {
              width: canvas.width,
              height: canvas.height,
            },
            stroke: strokesRef.current,
          },
        ],
      };

      try {
        const response = await fetch(
          "https://www.google.com/inputtools/request?ime=handwriting&app=autotrack",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        // Mengambil kandidat kata pertama/terbaik dari Google
        if (data[0] === "SUCCESS" && data[1]?.[0]?.[1]?.[0]) {
          return data[1][0][1][0];
        }
        return null;
      } catch (error) {
        console.error("Google Handwriting API Error:", error);
        return null;
      }
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

    return () => window.removeEventListener("resize", resize);
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

    // Mulai merekam goresan stroke baru (dibulatkan menjadi Integer agar JSON bersih)
    currentStrokeRef.current = [
      [Math.round(coords.x)],
      [Math.round(coords.y)],
      [Date.now()],
    ];

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

    // Masukkan koordinat baru ke baris goresan aktif saat ini
    if (currentStrokeRef.current) {
      currentStrokeRef.current[0].push(Math.round(coords.x));
      currentStrokeRef.current[1].push(Math.round(coords.y));
      currentStrokeRef.current[2].push(Date.now());
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    const ctx = ctxRef.current;

    if (ctx) {
      ctx.closePath();
    }

    // Dorong goresan yang sudah selesai ke penampung utama strokesRef
    if (currentStrokeRef.current) {
      strokesRef.current.push(currentStrokeRef.current);
      currentStrokeRef.current = null;
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