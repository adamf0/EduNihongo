import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { KanjiVG, type StrokeData as KvgStrokeData } from "kanjivg-js";

interface DrawingCanvasProps {
  kanji?: string;
  showGuide?: boolean;
  strokeColor?: string;
  lineWidth?: number;
}

export interface DrawingCanvasRef {
  clear: () => void;
  undo: () => void;
  getImage: () => string | null;
  getGoogleOcrText: () => Promise<string | null>;
  validateStrokeOrder: () => {
    isCorrect: boolean;
    correctCount: number;
    totalStrokes: number;
    accuracy: number;
    incorrectStrokes: number[];
  } | null;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
}

interface TemplateStroke {
  id: string;
  pathData: string;
  points: Point[];
  normalizedPoints: Point[];
}

const kv = new KanjiVG();



// Parse SVG path data to points list ($)
const parseSvgPath = (d: string): Point[] => {
  const points: Point[] = [];
  const commands = d.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi);
  if (!commands) return points;

  let n = 0;
  let s = 0;
  let c = 0;
  let i = 0;

  for (const cmd of commands) {
    const type = cmd[0];
    const argsMatch = cmd.slice(1).match(/[-+]?[0-9]*\.?[0-9]+/g);
    const args = argsMatch ? argsMatch.map(Number) : [];

    switch (type.toUpperCase()) {
      case "M":
        if (type === "M") {
          n = args[0];
          s = args[1];
        } else {
          n += args[0];
          s += args[1];
        }
        c = n;
        i = s;
        points.push({ x: n, y: s });
        break;
      case "L":
        if (type === "L") {
          n = args[0];
          s = args[1];
        } else {
          n += args[0];
          s += args[1];
        }
        points.push({ x: n, y: s });
        break;
      case "H":
        n = type === "H" ? args[0] : n + args[0];
        points.push({ x: n, y: s });
        break;
      case "V":
        s = type === "V" ? args[0] : s + args[0];
        points.push({ x: n, y: s });
        break;
      case "C":
        for (let idx = 0; idx < args.length && !(idx + 5 >= args.length); idx += 6) {
          const k = n;
          const v = s;
          let dX, dY, pX, pY, uX, uY;

          if (type === "C") {
            dX = args[idx];
            dY = args[idx + 1];
            pX = args[idx + 2];
            pY = args[idx + 3];
            uX = args[idx + 4];
            uY = args[idx + 5];
          } else {
            dX = n + args[idx];
            dY = s + args[idx + 1];
            pX = n + args[idx + 2];
            pY = s + args[idx + 3];
            uX = n + args[idx + 4];
            uY = s + args[idx + 5];
          }

          n = uX;
          s = uY;

          const steps = 15;
          for (let step = 1; step <= steps; step++) {
            const tVal = step / steps;
            const pt = interpolateBezier(k, v, dX, dY, pX, pY, uX, uY, tVal);
            points.push(pt);
          }
        }
        break;
      case "Z":
        if (n !== c || s !== i) {
          points.push({ x: c, y: i });
        }
        n = c;
        s = i;
        break;
    }
  }
  return points;
};

// Interpolate cubic bezier curve (I)
const interpolateBezier = (
  h: number,
  t: number,
  e: number,
  n: number,
  s: number,
  c: number,
  i: number,
  o: number,
  a: number
): Point => {
  const r = 1 - a;
  const l = r * r;
  const d = l * r;
  const m = a * a;
  const p = m * a;
  return {
    x: d * h + 3 * l * a * e + 3 * r * m * s + p * i,
    y: d * t + 3 * l * a * n + 3 * r * m * c + p * o,
  };
};

// Normalize points to [0, 1] scale (B)
const normalizePoints = (points: Point[], scale: number): Point[] => {
  return points.length === 0 ? [] : points.map(p => ({
    x: p.x / scale,
    y: p.y / scale
  }));
};

