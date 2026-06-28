import React, { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Smartphone, 
  Shield, 
  Flame, 
  Activity, 
  Swords, 
  Zap, 
  Award, 
  CheckCircle2, 
  Trophy, 
  Download, 
  FileText, 
  Lock, 
  Sparkles, 
  X, 
  HelpCircle,
  TrendingUp,
  Dumbbell,
  BookOpen,
  Compass,
  AlertTriangle,
  ChevronRight
} from "lucide-react";

// Types for the Interactive Quest Interface
interface Stat {
  name: string;
  abbreviation: string;
  value: number;
  description: string;
}

interface QuestItem {
  id: string;
  name: string;
  type: "workout" | "study" | "mind";
  current: number;
  target: number;
  unit: string;
  rewardStr: string;
}

export default function App() {
  // Personalized state using user prefix
  const userPlaceholder = "Malindu"; 
  const [hunterName, setHunterName] = useState(userPlaceholder);
  const [isEditingName, setIsEditingName] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Shadow Monarch");
  
  // Interactive RPG Game States
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(70);
  const maxXp = 100;
  const [statPoints, setStatPoints] = useState(5);
  const [gold, setGold] = useState(150);
  const [fatigue, setFatigue] = useState(15);
  
  const [stats, setStats] = useState<Stat[]>([
    { name: "Strength", abbreviation: "STR", value: 48, description: "Increases physical power load and overall stamina" },
    { name: "Vitality", abbreviation: "VIT", value: 24, description: "Boosts max health pools and natural recovery rates" },
    { name: "Agility", abbreviation: "AGI", value: 32, description: "Improves workout speeds and motor reflexes" },
    { name: "Intelligence", abbreviation: "INT", value: 14, description: "Enhances study focus and logic problem-solving" },
    { name: "Senses", abbreviation: "SEN", value: 18, description: "Sharpens situational awareness and sleep metrics" },
  ]);

  const [quests, setQuests] = useState<QuestItem[]>([
    { id: "q1", name: "100 Pushups routine", type: "workout", current: 80, target: 100, unit: "reps", rewardStr: "+1 STR, +10 XP" },
    { id: "q2", name: "Read & Learn Coding", type: "study", current: 25, target: 30, unit: "mins", rewardStr: "+1 INT, +15 XP" },
    { id: "q3", name: "Mindful Meditation", type: "mind", current: 5, target: 10, unit: "mins", rewardStr: "+1 SEN, +5 XP" },
  ]);

  // Notifications or toast messages
  const [notification, setNotification] = useState<string | null>(null);
  const [levelUpTriggered, setLevelUpTriggered] = useState(false);

  // Privacy Policy Modal State
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Simple custom SPA route tracking to support standard /privacy url structure
  const [currentRoute, setCurrentRoute] = useState<"main" | "privacy">(() => {
    if (typeof window !== "undefined") {
      try {
        return window.location.pathname === "/privacy" ? "privacy" : "main";
      } catch (err) {
        console.warn("Unable to access pathname due to sandboxing:", err);
      }
    }
    return "main";
  });

  useEffect(() => {
    const handleLocationChange = () => {
      try {
        setCurrentRoute(window.location.pathname === "/privacy" ? "privacy" : "main");
      } catch (err) {
        console.warn("Unable to access pathname during popstate event:", err);
      }
    };
    try {
      window.addEventListener("popstate", handleLocationChange);
    } catch (err) {
      console.warn("Unable to add popstate listener:", err);
    }
    return () => {
      try {
        window.removeEventListener("popstate", handleLocationChange);
      } catch (err) {
        // Safe ignore
      }
    };
  }, []);

  const navigateTo = (route: "main" | "privacy") => {
    const path = route === "privacy" ? "/privacy" : "/";
    try {
      window.history.pushState({}, "", path);
    } catch (err) {
      console.warn("Unable to pushState due to sandboxing, routing locally only:", err);
    }
    setCurrentRoute(route);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      try {
        window.scrollTo(0, 0);
      } catch (scrollErr) {
        // Safe ignore
      }
    }
  };

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const triggerProgress = (id: string) => {
    setQuests(prevQuests => 
      prevQuests.map(q => {
        if (q.id === id) {
          if (q.current >= q.target) {
            setNotification(`Quest "${q.name}" is already fully finished!`);
            return q;
          }
          const increment = q.type === "workout" ? 10 : 5;
          const nextVal = Math.min(q.target, q.current + increment);
          const completedNow = nextVal === q.target;
          
          if (completedNow) {
            setNotification(`🏆 Quest Completed: ${q.name}! Recieved bonus gold & extra leveling XP!`);
            setXp(prevXp => {
              const newXp = prevXp + 25;
              if (newXp >= maxXp) {
                // Trigger level up animation and update values
                setTimeout(() => {
                  setLevel(l => l + 1);
                  setXp(newXp - maxXp);
                  setStatPoints(p => p + 5);
                  setGold(g => g + 120);
                  setFatigue(f => Math.max(0, f - 10));
                  setLevelUpTriggered(true);
                  setNotification("🌟 SYSTEM ALERT: CONGRATULATIONS! YOU HAVE LEVELED UP!");
                }, 400);
              }
              return newXp;
            });
            
            // Add automatic stats awards based on quest type
            setStats(prevStats => 
              prevStats.map(s => {
                if (q.type === "workout" && s.abbreviation === "STR") return { ...s, value: s.value + 2 };
                if (q.type === "study" && s.abbreviation === "INT") return { ...s, value: s.value + 2 };
                if (q.type === "mind" && s.abbreviation === "SEN") return { ...s, value: s.value + 1 };
                return s;
              })
            );

            setGold(g => g + 50);
          }
          return { ...q, current: nextVal };
        }
        return q;
      })
    );
  };

  const resetInteractiveDemo = () => {
    setLevel(1);
    setXp(70);
    setStatPoints(5);
    setGold(150);
    setFatigue(15);
    setStats([
      { name: "Strength", abbreviation: "STR", value: 48, description: "Increases physical power load and overall stamina" },
      { name: "Vitality", abbreviation: "VIT", value: 24, description: "Boosts max health pools and natural recovery rates" },
      { name: "Agility", abbreviation: "AGI", value: 32, description: "Improves workout speeds and motor reflexes" },
      { name: "Intelligence", abbreviation: "INT", value: 14, description: "Enhances study focus and logic problem-solving" },
      { name: "Senses", abbreviation: "SEN", value: 18, description: "Sharpens situational awareness and sleep metrics" },
    ]);
    setQuests([
      { id: "q1", name: "100 Pushups routine", type: "workout", current: 80, target: 100, unit: "reps", rewardStr: "+1 STR, +10 XP" },
      { id: "q2", name: "Read & Learn Coding", type: "study", current: 25, target: 30, unit: "mins", rewardStr: "+1 INT, +15 XP" },
      { id: "q3", name: "Mindful Meditation", type: "mind", current: 5, target: 10, unit: "mins", rewardStr: "+1 SEN, +5 XP" },
    ]);
    setNotification("System simulator metrics reset to defaults.");
  };

  const allocateStatPoint = (abbreviation: string) => {
    if (statPoints <= 0) {
      setNotification("No remaining stat points. Conquer quests to level up and obtain more!");
      return;
    }
    setStats(prev => 
      prev.map(s => {
        if (s.abbreviation === abbreviation) {
          return { ...s, value: s.value + 1 };
        }
        return s;
      })
    );
    setStatPoints(p => p - 1);
    setNotification(`Allocated 1 Attribute Point into ${abbreviation}!`);
  };

  // Determine Rank based on interactive Level
  const getRank = (lvl: number) => {
    if (lvl >= 10) return "S-Rank";
    if (lvl >= 7) return "A-Rank";
    if (lvl >= 5) return "B-Rank";
    if (lvl >= 3) return "C-Rank";
    if (lvl >= 2) return "D-Rank";
    return "E-Rank";
  };

  if (currentRoute === "privacy") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 sm:p-12 relative overflow-hidden flex flex-col justify-between selection:bg-blue-600 selection:text-white" id="privacy-page-container">
        <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-blue-600/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto w-full space-y-10 py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-8">
            <div className="space-y-2">
              <button 
                onClick={() => navigateTo("main")} 
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-zinc-500 hover:text-blue-500 transition-colors cursor-pointer mb-2 bg-transparent border-0 p-0"
              >
                ← Return to main terminal
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black italic text-white shadow-lg shadow-blue-600/20">K</div>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-100 uppercase tracking-tighter">
                  Kaisel Sovereign Privacy Policy
                </h1>
              </div>
              <p className="text-xs text-zinc-500 font-mono">Status: Verified Offline Protocol • Last Updated: June 23, 2026</p>
            </div>
          </div>

          {/* Privacy Content Blocks */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm text-zinc-300 leading-relaxed font-mono shadow-2xl relative">
            <div className="absolute inset-0 bg-blue-600/[0.01] pointer-events-none rounded-3xl" />
            
            <div className="space-y-3">
              <span className="block font-display font-black text-lg text-zinc-100 uppercase tracking-tight text-blue-500">1. Decentralized Local Sandboxing</span>
              <p>
                Kaisel is engineered entirely as an offline-first system tool. The application stores all your personalized attributes values (STR, Vitality, Agility), XP counters, level benchmarks, local workout goals, study durations, and completed milestones locally on your device storage inside sandboxed binary layouts. No personal profiles are ever requested, stored or transmitted onto corporate server infrastructure.
              </p>
            </div>

            <div className="space-y-3">
              <span className="block font-display font-black text-lg text-zinc-100 uppercase tracking-tight text-blue-500">2. Telemetry and Local Integrations</span>
              <p>
                For automatic verification index syncs, you can optionally connect local Android step telemetry sensors. The metrics derived from physical workouts are inspected purely on-device and instantly converted to attribute stats increments. We strictly maintain a policy of zero central logging, zero location metrics caching, and zero device identity verification uploads. 
              </p>
            </div>

            <div className="space-y-3">
              <span className="block font-display font-black text-lg text-zinc-100 uppercase tracking-tight text-blue-500">3. Absolute Zero Adware/Trackers</span>
              <p>
                The Kaisel application is fundamentally open source inspired and contains zero telemetry tracker platforms, zero analytical pixel codes (such as Google Analytics or meta tracking structures), and zero marketing ad services. Our development relies solely on clean, transparent logic configurations.
              </p>
            </div>

            <div className="space-y-3">
              <span className="block font-display font-black text-lg text-zinc-100 uppercase tracking-tight text-blue-500">4. Controller & Contact Reference</span>
              <p>
                If you require assistance regarding the standalone installer source modules or wish to request revisions to the gamified physical ratios configurations, you can contact the system architect over physical coordinate address or directly contact via mail: <a href="mailto:malinduchethiyaatwork@gmail.com" className="text-blue-400 underline lowercase">malinduchethiyaatwork@gmail.com</a>.
              </p>
            </div>
          </div>

          {/* Accept / Done button */}
          <div className="text-center pt-4">
            <button 
              onClick={() => navigateTo("main")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-display font-bold py-3 px-10 rounded-xl text-xs uppercase tracking-wider transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-blue-500/10"
            >
              Acknowledge & Return to Terminal
            </button>
          </div>
        </div>

        {/* Small Footer */}
        <footer className="border-t border-zinc-900 py-8 text-center text-[10px] text-zinc-650 uppercase tracking-[0.2em] font-mono mt-12 w-full">
          © {new Date().getFullYear()} Kaisel Sovereign System Integration • Built with Bento aesthetics of the Monarchs.
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-600 selection:text-white" id="main-container">
      
      {/* Level-Up Celebration Overlay */}
      <AnimatePresence>
        {levelUpTriggered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-4 text-center cursor-pointer"
            onClick={() => setLevelUpTriggered(false)}
            id="levelup-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ type: "spring", scale: 1, y: 0 }}
              className="relative p-8 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl max-w-md w-full"
            >
              {/* Blue accent glow */}
              <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-2xl" />
              
              <div className="relative z-10 space-y-4">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="mx-auto w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center border border-blue-400 mb-2"
                >
                  <Trophy className="w-8 h-8 text-white" />
                </motion.div>

                <h2 className="font-display font-black text-4xl text-blue-500 tracking-tighter uppercase">
                  LEVEL UP
                </h2>
                
                <p className="text-zinc-400 text-sm">
                  The Sovereign system acknowledges your daily training progress.
                </p>

                <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 text-left space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">CURRENT CLASSIFICATION</span>
                    <span className="font-mono font-bold text-blue-400">Lv. {level} ({getRank(level)})</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">SPENDABLE STAT POINTS</span>
                    <span className="font-mono font-bold text-emerald-400">+{5} (Total Remaining: {statPoints})</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">QUEST REWARDS</span>
                    <span className="font-mono font-bold text-yellow-400">+120 Gold / +2 Stats</span>
                  </div>
                </div>

                <button 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-display font-bold py-3 rounded-xl transition-all uppercase tracking-wider text-sm cursor-pointer"
                  onClick={() => setLevelUpTriggered(false)}
                >
                  CONFIRM AWAKENING
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 sm:px-8 border-b border-zinc-850 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-45" id="main-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black italic text-white shadow-lg shadow-blue-600/20">K</div>
          <span className="font-display font-black text-xl tracking-tighter uppercase text-zinc-100">Kaisel</span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-black text-zinc-500">
          <a href="#how-it-works" className="hover:text-blue-500 transition-colors">System Mechanics</a>
          <a href="#interactive-simulator" className="text-blue-400 hover:text-blue-500 transition-colors">Interactive HUD</a>
          <a href="#app-features" className="hover:text-blue-500 transition-colors">Dungeon Perks</a>
          <a href="#downloads" className="hover:text-blue-500 transition-colors">Download</a>
        </nav>

        <div>
          <a 
            href="#downloads" 
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-100 px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-bold transition-all inline-flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
            <span>Install APK</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-2xl max-w-md w-[calc(100%-2rem)] flex items-start gap-3"
              id="system-notification"
            >
              <div className="p-1.5 rounded bg-blue-600/20 text-blue-400">
                <Sparkles className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <span className="block text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-500">System Broadcast</span>
                <span className="text-zinc-200 text-sm font-medium">{notification}</span>
              </div>
              <button onClick={() => setNotification(null)} className="text-zinc-500 hover:text-zinc-350">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bento Grid Header / Hero Module */}
        <div className="grid grid-cols-12 gap-4" id="hero-section">
          
          {/* Main Giant Hero Card (8 Cols / Rows) */}
          <div className="col-span-12 lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between relative overflow-hidden group min-h-[360px]">
            {/* Ambient dynamic glow in the background */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="z-10 flex flex-col justify-between max-w-xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-blue-400 uppercase tracking-wider mb-4">
                  <span className="animate-pulse inline-block w-2 bg-blue-500 h-2 rounded-full" />
                  <span>The System has Awakening Rules</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] uppercase">
                  AWAKEN YOUR <span className="text-blue-500">LIMITS.</span>
                </h1>
                
                <p className="text-zinc-400 text-sm sm:text-base mt-4 leading-relaxed">
                  Kaisel turns your daily workout, coding logs, and tasks into a legendary levelling system inspired by legendary web novels. Upgrade attributes real-time, conquer critical fitness goals offline, and view your ranking climb. 
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#downloads" 
                  className="bg-white hover:bg-zinc-250 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transform hover:-translate-y-0.5 transition-all text-sm uppercase"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK</span>
                </a>
                <a 
                  href="#interactive-simulator" 
                  className="border border-zinc-700 hover:border-zinc-500 bg-zinc-950/40 text-zinc-300 px-6 py-3 rounded-xl font-bold text-sm uppercase transition-all"
                >
                  View Simulator
                </a>
              </div>
            </div>

            {/* Float holographic preview */}
            <div className="relative mt-8 md:mt-0 md:w-56 flex items-center justify-center">
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/90 shadow-xl max-w-xs w-full rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
                <div className="text-[10px] text-blue-400 font-mono mb-2 uppercase tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                  <span>[System Message]</span>
                </div>
                <div className="text-xs italic text-zinc-300 mb-4 font-mono">
                  "Ready for assessment, hunter Malindu. 2/3 logs finished."
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>HUNTER LEVEL UP</span>
                    <span>65.4%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[65%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Stats Card (4 cols / Rows) */}
          <div className="col-span-12 lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between" id="how-it-works">
            <div>
              <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-3">Player Status Build</div>
              <h3 className="font-display font-bold text-xl text-zinc-100 uppercase mb-4">Initial Class Specs</h3>
              
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm border-b border-zinc-850 pb-1.5">
                  <span className="text-zinc-400 font-medium font-mono text-xs">STR PHYSICAL POWER</span>
                  <span className="text-blue-400 font-mono font-bold">48</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-zinc-850 pb-1.5">
                  <span className="text-zinc-400 font-medium font-mono text-xs">AGI SPEED & WORK</span>
                  <span className="text-blue-400 font-mono font-bold">32</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-zinc-850 pb-1.5">
                  <span className="text-zinc-400 font-medium font-mono text-xs">INT CODE MIND</span>
                  <span className="text-blue-400 font-mono font-bold">14</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-950/50 p-3 rounded-xl border border-zinc-900">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Equipped Class Status</span>
              <span className="text-xs uppercase font-black text-white px-2 py-1 bg-zinc-900 border border-zinc-850 rounded">
                SHADOW MONARCH
              </span>
            </div>
          </div>

        </div>

        {/* Detailed Mechanics - Dynamic Bento Widgets */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Bento Upwards Callout Card (4 Cols) */}
          <div className="col-span-12 md:col-span-4 bg-blue-600 rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden group min-h-[220px]">
            <div className="absolute right-0 bottom-0 opacity-15 transform translate-x-4 translate-y-4 font-black italic text-8xl pointer-events-none">RPG</div>
            
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200 bg-blue-700/60 px-2 py-0.5 rounded-md inline-block">System Logic</span>
              <h3 className="text-2xl font-black italic tracking-tight uppercase leading-tight">LEVEL UP REPUTATION.</h3>
              <p className="text-xs text-blue-100leading-relaxed">
                Complete designated daily physical exercises e.g., pushing ups, meditating, or studying code algorithms to obtain XP modules.
              </p>
            </div>
            
            <div className="mt-4 bg-blue-700/80 p-3 rounded-xl text-xs font-mono border border-blue-400/20">
              <span className="text-blue-200">ACTIVE RAID PROGRESS:</span><br/>
              100 pushups, 30m code study = +1 Level
            </div>
          </div>

          {/* Global Hunter Ranking Widget Card (4 Cols) */}
          <div className="col-span-12 md:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-2 min-h-[220px]">
            <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 text-blue-500 mb-2">
              <Trophy className="w-5 h-5 fill-blue-500" />
            </div>
            <div className="text-3xl font-black tracking-tighter text-zinc-100 uppercase font-display">
              RANK #1,402
            </div>
            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              Global Hunter System Ranking
            </div>
            <p className="text-[11px] text-zinc-400 max-w-[240px]">
              Climb local leagues based on verified offline weekly quests completions.
            </p>
          </div>

          {/* Quick Feature Passive Grid Card (4 Cols) */}
          <div className="col-span-12 md:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-3">Sovereign Perks</div>
              <div className="text-sm font-bold text-zinc-200 font-display mb-2">Passive Class Skills Unlocked</div>
              
              <div className="flex gap-2.5 mt-3">
                <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 text-lg hover:border-zinc-700 transition-colors" title="Lightning Swiftness">⚡</div>
                <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 text-lg hover:border-zinc-700 transition-colors" title="Iron Safeguard">🛡️</div>
                <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 text-lg hover:border-zinc-700 transition-colors" title="Flame Sparkle">🔥</div>
                <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 text-lg hover:border-zinc-700 transition-colors" title="Shadow Guard">🛡</div>
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 mt-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dungeon Route: The Morning Commute (45m Clear)</span>
            </div>
          </div>

        </div>

        {/* Live Interactive Simulator HUD (Fully Styled Bento Layout) */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 scroll-mt-20" id="interactive-simulator">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                  Live Terminal Simulator
                </span>
                <span className="text-xs text-zinc-500 font-mono">v1.0.4-INTEGRATION</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-100 uppercase tracking-tight">
                THE KAISEL QUEST INTERFACE
              </h2>
              <p className="text-sm text-zinc-400 max-w-xl">
                Test the client-side leveling mechanism. Click <strong className="text-blue-500 font-semibold">+ Mock Log</strong> beneath active quests to increase progress, achieve level elevations, and obtain attributes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={resetInteractiveDemo}
                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-mono transition-colors font-bold cursor-pointer"
              >
                Reset Interface
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Side: Avatar, Specs & Attribute Spend block (5 columns) */}
            <div className="col-span-12 lg:col-span-5 bg-zinc-950 rounded-2xl border border-zinc-850 p-6 space-y-6">
              
              {/* Persona Avatar card */}
              <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-850">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center border border-blue-400 font-black text-xl italic text-white shadow-lg shadow-blue-500/20">
                  {level}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {isEditingName ? (
                      <input 
                        type="text" 
                        value={hunterName} 
                        onChange={(e) => setHunterName(e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                        className="bg-zinc-950 border border-blue-500 text-white rounded px-2 py-1 text-sm font-display font-medium w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => setIsEditingName(true)}
                          className="font-display font-bold text-base text-zinc-100 hover:text-blue-400 cursor-pointer transition-colors border-b border-dashed border-zinc-700"
                        >
                          {hunterName || "Sovereign"}
                        </span>
                        <button onClick={() => setIsEditingName(true)} className="text-[10px] text-zinc-500 hover:text-blue-400 uppercase font-bold tracking-wider">Edit</button>
                      </div>
                    )}
                    
                    <span className="text-[10px] px-2 py-0.5 bg-blue-950 text-blue-400/90 rounded border border-blue-900/40 uppercase tracking-widest font-mono ml-auto">
                      {getRank(level)}
                    </span>
                  </div>

                  {/* Class designation Dropdown */}
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">CLASS PROTOCOL:</span>
                    <select 
                      value={selectedClass} 
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="bg-transparent text-blue-400 hover:text-blue-300 text-xs font-mono font-bold border-0 p-0 cursor-pointer focus:ring-0 focus:outline-none"
                    >
                      <option value="Shadow Monarch" className="bg-zinc-900 text-zinc-100">Shadow Monarch</option>
                      <option value="Sovereign Fighter" className="bg-zinc-900 text-zinc-100">Sovereign Fighter</option>
                      <option value="High Wizard" className="bg-zinc-900 text-zinc-100">High Wizard</option>
                      <option value="Rogue Spear" className="bg-zinc-900 text-zinc-100">Rogue Spear</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Stats telemetry panel */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">LEVEL METERS (XP)</span>
                  <span className="text-blue-400 font-bold">{xp} / {maxXp} XP</span>
                </div>
                
                <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                  <motion.div 
                    className="h-full bg-blue-600"
                    animate={{ width: `${(xp / maxXp) * 100}%` }}
                    transition={{ type: "spring", stiffness: 85 }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
                  <div>
                    <span className="block text-[9px] text-zinc-500 font-mono uppercase">System Gold</span>
                    <span className="text-lg font-mono font-bold text-yellow-500">{gold}g</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-500 font-mono uppercase font-bold">Physical Fatigue</span>
                    <span className={`text-lg font-mono font-bold ${fatigue > 70 ? "text-red-500" : "text-sky-450"}`}>{fatigue}%</span>
                  </div>
                </div>
              </div>

              {/* Attributes block */}
              <div className="space-y-3 pt-3 border-t border-zinc-900">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-zinc-400">CHARACTER ATTRIBUTES</span>
                  {statPoints > 0 && (
                    <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase animate-pulse">
                      {statPoints} Attributes Points Left!
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {stats.map((st) => (
                    <div 
                      key={st.abbreviation}
                      className="flex items-center justify-between text-xs bg-zinc-900 p-2.5 rounded-xl border border-zinc-850 hover:border-zinc-800 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-zinc-500 w-10 text-left">{st.abbreviation}</span>
                          <span className="text-zinc-200 font-bold font-display">{st.name}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500">{st.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-blue-400 font-bold bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-850 min-w-8 text-center">{st.value}</span>
                        {statPoints > 0 && (
                          <button 
                            onClick={() => allocateStatPoint(st.abbreviation)}
                            className="w-6 h-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center font-black text-xs transition-colors cursor-pointer"
                            title={`Allocate point to ${st.name}`}
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side: Quest boards (7 columns) */}
            <div className="col-span-12 lg:col-span-7 bg-zinc-950 rounded-2xl border border-zinc-850 p-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Daily Target Quest Logs</span>
                  <span className="text-[10px] text-zinc-500 font-mono">D-QUEST_CODE_939</span>
                </div>

                {/* Pre-requisite alert banner */}
                <div className="p-4 bg-zinc-900 rounded-xl border border-blue-900/20 relative overflow-hidden">
                  <div className="absolute right-0 top-0 text-blue-500/10 pointer-events-none transform translate-x-3 -translate-y-3 text-7xl font-mono font-black select-none">!</div>
                  <div className="relative z-10 space-y-1.5">
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-950 border border-red-900/35 rounded text-[8px] font-mono font-bold text-red-400 uppercase">
                      Class Obligation
                    </div>
                    <h4 className="font-display font-semibold text-sm text-zinc-100 uppercase">Pre-requisite for Sovereign Title</h4>
                    <p className="text-xs text-zinc-405 leading-relaxed">
                      "System warning protocols state that missing regular weekly exercises locks down attributes accumulation points."
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {quests.map((q) => {
                    const progressPercent = Math.min(100, Math.round((q.current / q.target) * 100));
                    const isDone = q.current >= q.target;
                    
                    return (
                      <div 
                        key={q.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isDone 
                            ? "bg-zinc-900/40 border-zinc-900/60" 
                            : "bg-zinc-900 border-zinc-850"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              )}
                              <h5 className={`font-display font-bold text-sm ${isDone ? "text-zinc-500 line-through" : "text-zinc-250"}`}>
                                {q.name}
                              </h5>
                            </div>
                            <span className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                              REWARD: {q.rewardStr}
                            </span>
                          </div>
                          
                          <button 
                            onClick={() => triggerProgress(q.id)}
                            disabled={isDone}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all uppercase ${
                              isDone 
                                ? "bg-zinc-950 text-zinc-700 cursor-not-allowed border border-zinc-900" 
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10 cursor-pointer"
                            }`}
                          >
                            <span>{isDone ? "Cleared" : "+ Mock Log"}</span>
                          </button>
                        </div>

                        <div className="space-y-1.5 font-mono">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-zinc-500">Completed Metric</span>
                            <span className={isDone ? "text-emerald-500 font-bold" : "text-zinc-300"}>
                              {q.current} / {q.target} {q.unit} ({progressPercent}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
                            <motion.div 
                              className={`h-full ${isDone ? "bg-emerald-500" : "bg-blue-500"}`}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ type: "spring", stiffness: 95 }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-4 mt-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/30 p-3 rounded-lg border border-zinc-850">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-300 font-bold uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Penalty Quest Risk Zones</span>
                  </p>
                  <p className="text-[10px] text-zinc-550 leading-relaxed max-w-sm">
                    In the official Android package, ignoring objectives for 3 consecutive days triggers a hard physical recovery trial.
                  </p>
                </div>
                
                <a 
                  href="#downloads"
                  className="text-[10px] uppercase font-bold tracking-widest text-zinc-100 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg hover:border-zinc-700 transition-colors"
                >
                  Learn penalty
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="space-y-6" id="app-features">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs text-blue-500 font-black tracking-widest uppercase">APP CAPABILITIES</span>
            <h2 className="font-display font-extrabold text-3xl text-zinc-100 uppercase">ENGINEERED SPECS</h2>
            <p className="text-sm text-zinc-400">
              Kaisel utilizes isolated mobile technologies to provide a lightning fast, private personal ledger without intrusive network queries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento box 1 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-zinc-750 transition-all min-h-[220px]">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-blue-500 flex items-center justify-center border border-zinc-850">
                <Lock className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-2 mt-4">
                <h3 className="font-display font-black text-lg text-zinc-100 uppercase tracking-tight">100% Offline Storage</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your life targets belong strictly to your device file structure. Kaisel saves metrics into local encrypted binary partitions. Zero analytics trackers or database sync hazards.
                </p>
              </div>
            </div>

            {/* Bento box 2 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-zinc-750 transition-all min-h-[220px]">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-blue-500 flex items-center justify-center border border-zinc-850">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-2 mt-4">
                <h3 className="font-display font-black text-lg text-zinc-100 uppercase tracking-tight">Passive Telemetry Support</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Automatically synchronize with Android Health APIs layout to register step metrics and calorie burns directly without launching persistent background applications.
                </p>
              </div>
            </div>

            {/* Bento box 3 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-zinc-750 transition-all min-h-[220px]">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-blue-500 flex items-center justify-center border border-zinc-850">
                <Swords className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-2 mt-4">
                <h3 className="font-display font-black text-lg text-zinc-100 uppercase tracking-tight">E-Rank to S-Rank Classes</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Gain titles offline. Create customizable graphic log cards representing high tier attribute clearances to display proudly on social grids.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Download Standalone Package Section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden scroll-mt-20" id="downloads">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
          <div className="absolute inset-0 bg-blue-600/[0.02] pointer-events-none blur-3xl" />

          <div className="max-w-2xl mx-auto space-y-3">
            <span className="font-mono text-xs text-blue-500 font-bold uppercase tracking-widest">[Sovereign System Package]</span>
            <h2 className="font-display font-black text-35xl sm:text-4xl text-zinc-100 uppercase">
              Download the Kaisel Application
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto">
              Ready to awaken? Skip complex app stores and fetch the standalone package directly to your Android file manager to setup instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto pt-2">
            <button 
              onClick={() => setNotification("📥 APK file download initiated successfully: kaisel-sovereign-v1.apk")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 text-xs uppercase tracking-wider cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download APK</span>
            </button>
            <button 
              onClick={() => setNotification("📋 Git repository sources opened in active terminal configuration context.")}
              className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 hover:border-zinc-700 font-bold px-6 py-3 rounded-xl transition-all text-xs uppercase tracking-wider"
            >
              System Git Repo
            </button>
          </div>

          <p className="text-[10px] text-zinc-650 font-mono">
            Requires: Android 8.0+ (Oreo, Pie, Q, 11, 12, 13, 14, 15) • File Size: ~18.4 MB • Zero root requisites
          </p>
        </section>

      </main>

      {/* Footer conforming to guidelines */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-600" id="main-footer">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-zinc-900 text-blue-500 flex items-center justify-center font-black italic text-xs border border-zinc-800">K</div>
              <span className="font-display font-medium text-xs text-zinc-400 uppercase tracking-widest">Kaisel System Integration</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold">
              <a href="#how-it-works" className="hover:text-blue-500 transition-colors">Abilities</a>
              <a href="#interactive-simulator" className="hover:text-blue-500 transition-colors">Inventory</a>
              <button 
                onClick={() => navigateTo("privacy")}
                className="hover:text-blue-550 text-blue-500 transition-colors cursor-pointer bg-transparent border-0 p-0 font-bold uppercase tracking-[0.2em] text-[10px]"
                id="footer-privacy-policy-link"
              >
                Privacy Policy
              </button>
              <a href="#" onClick={(e) => { e.preventDefault(); setNotification("Terms of Service is identical to standard open source GNU rules."); }} className="hover:text-blue-500 transition-colors">Terms of Service</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setNotification("Sovereign assistance system support contact email mapped to owner."); }} className="hover:text-blue-500 transition-colors">Support</a>
            </div>

            <p className="text-[10px] text-zinc-600 font-mono tracking-normal">
              © {new Date().getFullYear()} Kaisel Sovereign System. All rights reserved.
            </p>

          </div>
        </div>
      </footer>

      {/* Interactive Privacy Policy Dialog Modal */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm"
            onClick={() => setIsPrivacyOpen(false)}
            id="privacy-policy-modal"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-6 right-6 p-1.5 bg-zinc-950 hover:bg-zinc-805 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 pb-4 border-b border-zinc-850">
                <div className="text-blue-500 font-mono text-[10px] tracking-widest uppercase font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Sovereign Security Protocols</span>
                </div>
                <h3 className="font-display font-black text-2xl text-zinc-100 uppercase tracking-tight">Kaisel Privacy Policy guidelines</h3>
                <p className="text-[11px] text-zinc-500 font-mono">Verified offline secure model. Updated: June 23, 2026</p>
              </div>

              <div className="space-y-4 text-xs font-mono text-zinc-350 leading-relaxed">
                
                <div className="space-y-1.5">
                  <span className="block font-bold text-zinc-150 uppercase tracking-wider text-xs">1. Offline local sandboxing only</span>
                  <p className="text-zinc-400">
                    Kaisel maintains all exercise reps, level up indexes, gold counters, code durations and active schedules locally inside an offline SQLite sandbox. We do not write, transmit, share, or backup metrics to central web servers.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="block font-bold text-zinc-150 uppercase tracking-wider text-xs">2. Health API integration</span>
                  <p className="text-zinc-400">
                    Kaisel connects with native Google Health parameters locally to automatically retrieve real workout counts. No sensitive background location trackers or telemetry indicators are ever engaged.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="block font-bold text-zinc-150 uppercase tracking-wider text-xs">3. Zero third-party ad networks</span>
                  <p className="text-zinc-400">
                    Your progression is yours. Kaisel is entirely free from tracking SDKs, advertising pixels or corporate trackers e.g. Facebook pixel, hotjar or Google Analytics.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="block font-bold text-zinc-150 uppercase tracking-wider text-xs">4. Contact system protocol</span>
                  <p className="text-zinc-400">
                    For system feedback regarding leveling ratios, feel free to email the system coordinator directly at: <a href="mailto:malinduchethiyaatwork@gmail.com" className="text-blue-500 underline">malinduchethiyaatwork@gmail.com</a>.
                  </p>
                </div>

              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-850">
                <button 
                  onClick={() => setIsPrivacyOpen(false)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-display font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wide cursor-pointer"
                >
                  I Acknowledge protocols
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
