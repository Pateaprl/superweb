import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';

function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing environment...");

  useEffect(() => {
    const texts = [
      "Initializing environment...",
      "Loading WebGL contexts...",
      "Rendering physics engine...",
      "Preparing immersive experience..."
    ];

    const timer = setInterval(() => {
      setProgress(p => {
        const newP = p + Math.floor(Math.random() * 10) + 5;
        if (newP >= 100) {
          clearInterval(timer);
          setLoadingText("System ready.");
          setTimeout(onComplete, 250);
          return 100;
        }
        if (newP > 25 && newP < 50) setLoadingText(texts[1]);
        else if (newP >= 50 && newP < 75) setLoadingText(texts[2]);
        else if (newP >= 75) setLoadingText(texts[3]);

        return newP;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#030303] flex flex-col justify-between p-6 md:p-12 overflow-hidden"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-start text-white/40 font-mono text-[10px] md:text-xs uppercase tracking-widest">
        <span>Tate Alen © {new Date().getFullYear()}</span>
        <span>Portfolio / WebGL</span>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="overflow-hidden mb-6 px-4 md:px-8">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[25vw] md:text-[15vw] font-bold text-white leading-none tracking-tighter"
          >
            {Math.min(progress, 100)}<span className="text-[12vw] md:text-[8vw] text-white/30 ml-2">%</span>
          </motion.div>
        </div>
        
        <div className="w-full max-w-3xl flex flex-col gap-4 px-4 md:px-8">
          <div className="h-[4px] md:h-[6px] w-full bg-white/10 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ ease: "circOut", duration: 0.2 }}
            />
          </div>
          <div className="flex justify-between items-center text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span className="animate-pulse">{loadingText}</span>
            <span>{Math.min(progress, 100) === 100 ? 'READY' : 'LOADING'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end text-white/40 font-mono text-[10px] md:text-xs uppercase tracking-widest">
        <span>System Initialization</span>
        <span className="text-right">Interactive<br/>Experience</span>
      </div>
    </motion.div>
  );
}

function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { stiffness: 500, damping: 28, mass: 0.5 });
  const cursorYSpring = useSpring(cursorY, { stiffness: 500, damping: 28, mass: 0.5 });
  const ringXSpring = useSpring(cursorX, { stiffness: 250, damping: 20, mass: 0.8 });
  const ringYSpring = useSpring(cursorY, { stiffness: 250, damping: 20, mass: 0.8 });

  const prevX = useRef(0);
  const arrowRotation = useMotionValue(0);
  const springArrowRotation = useSpring(arrowRotation, { stiffness: 400, damping: 25, mass: 0.5 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const deltaX = e.clientX - prevX.current;
      if (deltaX > 2) {
        arrowRotation.set(0);
      } else if (deltaX < -2) {
        arrowRotation.set(180);
      }
      prevX.current = e.clientX;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  const text = "EXPLORE • DISCOVER • CREATE • ";
  const chars = text.split("");

  return (
    <div className="custom-cursor-element hidden [@media(pointer:fine)]:block">
      <motion.div
        className="fixed top-0 left-0 bg-white rounded-full pointer-events-none z-[150] mix-blend-difference flex items-center justify-center overflow-hidden"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHovering ? 64 : 8,
          height: isHovering ? 64 : 8,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <motion.div style={{ rotate: springArrowRotation }} className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-black" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-[149] mix-blend-difference flex items-center justify-center"
        style={{ x: ringXSpring, y: ringYSpring, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: isHovering ? 1.2 : 0.4,
          opacity: isHovering ? 1 : 0.3
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        >
          {chars.map((char, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-0 text-[10px] font-mono font-bold text-white"
              style={{
                transform: `translateX(-50%) rotate(${i * 12}deg)`,
                transformOrigin: "50% 64px"
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (canvasRef.current && !initialized.current) {
      initialized.current = true;
      
      const canvas = canvasRef.current;
      const originalAddEventListener = canvas.addEventListener;
      canvas.addEventListener = function(type, listener, options) {
        if (type === 'touchstart' || type === 'touchmove') {
          const wrappedListener = (e: Event) => {
            const touchEvent = e as TouchEvent;
            const proxyEvent = new Proxy(touchEvent, {
              get(target, prop) {
                if (prop === 'preventDefault') return () => {};
                if (prop === 'targetTouches' || prop === 'changedTouches' || prop === 'touches') {
                  const touches = target[prop as keyof TouchEvent] as TouchList;
                  return Array.from(touches).map(t => new Proxy(t, {
                    get(tTarget, tProp) {
                      if (tProp === 'pageX') return tTarget.clientX;
                      if (tProp === 'pageY') return tTarget.clientY;
                      const val = tTarget[tProp as keyof Touch];
                      return typeof val === 'function' ? (val as Function).bind(tTarget) : val;
                    }
                  }));
                }
                const val = target[prop as keyof TouchEvent];
                return typeof val === 'function' ? val.bind(target) : val;
              }
            });

            if (typeof listener === 'function') {
              listener(proxyEvent as unknown as Event);
            } else if (listener && typeof listener.handleEvent === 'function') {
              listener.handleEvent(proxyEvent as unknown as Event);
            }
          };
          return originalAddEventListener.call(this, type, wrappedListener, { passive: true });
        }
        return originalAddEventListener.call(this, type, listener, options);
      };

      import('webgl-fluid').then((module) => {
        const webGLFluidEnhanced = module.default;
        webGLFluidEnhanced(canvas, {
          IMMEDIATE: true,
          TRIGGER: 'hover',
          SIM_RESOLUTION: 128,
          DYE_RESOLUTION: 1024,
          CAPTURE_RESOLUTION: 512,
          DENSITY_DISSIPATION: 1.5,
          VELOCITY_DISSIPATION: 0.5,
          PRESSURE: 0.8,
          PRESSURE_ITERATIONS: 20,
          CURL: 30,
          SPLAT_RADIUS: 0.25,
          SPLAT_FORCE: 6000,
          SHADING: true,
          COLORFUL: true,
          COLOR_UPDATE_SPEED: 10,
          PAUSED: false,
          BACK_COLOR: { r: 3, g: 3, b: 3 },
          TRANSPARENT: false,
          BLOOM: true,
          BLOOM_ITERATIONS: 8,
          BLOOM_RESOLUTION: 256,
          BLOOM_INTENSITY: 0.4,
          BLOOM_THRESHOLD: 0.8,
          BLOOM_SOFT_KNEE: 0.7,
          SUNRAYS: true,
          SUNRAYS_RESOLUTION: 196,
          SUNRAYS_WEIGHT: 0.5,
        });
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#030303]">
      <canvas ref={canvasRef} className="w-full h-full" style={{ touchAction: 'auto' }} />
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-screen pointer-events-none"></div>
    </div>
  );
}

function ScrollFade({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "end 5%"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [30, 0, 0, -30]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

function Magnetic({ children, strength = 40 }: { children: React.ReactNode, strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set((middleX / width) * strength);
    y.set((middleY / height) * strength);
  }, [strength, x, y]);

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className="pointer-events-auto"
    >
      {children}
    </motion.div>
  );
}

function Hero({ loading }: { loading: boolean }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 75, damping: 15, mass: 0.5 });
  const springRotateY = useSpring(rotateY, { stiffness: 75, damping: 15, mass: 0.5 });

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 40; 
      const y = (clientY / innerHeight - 0.5) * -40;
      rotateX.set(y);
      rotateY.set(x);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleReset = () => {
      rotateX.set(0);
      rotateY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleReset);
    window.addEventListener('touchend', handleReset);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleReset);
      window.removeEventListener('touchend', handleReset);
    };
  }, [rotateX, rotateY]);

  return (
    <section 
      className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden pointer-events-none"
      style={{ perspective: 1000 }}
    >
      <motion.div 
        style={{ y: y1, opacity, transformStyle: "preserve-3d", rotateX: springRotateX, rotateY: springRotateY }} 
        className="text-center z-10 w-full max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, z: 60 }}
          animate={{ opacity: loading ? 0 : 1, z: 60 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mb-6 px-5 py-2 rounded-full border border-white/10 glass-panel text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-white/80"
        >
          Creative Developer & Designer
        </motion.div>
        
        <motion.div className="overflow-hidden py-2" initial={{ z: 100 }} animate={{ z: 100 }}>
          <motion.h1 
            className="font-display text-[14vw] md:text-[9vw] font-bold leading-[0.85] tracking-tighter"
            initial={{ y: "100%" }}
            animate={{ y: loading ? "100%" : 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            CRAFTING
          </motion.h1>
        </motion.div>
        <motion.div className="overflow-hidden py-2 mb-6" initial={{ z: 80 }} animate={{ z: 80 }}>
          <motion.h1 
            className="font-display text-[14vw] md:text-[9vw] font-bold leading-[0.85] tracking-tighter"
            initial={{ y: "100%" }}
            animate={{ y: loading ? "100%" : 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gradient italic pr-4">DIGITAL</span> IMPRINTING
          </motion.h1>
        </motion.div>
        
        <motion.p 
          className="max-w-xl mx-auto text-base md:text-xl text-white/60 font-light leading-relaxed"
          initial={{ opacity: 0, y: 20, z: 40 }}
          animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0, z: 40 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          What is presented here is an imagination of movement for me. All the colors are flowing through my life.
        </motion.p>
      </motion.div>

      <motion.div 
        style={{ y: y2, opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-mono text-white/40">Scroll to explore</span>
        <motion.div 
          className="w-[1px] h-16 bg-gradient-to-b from-white/40 to-transparent"
          animate={{ scaleY: [0, 1, 0], transformOrigin: ["top", "top", "bottom"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

function Word({ word }: { word: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 40%"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [20, 0]);
  
  return (
    <span ref={ref} className="relative inline-block mr-[0.25em] mt-[0.1em]">
      <motion.span style={{ opacity, y: scrollY, display: "inline-block" }}>
        <motion.span 
          whileHover={{ 
            scale: 1.25, 
            y: -15, 
            color: "#ffffff", 
            textShadow: "0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.5)" 
          }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
          className="cursor-none pointer-events-auto inline-block transition-colors duration-300"
        >
          {word}
        </motion.span>
      </motion.span>
    </span>
  );
}

function About() {
  const words = useMemo(() => {
    const text = "A cat , carrying a bunch of moonlight , jumped onto the wall . He lowered his head and saw me in the corner . Meow ~ , the moonlight fell on my hand .";
    return text.split(" ");
  }, []);
  
  return (
    <section className="py-32 px-6 md:px-12 max-w-6xl mx-auto min-h-screen flex items-center justify-center pointer-events-none">
      <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.1] font-medium text-center max-w-5xl">
        {words.map((word, i) => (
          <Word key={i} word={word} />
        ))}
      </h2>
    </section>
  );
}

const skillsData = [
  { name: "React", color: "#06B6D4" },
  { name: "WebGL", color: "#FF3366" },
  { name: "Three.js", color: "#7C3AED" },
  { name: "Framer Motion", color: "#06B6D4" },
  { name: "TailwindCSS", color: "#FF3366" },
  { name: "UI/UX", color: "#7C3AED" },
  { name: "TypeScript", color: "#06B6D4" },
  { name: "Next.js", color: "#FF3366" },
  { name: "Creative Coding", color: "#7C3AED" },
  { name: "GSAP", color: "#06B6D4" }
];

function Skills() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);
  const bodiesRef = useRef<any[]>([]);
  const matterRef = useRef<any>(null);
  const [gravityValue, setGravityValue] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    let animationFrameId: number;
    let runner: any;
    let engine: any;

    import('matter-js').then((MatterModule) => {
      const Matter = MatterModule.default || MatterModule;
      matterRef.current = Matter;

      const Engine = Matter.Engine,
            Runner = Matter.Runner,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            World = Matter.World,
            Bodies = Matter.Bodies;

      engine = Engine.create();
      engineRef.current = engine;
      const world = engine.world;

      engine.world.gravity.y = 0; // Start with no gravity

      const width = sceneRef.current!.clientWidth;
      const height = sceneRef.current!.clientHeight;

      // Walls
      const wallOptions = { isStatic: true, render: { visible: false } };
      const wallThickness = 50;
      World.add(world, [
          Bodies.rectangle(width / 2, -wallThickness/2, width, wallThickness, wallOptions), // Top
          Bodies.rectangle(width / 2, height + wallThickness/2, width, wallThickness, wallOptions), // Bottom
          Bodies.rectangle(-wallThickness/2, height / 2, wallThickness, height, wallOptions), // Left
          Bodies.rectangle(width + wallThickness/2, height / 2, wallThickness, height, wallOptions) // Right
      ]);

      const bodies = skillsData.map((skill, i) => {
          // Approximate size based on text length and padding
          const isMobile = window.innerWidth < 768;
          const charWidth = isMobile ? 8 : 10;
          const padding = isMobile ? 48 : 64;
          const w = skill.name.length * charWidth + padding;
          const h = isMobile ? 48 : 56;
          
          const x = Math.random() * (width - w) + w/2;
          const y = Math.random() * (height - h) + h/2;
          
          return Bodies.rectangle(x, y, w, h, {
              chamfer: { radius: h / 2 },
              restitution: 0.8, // Bounciness
              friction: 0.005,
              frictionAir: 0.01,
              render: { visible: false }
          });
      });
      
      bodiesRef.current = bodies;
      World.add(world, bodies);

      const mouse = Mouse.create(sceneRef.current);
      const mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
              stiffness: 0.2,
              render: { visible: false }
          }
      });
      World.add(world, mouseConstraint);

      runner = Runner.create();
      Runner.run(runner, engine);

      const updateDOM = () => {
          bodies.forEach((body, i) => {
              const el = document.getElementById(`skill-${i}`);
              if (el) {
                  el.style.left = `${body.position.x}px`;
                  el.style.top = `${body.position.y}px`;
                  el.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
              }
          });
          animationFrameId = requestAnimationFrame(updateDOM);
      };
      updateDOM();
    });

    return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (matterRef.current && runner && engine) {
          matterRef.current.Runner.stop(runner);
          matterRef.current.Engine.clear(engine);
          if (engine.world) {
              matterRef.current.World.clear(engine.world, false);
          }
        }
    };
  }, []);

  const handleReset = useCallback(() => {
    if (!engineRef.current || !sceneRef.current || !matterRef.current) return;
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    bodiesRef.current.forEach((body, i) => {
      const skill = skillsData[i];
      const isMobile = window.innerWidth < 768;
      const charWidth = isMobile ? 8 : 10;
      const padding = isMobile ? 48 : 64;
      const w = skill.name.length * charWidth + padding;
      const h = isMobile ? 48 : 56;
      
      const x = Math.random() * (width - w) + w/2;
      const y = Math.random() * (height - h) + h/2;

      matterRef.current.Body.setPosition(body, { x, y });
      matterRef.current.Body.setVelocity(body, { x: 0, y: 0 });
      matterRef.current.Body.setAngularVelocity(body, 0);
      matterRef.current.Body.setAngle(body, 0);
    });

    setGravityValue(0);
    engineRef.current.world.gravity.y = 0;
  }, []);

  const handlePointerDown = useCallback(() => {
    pressTimer.current = setTimeout(() => {
      setShowSlider(true);
    }, 400); // 400ms long press
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    // If slider didn't open, it was a click
    if (!showSlider) {
      if (!engineRef.current) return;
      const newGravity = gravityValue === 0 ? 1 : 0;
      setGravityValue(newGravity);
      engineRef.current.world.gravity.y = newGravity;
    }
  }, [gravityValue, showSlider]);

  const handlePointerLeave = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setGravityValue(val);
    if (engineRef.current) {
      engineRef.current.world.gravity.y = val;
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
        setShowSlider(false);
      }
    };
    if (showSlider) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSlider]);

  return (
    <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto overflow-hidden pointer-events-none">
      <div className="mb-16 flex flex-col items-center gap-8">
        <ScrollFade className="flex flex-col items-center gap-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-center">
            KINETIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 italic font-light pr-2">DATA_NODES</span>
          </h2>
          <p className="text-cyan-500/50 text-sm font-mono uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            Simulation Environment Active
          </p>
        </ScrollFade>
        
        <ScrollFade className="flex flex-wrap justify-center gap-3 md:gap-4 z-20 relative px-4">
          <button 
            onClick={handleReset} 
            className="px-8 py-3 md:py-2 rounded-full border border-white/20 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95 font-mono text-xs md:text-sm uppercase tracking-widest pointer-events-auto cursor-none"
          >
            Reset.Sim()
          </button>
          <div className="relative flex flex-col items-center" ref={sliderRef}>
            <button 
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              className={`px-8 py-3 md:py-2 rounded-full border transition-all active:scale-95 font-mono text-xs md:text-sm uppercase tracking-widest pointer-events-auto cursor-none select-none ${gravityValue !== 0 ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/20 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}
            >
              Gravity: {gravityValue.toFixed(1)}G
            </button>
            <AnimatePresence>
              {showSlider && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, scale: 0.9, filter: "blur(10px)" }}
                  className="absolute top-full mt-6 p-[1px] bg-gradient-to-b from-cyan-500/50 to-purple-500/50 pointer-events-auto z-50 w-64 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                  style={{
                    clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
                  }}
                >
                  <div 
                    className="bg-[#050505]/95 backdrop-blur-xl p-5 w-full h-full"
                    style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                        GRAV_CALIBRATION
                      </div>
                      <div className="text-[10px] font-mono text-white/30">SYS.OP</div>
                    </div>

                    {/* Dynamic Display */}
                    <div className="flex flex-col items-center justify-center py-4 mb-5 bg-cyan-950/20 border-y border-cyan-500/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d410_1px,transparent_1px),linear-gradient(to_bottom,#06b6d410_1px,transparent_1px)] bg-[size:8px_8px]" />
                      <div className={`text-4xl font-display font-bold tracking-tighter z-10 transition-colors duration-300 ${gravityValue < 0 ? 'text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]' : gravityValue > 0 ? 'text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]' : 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]'}`}>
                        {gravityValue > 0 ? '+' : ''}{gravityValue.toFixed(1)}<span className="text-lg text-white/40 ml-1">G</span>
                      </div>
                      <div className="text-[8px] font-mono text-white/50 mt-2 z-10 tracking-widest uppercase">
                        {gravityValue < 0 ? 'Anti-Gravity Field' : gravityValue === 0 ? 'Zero-G Environment' : 'Standard Gravity'}
                      </div>
                    </div>

                    {/* Custom Slider */}
                    <div className="relative w-full py-2">
                      {/* Center Mark */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/30 z-0" />
                      <input 
                        type="range" 
                        min="-10" 
                        max="10" 
                        step="0.1" 
                        value={gravityValue}
                        onChange={handleSliderChange}
                        className={`w-full h-1 bg-gradient-to-r from-purple-500/50 via-white/20 to-cyan-500/50 appearance-none outline-none cursor-none relative z-10
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:[clip-path:polygon(0_20%,50%_0,100%_20%,100%_80%,50%_100%,0_80%)] [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:duration-300
                          [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:[clip-path:polygon(0_20%,50%_0,100%_20%,100%_80%,50%_100%,0_80%)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:transition-colors [&::-moz-range-thumb]:duration-300
                          ${gravityValue < 0 
                            ? '[&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(168,85,247,0.8)] [&::-moz-range-thumb]:bg-purple-400 [&::-moz-range-thumb]:shadow-[0_0_15px_rgba(168,85,247,0.8)]' 
                            : gravityValue > 0 
                              ? '[&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(6,182,212,0.8)] [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                              : '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(255,255,255,0.8)] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                          }
                        `}
                      />
                    </div>

                    {/* Footer Labels */}
                    <div className="flex justify-between w-full text-[9px] font-mono text-white/40 mt-3">
                      <span className="text-purple-400/70">-10.0</span>
                      <span>0.0</span>
                      <span className="text-cyan-400/70">+10.0</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollFade>
      </div>
      
      <div className="relative w-full">
        {/* Decorative glowing blobs behind the glass for frosted effect */}
        <div className="absolute top-1/2 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div 
          ref={sceneRef} 
          className="relative w-full h-[500px] md:h-[600px] border border-white/10 rounded-[2rem] overflow-hidden bg-white/[0.02] backdrop-blur-3xl pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          style={{ touchAction: 'none' }}
        >
          {/* Sci-fi Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_80%)] opacity-60" />

        {/* HUD Elements */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg pointer-events-none" />

        <div className="absolute top-8 left-16 text-[10px] font-mono text-cyan-500/40 tracking-widest pointer-events-none hidden md:block">SYS.CORE // ONLINE</div>
        <div className="absolute bottom-8 right-16 text-[10px] font-mono text-cyan-500/40 tracking-widest pointer-events-none hidden md:block">PHYSICS.ENGINE // MATTER.JS</div>

        {skillsData.map((skill, i) => (
          <div
            key={i}
            id={`skill-${i}`}
            className="absolute top-0 left-0 px-6 py-3 md:px-8 md:py-4 bg-black/80 border rounded-full backdrop-blur-md font-mono text-sm md:text-base uppercase tracking-wider select-none pointer-events-none whitespace-nowrap shadow-lg transition-colors duration-300"
            style={{ 
              transform: 'translate(-50%, -50%)',
              borderColor: `${skill.color}50`,
              color: skill.color,
              boxShadow: `0 0 20px ${skill.color}20, inset 0 0 10px ${skill.color}10`,
              textShadow: `0 0 10px ${skill.color}80`
            }}
          >
            {skill.name}
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] font-display text-[12vw] font-bold uppercase tracking-tighter text-center leading-none text-cyan-500">
          SYSTEM
        </div>
      </div>
      </div>
    </section>
  );
}

const projects = [
  {
    title: "Ethereal",
    category: "WebGL Experience",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    color: "#FF3366",
    year: "2025"
  },
  {
    title: "Nexus",
    category: "Fintech Platform",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop",
    color: "#7C3AED",
    year: "2024"
  },
  {
    title: "Aura",
    category: "Digital Art Gallery",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2000&auto=format&fit=crop",
    color: "#06B6D4",
    year: "2026"
  }
];

function ProjectCard({ project, index }: { project: any, index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [45, 0, -45]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], index % 2 === 0 ? [-30, 0, 30] : [30, 0, -30]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.8, 1.1, 1.8]);
  const filter = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], ["grayscale(100%) blur(15px)", "grayscale(0%) blur(0px)", "grayscale(0%) blur(0px)", "grayscale(100%) blur(15px)"]);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef<number | null>(null);

  const handlePressStart = useCallback(() => {
    setIsPressing(true);
    pressTimer.current = window.setTimeout(() => {
      setIsPreviewOpen(true);
      setIsPressing(false);
    }, 500); // 500ms long press
  }, []);

  const handlePressEnd = useCallback(() => {
    setIsPressing(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  }, []);

  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPreviewOpen]);

  return (
    <>
      <motion.div 
        ref={ref}
        style={{ opacity, perspective: 1200 }}
        className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-20 items-center`}
      >
        <motion.div 
          style={{ scale, rotateX, rotateY, filter }}
          className="w-full md:w-3/5 overflow-hidden rounded-[2rem] glass-panel relative group aspect-[4/3] md:aspect-[16/10] pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] cursor-pointer md:cursor-none"
          onPointerDown={handlePressStart}
          onPointerUp={handlePressEnd}
          onPointerLeave={handlePressEnd}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Desktop Hover View Button */}
          <motion.div 
            className="hidden md:flex absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 items-center justify-center bg-black/40 backdrop-blur-md pointer-events-none"
          >
            <Magnetic strength={60}>
              <div className="w-28 h-28 rounded-full bg-white text-black flex items-center justify-center font-bold uppercase tracking-widest text-sm transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 select-none">
                <motion.div
                  animate={{ scale: isPressing ? 0.85 : 1 }}
                  className="w-full h-full flex items-center justify-center rounded-full"
                >
                  {isPressing ? "Hold..." : "View"}
                </motion.div>
              </div>
            </Magnetic>
          </motion.div>

          {/* Mobile Hold Hint */}
          <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 text-white/90 text-[10px] font-mono uppercase tracking-widest flex items-center gap-3 z-20 shadow-xl pointer-events-none">
            <motion.div
              animate={{ scale: isPressing ? 0.8 : 1.2, opacity: isPressing ? 0.5 : 1 }}
              transition={{ repeat: isPressing ? 0 : Infinity, repeatType: "reverse", duration: 0.8 }}
              className="w-2 h-2 rounded-full bg-white"
            />
            {isPressing ? "Opening..." : "Hold to preview"}
          </div>

          <motion.img 
            style={{ y, scale: imageScale }}
            src={project.image} 
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-[150%] object-cover absolute top-[-25%] left-0 transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>
        
        <div className="w-full md:w-2/5 flex flex-col">
          <ScrollFade>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-mono tracking-widest uppercase" style={{ color: project.color }}>
                0{index + 1}
              </span>
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-sm font-mono tracking-widest uppercase text-white/60">
                {project.year}
              </span>
            </div>
          </ScrollFade>
          <ScrollFade>
            <h3 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight">{project.title}</h3>
          </ScrollFade>
          <ScrollFade>
            <p className="text-white/50 text-lg md:text-xl mb-10 leading-relaxed font-light">
              {project.category}
            </p>
          </ScrollFade>
          <ScrollFade>
            <Magnetic strength={20}>
              <button className="w-fit flex items-center gap-4 pb-3 border-b border-white/20 hover:border-white transition-colors group cursor-none pointer-events-auto">
                <span className="uppercase tracking-[0.2em] text-sm font-medium">Explore Case</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-3 transition-transform" />
              </button>
            </Magnetic>
          </ScrollFade>
        </div>
      </motion.div>

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl cursor-none pointer-events-auto"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={project.image}
              alt={project.title}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl pointer-events-none"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-8 right-8 text-white/50 font-mono text-sm uppercase tracking-widest pointer-events-none"
            >
              Click anywhere to close
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Work() {
  return (
    <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <ScrollFade>
          <h2 className="font-display text-6xl md:text-8xl font-bold tracking-tighter">
            SELECTED <br/>
            <span className="text-white/40 italic font-light">WORKS</span>
          </h2>
        </ScrollFade>
        <ScrollFade>
          <p className="text-white/60 max-w-sm text-lg">
            A curated selection of my recent projects, showcasing a blend of creative design and technical excellence.
          </p>
        </ScrollFade>
      </div>

      <div className="flex flex-col gap-40">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative pt-32 pb-12 px-6 md:px-12 overflow-hidden mt-32">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-transparent to-white/[0.02]" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-16 mb-32">
        <ScrollFade className="flex flex-col items-center md:items-start w-full md:w-auto">
          <h2 className="font-display text-6xl md:text-[9vw] leading-[0.85] font-bold tracking-tighter mb-8 text-center md:text-left">
            JOIN <br/>
            <span className="text-white/40 italic font-light">US</span>
          </h2>
          <Magnetic strength={40}>
            <a href="mailto:tatealenvip@gmail.com" className="group relative inline-flex items-center justify-center px-8 py-5 w-full md:w-auto rounded-full bg-white text-black font-medium uppercase tracking-widest overflow-hidden cursor-none active:scale-95 transition-transform pointer-events-auto">
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">tatealenvip@gmail.com</span>
              <div className="absolute inset-0 bg-black transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[0.76,0,0.24,1]" />
            </a>
          </Magnetic>
        </ScrollFade>
        
        <ScrollFade className="flex gap-4">
          {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
            <Magnetic key={i} strength={30}>
              <a href="#" className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-500 cursor-none group pointer-events-auto">
                <Icon className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-500" />
              </a>
            </Magnetic>
          ))}
        </ScrollFade>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-white/30 text-xs md:text-sm font-mono uppercase tracking-[0.2em] gap-4">
        <p>© {new Date().getFullYear()} Tate Alen</p>
        <p>Designed & Built with passion</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [loading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={handleLoadingComplete} />}
      </AnimatePresence>
      
      <CustomCursor />
      <AnimatedBackground />
      
      <motion.main
        className="pointer-events-none relative z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <Hero loading={loading} />
        <About />
        <Skills />
        <Work />
        <Footer />
      </motion.main>
    </>
  );
}