// Normalize user drawn points to [0, 1] scale (D)
const normalizeUserPoints = (stroke: Stroke, scale: number): Point[] => {
  return stroke.points.length === 0 ? [] : stroke.points.map(p => ({
    x: p.x / scale,
    y: p.y / scale
  }));
};

// Calculate distance between two points (E)
const distanceBetweenPoints = (p1: Point, p2: Point): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Resample a path to N equally spaced points (C)
const resamplePoints = (points: Point[], numPoints: number): Point[] => {
  if (points.length < 2 || numPoints < 2) return points;
  let totalDist = 0;
  const distances = [0];

  for (let a = 1; a < points.length; a++) {
    const dist = distanceBetweenPoints(points[a - 1], points[a]);
    totalDist += dist;
    distances.push(totalDist);
  }

  if (totalDist === 0) return points;

  const resampled: Point[] = [points[0]];
  const stepSize = totalDist / (numPoints - 1);
  let currentPos = stepSize;
  let ptr = 0;

  for (let a = 1; a < numPoints - 1; a++) {
    while (ptr < points.length - 1 && distances[ptr + 1] < currentPos) {
      ptr++;
    }
    if (ptr >= points.length - 1) break;
    const distStart = distances[ptr];
    const segmentLen = distances[ptr + 1] - distStart;

    if (segmentLen === 0) {
      resampled.push(points[ptr]);
    } else {
      const ratio = (currentPos - distStart) / segmentLen;
      const startPt = points[ptr];
      const endPt = points[ptr + 1];
      resampled.push({
        x: startPt.x + (endPt.x - startPt.x) * ratio,
        y: startPt.y + (endPt.y - startPt.y) * ratio,
      });
    }
    currentPos += stepSize;
  }
  resampled.push(points[points.length - 1]);
  return resampled;
};

// Compare single user stroke to guide template stroke (T)
const compareSingleStroke = (
  userStroke: Stroke,
  tempStroke: TemplateStroke,
  canvasWidth: number
): number => {
  const userNorm = normalizeUserPoints(userStroke, canvasWidth);
  const tempNorm = tempStroke.normalizedPoints;

  if (userNorm.length < 2 || tempNorm.length < 2) return 0;

  const resampleCount = 32;
  const userResampled = resamplePoints(userNorm, resampleCount);
  const tempResampled = resamplePoints(tempNorm, resampleCount);

  const startDist = distanceBetweenPoints(userResampled[0], tempResampled[0]);
  const startScore = Math.max(0, 1 - startDist * 5);

  const endDist = distanceBetweenPoints(
    userResampled[userResampled.length - 1],
    tempResampled[tempResampled.length - 1]
  );
  const endScore = Math.max(0, 1 - endDist * 3);

  let sumDist = 0;
  for (let b = 0; b < resampleCount; b++) {
    sumDist += distanceBetweenPoints(userResampled[b], tempResampled[b]);
  }
  const avgDist = sumDist / resampleCount;
  const pathScore = Math.max(0, 1 - avgDist * 3);

  const userDx = userResampled[userResampled.length - 1].x - userResampled[0].x;
  const userDy = userResampled[userResampled.length - 1].y - userResampled[0].y;
  const userAngle = Math.atan2(userDy, userDx);

  const tempDx = tempResampled[tempResampled.length - 1].x - tempResampled[0].x;
  const tempDy = tempResampled[tempResampled.length - 1].y - tempResampled[0].y;
  const tempAngle = Math.atan2(tempDy, tempDx);

  let angleDiff = Math.abs(userAngle - tempAngle);
  if (angleDiff > Math.PI) {
    angleDiff = 2 * Math.PI - angleDiff;
  }
  const directionScore = Math.max(0, 1 - angleDiff / Math.PI);

  const finalScore =
    startScore * 0.4 +
    pathScore * 0.35 +
    directionScore * 0.15 +
    endScore * 0.1;

  return Math.max(0, Math.min(1, finalScore));
};

