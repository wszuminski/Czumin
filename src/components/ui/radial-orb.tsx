// radial-orb.tsx (optimized, visuals unchanged)
// @ts-nocheck
import { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CaseStudy } from "../../data/case-studies";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface RadialOrbitalTimelineProps {
  timelineData: CaseStudy[];
}

const normalizeAngle = (a: number) => ((a % 360) + 360) % 360;
const NODE_SIZE_MULTIPLIER = 1.5;
const CENTER_CORE_SCALE = 0.75;
const CENTER_GLOW_SCALE = 2.2;

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode] = useState<"orbital">("orbital");
  const rotationAngleRef = useRef<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [inView, setInView] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);

  // responsive radius + sizing
  const [radius, setRadius] = useState<number>(180);
  const [nodeSize, setNodeSize] = useState<number>(40 * NODE_SIZE_MULTIPLIER);
  const [orbitPadding, setOrbitPadding] = useState<number>(24);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const expandedItemsRef = useRef<Record<number, boolean>>(expandedItems);
  const isRotatingRef = useRef<boolean>(false);

  // Precompute maps for O(1) lookups
  const idToIndex = useMemo(() => {
    const map = new Map<number, number>();
    timelineData.forEach((item, i) => map.set(item.id, i));
    return map;
  }, [timelineData]);

  const relatedMap = useMemo(() => {
    const m = new Map<number, number[]>();
    timelineData.forEach((i) => m.set(i.id, i.relatedIds));
    return m;
  }, [timelineData]);

  const titleById = useMemo(() => {
    const m = new Map<number, string>();
    timelineData.forEach((item) => m.set(item.id, item.title));
    return m;
  }, [timelineData]);

  const totalNodes = timelineData.length || 1;

  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
      isRotatingRef.current = true;
    }
  }, []);

  const calculateNodePosition = useCallback(
    (index: number, total: number, rotationAngle: number) => {
      const angle = normalizeAngle((index / total) * 360 + rotationAngle);
      const radian = (angle * Math.PI) / 180;

      const x = radius * Math.cos(radian) + centerOffset.x;
      const y = radius * Math.sin(radian) + centerOffset.y;

      const zIndex = Math.round(100 + 50 * Math.cos(radian));
      const opacity = Math.max(0.45, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

      return { x, y, angle, zIndex, opacity };
    },
    [radius, centerOffset]
  );

  const updateNodes = useCallback(
    (angleOverride?: number) => {
      const nextAngle = normalizeAngle(angleOverride ?? rotationAngleRef.current);
      rotationAngleRef.current = nextAngle;
      if (!timelineData.length) return;
      const total = timelineData.length;

      timelineData.forEach((item, index) => {
        const node = nodeRefs.current[item.id];
        if (!node) return;

        const { x, y, zIndex, opacity } = calculateNodePosition(
          index,
          total,
          nextAngle
        );

        node.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) translateZ(0)`;
        const isExpanded = !!expandedItemsRef.current[item.id];
        node.style.zIndex = `${isExpanded ? 200 : zIndex}`;
        node.style.opacity = isExpanded ? "1" : `${opacity}`;
        node.style.transition = isRotatingRef.current
          ? "opacity 150ms linear"
          : "transform 400ms ease, opacity 200ms ease";
      });
    },
    [timelineData, calculateNodePosition]
  );

  const centerViewOnNode = useCallback(
    (nodeId: number) => {
      if (viewMode !== "orbital" || !idToIndex.has(nodeId)) return;
      const nodeIndex = idToIndex.get(nodeId)!;
      const targetAngle = (nodeIndex / totalNodes) * 360;
      const next = normalizeAngle(270 - targetAngle);
      updateNodes(next);
    },
    [viewMode, idToIndex, totalNodes, updateNodes]
  );

  const toggleItem = useCallback((id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        isRotatingRef.current = false;

        const relatedItems = relatedMap.get(id) ?? [];
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => (newPulseEffect[relId] = true));
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        isRotatingRef.current = true;
        setPulseEffect({});
      }

      return newState;
    });
  }, [relatedMap, centerViewOnNode]);

  const isRotating = autoRotate && viewMode === "orbital" && inView;

  // rAF loop throttled to ~30 FPS, mutating DOM styles to avoid component re-renders
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();
    let acc = 0;
    const frameInterval = 1000 / 30;

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      acc += dt;
      if (acc >= frameInterval) {
        const deltaDegrees = (acc / 1000) * 6;
        updateNodes(rotationAngleRef.current + deltaDegrees);
        acc = 0;
      }
      rafId = requestAnimationFrame(loop);
    };

    if (isRotating) {
      last = performance.now();
      rafId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(rafId);
  }, [isRotating, updateNodes]);

  useLayoutEffect(() => {
    updateNodes(rotationAngleRef.current);
  }, [updateNodes]);

  useEffect(() => {
    expandedItemsRef.current = expandedItems;
    updateNodes();
  }, [expandedItems, updateNodes]);

  useEffect(() => {
    isRotatingRef.current = isRotating;
    updateNodes();
  }, [isRotating, updateNodes]);

  // Observe visibility to pause animations offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver((entries) => setInView(entries[0].isIntersecting), {
      threshold: 0.2,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) setAutoRotate(false);
  }, []);

  // measure container and compute responsive sizes
  useEffect(() => {
    const computeSizes = () => {
      const el = containerRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      const minDim = Math.min(width, height);

      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;

      const baseRadius = Math.max(80, Math.floor((minDim - 2 * orbitPadding) / 2) - 40);

      let r = baseRadius;
      let dot = 52;
      if (isMobile) {
        r = Math.min(baseRadius, 110);
        dot = 42;
      } else if (isTablet) {
        r = Math.min(baseRadius, 150);
        dot = 48;
      } else {
        r = Math.min(baseRadius, 200);
        dot = 56;
      }

      setRadius(r);
      setNodeSize(dot * NODE_SIZE_MULTIPLIER);
    };

    computeSizes();
    window.addEventListener("resize", computeSizes);
    return () => window.removeEventListener("resize", computeSizes);
  }, [orbitPadding]);

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const rel = relatedMap.get(activeNodeId) ?? [];
    return rel.includes(itemId);
  };

  const getStatusStyles = (status: CaseStudy["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-black border-white";
      case "in-progress":
        return "text-black bg-white border-black";
      case "pending":
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  const labelOffsetTop = nodeSize + 8;
  const expandedScale = 1.4;
  const orbitDiameter = radius * 2;

  return (
    <div
      className="w-full min-h-dvh flex flex-col justify-start bg-black overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
      style={{ touchAction: "manipulation" }}
    >
      <div className="container text-center pt-20 sm:pt-24 pb-4 px-4">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Wybrane realizacje</h2>
        <p className="mt-2 text-xl sm:text-2xl text-white/70">Jedno zdanie o projektach — klarownie i konkretnie.</p>
      </div>

      <div className="relative w-full max-w-4xl flex-1 mx-auto flex items-center justify-center px-3">
        <div
          className="absolute inset-0 flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Core */}
          <div
            className="absolute rounded-full flex items-center justify-center z-10 shadow-[0_0_60px_rgba(99,102,241,0.35)]"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: nodeSize * CENTER_CORE_SCALE,
              height: nodeSize * CENTER_CORE_SCALE,
              background:
                "conic-gradient(from 0deg, rgba(99,102,241,0.6), rgba(168,85,247,0.55), rgba(56,189,248,0.55), rgba(99,102,241,0.6))",
              boxShadow: "inset 0 0 14px rgba(255,255,255,0.12), 0 0 30px rgba(56,189,248,0.18)",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: nodeSize * CENTER_GLOW_SCALE,
                height: nodeSize * CENTER_GLOW_SCALE,
                background: "radial-gradient(circle at center, rgba(99,102,241,0.18), rgba(56,189,248,0) 60%)",
                filter: "blur(2px)",
              }}
            />
          </div>

          {/* Orbit outline */}
          <div
            className="absolute rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: orbitDiameter,
              height: orbitDiameter,
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.12), inset 0 0 80px rgba(99,102,241,0.08), 0 0 60px rgba(56,189,248,0.06)",
              background:
                "radial-gradient(closest-side, transparent calc(100% - 1px), rgba(255,255,255,0.12) calc(100% - 1px))",
            }}
          />

          {timelineData.map((item) => {
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const logoPadding = Math.max(2, Math.floor(nodeSize * 0.08));

            const nodeStyle = {
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              willChange: "transform, opacity",
            } as const;

            const dotStyle = { width: nodeSize, height: nodeSize } as const;

            const baseAura = Math.min(80 * NODE_SIZE_MULTIPLIER, nodeSize + item.energy * 0.45);
            const auraSize = isExpanded ? Math.min(baseAura * 1.4, nodeSize * 2.6) : baseAura;
            const auraBackground = isExpanded
              ? "radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(129,140,248,0.22) 45%, rgba(56,189,248,0.12) 70%, rgba(17,24,39,0) 90%)"
              : isRelated
              ? "radial-gradient(circle, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0) 80%)"
              : "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)";

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full pointer-events-none ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                  style={{
                    background: auraBackground,
                    width: auraSize,
                    height: auraSize,
                    left: -(auraSize - nodeSize) / 2,
                    top: -(auraSize - nodeSize) / 2,
                  }}
                />

                <div
                  className={`rounded-full flex items-center justify-center border-2 transition-transform duration-300 overflow-hidden
                  ${isExpanded
                    ? "bg-black text-white border-violet-200 shadow-[0_0_35px_rgba(168,85,247,0.55)]"
                    : isRelated
                    ? "bg-white/50 text-black border-white animate-pulse"
                    : "bg-black text-white border-white/40"}
                  `}
                  style={{ ...dotStyle, transform: `scale(${isExpanded ? expandedScale : 1})` }}
                >
                  <img
                    src={item.logo}
                    alt={`${item.title} logo`}
                    style={{ padding: logoPadding, boxSizing: "border-box" }}
                    className="pointer-events-none select-none h-full w-full rounded-full object-contain"
                    draggable={false}
                    decoding="async"
                  />
                </div>

                <div
                  className={`
                    absolute whitespace-nowrap text-[10px] sm:text-xs font-semibold tracking-wider
                    transition-all duration-300
                    ${isExpanded ? "text-white" : "text-white/70"}
                  `}
                  style={{ top: labelOffsetTop, opacity: isExpanded ? 0 : 1, transform: `translateY(${isExpanded ? 8 : 0}px)` }}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card
                    className="absolute left-1/2 -translate-x-1/2 w-64 sm:w-72 bg-black/90 backdrop-blur-lg border-white/30 shadow-xl shadow-white/10 overflow-visible"
                    style={{ top: labelOffsetTop + nodeSize * 0.8 }}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/50" />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-[10px] sm:text-xs ${getStatusStyles(item.status)}`}>
                          {item.status === "completed" ? "Skończony" : item.status === "in-progress" ? "IN PROGRESS" : "PENDING"}
                        </Badge>
                        <span className="text-[10px] sm:text-xs font-mono text-white/50">{item.date}</span>
                      </div>
                      <CardTitle className="text-sm mt-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/80">
                      <p>{item.content}</p>

                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center">
                            <Zap size={10} className="mr-1" />
                            Poziom satysfakcji
                          </span>
                          <span className="font-mono">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${item.energy}%` }} />
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-white/70 mr-1" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">Zobacz więcej</h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => (
                              <Button
                                key={relatedId}
                                variant="outline"
                                size="sm"
                                className="flex items-center h-6 px-2 py-0 text-[10px] sm:text-xs rounded-3xl border-white/20 bg-transparent hover:bg-white/10 text-white/80 hover:text-white transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleItem(relatedId);
                                }}
                              >
                                {titleById.get(relatedId) ?? ""}
                                <ArrowRight size={8} className="ml-1 text-white/60" />
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        className="mt-4 w-full rounded-full bg-white text-black hover:bg-white/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/cases/${item.id}`);
                        }}
                      >
                        Zobacz więcej
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
