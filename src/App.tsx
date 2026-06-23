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
  ArrowRight, 
  Download, 
  Eye, 
  FileText, 
  Lock, 
  Sparkles, 
  Plus, 
  Minus, 
  Smartphone as PhoneIcon, 
  X, 
  HelpCircle,
  TrendingUp,
  Dumbbell,
  BookOpen,
  Compass,
  AlertTriangle
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
  // Personalized state using user prefix if available, otherwise "Hunter"
  const userPlaceholder = "Malindu"; // Optimized for user's email: malinduchethiyaatwork@gmail.com
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
    { name: "Strength", abbreviation: "STR", value: 12, description: "Increases physical power and stamina" },
    { name: "Vitality", abbreviation: "VIT", value: 11, description: "Boosts max health and recovery rates" },
    { name: "Agility", abbreviation: "AGI", value: 14, description: "Improves workout speeds and reflexes" },
    { name: "Intelligence", abbreviation: "INT", value: 10, description: "Enhances study focus and problem-solving" },
    { name: "Senses", abbreviation: "SEN", value: 10, description: "Sharpens spatial awareness and sleep quality" },
  ]);

  const [quests, setQuests] = useState<QuestItem[]>([
    { id: "q1", name: "Daily Workout routine", type: "workout", current: 80, target: 100, unit: "reps", rewardStr: "+1 STR, +10 XP" },
    { id: "q2", name: "Read & Learn Coding", type: "study", current: 25, target: 30, unit: "mins", rewardStr: "+1 INT, +10 XP" },
    { id: "q3", name: "Mindful Meditation", type: "mind", current: 5, target: 10, unit: "mins", rewardStr: "+1 SEN, +5 XP" },
  ]);

  // Notifications or toast messages
  const [notification, setNotification] = useState<string | null>(null);
  const [levelUpTriggered, setLevelUpTriggered] = useState(false);

  // Privacy Policy Modal State
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

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
          const nextVal = Math.min(q.target, q.current + (q.type === "workout" ? 10 : 5));
          const completedNow = nextVal === q.target;
          
          if (completedNow) {
            setNotification(`🏆 Quest Completed: ${q.name}! Recieved gold & extra leveling XP!`);
            setXp(prevXp => {
              const newXp = prevXp + 25;
              if (newXp >= maxXp) {
                // Trigger level up animation and update values
                setTimeout(() => {
                  setLevel(l => l + 1);
                  setXp(newXp - maxXp);
                  setStatPoints(p => p + 5);
                  setGold(g => g + 100);
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
                if (q.type === "workout" && s.abbreviation === "STR") return { ...s, value: s.value + 1 };
                if (q.type === "study" && s.abbreviation === "INT") return { ...s, value: s.value + 1 };
                if (q.type === "mind" && s.abbreviation === "SEN") return { ...s, value: s.value + 1 };
                return s;
              })
            );

            setGold(g => g + 35);
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
      { name: "Strength", abbreviation: "STR", value: 12, description: "Increases physical power and stamina" },
      { name: "Vitality", abbreviation: "VIT", value: 11, description: "Boosts max health and recovery rates" },
      { name: "Agility", abbreviation: "AGI", value: 14, description: "Improves workout speeds and reflexes" },
      { name: "Intelligence", abbreviation: "INT", value: 10, description: "Enhances study focus and problem-solving" },
      { name: "Senses", abbreviation: "SEN", value: 10, description: "Sharpens spatial awareness and sleep quality" },
    ]);
    setQuests([
      { id: "q1", name: "Daily Workout routine", type: "workout", current: 80, target: 100, unit: "reps", rewardStr: "+1 STR, +10 XP" },
      { id: "q2", name: "Read & Learn Coding", type: "study", current: 25, target: 30, unit: "mins", rewardStr: "+1 INT, +10 XP" },
      { id: "q3", name: "Mindful Meditation", type: "mind", current: 5, target: 10, unit: "mins", rewardStr: "+1 SEN, +5 XP" },
    ]);
    setNotification("System simulator has been reset.");
  };

  const allocateStatPoint = (abbreviation: string) => {
    if (statPoints <= 0) {
      setNotification("No remaining stat points. Level up to obtain more!");
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
    setNotification(`Allocated 1 Point into ${abbreviation}!`);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans leading-relaxed selection:bg-sky-500 selection:text-white" id="main-container">
      
      {/* Animated Level-Up Celebration Overlay */}
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
              initial={{ scale: 0.3, y: 100 }}
              animate={{ type: "spring", scale: 1, y: 0 }}
              className="relative p-8 rounded-2xl border-2 border-sky-400 bg-slate-900 shadow-2xl max-w-md w-full"
            >
              {/* Background ambient beam */}
              <div className="absolute inset-0 bg-sky-500/20 rounded-2xl blur-xl" />
              
              <div className="relative z-10">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mx-auto w-20 h-20 rounded-full bg-sky-950 flex items-center justify-center border border-sky-400 mb-4"
                >
                  <Trophy className="w-10 h-10 text-sky-400" />
                </motion.div>

                <h2 className="font-display font-bold text-4xl text-sky-400 tracking-wider mb-2 uppercase neon-glow-blue">
                  LEVEL UP!
                </h2>
                
                <p className="text-xl text-white font-medium mb-4">
                  The System acknowledges your growth.
                </p>

                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-left mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Current Level</span>
                    <span className="font-mono font-bold text-sky-400 text-base">Lv. {level} <span className="text-xs text-slate-500">({getRank(level)})</span></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Available Stat Points</span>
                    <span className="font-mono font-bold text-amber-400">+5 (Total: {statPoints})</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">System Gold</span>
                    <span className="font-mono font-bold text-yellow-400">+{100} Coins</span>
                  </div>
                </div>

                <button 
                  className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-display font-medium py-3 rounded-lg transition-all tracking-wide shadow-lg cursor-pointer"
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
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-900" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center shadow-lg border border-sky-400 shadow-sky-500/10">
              <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <span className="font-display font-bold text-2xl tracking-wider text-white">KAISEL</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded bg-sky-950 text-sky-400 font-mono text-[10px] uppercase font-bold tracking-widest border border-sky-900/50">SYSTEM ENGAGED</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-sky-400 transition-colors">System Mechanics</a>
            <a href="#interactive-simulator" className="hover:text-sky-400 transition-colors">Quest Terminal</a>
            <a href="#app-features" className="hover:text-sky-400 transition-colors">Awakened Perks</a>
            <a href="#downloads" className="hover:text-sky-400 transition-colors">Android Download</a>
          </nav>

          <div>
            <a 
              href="#downloads" 
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-sky-400 border border-sky-400/35 hover:border-sky-400 px-4 py-2 rounded-lg text-sm font-display font-medium transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Get App</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        
        {/* Toast Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border-l-4 border-sky-400 p-4 rounded-r-lg shadow-xl max-w-md w-[calc(100%-2rem)] flex items-start gap-3"
              id="system-notification"
            >
              <div className="p-1 rounded bg-sky-950 text-sky-400">
                <Sparkles className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex-1">
                <span className="block text-xs font-mono font-semibold tracking-widest uppercase text-sky-400">System Broadcast</span>
                <span className="text-slate-200 text-sm">{notification}</span>
              </div>
              <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Banner Section */}
        <section className="relative overflow-hidden pt-12 pb-24 md:py-32" id="hero-section">
          {/* Neon glowing ambient circles */}
          <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Hero Copy (5 Ranks / Columns) */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-950/60 border border-sky-500/30 rounded-full text-xs font-mono text-sky-400">
                  <span className="animate-pulse inline-block w-2 bg-sky-400 h-2 rounded-full" />
                  <span>THE SYSTEM HAS AWAKENED FOR ANDROID</span>
                </div>
                
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                  Break Your Limits.<br />
                  <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-300 bg-clip-text text-transparent uppercase neon-glow-blue">Gain The System.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0">
                  Kaisel is an offline-first, deeply gamified Android app inspired by legendary leveling manga. It turns your daily exercise routines, studying goals, coding progress, and physical tasks into a fully interactive RPG experience. Accept quests, upgrade stats real-time, and watch your Rank rise.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <a 
                    href="#downloads" 
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-400 text-slate-950 px-8 py-4 rounded-xl font-display font-semibold transition-all hover:translate-y-[-2px] shadow-lg shadow-sky-500/20 tracking-wide"
                  >
                    <Download className="w-5 h-5 fill-slate-950" />
                    <span>Download App (Free APK)</span>
                  </a>
                  
                  <a 
                    href="#interactive-simulator" 
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 px-8 py-4 rounded-xl font-display font-medium transition-all hover:translate-y-[-2px]"
                  >
                    <Zap className="w-5 h-5 text-sky-400" />
                    <span>Test-Drive System Demo</span>
                  </a>
                </div>

                <div className="pt-6 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 border-t border-slate-900">
                  <div className="text-center lg:text-left">
                    <span className="block font-display font-bold text-2xl text-white">100%</span>
                    <span className="text-xs text-slate-500 font-mono uppercase">Offline & Secure</span>
                  </div>
                  <div className="text-center lg:text-left">
                    <span className="block font-display font-bold text-2xl text-white">Zero</span>
                    <span className="text-xs text-slate-500 font-mono uppercase">Intrusive Trackers</span>
                  </div>
                  <div className="text-center lg:text-left">
                    <span className="block font-display font-bold text-2xl text-white">E to S</span>
                    <span className="text-xs text-slate-500 font-mono uppercase">Growth Hierarchy</span>
                  </div>
                </div>
              </div>

              {/* Hero Graphic Column (5 Columns) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm sm:max-w-md">
                  {/* Outer border decoration mimicking a high-tech phone */}
                  <div className="absolute inset-x-0 -top-6 -bottom-6 bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-slate-950/20 rounded-3xl blur-md -z-10" />
                  
                  <div className="border border-slate-800 bg-slate-900/70 p-3 rounded-2xl shadow-xl backdrop-blur-md">
                    <div className="relative rounded-xl overflow-hidden aspect-[16/9] sm:aspect-auto border border-slate-855">
                      <img 
                        src="src/assets/images/kaisel_hero_1782224616667.jpg" 
                        alt="Kaisel interface holographic preview" 
                        className="w-full h-auto object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient overlay inside image to blend */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-slate-950/90 border border-sky-900/40 p-3 rounded-lg backdrop-blur-sm">
                          <p className="font-mono text-[10px] text-sky-400 font-semibold tracking-wider uppercase mb-1">Manga System UI Preview</p>
                          <p className="text-xs text-slate-350">
                            "System initialized. The path to the Sovereign is open. Ready for daily assessment, Malindu."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 border-t border-slate-900 bg-slate-950/30" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="font-mono text-xs text-sky-400 font-bold tracking-widest uppercase">The Process of Awakening</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">How The Kaisel System Works</h2>
              <p className="text-slate-400">
                You do not buy levels. You forge them with real sweat, research, study, and daily focus. The app translates your actual tasks into high-stakes dungeon battles and rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Card 1 */}
              <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4 hover:border-slate-800 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-900/50 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white">1. Engage the App Interface</h3>
                <p className="text-sm text-slate-400">
                  Download and launch the offline-first environment. Set up your starting hunter stats. Zero internet connection or API integration needed.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4 hover:border-slate-800 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-900/50 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white">2. Push your Limits</h3>
                <p className="text-sm text-slate-400">
                  Perform actual workouts, finish homework, or program applications. Input your completions inside the Kaisel log daily.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4 hover:border-slate-800 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-900/50 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
                  <Swords className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white">3. Conquer the Raid</h3>
                <p className="text-sm text-slate-400">
                  Assign difficulty tiers (E-Rank to S-Rank) to your tasks. Solving complex work feels like defeating massive, ominous dungeon lords.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4 hover:border-slate-800 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-900/50 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white">4. Allocate & Level Up</h3>
                <p className="text-sm text-slate-400">
                  Acquire free system stat points during Level Up. Manually input your stats point increase to customize your optimal character build.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Live Interactive Simulator HUD Section */}
        <section className="py-20 bg-slate-900/20 border-t border-slate-900 scroll-mt-20" id="interactive-simulator">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="font-mono text-xs text-sky-400 font-bold tracking-widest uppercase mb-1 block">Live Browser Simulation</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">Test-Drive the Kaisel Interface</h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Interact with the mock terminal below. Complete standard quests to gather XP, trigger a real <strong className="text-sky-400">LEVEL UP</strong> notification, and spend attributes onto your personal Hunter.
              </p>
            </div>

            {/* Simulated Game Console Block */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-w-4xl mx-auto">
              
              {/* Header Tab Panel */}
              <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-sky-500/80" />
                  <span className="ml-2 font-mono text-xs text-slate-500 tracking-wider">KAISEL_CORE v1.0.4-LOCAL-HUD</span>
                </div>
                <button 
                  onClick={resetInteractiveDemo}
                  className="px-3 py-1 bg-slate-950 text-slate-400 hover:text-white border border-slate-800 rounded text-xs font-mono transition-colors cursor-pointer"
                >
                  Reset HUD
                </button>
              </div>

              {/* Game Layout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Left Panel: Hunter Persona & Core Stats (5 Columns) */}
                <div className="md:col-span-5 p-6 border-b md:border-b-0 md:border-r border-slate-800 space-y-6 bg-slate-950">
                  
                  {/* Avatar & Class Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-500">AWAKENED LOG</span>
                      <span className="font-mono text-xs px-2 py-0.5 bg-sky-950 text-sky-400 rounded-full border border-sky-900/30 font-bold uppercase tracking-wider">
                        {getRank(level)} RANK
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center border border-sky-400 shadow-lg shadow-sky-500/20">
                        <Flame className="w-8 h-8 text-white fill-white/10" />
                      </div>
                      
                      <div className="flex-1">
                        {isEditingName ? (
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="text" 
                              value={hunterName} 
                              onChange={(e) => setHunterName(e.target.value)}
                              onBlur={() => setIsEditingName(false)}
                              onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                              className="bg-slate-900 border border-sky-500 text-white rounded px-2 py-1 text-sm font-display font-medium w-full focus:outline-none focus:ring-1 focus:ring-sky-400"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h3 
                              onClick={() => setIsEditingName(true)}
                              className="font-display font-bold text-lg text-white hover:text-sky-400 cursor-pointer transition-colors border-b border-dashed border-slate-700 hover:border-sky-400"
                              title="Click to change name"
                            >
                              {hunterName || "Name"}
                            </h3>
                            <button onClick={() => setIsEditingName(true)} className="text-xs text-slate-500 hover:text-sky-400">📝 Edit</button>
                          </div>
                        )}
                        
                        <select 
                          value={selectedClass} 
                          onChange={(e) => setSelectedClass(e.target.value)}
                          className="bg-transparent text-slate-400 text-xs font-mono border-0 p-0 hover:text-sky-400 cursor-pointer focus:ring-0 focus:outline-none"
                        >
                          <option value="Shadow Monarch" className="bg-slate-950 text-slate-200">Shadow Monarch</option>
                          <option value="Sovereign Fighter" className="bg-slate-950 text-slate-200">Sovereign Fighter</option>
                          <option value="High Wizard" className="bg-slate-950 text-slate-200">High Wizard</option>
                          <option value="Rogue Spear" className="bg-slate-950 text-slate-200">Rogue Spear</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Life Telemetry Stats */}
                  <div className="bg-slate-900/50 border border-slate-900 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">XP PROGRESS</span>
                      <span className="text-sky-400 font-bold">{xp} / {maxXp} XP</span>
                    </div>
                    {/* XP Outer Bar */}
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-sky-500 to-indigo-500"
                        animate={{ width: `${(xp / maxXp) * 100}%` }}
                        transition={{ type: "spring", stiffness: 80 }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-950">
                      <div>
                        <span className="block text-[10px] text-slate-500 font-mono uppercase">System Level</span>
                        <span className="text-2xl font-display font-bold text-white tracking-widest">Lv. {level}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 font-mono uppercase">System Gold</span>
                        <span className="text-2xl font-display font-bold text-yellow-500 tracking-widest">{gold}g</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-950">
                      <div className="flex justify-between text-[10px] text-slate-550 font-mono uppercase mb-1">
                        <span>Physical Fatigue</span>
                        <span className={fatigue > 70 ? "text-red-400 font-bold" : "text-sky-400"}>{fatigue}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-950 rounded bg-opacity-40 overflow-hidden">
                        <div className={`h-full ${fatigue > 70 ? "bg-red-500" : "bg-sky-400"}`} style={{ width: `${fatigue}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Character Spendable Attributes */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-slate-500">CHARACTER ATTRIBUTES</span>
                      {statPoints > 0 && (
                        <span className="font-mono text-xs text-amber-400 font-semibold uppercase animate-pulse">
                          +{statPoints} Spend Points!
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {stats.map((st) => (
                        <div 
                          key={st.abbreviation}
                          className="flex items-center justify-between text-xs bg-slate-900 p-2.5 rounded border border-slate-900 hover:border-slate-850"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-400 w-12 text-left">{st.abbreviation}</span>
                              <span className="text-slate-100 font-semibold">{st.name}</span>
                            </div>
                            <p className="text-[10px] text-slate-500">{st.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-sky-400 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-850 min-w-8 text-center">{st.value}</span>
                            {statPoints > 0 && (
                              <button 
                                onClick={() => allocateStatPoint(st.abbreviation)}
                                className="w-6 h-6 rounded bg-sky-500/20 hover:bg-sky-500 text-sky-400 hover:text-slate-950 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                                title="Allocate stat point"
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

                {/* Right Panel: Daily Quest Board (7 Columns) */}
                <div className="md:col-span-7 p-6 space-y-6 flex flex-col justify-between bg-slate-950/60">
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">ACTIVE DAILY QUEST SUMMARY</span>
                      <span className="text-[10px] text-slate-500 font-mono">ID: D-001438</span>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl border border-sky-900/20 relative overflow-hidden">
                      {/* Grid design background */}
                      <div className="absolute inset-0 bg-slate-950/30 pointer-events-none opacity-40" />
                      
                      <div className="relative z-10 space-y-2">
                        <span className="font-mono text-[9px] px-1.5 py-0.5 bg-red-950 text-red-400 rounded border border-red-900/50 font-bold uppercase tracking-widest">CRITICAL MISSION</span>
                        <h4 className="font-display font-bold text-lg text-white">Pre-requisite for Awakening</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          "System warnings state that if the daily physical training log is ignored, a designated high-danger Penalty Quest zone will be launched."
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {quests.map((q) => {
                        const progressPercent = Math.min(100, Math.round((q.current / q.target) * 100));
                        const isDone = q.current >= q.target;
                        
                        return (
                          <div 
                            key={q.id}
                            className={`p-4 rounded-xl border transition-all ${
                              isDone 
                                ? "bg-slate-900/30 border-slate-900/80" 
                                : "bg-slate-900/60 border-slate-800"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <div className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                                  )}
                                  <h5 className={`font-display font-semibold text-sm ${isDone ? "text-slate-500 line-through" : "text-white"}`}>
                                    {q.name}
                                  </h5>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-slate-500 font-mono">REWARD: {q.rewardStr}</span>
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => triggerProgress(q.id)}
                                disabled={isDone}
                                className={`px-3 py-1.5 rounded text-xs font-display font-medium transition-all inline-flex items-center gap-1 cursor-pointer ${
                                  isDone 
                                    ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800" 
                                    : "bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-slate-950 border border-sky-500/20 font-semibold"
                                }`}
                              >
                                <span>{isDone ? "Finished" : "+ Mock Log"}</span>
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[11px] font-mono">
                                <span className="text-slate-500">Progress Telemetry</span>
                                <span className={isDone ? "text-emerald-450 font-bold" : "text-slate-350"}>
                                  {q.current} / {q.target} {q.unit} ({progressPercent}%)
                                </span>
                              </div>
                              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                                <motion.div 
                                  className={`h-full ${isDone ? "bg-emerald-500" : "bg-sky-500"}`}
                                  animate={{ width: `${progressPercent}%` }}
                                  transition={{ type: "spring", stiffness: 90 }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-900 bg-slate-950/20 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-white font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Penalty Quest Imminent?</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        In the official Android app, failing to trigger daily quests triggers a hard fitness mode.
                      </p>
                    </div>
                    <a 
                      href="#downloads" 
                      className="text-xs bg-slate-900 hover:bg-slate-850 hover:text-sky-400 text-slate-300 border border-slate-800 px-3 py-2 rounded text-center transition-colors"
                    >
                      How Penalty works
                    </a>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="py-20 border-t border-slate-900 bg-slate-950" id="app-features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
              <span className="font-mono text-xs text-sky-400 font-bold tracking-widest uppercase">Engine Architecture</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">Engineered For Aspiring Sovereigns</h2>
              <p className="text-slate-400">
                Unlike bloated health trackers, Kaisel builds on minimalist design and manga metaphors to offer the most badass progress dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="space-y-4 p-6 bg-slate-900/20 border border-slate-900 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-900/50">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-white">100% Privacy Focused</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your life logs belong to you alone. Kaisel keeps all workout counts and study durations encrypted inside a fast, local SQLite database on your Android storage. No servers, no tracking.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-4 p-6 bg-slate-900/20 border border-slate-900 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-900/50">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Daily Workout Detection</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Connect local health modules. The system scans step count telemetry offline and awards instant speed statistics, matching the exact stamina tracking of legendary series heroes.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-4 p-6 bg-slate-900/20 border border-slate-900 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-900/50">
                  <Swords className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Awakener Rank Tier Up</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Climb ranks step-by-step. Earn customized titles, unlock cosmetic interface colors, and share elegant layout cards of your high level achievements offline to social networks.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Download Call to Action Section */}
        <section className="py-20 border-t border-slate-900 bg-gradient-to-b from-slate-950 to-slate-900 scroll-mt-20" id="downloads">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 relative overflow-hidden text-center space-y-8">
              {/* Futuristic background lines */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-30" />
              <div className="absolute inset-0 bg-sky-500/5 pointer-events-none blur-3xl" />

              <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                  Ready to Awaken? Install the Android System today.
                </h2>
                <p className="text-sm sm:text-base text-slate-400">
                  Ditch basic spreadsheets and experience a true visual tracking hierarchy. Click below to retrieve the standalone APK configuration file for direct deployment.
                </p>
              </div>

              {/* Download Buttons */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <a 
                  href="#direct-apk" 
                  onClick={(e) => {
                    e.preventDefault();
                    setNotification("📥 Kaisel APK Download initiated! (Simulated download file: kaisel-alpha-v1.deb.apk)");
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-400 text-slate-950 px-8 py-4 rounded-xl font-display font-semibold transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download APK (arm64)</span>
                </a>
                
                <a 
                  href="#sources"
                  onClick={(e) => {
                    e.preventDefault();
                    setNotification("📋 App package sources directory unlocked under open source terms.");
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 px-8 py-4 rounded-xl font-display font-medium transition-all"
                >
                  <FileText className="w-5 h-5" />
                  <span>GitHub Repository</span>
                </a>
              </div>

              {/* Requirements specifications */}
              <div className="relative z-10 text-xs text-slate-500 font-mono flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <span>Supports: Android 8.0+ (Oreo to Android 15)</span>
                <span className="hidden sm:inline">•</span>
                <span>File Size: ~18.4 MB</span>
                <span className="hidden sm:inline">•</span>
                <span>No Root Required</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-900/50">
                <Flame className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <span className="font-display font-bold text-base text-slate-300 tracking-widest uppercase">KAISEL APPS</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
              <a href="#how-it-works" className="hover:text-white transition-colors">System Mechanics</a>
              <a href="#interactive-simulator" className="hover:text-white transition-colors">Quest Terminal</a>
              <a href="#app-features" className="hover:text-white transition-colors">Awakened Perks</a>
              <button 
                onClick={() => setIsPrivacyOpen(true)}
                className="hover:text-white transition-colors font-semibold text-sky-400 underline decoration-sky-400/50 underline-offset-4 cursor-pointer"
                id="footer-privacy-policy"
              >
                Privacy Policy Guidelines
              </button>
            </div>

            <p className="text-xs text-slate-600 font-mono">
              © {new Date().getFullYear()} Kaisel App. All Sovereign rights reserved.
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
            onClick={() => setIsPrivacyOpen(false)}
            id="privacy-policy-modal"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-6 right-6 p-1 bg-slate-950 hover:bg-slate-805 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-sky-400">
                  <Shield className="w-5 h-5" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest">Sovereign Protection Registry</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-white">Kaisel Privacy Policy</h3>
                <p className="text-xs text-slate-500 font-mono">Last modified: June 23, 2026 • Verified System Secure</p>
              </div>

              <div className="space-y-5 text-sm text-slate-300 leading-relaxed scrollbar-thin">
                
                <section className="space-y-2">
                  <h4 className="font-display font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span>1. Telemetry Privacy & No-Data-Harvesting</span>
                  </h4>
                  <p>
                    Kaisel is designed with extreme offline principles. We believe that your self-improvement telemetry, daily workouts, study habits, and psychological markers belong strictly to you. **All database operations occur locally on your custom Android runtime system (SQLite database file)**. We never compile, aggregate, sell, or mirror your personal statistics to external cloud entities.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="font-display font-semibold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-400" />
                    <span>2. Sensory Integrations & Android Health Connect</span>
                  </h4>
                  <p>
                    To correctly automate Quest progress (specifically physical exercise metrics), Kaisel integrates optional telemetry connections with local Google Health Connect libraries. These queries are compiled inside your handheld device. No location logs or spatial GPS patterns leave your operating system environment.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="font-display font-semibold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    <span>3. Offline Local Sandbox Parameters</span>
                  </h4>
                  <p>
                    Your user profile, level index, coin cache, and current rank statuses are secured within standard isolated sandbox storage directories. Clearing application caches or carrying out factory system resets will delete your level metadata, as we do not hold server side mirror copies. Offline exports are provided manually as serialized JSON files in your downloads directories.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="font-display font-semibold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-sky-400" />
                    <span>4. Third-Party Tracker Elimination</span>
                  </h4>
                  <p>
                    Kaisel contains **zero tracking SDKs, advertising pixel scripts, or telemetry libraries** (such as Firebase Analytics, HubSpot, or segment trackers). We guarantee a 100% clean, distraction-free environment optimized specifically for performance.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="font-display font-semibold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-sky-400" />
                    <span>5. Contact & System Protocol Inquiries</span>
                  </h4>
                  <p>
                    For questions, system bug updates, feedback, or general greetings regarding the application architecture, you can contact the Kaisel development team directly at <a href="mailto:malinduchethiyaatwork@gmail.com" className="text-sky-450 underline decoration-sky-450 hover:text-white transition-colors">malinduchethiyaatwork@gmail.com</a>.
                  </p>
                </section>

              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button 
                  onClick={() => setIsPrivacyOpen(false)}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-display font-medium px-6 py-2.5 rounded-lg transition-all text-xs tracking-wider uppercase cursor-pointer"
                >
                  I Acknowledge the System
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