// Validate all strokes (W)
const validateStrokes = (
  userStrokes: Stroke[],
  tempStrokes: TemplateStroke[],
  canvasWidth: number,
  threshold = 0.45
) => {
  if (userStrokes.length === 0 || tempStrokes.length === 0) {
    return {
      isCorrect: false,
      correctCount: 0,
      totalStrokes: Math.max(userStrokes.length, tempStrokes.length),
      accuracy: 0,
      incorrectStrokes: [] as number[],
    };
  }

  let correctCount = 0;
  const incorrectStrokes: number[] = [];
  const minLen = Math.min(userStrokes.length, tempStrokes.length);

  for (let r = 0; r < minLen; r++) {
    const score = compareSingleStroke(userStrokes[r], tempStrokes[r], canvasWidth);
    if (score >= threshold) {
      correctCount++;
    } else {
      incorrectStrokes.push(r + 1);
    }
  }

  if (userStrokes.length !== tempStrokes.length) {
    for (let r = minLen; r < Math.max(userStrokes.length, tempStrokes.length); r++) {
      incorrectStrokes.push(r + 1);
    }
  }

  const accuracyRatio = tempStrokes.length > 0 ? correctCount / tempStrokes.length : 0;

  return {
    isCorrect: accuracyRatio >= 0.8 && userStrokes.length === tempStrokes.length,
    correctCount,
    totalStrokes: tempStrokes.length,
    accuracy: Math.round(accuracyRatio * 100),
    incorrectStrokes,
  };
};

// Simple moving average stroke smoothing
const smoothStroke = (points: Point[]): Point[] => {
  if (points.length < 3) return points;
  const smoothed: Point[] = [];
  smoothed.push(points[0]);
  for (let n = 1; n < points.length - 1; n++) {
    const prev = points[n - 1];
    const curr = points[n];
    const next = points[n + 1];
    const sx = (prev.x + curr.x + next.x) / 3;
    const sy = (prev.y + curr.y + next.y) / 3;
    smoothed.push({ x: sx, y: sy });
  }
  smoothed.push(points[points.length - 1]);
  return smoothed;
};

export const DrawingCanvas = forwardRef<
  DrawingCanvasRef,
  DrawingCanvasProps
