import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import webGLFluidEnhanced from 'webgl-fluid';

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

  return (
    <section className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
      <motion.div style={{ y: y1, opacity }} className="text-center z-10 w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mb-6 px-5 py-2 rounded-full border border-white/10 glass-panel text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-white/80"
        >
          Creative Developer & Designer
        </motion.div>
        
        <div className="overflow-hidden py-2">
          <motion.h1 
            className="font-display text-[14vw] md:text-[9vw] font-bold leading-[0.85] tracking-tighter"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            CRAFTING
          </motion.h1>
        </div>
        <div className="overflow-hidden py-2 mb-6">
          <motion.h1 
            className="font-display text-[14vw] md:text-[9vw] font-bold leading-[0.85] tracking-tighter"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gradient italic pr-4">DIGITAL</span> EXPERIENCES
          </motion.h1>
        </div>
        
        <motion.p 
          className="max-w-xl mx-auto text-base md:text-xl text-white/60 font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        >
          I build immersive, interactive, and stunning web applications that leave a lasting impression.
        </motion.p>
      </motion.div>

      <motion.div 
        style={{ y: y2, opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
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
      <motion.span style={{ opacity, y, display: "inline-block" }}>{word}</motion.span>
    </span>
  );
}

function About() {
  const text = "I believe in the power of design to transform ideas into unforgettable digital experiences. Blending aesthetics with cutting-edge technology to build the web of tomorrow.";
  const words = text.split(" ");
  
  return (
    <section className="py-32 px-6 md:px-12 max-w-6xl mx-auto min-h-screen flex items-center justify-center">
      <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.1] font-medium text-center max-w-5xl">
        {words.map((word, i) => (
          <Word key={i} word={word} />
        ))}
      </h2>
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
  
  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity }}
      className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-20 items-center`}
    >
      <motion.div 
        style={{ scale }}
        className="w-full md:w-3/5 overflow-hidden rounded-[2rem] glass-panel relative group aspect-[4/3] md:aspect-[16/10] pointer-events-auto"
      >
        <motion.div 
          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <Magnetic strength={60}>
            <div className="w-28 h-28 rounded-full bg-white text-black flex items-center justify-center font-bold uppercase tracking-widest text-sm transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 cursor-none">
              View
            </div>
          </Magnetic>
        </motion.div>
        <motion.img 
          style={{ y }}
          src={project.image} 
          alt={project.title}
          className="w-full h-[130%] object-cover absolute top-[-15%] left-0"
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
            LET'S <br/>
            <span className="text-white/40 italic font-light">TALK</span>
          </h2>
          <Magnetic strength={40}>
            <a href="mailto:hello@example.com" className="group relative inline-flex items-center justify-center px-8 py-5 rounded-full bg-white text-black font-medium uppercase tracking-widest overflow-hidden cursor-none">
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">hello@example.com</span>
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
        <p>© {new Date().getFullYear()} PORTFOLIO</p>
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
          <Work />
          <Footer />
        </motion.main>
      )}
    </>
  );
}
