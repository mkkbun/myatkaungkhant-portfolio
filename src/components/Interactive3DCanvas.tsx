import React, { useRef, useEffect, useState, useMemo } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Compass, 
  Activity, 
  Grid, 
  Zap,
  Globe,
  Sliders
} from "lucide-react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  color?: string;
}

interface Edge {
  a: number;
  b: number;
}

interface Interactive3DCanvasProps {
  colorPreset: {
    id: string;
    glowColor: string;
    textGrad: string;
  };
  colorMode?: "dark" | "light";
}

export default function Interactive3DCanvas({ colorPreset, colorMode = "dark" }: Interactive3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive properties
  const [shape, setShape] = useState<"torus" | "crystal" | "dna" | "wave">("torus");
  const [isRotating, setIsRotating] = useState(true);
  const [resolution, setResolution] = useState<number>(30); // scale fidelity
  const [modelScale, setModelScale] = useState<number>(1);
  const [nodeSize, setNodeSize] = useState<number>(2.5); // node size
  const [showWireframe, setShowWireframe] = useState(true);
  const [showNodes, setShowNodes] = useState(true);

  // Math Rotation variables
  const anglesRef = useRef({ x: 0.5, y: 0.8, z: 0.2 });
  const mouseStateRef = useRef({ isDragging: false, startX: 0, startY: 0 });
  const rotationVelocityRef = useRef({ x: 0.005, y: 0.006, z: 0.002 });

  // Handle color conversions based on selected system themes
  const activeColor = useMemo(() => {
    switch (colorPreset.id) {
      case "violet":
        return { primary: "168, 85, 247", secondary: "236, 72, 153" };
      case "emerald":
        return { primary: "16, 185, 129", secondary: "6, 182, 212" };
      case "amber":
        return { primary: "245, 158, 11", secondary: "249, 115, 22" };
      case "cyan":
      default:
        return { primary: "14, 165, 233", secondary: "99, 102, 241" };
    }
  }, [colorPreset]);

  // Compute 3D shapes mathematically
  const torusPoints = useMemo(() => {
    const pts: Point3D[] = [];
    const R = 85; // outer radius
    const r = 32; // inner tube radius
    
    // Generate Torus vertices
    for (let i = 0; i < resolution; i++) {
      const theta = (i / resolution) * Math.PI * 2;
      for (let j = 0; j < resolution; j++) {
        const phi = (j / resolution) * Math.PI * 2;
        
        const x = (R + r * Math.cos(phi)) * Math.cos(theta);
        const y = (R + r * Math.cos(phi)) * Math.sin(theta);
        const z = r * Math.sin(phi);
        
        // Dynamic shading color based on depth
        pts.push({ x, y, z });
      }
    }
    return pts;
  }, [resolution]);

  const torusEdges = useMemo(() => {
    const edges: Edge[] = [];
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const current = i * resolution + j;
        const nextTheta = ((i + 1) % resolution) * resolution + j;
        const nextPhi = i * resolution + ((j + 1) % resolution);
        
        edges.push({ a: current, b: nextTheta });
        edges.push({ a: current, b: nextPhi });
      }
    }
    return edges;
  }, [resolution]);

  // Crystal Double Nested Prism
  const crystalPoints = useMemo(() => {
    const pts: Point3D[] = [];
    
    // Core vertices for icosahedron mathematically calculated
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const scaleFactor = 75;
    
    const baseVertices = [
      { x: -1, y: phi, z: 0 },
      { x: 1, y: phi, z: 0 },
      { x: -1, y: -phi, z: 0 },
      { x: 1, y: -phi, z: 0 },
      
      { x: 0, y: -1, z: phi },
      { x: 0, y: 1, z: phi },
      { x: 0, y: -1, z: -phi },
      { x: 0, y: 1, z: -phi },
      
      { x: phi, y: 0, z: -1 },
      { x: phi, y: 0, z: 1 },
      { x: -phi, y: 0, z: -1 },
      { x: -phi, y: 0, z: 1 }
    ].map(v => ({ x: v.x * scaleFactor, y: v.y * scaleFactor, z: v.z * scaleFactor }));

    pts.push(...baseVertices);

    // Inner orbiting core
    baseVertices.forEach(v => {
      pts.push({ x: v.x * 0.4, y: v.y * 0.4, z: v.z * 0.4 });
    });

    return pts;
  }, []);

  const crystalEdges = useMemo(() => {
    const edges: Edge[] = [];
    const size = 12;

    // Detect closest neighbors to draft icosahedron wireframe lines
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        const p1 = crystalPoints[i];
        const p2 = crystalPoints[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
        if (dist < 185) { // Threshold for icosahedron bounds
          edges.push({ a: i, b: j });
          // Link matching inner core
          edges.push({ a: i + size, b: j + size });
        }
      }
    }

    // Connect outer shell to inner core to make a premium futuristic matrix
    for (let i = 0; i < size; i++) {
      edges.push({ a: i, b: i + size });
    }

    return edges;
  }, [crystalPoints]);

  // Dual Helix DNA model
  const dnaPoints = useMemo(() => {
    const pts: Point3D[] = [];
    const numPoints = 48;
    const heightRange = 160;
    const turns = 2.5;

    for (let i = 0; i < numPoints; i++) {
      const progress = i / numPoints;
      const angle = progress * turns * Math.PI * 2;
      const y = (progress - 0.5) * heightRange;
      
      // Helix 1
      const x1 = Math.cos(angle) * 48;
      const z1 = Math.sin(angle) * 48;
      pts.push({ x: x1, y, z: z1, color: "primary" });

      // Helix 2 (180deg out of phase)
      const x2 = Math.cos(angle + Math.PI) * 48;
      const z2 = Math.sin(angle + Math.PI) * 48;
      pts.push({ x: x2, y, z: z2, color: "secondary" });
    }
    return pts;
  }, []);

  const dnaEdges = useMemo(() => {
    const edges: Edge[] = [];
    const size = dnaPoints.length / 2;

    // Backbone edges
    for (let i = 0; i < size - 1; i++) {
      edges.push({ a: i * 2, b: (i + 1) * 2 }); // side a
      edges.push({ a: i * 2 + 1, b: (i + 1) * 2 + 1 }); // side b
    }

    // Horizontal ladder connections
    for (let i = 0; i < size; i += 2) {
      edges.push({ a: i * 2, b: i * 2 + 1 });
    }

    return edges;
  }, [dnaPoints]);

  // Wave Grid Wave Plane in 3D Space
  const wavePoints = useMemo(() => {
    const pts: Point3D[] = [];
    const gridSize = 12; // 12x12
    const spacing = 16;
    const startOffset = -((gridSize - 1) * spacing) / 2;

    for (let i = 0; i < gridSize; i++) {
      const xp = startOffset + i * spacing;
      for (let j = 0; j < gridSize; j++) {
        const zp = startOffset + j * spacing;
        
        // Standard resting height, perturbed dynamically in frame block
        pts.push({ x: xp, y: 0, z: zp });
      }
    }
    return pts;
  }, []);

  // Set drag controls for manual orbit
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!mouseStateRef.current.isDragging) return;
    
    const dx = e.clientX - mouseStateRef.current.startX;
    const dy = e.clientY - mouseStateRef.current.startY;
    
    // Transfer delta dragging relative offset to rotation angles
    anglesRef.current.y += dx * 0.008;
    anglesRef.current.x += dy * 0.008;
    
    mouseStateRef.current.startX = e.clientX;
    mouseStateRef.current.startY = e.clientY;
  };

  const handleMouseUp = () => {
    mouseStateRef.current.isDragging = false;
  };

  // Touch handlers for mobile/tablet orbit interaction
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      mouseStateRef.current = {
        isDragging: true,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!mouseStateRef.current.isDragging || e.touches.length !== 1) return;
    
    // Smooth touch delta drag calculation
    const dx = e.touches[0].clientX - mouseStateRef.current.startX;
    const dy = e.touches[0].clientY - mouseStateRef.current.startY;
    
    anglesRef.current.y += dx * 0.008;
    anglesRef.current.x += dy * 0.008;
    
    mouseStateRef.current.startX = e.touches[0].clientX;
    mouseStateRef.current.startY = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    mouseStateRef.current.isDragging = false;
  };

  // Canvas context drawer loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let waveTime = 0;

    const render = () => {
      // Clear with elegant translucent black to create premium fade trails
      ctx.fillStyle =
        colorMode === "light" ? "rgba(255, 255, 255, 0.55)" : "rgba(5, 5, 5, 0.45)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Update passive rotation if dynamic state is on
      if (isRotating && !mouseStateRef.current.isDragging) {
        anglesRef.current.x += rotationVelocityRef.current.x;
        anglesRef.current.y += rotationVelocityRef.current.y;
        anglesRef.current.z += rotationVelocityRef.current.z;
      }

      const rx = anglesRef.current.x;
      const ry = anglesRef.current.y;
      const rz = anglesRef.current.z;

      // Select points & edges according to live shape configuration state
      let activePts: Point3D[] = [];
      let activeEdges: Edge[] = [];

      switch (shape) {
        case "crystal":
          activePts = crystalPoints;
          activeEdges = crystalEdges;
          break;
        case "dna":
          activePts = dnaPoints;
          activeEdges = dnaEdges;
          break;
        case "wave":
          // Compute dynamic sine wave heights for wave plane
          waveTime += 0.04;
          activePts = wavePoints.map(p => {
            const distance = Math.hypot(p.x, p.z);
            const yOffset = Math.sin(distance * 0.05 - waveTime) * 18;
            return { ...p, y: yOffset };
          });
          // Connect edges of grid dynamic loop indices
          activeEdges = [];
          const gridSize = 12;
          for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
              const current = i * gridSize + j;
              if (i < gridSize - 1) activeEdges.push({ a: current, b: (i + 1) * gridSize + j });
              if (j < gridSize - 1) activeEdges.push({ a: current, b: i * gridSize + (j + 1) });
            }
          }
          break;
        case "torus":
        default:
          activePts = torusPoints;
          activeEdges = torusEdges;
          break;
      }

      // Rotate and Project 3D points
      const projected: { x: number; y: number; zDepth: number; original: Point3D }[] = [];
      const focalLength = 340;
      
      // Responsive scale based on canvas size to fit perfectly on mobile and tablet screens
      const responsiveScaleFactor = canvas.width < 340 ? 0.70 : canvas.width < 380 ? 0.82 : canvas.width < 450 ? 0.90 : 1.0;
      const currentScale = modelScale * (shape === "wave" ? 1.15 : 1.0) * responsiveScaleFactor;

      activePts.forEach(p => {
        // Step 1: Rotate around X
        const y1 = p.y * Math.cos(rx) - p.z * Math.sin(rx);
        const z1 = p.y * Math.sin(rx) + p.z * Math.cos(rx);

        // Step 2: Rotate around Y
        const x2 = p.x * Math.cos(ry) + z1 * Math.sin(ry);
        const z2 = -p.x * Math.sin(ry) + z1 * Math.cos(ry);

        // Step 3: Rotate around Z
        const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
        const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

        // Perspective projections
        // Translate Z back for camera space
        const perspectiveScale = focalLength / (focalLength + z2);
        
        projected.push({
          x: x3 * perspectiveScale * currentScale + cx,
          y: y3 * perspectiveScale * currentScale + cy,
          zDepth: z2, // Used for sorting and style depth fades
          original: p
        });
      });

      // RENDER WIREFRAME LINES
      if (showWireframe) {
        ctx.lineWidth = 1.1;
        activeEdges.forEach(e => {
          const p1 = projected[e.a];
          const p2 = projected[e.b];
          if (!p1 || !p2) return;

          // Limit very distorted wrap-around edges for wrapping toroidal bounds
          if (shape === "torus") {
            const dx = Math.abs(p1.original.x - p2.original.x);
            const dy = Math.abs(p1.original.y - p2.original.y);
            if (dx > 80 || dy > 80) return;
          }

          // Depth-based line color mixing for beautiful fadeouts
          const avgDepth = (p1.zDepth + p2.zDepth) / 2;
          const maxDepth = 100;
          const alphaFade = Math.max(0.08, Math.min(0.9, 1 - (avgDepth + maxDepth) / (maxDepth * 2)));
          
          // Color selection
          let strokeColor = `rgba(${activeColor.primary}, ${alphaFade * 0.6})`;
          if (p1.original.color === "secondary") {
            strokeColor = `rgba(${activeColor.secondary}, ${alphaFade * 0.6})`;
          }

          ctx.strokeStyle = strokeColor;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });
      }

      // RENDER SPECIFIC NODES/PARTICLES
      if (showNodes) {
        // Sort particles back-to-front for accurate overlapping rendering
        const sortedPoints = [...projected].sort((a, b) => b.zDepth - a.zDepth);

        sortedPoints.forEach(p => {
          const depthScale = Math.max(0.3, 1 - (p.zDepth + 80) / 160);
          const drawRadius = nodeSize * depthScale;
          
          // Outer glow layer
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawRadius * 2.2, 0, Math.PI * 2);
          
          let glowAlpha = 0.08 * depthScale;
          if (shape === "dna") {
            ctx.fillStyle = p.original.color === "secondary" 
              ? `rgba(${activeColor.secondary}, ${glowAlpha * 1.5})` 
              : `rgba(${activeColor.primary}, ${glowAlpha * 1.5})`;
          } else {
            ctx.fillStyle = `rgba(${activeColor.primary}, ${glowAlpha})`;
          }
          ctx.fill();

          // Core node particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);
          
          if (shape === "dna") {
            ctx.fillStyle = p.original.color === "secondary" 
              ? `rgba(${activeColor.secondary}, ${depthScale})` 
              : `rgba(${activeColor.primary}, ${depthScale})`;
          } else {
            // Gradient mix based on Y coordinate to look highly professional
            const mixRatio = Math.sin(p.original.y * 0.05) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(${activeColor.primary}, ${depthScale * 0.95})`;
          }
          ctx.fill();
        });
      }

      // Dynamic indicator decal overlay
      ctx.font = "8px 'Fira Code', 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
      ctx.fillText(`ROT_X: ${rx.toFixed(2)}  ROT_Y: ${ry.toFixed(2)}`, 16, canvas.height - 18);
      ctx.fillText(`ENGINE: COMPILING_OK // SHAPE: ${shape.toUpperCase()}`, 16, canvas.height - 30);

      // Simple grid markings
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(canvas.width - 24, 16);
      ctx.lineTo(canvas.width - 12, 16);
      ctx.lineTo(canvas.width - 12, 28);
      ctx.stroke();

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [shape, resolution, modelScale, nodeSize, showWireframe, showNodes, crystalPoints, torusPoints, dnaPoints, wavePoints, activeColor, isRotating, colorMode]);

  // Handle Resize of Container properly
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const cnt = containerRef.current;
      if (!canvas || !cnt) return;
      
      canvas.width = cnt.clientWidth;
      canvas.height = cnt.clientHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Quick timeout backup
    const t = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative group rounded-2xl overflow-hidden flex flex-col justify-between">
      
      {/* 3D Canvas screen viewports */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="w-full h-full cursor-grab active:cursor-grabbing block touch-none"
        />
      </div>

      {/* Shapes Selector floating bottom glass overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex gap-1 bg-app-input border border-app backdrop-blur-md px-1.5 py-1 rounded-xl pointer-events-auto">
          {(["torus", "crystal", "dna", "wave"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setShape(s)}
              className={`px-2 py-1 text-[9px] font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                shape === s 
                  ? "bg-app-surface-hover text-app-heading font-black" 
                  : "text-app-subtle hover:text-app-secondary"
              }`}
            >
              {s === "torus" ? "Torus" : s === "crystal" ? "Crystal" : s === "dna" ? "Helix" : "Wave"}
            </button>
          ))}
        </div>

        {/* Speed State controls */}
        <div className="flex bg-app-input border border-app backdrop-blur-md p-1 rounded-xl pointer-events-auto gap-1">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-1 rounded text-app-muted hover:text-app-heading hover:bg-app-surface transition-colors cursor-pointer"
            title={isRotating ? "Pause Rotating Space" : "Play Rotating Space"}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-sky-400" />}
          </button>
          <button
            onClick={() => {
              anglesRef.current = { x: 0.5, y: 0.8, z: 0.2 };
            }}
            className="p-1 rounded text-app-muted hover:text-app-heading hover:bg-app-surface transition-colors cursor-pointer"
            title="Reset Coordinates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Settings control sliders overlay at bottom of the panel */}
      <div className="mt-auto p-3 z-10 bg-app-input border-t border-app backdrop-blur-md pointer-events-auto flex items-center justify-between text-[9px] font-mono text-app-muted">
        
        {/* Toggle options checkboxes */}
        <div className="flex gap-3">
          <label className="flex items-center gap-1 cursor-pointer hover:text-app-secondary">
            <input
              type="checkbox"
              checked={showWireframe}
              onChange={(e) => setShowWireframe(e.target.checked)}
              className="accent-sky-500 w-3 h-3 bg-app-elevated border border-app rounded"
            />
            <span>Grid</span>
          </label>

          <label className="flex items-center gap-1 cursor-pointer hover:text-app-secondary">
            <input
              type="checkbox"
              checked={showNodes}
              onChange={(e) => setShowNodes(e.target.checked)}
              className="accent-sky-500 w-3 h-3 bg-app-elevated border border-app rounded"
            />
            <span>Nodes</span>
          </label>
        </div>

        {/* Interactive Resizing control helper status */}
        <div className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-app-secondary">Drag viewport to manually orbit</span>
        </div>

      </div>

    </div>
  );
}
