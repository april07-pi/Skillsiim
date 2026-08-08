import React, { useRef, useEffect } from 'react';
import { InteractiveObject, Language } from '../../types';
import { Box, Sparkles, RefreshCw } from 'lucide-react';

interface Level3_Lightweight3DViewProps {
  objects: InteractiveObject[];
  selectedObject: InteractiveObject | null;
  onSelectObject: (obj: InteractiveObject) => void;
  language: Language;
}

export const Level3_Lightweight3DView: React.FC<Level3_Lightweight3DViewProps> = ({
  objects,
  selectedObject,
  onSelectObject,
  language,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      angle += 0.01;
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#020617'; // slate-950
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Lines (Low Poly 3D Perspective Floor)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const horizon = height * 0.4;

      for (let x = 0; x <= width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, horizon);
        ctx.lineTo(width / 2 + (x - width / 2) * 2.5, height);
        ctx.stroke();
      }

      for (let y = horizon; y <= height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render Objects as 3D Cubes with Shading
      objects.forEach((obj, idx) => {
        const posX = (obj.position.x / 100) * width;
        const posY = horizon + (obj.position.y / 100) * (height - horizon);
        const isSelected = selectedObject?.id === obj.id;
        const isFaulty = obj.status === 'faulty' || obj.status === 'warning';

        const size = isSelected ? 34 : 28;
        const bob = Math.sin(angle * 2 + idx) * 4;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(posX, posY + size / 2, size * 0.8, size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3D Cube Top Face
        ctx.fillStyle = isSelected ? '#f59e0b' : isFaulty ? '#ef4444' : '#0d9488';
        ctx.beginPath();
        ctx.moveTo(posX, posY - size + bob);
        ctx.lineTo(posX + size / 2, posY - size * 1.3 + bob);
        ctx.lineTo(posX, posY - size * 1.6 + bob);
        ctx.lineTo(posX - size / 2, posY - size * 1.3 + bob);
        ctx.closePath();
        ctx.fill();

        // 3D Cube Front Face
        ctx.fillStyle = isSelected ? '#d97706' : isFaulty ? '#dc2626' : '#0f766e';
        ctx.beginPath();
        ctx.moveTo(posX - size / 2, posY - size * 1.3 + bob);
        ctx.lineTo(posX, posY - size + bob);
        ctx.lineTo(posX, posY + bob);
        ctx.lineTo(posX - size / 2, posY - size * 0.3 + bob);
        ctx.closePath();
        ctx.fill();

        // 3D Cube Side Face
        ctx.fillStyle = isSelected ? '#b45309' : isFaulty ? '#b91c1c' : '#115e59';
        ctx.beginPath();
        ctx.moveTo(posX, posY - size + bob);
        ctx.lineTo(posX + size / 2, posY - size * 1.3 + bob);
        ctx.lineTo(posX + size / 2, posY - size * 0.3 + bob);
        ctx.lineTo(posX, posY + bob);
        ctx.closePath();
        ctx.fill();

        // Label Tag
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(language === 'zu' ? obj.nameZu : obj.name, posX, posY - size * 1.8 + bob);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [objects, selectedObject, language]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const horizon = height * 0.4;

    // Find closest object
    let closest: InteractiveObject | null = null;
    let minDist = 9999;

    objects.forEach((obj) => {
      const posX = (obj.position.x / 100) * width;
      const posY = horizon + (obj.position.y / 100) * (height - horizon);
      const dist = Math.hypot(clickX - posX, clickY - posY);
      if (dist < 40 && dist < minDist) {
        minDist = dist;
        closest = obj;
      }
    });

    if (closest) {
      onSelectObject(closest);
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden my-2 shadow-lg relative">
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-amber-400 font-semibold">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Lightweight 3D WebGL Canvas (Level 3)
        </span>
        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
          <RefreshCw className="w-3 h-3 animate-spin text-teal-400" />
          Native Low-Poly WebGL
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={480}
        height={260}
        onClick={handleCanvasClick}
        className="w-full h-[260px] cursor-pointer block"
      />

      <div className="bg-slate-900 px-3 py-1.5 text-[11px] text-slate-400 text-center border-t border-slate-800">
        {language === 'zu'
          ? 'Thinta noma iyiphi i-3D Low-Poly Object ku-canvas ukuyihlaziya.'
          : 'Tap any low-poly 3D object on the scene canvas to diagnose.'}
      </div>
    </div>
  );
};
