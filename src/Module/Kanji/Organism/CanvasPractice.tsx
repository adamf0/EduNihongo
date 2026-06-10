import React, { useRef, useEffect, useState } from "react";
import Icon from "../Atoms/Icon";
import Button from "../Atoms/Button";
import StrokeBox from "../Atoms/StrokeBox";

// Target coordinate paths for accuracy calculations (percentage based on 100x100 grid)
const STROKE_PATHS = [
    // Stroke 1: 亅 (vertical with hook)
    [
        { x: 50, y: 15 },
        { x: 50, y: 30 },
        { x: 50, y: 50 },
        { x: 50, y: 70 },
        { x: 50, y: 85 },
        { x: 42, y: 75 },
    ],
    // Stroke 2: フ (left diagonal)
    [
        { x: 20, y: 35 },
        { x: 35, y: 35 },
        { x: 48, y: 35 },
        { x: 35, y: 45 },
        { x: 20, y: 55 },
    ],
    // Stroke 3: 丿 (right slant left)
    [
        { x: 75, y: 25 },
        { x: 68, y: 32 },
        { x: 60, y: 40 },
        { x: 52, y: 48 },
    ],
    // Stroke 4: 乀 (right slant right)
    [
        { x: 55, y: 52 },
        { x: 65, y: 60 },
        { x: 75, y: 70 },
        { x: 85, y: 80 },
    ],
];

// Flattened template points for accuracy checks
const TEMPLATE_POINTS = STROKE_PATHS.flat();

interface CanvasPracticeProps {
    kanjiChar: string;
    strokes: string[];
    onSavePractice?: (accuracy: number) => void;
}

export const CanvasPractice: React.FC<CanvasPracticeProps> = ({
    kanjiChar,
    strokes,
    onSavePractice,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const userPointsRef = useRef<{ x: number; y: number }[]>([]);

    const [isSaved, setIsSaved] = useState(false);
    const [accuracy, setAccuracy] = useState<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (rect && rect.width > 0 && rect.height > 0) {
                const newWidth = Math.round(rect.width);
                const newHeight = Math.round(rect.height);
                if (canvas.width !== newWidth || canvas.height !== newHeight) {
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                }
                ctx.lineWidth = 10;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.strokeStyle = "#02021a";
            }
        };

        resize();
        window.addEventListener("resize", resize);

        let drawing = false;

        const startDraw = (e: MouseEvent | TouchEvent) => {
            drawing = true;
            draw(e);
        };

        const endDraw = () => {
            drawing = false;
            ctx.beginPath();
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!drawing) return;
            const rect = canvas.getBoundingClientRect();
            let clientX = 0;
            let clientY = 0;

            if ("touches" in e) {
                if (e.touches.length === 0) return;
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            // Track coordinates in ref for lag-free calculations
            userPointsRef.current.push({ x, y });

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            startDraw(e);
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            draw(e);
        };

        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener("mouseup", endDraw);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseleave", endDraw);

        canvas.addEventListener("touchstart", handleTouchStart, {
            passive: false,
        });
        canvas.addEventListener("touchend", endDraw);
        canvas.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });

        return () => {
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("mousedown", startDraw);
            canvas.removeEventListener("mouseup", endDraw);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseleave", endDraw);
            canvas.removeEventListener("touchstart", handleTouchStart);
            canvas.removeEventListener("touchend", endDraw);
            canvas.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        userPointsRef.current = [];
        setIsSaved(false);
        setAccuracy(null);
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();

        const canvas = canvasRef.current;
        if (!canvas) return;
        const W = canvas.width;
        const H = canvas.height;
        const userPoints = userPointsRef.current;

        // If user drew almost nothing
        if (userPoints.length < 5) {
            alert("Silakan tulis Kanji terlebih dahulu pada kanvas!");
            return;
        }

        // Convert points to 0-100 grid
        const normalizedUser = userPoints.map((p) => ({
            x: (p.x / W) * 100,
            y: (p.y / H) * 100,
        }));

        // Distance checks
        let totalDistance = 0;
        TEMPLATE_POINTS.forEach((t) => {
            let minDistance = Infinity;
            normalizedUser.forEach((u) => {
                const dx = u.x - t.x;
                const dy = u.y - t.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDistance) {
                    minDistance = dist;
                }
            });
            totalDistance += minDistance;
        });

        const averageDistance = totalDistance / TEMPLATE_POINTS.length;
        const computedAccuracy = Math.max(
            0,
            Math.min(100, Math.round(100 - averageDistance * 2.5)),
        );

        setAccuracy(computedAccuracy);

        if (computedAccuracy < 75) {
            alert(
                `Akurasi kemiripan goresan Anda: ${computedAccuracy}%. Kurang dari batas minimal 75%, silakan coba lagi!`,
            );
            setIsSaved(false);
        } else {
            setIsSaved(true);
            if (onSavePractice) {
                onSavePractice(computedAccuracy);
            }
        }
    };

    return (
        <section className="bg-white rounded-xl p-8 custom-shadow border border-outline-variant/30">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                    <h4 className="font-bold text-lg text-primary text-on-surface">
                        Latihan Menulis
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                        Ikuti garis panduan untuk melatih memori otot.
                    </p>
                </div>
                <div className="flex gap-2">
                    {!isSaved && (
                        <Button
                            onClick={handleClear}
                            className="flex items-center gap-2 border border-outline-variant px-4 py-2 rounded-lg text-on-surface hover:bg-surface-container transition-all"
                        >
                            <Icon name="delete" className="text-sm block" />
                            Hapus
                        </Button>
                    )}

                    {isSaved ? (
                        <div className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold select-none shadow-sm">
                            <Icon
                                name="check_circle"
                                className="text-sm block text-white"
                            />
                            Hasil ({accuracy}%)
                        </div>
                    ) : (
                        <Button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-bold"
                        >
                            <Icon
                                name="save"
                                className="text-sm block text-white"
                            />
                            Simpan
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Canvas Writing Practice */}
                <div className="kanji-canvas-grid w-full aspect-square rounded-xl border-2 border-outline-variant relative cursor-crosshair overflow-hidden bg-surface-container-lowest @container">
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none select-none">
                        <span className="font-jp text-[70cqw] text-on-surface">
                            {kanjiChar}
                        </span>
                    </div>
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full z-10"
                    ></canvas>
                </div>

                {/* Stroke Guides Order panel */}
                <div className="space-y-6 flex flex-col justify-center">
                    <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
                        <h5 className="text-xs font-bold uppercase text-on-surface-variant mb-4">
                            Urutan Goresan ({strokes.length} Goresan)
                        </h5>
                        <div className="flex flex-wrap gap-3">
                            {strokes.map((stroke, index) => {
                                const strokeNum = index + 1;
                                return (
                                    <StrokeBox
                                        key={index}
                                        index={strokeNum}
                                        stroke={stroke}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CanvasPractice;