>(({ kanji, showGuide = true, strokeColor = "#0f172a", lineWidth }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [guideStrokes, setGuideStrokes] = useState<KvgStrokeData[]>([]);

  // Keep track of user drawing strokes
  const strokesRef = useRef<Stroke[]>([]);
  // Keep track of coordinates of current active stroke
  const activeStrokeRef = useRef<Point[]>([]);

  const defaultLineWidth = window.innerWidth <= 768 ? 8.5 : 12;
  const currentLineWidth = lineWidth || defaultLineWidth;

  // Load guide strokes from KanjiVG
  useEffect(() => {
    if (!kanji) return;
    const loadGuide = async () => {
      try {
        const result = await kv.getKanji(kanji);
        if (result && result.length > 0) {
          setGuideStrokes(result[0].strokes);
        }
      } catch (e) {
        console.error("Failed to load kanji guide outline:", e);
      }
    };
    loadGuide();
  }, [kanji]);

  // Redraw loop
  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = currentLineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 1. Draw completed strokes
    strokesRef.current.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      if (stroke.points.length === 2) {
        ctx.lineTo(stroke.points[1].x, stroke.points[1].y);
      } else {
        for (let s = 1; s < stroke.points.length - 1; s++) {
          const c = stroke.points[s];
          const next = stroke.points[s + 1];
          const r = (c.x + next.x) / 2;
          const l = (c.y + next.y) / 2;
          ctx.quadraticCurveTo(c.x, c.y, r, l);
        }
        const last = stroke.points[stroke.points.length - 1];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();

    });

    // 2. Draw active drawing stroke
    if (activeStrokeRef.current.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(activeStrokeRef.current[0].x, activeStrokeRef.current[0].y);
      for (let s = 1; s < activeStrokeRef.current.length; s++) {
        ctx.lineTo(activeStrokeRef.current[s].x, activeStrokeRef.current[s].y);
      }
      ctx.stroke();
    } else if (activeStrokeRef.current.length === 1) {
      // Draw single point dot
      ctx.beginPath();
      ctx.arc(activeStrokeRef.current[0].x, activeStrokeRef.current[0].y, currentLineWidth / 2, 0, 2 * Math.PI);
      ctx.fillStyle = strokeColor;
      ctx.fill();
    }

    ctx.restore();
  };

  useImperativeHandle(ref, () => ({
    clear: () => {
      strokesRef.current = [];
      activeStrokeRef.current = [];
      redraw();
    },

    undo: () => {
      if (strokesRef.current.length > 0) {
        strokesRef.current.pop();
        redraw();
      }
    },

    getImage: () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      return canvas.toDataURL("image/png");
    },

    getGoogleOcrText: async () => {
      if (strokesRef.current.length === 0) return null;

      const canvas = canvasRef.current;
      if (!canvas) return null;

      // Transform internal Ref strokes to Google handwriting stroke structure
      const googleStrokes = strokesRef.current.map((stroke) => {
        const xCoords: number[] = [];
        const yCoords: number[] = [];
        const tCoords: number[] = [];

        stroke.points.forEach((p, index) => {
          xCoords.push(Math.round(p.x));
          yCoords.push(Math.round(p.y));
          tCoords.push(index * 20);
        });

        return [xCoords, yCoords, tCoords] as [number[], number[], number[]];
      });

      const payload = {
        app: "demopage",
        device: "desktop",
        input_type: "0",
        languages: ["ja"],
        requests: [
          {
            writing_guide: {
              width: canvas.width,
              height: canvas.height,
            },
            stroke: googleStrokes,
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
        if (data[0] === "SUCCESS" && data[1]?.[0]?.[1]?.[0]) {
          return data[1][0][1][0];
        }
        return null;
      } catch (error) {
        console.error("Google Handwriting API Error:", error);
        return null;
      }
    },

    validateStrokeOrder: () => {
      const canvas = canvasRef.current;
      if (!canvas || !kanji) return null;

      // Build template strokes
      const tempStrokes = guideStrokes.map((stroke, idx) => {
        const parsedPoints = parseSvgPath(stroke.path);
        return {
          id: `yunbi-${idx + 1}`,
          pathData: stroke.path,
          points: parsedPoints,
          normalizedPoints: normalizePoints(parsedPoints, 109)
        };
      });

      // Compare strokes using 0.45 score threshold
      return validateStrokes(strokesRef.current, tempStrokes, canvas.width, 0.45);
    }
  }));

  // Canvas size and resize setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctxRef.current = ctx;
      redraw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [strokeColor, currentLineWidth]);

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

    setIsDrawing(true);
    activeStrokeRef.current = [coords];
    redraw();
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

    activeStrokeRef.current.push(coords);
    redraw();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    if (activeStrokeRef.current.length > 0) {
      const smoothed = smoothStroke(activeStrokeRef.current);
      strokesRef.current.push({ points: smoothed });
      activeStrokeRef.current = [];
      redraw();
    }
  };

  return (
    <div className="w-full h-full relative bg-transparent select-none">
      {/* Dashed Crosshair Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeDasharray="4,4"
        />
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeDasharray="4,4"
        />
      </svg>

      {showGuide && guideStrokes.length > 0 && (
        <svg
          viewBox="0 0 109 109"
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          {/* Guide strokes */}
          {guideStrokes.map((stroke) => (
            <path
              key={stroke.strokeNumber}
              d={stroke.path}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
            />
          ))}
        </svg>
      )}

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="absolute inset-0 w-full h-full z-10 touch-none cursor-crosshair bg-transparent"
      />
    </div>
  );
});

DrawingCanvas.displayName = "DrawingCanvas";

export default DrawingCanvas;