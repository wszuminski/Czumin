// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CaseStudy } from "../../data/case-studies";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface RadialOrbitalTimelineProps {
  timelineData: CaseStudy[];
}

const normalizeAngle = (a: number) => ((a % 360) + 360) % 360; // FIX: prevent negative angles

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [inView, setInView] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);

  // responsive radius + sizing
  const [radius, setRadius] = useState<number>(180);
  const [nodeSize, setNodeSize] = useState<number>(40);
  const [orbitPadding, setOrbitPadding] = useState<number>(24);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  // Smooth rotation via rAF and pause when out of view to avoid jank
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      const deltaDegrees = (dt / 1000) * 6; // ~6deg/sec
      setRotationAngle((prev) => normalizeAngle(prev + deltaDegrees)); // FIX: normalized
      rafId = requestAnimationFrame(loop);
    };

    if (autoRotate && viewMode === "orbital" && inView) {
      rafId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(rafId);
  }, [autoRotate, viewMode, inView]);

  // Observe visibility to pause animations offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
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
      let dot = 40;
      if (isMobile) {
        r = Math.min(baseRadius, 120);
        dot = 32;
      } else if (isTablet) {
        r = Math.min(baseRadius, 160);
        dot = 36;
      } else {
        r = Math.min(baseRadius, 200);
        dot = 40;
      }

      setRadius(r);
      setNodeSize(dot);
    };

    computeSizes();
    window.addEventListener("resize", computeSizes);
    return () => window.removeEventListener("resize", computeSizes);
  }, [orbitPadding]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(normalizeAngle(270 - targetAngle)); // FIX: normalized set
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = normalizeAngle((index / total) * 360 + rotationAngle); // FIX: normalized
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.45, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: CaseStudy["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-black border-white";
      case "in-progress":
        return "text-black bg-white border-black";
      case "pending":
        return "text-white bg-black/40 border-white/50";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  const labelOffsetTop = nodeSize + 8;
  const expandedScale = 1.4;
  const orbitDiameter = radius * 2;

  const isRotating = autoRotate && viewMode === "orbital" && inView; // FIX: rotation flag

  return (
    <div
      className="w-full min-h-dvh flex flex-col items-center justify-center bg-black overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center px-3">
        <div
          className="absolute inset-0 flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            // We keep centerOffset but now everything is centered; this acts as a fine nudge
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          {/* core (centered) */}
          <div
            className="absolute rounded-full flex items-center justify-center z-10 shadow-[0_0_60px_rgba(99,102,241,0.35)]"
            style={{
              top: "50%", left: "50%", transform: "translate(-50%, -50%)", // FIX: center anchor
              width: nodeSize * 1.8,
              height: nodeSize * 1.8,
              background:
                "conic-gradient(from 0deg, rgba(99,102,241,0.65), rgba(168,85,247,0.65), rgba(56,189,248,0.65), rgba(99,102,241,0.65))",
              boxShadow:
                "inset 0 0 18px rgba(255,255,255,0.25), 0 0 36px rgba(56,189,248,0.15)",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: nodeSize * 2.3,
                height: nodeSize * 2.3,
                background:
                  "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0) 60%)",
                filter: "blur(1px)",
              }}
            />
            <div
              className="rounded-full backdrop-blur-md ring-1 ring-white/30"
              style={{ width: nodeSize * 0.85, height: nodeSize * 0.85, background: "rgba(255,255,255,0.9)" }}
            />
          </div>

          {/* orbit outline (centered) */}
          <div
            className="absolute rounded-full"
            style={{
              top: "50%", left: "50%", transform: "translate(-50%, -50%)", // FIX: center anchor
              width: orbitDiameter,
              height: orbitDiameter,
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.12), inset 0 0 80px rgba(99,102,241,0.08), 0 0 60px rgba(56,189,248,0.06)",
              background:
                "radial-gradient(closest-side, transparent calc(100% - 1px), rgba(255,255,255,0.12) calc(100% - 1px))",
            }}
          />

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              top: "50%", left: "50%", // FIX: center anchor
              transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) translateZ(0)`, // FIX: orbit around center
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
              willChange: "transform, opacity",
              // FIX: don't transition transform when the orbit is auto-rotating (prevents oscillation/jitter)
              transition: isRotating
                ? "opacity 150ms linear"
                : "transform 400ms ease, opacity 200ms ease",
            } as const;

            const dotStyle = {
              width: nodeSize,
              height: nodeSize,
            } as const;

            const aura = Math.min(60, nodeSize + item.energy * 0.35);

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute cursor-pointer" // FIX: removed transition-all here
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                  style={{
                    background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                    width: aura,
                    height: aura,
                    left: -(aura - nodeSize) / 2,
                    top: -(aura - nodeSize) / 2,
                  }}
                />

                <div
                  className={`rounded-full flex items-center justify-center 
                  ${isExpanded ? "bg-white text-black" : isRelated ? "bg-white/50 text-black" : "bg-black text-white"}
                  border-2 
                  ${isExpanded ? "border-white shadow-lg shadow-white/30" : isRelated ? "border-white animate-pulse" : "border-white/40"}
                  transition-transform duration-300`} // keep transform transition for expand only
                  style={{ ...dotStyle, transform: `scale(${isExpanded ? expandedScale : 1})` }}
                >
                  <Icon size={Math.max(12, Math.floor(nodeSize * 0.4))} />
                </div>

                <div
                  className={`
                  absolute whitespace-nowrap text-[10px] sm:text-xs font-semibold tracking-wider
                  transition-all duration-300
                  ${isExpanded ? "text-white scale-110" : "text-white/70"}
                `}
                  style={{ top: labelOffsetTop }}
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
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
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
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1 text-white/60" />
                                </Button>
                              );
                            })}
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
