import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import music from "./assets/love_Thuy.mp3";
import mylove from "./assets/baobao.png";

/* ============================= */
/* THÔNG TIN CÁ NHÂN */
/* ============================= */

const GIRL_NAME = "Baobao của anh"; 
const LOVE_IMAGE =mylove;

/* ============================= */
/* DATA GAME */
/* ============================= */

const LOVE_PIECES = [
  { id: 1, icon: "❤️", label: "Tình yêu", top: "15%", left: "20%" },
  { id: 2, icon: "🌹", label: "Sự quan tâm", top: "65%", left: "15%" },
  { id: 3, icon: "✨", label: "Niềm tin", top: "25%", left: "80%" },
  { id: 4, icon: "🎈", label: "Kỷ niệm", top: "80%", left: "70%" },
  { id: 5, icon: "💎", label: "Trân trọng", top: "45%", left: "50%" }
];

/* ============================= */
/* HELPER SOUND */
/* ============================= */

const playSound = (src) => {
  const a = new Audio(src);
  a.volume = 0.7;
  a.play().catch(() => {});
};

/* ============================= */
/* APP */
/* ============================= */

export default function App() {
  const [foundIds, setFoundIds] = useState([]);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [stage, setStage] = useState("searching");
  const [particles, setParticles] = useState([]);

  const audioRef = useRef(null);

  /* ============================= */
  /* CURSOR LIGHT */
  /* ============================= */

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, []);

  /* ============================= */
  /* PARTICLE */
  /* ============================= */

  const createParticle = (x, y) => {
    const id = Date.now();

    setParticles((p) => [...p, { id, x, y }]);

    setTimeout(() => {
      setParticles((p) => p.filter((p2) => p2.id !== id));
    }, 1000);
  };

  /* ============================= */
  /* COLLECT PIECE */
  /* ============================= */

  const collectPiece = (id) => {
    if (!foundIds.includes(id)) {
      setFoundIds([...foundIds, id]);

      playSound(
        "love_Thuy.mp3"
      );

      createParticle(mousePos.x, mousePos.y);

      confetti({
        particleCount: 30,
        spread: 100,
        origin: {
          x: mousePos.x / window.innerWidth,
          y: mousePos.y / window.innerHeight
        }
      });

      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  /* ============================= */
  /* OPEN GIFT */
  /* ============================= */

  const openGift = () => {
    setStage("message");

    const duration = 5000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);

      confetti({
        particleCount: 60,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  /* ============================= */
  /* RENDER */
  /* ============================= */

  return (
    <motion.div
      className="relative w-full h-screen overflow-hidden"
      animate={{
        background: [
          "linear-gradient(135deg,#1e293b,#0f172a)",
          "linear-gradient(135deg,#3b044b,#0f172a)",
          "linear-gradient(135deg,#1e293b,#6d28d9)"
        ]
      }}
      transition={{ repeat: Infinity, duration: 20 }}
    >

      {/* STARS */}

      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/40"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3 + Math.random() * 2
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* LIGHT EFFECT */}

      {stage !== "message" && (
        <div
          className="pointer-events-none fixed inset-0 z-50"
          style={{
            background: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, rgba(255,192,203,0.6) 0%, transparent 80%)`
          }}
        />
      )}

      {/* GAME */}

      {stage === "searching" &&
        LOVE_PIECES.map((p) => (
          <motion.div
            key={p.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 1.4 }}
            onClick={() => collectPiece(p.id)}
            className="absolute z-40 cursor-pointer"
            style={{ top: p.top, left: p.left }}
          >
            {foundIds.includes(p.id) ? (
              <span className="text-4xl">{p.icon}</span>
            ) : (
              <div className="w-6 h-6 rounded-full border border-pink-400 animate-pulse" />
            )}
          </motion.div>
        ))}

      {/* PROGRESS */}
      {stage === "searching" && (
       <div className="absolute top-10 w-full text-4xl text-center text-rose-300">
        Cảnh báo có nhạc của Bàm Công Nui
       </div>
    )}

      {stage === "searching" && (
        <div className="absolute bottom-10 w-full text-center text-pink-300">
          Tìm {foundIds.length}/{LOVE_PIECES.length} mảnh ghép tình yêu 💖
        </div>
      )}

      {/* GIFT */}

      <AnimatePresence>
        {foundIds.length === LOVE_PIECES.length && stage === "searching" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <motion.div
              className="text-9xl cursor-pointer"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={() => setStage("gift")}
            >
              🎁
            </motion.div>

            <p className="text-pink-400 mt-6">
              Bấm vào hộp quà để mở bất ngờ
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OPEN BUTTON */}

      {stage === "gift" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <button
            onClick={openGift}
            className="px-8 py-4 bg-pink-500 text-white rounded-full text-xl"
          >
            MỞ QUÀ 💖
          </button>
        </div>
      )}

      {/* MESSAGE */}

      <AnimatePresence>
        {stage === "message" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-pink-100 text-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <img
              src={LOVE_IMAGE}
              className="w-48 h-48 object-cover rounded-2xl shadow-xl mb-6"
            />

            <h1 className="text-5xl font-bold text-pink-600">
              Happy 8/3 {GIRL_NAME} ❤️
            </h1>

            <p className="mt-6 text-lg text-gray-700 max-w-lg italic">
              {GIRL_NAME} à,  
Cảm ơn em vì đã xuất hiện trong cuộc đời anh,

một cách rất nhẹ nhàng nhưng lại khiến mọi thứ trở nên đặc biệt hơn.

Nhân ngày 8/3, anh chúc em luôn vui vẻ, xinh xắn và thật nhiều năng lượng tích cực.
Mong rằng em sẽ sớm tìm được một công việc mà em thật sự yêu thích,
một nơi khiến em mỗi ngày đều cảm thấy hào hứng khi bắt đầu.

Cứ yên tâm bước tiếp nhé,
mọi thứ rồi sẽ ổn thôi ❤️

            </p>

            <div className="text-4xl mt-6">
              🌸 💖 🌸
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PARTICLES */}

      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1 }}
          animate={{ y: -80, opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: "fixed",
            left: p.x,
            top: p.y
          }}
        >
          💕
        </motion.div>
      ))}

      {/* MUSIC */}

      <audio ref={audioRef} loop>
        <source src={music} type="audio/mpeg" />
      </audio>

    </motion.div>
  );
}