import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import webGLFluidEnhanced from 'webgl-fluid';
import Matter from 'matter-js';

function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#030303] flex flex-col items-center justify-center"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="font-display text-6xl md:text-8xl font-bold text-white mb-8">
        {Math.min(progress, 100)}%
      </div>
      <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
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
  }, []);

  return (
    <div className="custom-cursor-element hidden [@media(pointer:fine)]:block">
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 2.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-white/30 rounded-full pointer-events-none z-40"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.8 }}
      />
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
                      return typeof val === 'function' ? val.bind(tTarget) : val;
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
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#030303]">
      <canvas ref={canvasRef} className="w-full h-full" style={{ touchAction: 'auto' }} />
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-screen pointer-events-none"></div>
    </div>
  );
}

function Magnetic({ children, strength = 40 }: { children: React.ReactNode, strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: (middleX / width) * strength, y: (middleY / height) * strength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="pointer-events-auto"
    >
      {children}
    </motion.div>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 40; 
      const y = (clientY / innerHeight - 0.5) * -40;
      setRotateX(y);
      setRotateY(x);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section 
      className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden pointer-events-none"
      style={{ perspective: 1000 }}
    >
      <motion.div 
        style={{ y: y1, opacity, transformStyle: "preserve-3d" }} 
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 75, damping: 15, mass: 0.5 }}
        className="text-center z-10 w-full max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transform: "translateZ(60px)" }}
          className="inline-block mb-6 px-5 py-2 rounded-full border border-white/10 glass-panel text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-white/80"
        >
          Creative Developer & Designer
        </motion.div>
        
        <div className="overflow-hidden py-2" style={{ transform: "translateZ(100px)" }}>
          <motion.h1 
            className="font-display text-[14vw] md:text-[9vw] font-bold leading-[0.85] tracking-tighter"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            CRAFTING
          </motion.h1>
        </div>
        <div className="overflow-hidden py-2 mb-6" style={{ transform: "translateZ(80px)" }}>
          <motion.h1 
            className="font-display text-[14vw] md:text-[9vw] font-bold leading-[0.85] tracking-tighter"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gradient italic pr-4">DIGITAL</span> IMPRINTING
          </motion.h1>
        </div>
        
        <motion.p 
          className="max-w-xl mx-auto text-base md:text-xl text-white/60 font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          style={{ transform: "translateZ(40px)" }}
        >
          What is presented here is an imagination of movement for me. All the colors are flowing through my life.
        </motion.p>
      </motion.div>

      <motion.div 
        style={{ y: y2, opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
  const y = useTransform(scrollYProgress, [0, 1], [20, 0]);
  
  return (
    <span ref={ref} className="relative inline-block mr-[0.25em] mt-[0.1em]">
      <motion.span 
        style={{ opacity, y, display: "inline-block" }}
        whileHover={{ scale: 1.1, y: -10, color: "#fff", textShadow: "0px 0px 20px rgba(255,255,255,0.8)" }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="cursor-none transition-colors duration-300 pointer-events-auto"
      >
        {word}
      </motion.span>
    </span>
  );
}

function About() {
  const text = "I believe in the power of design to transform ideas into unforgettable digital experiences. Blending aesthetics with cutting-edge technology to build the web of tomorrow.";
  const words = text.split(" ");
  
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

const skillsList = ["React", "WebGL", "Three.js", "Framer Motion", "TailwindCSS", "UI/UX", "TypeScript", "Next.js", "Creative Coding", "GSAP"];

function Skills() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const [gravity, setGravity] = useState(false);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          World = Matter.World,
          Bodies = Matter.Bodies;

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    engine.world.gravity.y = 0; // Start with no gravity

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Walls
    const wallOptions = { isStatic: true, render: { visible: false } };
    const wallThickness = 50;
    World.add(world, [
        Bodies.rectangle(width / 2, -wallThickness/2, width, wallThickness, wallOptions), // Top
        Bodies.rectangle(width / 2, height + wallThickness/2, width, wallThickness, wallOptions), // Bottom
        Bodies.rectangle(-wallThickness/2, height / 2, wallThickness, height, wallOptions), // Left
        Bodies.rectangle(width + wallThickness/2, height / 2, wallThickness, height, wallOptions) // Right
    ]);

    const bodies = skillsList.map((skill, i) => {
        // Approximate size based on text length and padding
        const isMobile = window.innerWidth < 768;
        const charWidth = isMobile ? 8 : 10;
        const padding = isMobile ? 48 : 64;
        const w = skill.length * charWidth + padding;
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

    const runner = Runner.create();
    Runner.run(runner, engine);

    let animationFrameId: number;
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

    return () => {
        cancelAnimationFrame(animationFrameId);
        Runner.stop(runner);
        Engine.clear(engine);
        if (engine.world) {
            World.clear(engine.world, false);
        }
    };
  }, []);

  const handleReset = () => {
    if (!engineRef.current || !sceneRef.current) return;
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    bodiesRef.current.forEach((body, i) => {
      const skill = skillsList[i];
      const isMobile = window.innerWidth < 768;
      const charWidth = isMobile ? 8 : 10;
      const padding = isMobile ? 48 : 64;
      const w = skill.length * charWidth + padding;
      const h = isMobile ? 48 : 56;
      
      const x = Math.random() * (width - w) + w/2;
      const y = Math.random() * (height - h) + h/2;

      Matter.Body.setPosition(body, { x, y });
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(body, 0);
      Matter.Body.setAngle(body, 0);
    });

    setGravity(false);
    engineRef.current.world.gravity.y = 0;
  };

  const toggleGravity = () => {
    if (!engineRef.current) return;
    const newGravity = !gravity;
    setGravity(newGravity);
    engineRef.current.world.gravity.y = newGravity ? 1 : 0;
  };

  return (
    <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto overflow-hidden pointer-events-none">
      <div className="mb-16 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-center">
            INTERACTIVE <span className="text-white/40 italic font-light">PLAYGROUND</span>
          </h2>
          <p className="text-white/50 text-sm font-mono uppercase tracking-widest">Drag and throw the pills</p>
        </div>
        
        <div className="flex gap-4 z-20 relative">
          <button 
            onClick={handleReset} 
            className="px-6 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors font-mono text-sm uppercase tracking-widest pointer-events-auto cursor-none"
          >
            Reset
          </button>
          <button 
            onClick={toggleGravity} 
            className={`px-6 py-2 rounded-full border transition-colors font-mono text-sm uppercase tracking-widest pointer-events-auto cursor-none ${gravity ? 'bg-white text-black border-white' : 'border-white/20 hover:bg-white hover:text-black'}`}
          >
            Gravity: {gravity ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
      
      <div 
        ref={sceneRef} 
        className="relative w-full h-[500px] md:h-[600px] border border-white/10 rounded-[3rem] glass-panel overflow-hidden bg-white/[0.02] pointer-events-auto"
        style={{ touchAction: 'none' }}
      >
        {skillsList.map((skill, i) => (
          <div
            key={i}
            id={`skill-${i}`}
            className="absolute top-0 left-0 px-6 py-3 md:px-8 md:py-4 bg-white/5 border border-white/10 rounded-full backdrop-blur-md font-mono text-sm md:text-base uppercase tracking-wider text-white/80 select-none pointer-events-none shadow-lg whitespace-nowrap"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            {skill}
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] font-display text-[10vw] font-bold uppercase tracking-tighter text-center leading-none">
          SKILLS
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

  const handlePressStart = () => {
    setIsPressing(true);
    pressTimer.current = window.setTimeout(() => {
      setIsPreviewOpen(true);
      setIsPressing(false);
    }, 500); // 500ms long press
  };

  const handlePressEnd = () => {
    setIsPressing(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

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
          className="w-full md:w-3/5 overflow-hidden rounded-[2rem] glass-panel relative group aspect-[4/3] md:aspect-[16/10] pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <motion.div 
            className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center bg-black/40 backdrop-blur-md"
          >
            <Magnetic strength={60}>
              <div className="w-28 h-28 rounded-full bg-white text-black flex items-center justify-center font-bold uppercase tracking-widest text-sm transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 cursor-none select-none">
                <motion.div
                  onPointerDown={handlePressStart}
                  onPointerUp={handlePressEnd}
                  onPointerLeave={handlePressEnd}
                  onContextMenu={(e) => e.preventDefault()}
                  animate={{ scale: isPressing ? 0.85 : 1 }}
                  className="w-full h-full flex items-center justify-center rounded-full"
                >
                  {isPressing ? "Hold..." : "View"}
                </motion.div>
              </div>
            </Magnetic>
          </motion.div>
          <motion.img 
            style={{ y, scale: imageScale }}
            src={project.image} 
            alt={project.title}
            className="w-full h-[150%] object-cover absolute top-[-25%] left-0 transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>
        
        <div className="w-full md:w-2/5 flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-mono tracking-widest uppercase" style={{ color: project.color }}>
              0{index + 1}
            </span>
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-sm font-mono tracking-widest uppercase text-white/60">
              {project.year}
            </span>
          </div>
          <h3 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight">{project.title}</h3>
          <p className="text-white/50 text-lg md:text-xl mb-10 leading-relaxed font-light">
            {project.category}
          </p>
          <Magnetic strength={20}>
            <button className="w-fit flex items-center gap-4 pb-3 border-b border-white/20 hover:border-white transition-colors group cursor-none">
              <span className="uppercase tracking-[0.2em] text-sm font-medium">Explore Case</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-3 transition-transform" />
            </button>
          </Magnetic>
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
        <h2 className="font-display text-6xl md:text-8xl font-bold tracking-tighter">
          SELECTED <br/>
          <span className="text-white/40 italic font-light">WORKS</span>
        </h2>
        <p className="text-white/60 max-w-sm text-lg">
          A curated selection of my recent projects, showcasing a blend of creative design and technical excellence.
        </p>
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
        <div className="flex flex-col items-center md:items-start w-full md:w-auto">
          <h2 className="font-display text-6xl md:text-[9vw] leading-[0.85] font-bold tracking-tighter mb-8 text-center md:text-left">
            JOIN <br/>
            <span className="text-white/40 italic font-light">US</span>
          </h2>
          <Magnetic strength={40}>
            <a href="mailto:tatealenvip@gmail.com" className="group relative inline-flex items-center justify-center px-8 py-5 rounded-full bg-white text-black font-medium uppercase tracking-widest overflow-hidden cursor-none">
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">hello@skyhome.studio</span>
              <div className="absolute inset-0 bg-black transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[0.76,0,0.24,1]" />
            </a>
          </Magnetic>
        </div>
        
        <div className="flex gap-4">
          {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
            <Magnetic key={i} strength={30}>
              <a href="#" className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-500 cursor-none group">
                <Icon className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-500" />
              </a>
            </Magnetic>
          ))}
        </div>
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
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      <CustomCursor />
      <AnimatedBackground />
      
      {!loading && (
        <motion.main
          className="pointer-events-none relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Hero />
          <About />
          <Skills />
          <Work />
          <Footer />
        </motion.main>
      )}
    </>
  );
}
