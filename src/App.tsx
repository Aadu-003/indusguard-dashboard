/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type ReactNode } from 'react';
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import { 
  Factory, 
  Bell as Notifications, 
  LayoutDashboard as Dashboard, 
  Brain as Psychology, 
  BarChart3 as QueryStats, 
  Settings, 
  User as Person, 
  Mic, 
  TriangleAlert as Warning, 
  TrendingUp as Analytics, 
  Cpu as PrecisionManufacturing,
  Thermometer as DeviceThermostat,
  Waves as Vibration,
  Gauge as Speed,
  Zap as Bolt,
  Activity as Monitoring,
  AlertCircle as AssignmentLate,
  Lightbulb,
  Info,
  Download,
  RotateCcw as SettingsBackupRestore,
  History,
  Send,
  Router,
  Cpu as DeveloperBoard,
  ChevronRight,
  MoreVertical as MoreVert,
  Palette,
  Lock,
  Search,
  Filter as FilterList,
  Plus as Add,
  BellRing as AddAlert,
  Rocket as RocketLaunch,
  Power as EmergencyHome,
  Clock as PendingActions,
  Calendar as Schedule,
  Snowflake as AcUnit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Screen = 'monitor' | 'analytics' | 'alerts' | 'config' | 'voice';

// --- Shared Components ---
const GlassPanel = ({ children, className, glowColor }: { children: ReactNode, className?: string, glowColor?: 'cyan' | 'purple' | 'red' | 'blue', key?: string | number }) => (
  <div className={cn(
    "glass-panel overflow-hidden relative border border-outline",
    glowColor === 'cyan' && "glow-cyan",
    glowColor === 'purple' && "glow-purple",
    glowColor === 'red' && "glow-red",
    glowColor === 'blue' && "border-l-2 border-l-tertiary",
    className
  )}>
    <div className="scan-line absolute inset-0 opacity-10" />
    {children}
  </div>
);

const IndicatorPip = ({ color = 'primary' }: { color?: string }) => (
  <span className={cn(
    "w-1.5 h-1.5 rounded-full",
    color === 'primary' ? "bg-primary" : "bg-secondary"
  )} />
);

// --- Navigation Components ---
const TopBar = ({ activeScreen }: { activeScreen: Screen }) => (
  <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline flex justify-between items-center px-6 md:px-12 h-20">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <Factory className="text-primary w-5 h-5" />
        <h1 className="font-serif italic text-2xl text-primary font-bold tracking-tight">IndusGuard</h1>
      </div>
      <div className="hidden md:flex items-center gap-8 border-l border-outline pl-8">
        <span className={cn("tag-pill cursor-pointer transition-all", activeScreen === 'monitor' ? "text-primary" : "opacity-40")}>Live Floor</span>
        <span className={cn("tag-pill cursor-pointer transition-all", activeScreen === 'analytics' ? "text-primary" : "opacity-40")}>Analytics</span>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant transition-all hover:text-primary">
          <Notifications size={20} />
        </button>
        <div className="h-10 w-10 border border-outline flex items-center justify-center overflow-hidden bg-surface-dim">
          <img 
            alt="Operator" 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
      </div>
    </div>
  </header>
);

const Sidebar = ({ activeScreen, setScreen }: { activeScreen: Screen, setScreen: (s: Screen) => void }) => {
  const items = [
    { id: 'monitor', icon: Dashboard, label: 'Floor' },
    { id: 'analytics', icon: Psychology, label: 'AI' },
    { id: 'alerts', icon: QueryStats, label: 'Health' },
    { id: 'config', icon: Settings, label: 'Config' },
  ];

  return (
    <nav className="hidden md:flex h-screen w-20 fixed left-0 top-0 z-40 bg-surface border-r border-outline flex-col items-center py-24 gap-12">
      <div className="logo writing-vertical-rl rotate-180 font-bold tracking-[0.3em] text-[10px] text-primary whitespace-nowrap">
        COMMAND CENTRE
      </div>
      <div className="flex flex-col gap-8 w-full items-center">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as Screen)}
            title={item.label}
            className={cn(
              "flex flex-col items-center justify-center transition-all w-full py-2 group relative",
              activeScreen === item.id 
                ? "text-primary" 
                : "text-secondary opacity-40 hover:opacity-100"
            )}
          >
            {activeScreen === item.id && (
              <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-8 bg-primary" />
            )}
            <item.icon size={22} className="group-hover:scale-110 transition-transform" />
          </button>
        ))}
      </div>
      <div className="mt-auto text-xl opacity-20 italic font-serif">●</div>
    </nav>
  );
};

const BottomNav = ({ activeScreen, setScreen }: { activeScreen: Screen, setScreen: (s: Screen) => void }) => {
  const items = [
    { id: 'monitor', icon: PrecisionManufacturing, label: 'Monitor' },
    { id: 'analytics', icon: Analytics, label: 'AI' },
    { id: 'alerts', icon: Warning, label: 'Alerts' },
    { id: 'config', icon: Person, label: 'User' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface border-t border-outline flex justify-around items-center h-16 pb-safe px-4 shadow-lg">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id as Screen)}
          className={cn(
            "flex flex-col items-center justify-center transition-all px-2",
            activeScreen === item.id 
              ? "text-primary" 
              : "text-secondary opacity-50"
          )}
        >
          <item.icon size={20} />
          <span className="font-mono text-[9px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// --- Screen Components ---

const MonitorScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {

  // Firebase Sensor Data
  const [sensorData, setSensorData] = useState({
    temperature: 64.2,
    vibration: 0.4,
    rpm: 3602,
    current: 42.8
  });

  // Graph Data
  const [data, setData] = useState<{name: string, actual: number, predict: number}[]>([]);

  useEffect(() => {

  // Firebase realtime listener
  const sensorRef = ref(database, "machineData");

  onValue(sensorRef, (snapshot) => {
    const firebaseData = snapshot.val();

    if (firebaseData) {
      setSensorData(firebaseData);
    }
  });

  // Mock Graph Data
  const mockData = Array.from({ length: 12 }, (_, i) => ({
    name: `${i * 2}:00`,
    actual: 30 + Math.random() * 40,
    predict: 35 + Math.random() * 30
  }));

  setData(mockData);

}, []);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Gauge */}
        <GlassPanel className="lg:col-span-5 p-12 flex flex-col items-center justify-center min-h-[450px]">
          <div className="relative w-72 h-72 flex items-center justify-center">
             {/* Simple SVG Circular Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="144" cy="144" r="130" fill="transparent" stroke="#E5E4DE" strokeWidth="4" />
              <circle 
                cx="144" cy="144" r="130" 
                fill="transparent" 
                stroke="#1A1A1A" 
                strokeWidth="8" 
                strokeDasharray="816" 
                strokeDashoffset={816 - (816 * 0.82)}
                strokeLinecap="square"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="tag-pill opacity-40 mb-2">Health Index</span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-8xl text-primary font-bold">82</span>
                <span className="text-2xl text-secondary opacity-50 italic font-serif">%</span>
              </div>
              <span className="tag-pill text-primary mt-4">Optimal Efficiency</span>
            </div>
          </div>
          <div className="mt-12 w-full flex justify-between items-end border-t border-outline pt-8">
            <div>
              <h3 className="font-serif italic text-3xl text-primary leading-tight">Main Turbine<br/>B-42 Series</h3>
              <p className="tag-pill mt-3 opacity-60">Status: Continuous Operation</p>
            </div>
            <div className="flex gap-1.5 items-end h-10">
              {[0.4, 0.6, 0.4, 0.8, 0.6, 1].map((h, i) => (
                <div key={i} className="w-1.5 bg-outline" style={{ height: `${h * 100}%` }}>
                  <div className="w-full bg-primary transition-all duration-1000" style={{ height: i === 5 ? '100%' : '30%' }} />
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* Telemetry Bento */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-8">
          {[
            { label: 'Thermal Output', val: sensorData.temperature, unit: '°C', icon: DeviceThermostat, color: 'primary', perc: 64 },
            { label: 'Vibration Level', val: sensorData.vibration, unit: 'mm/s', icon: Vibration, color: 'secondary', perc: 20 },
            { label: 'Rotations/Min', val: sensorData.rpm, unit: 'RPM', icon: Speed, color: 'tertiary', perc: 85 },
            { label: 'Applied Load', val: sensorData.current, unit: 'A', icon: Bolt, color: 'error', perc: 72 },
          ].map((item) => (
            <GlassPanel key={item.label} className="p-8 relative group">
              <div className="flex justify-between items-start mb-6">
                <item.icon className="text-secondary w-6 h-6" />
                <span className="tag-pill">{item.label}</span>
              </div>
              <p className="font-serif italic text-4xl text-primary">
                {item.val}
                <span className="text-base ml-2 opacity-50 not-italic font-sans font-medium">{item.unit}</span>
              </p>
              <div className="w-full bg-outline h-[1px] mt-8 overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-1000", 
                    item.color === 'primary' && "bg-primary",
                    item.color === 'secondary' && "bg-secondary",
                    item.color === 'tertiary' && "bg-primary",
                    item.color === 'error' && "bg-error",
                  )} 
                  style={{ width: `${item.perc}%` }} 
                />
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Graph */}
        <GlassPanel className="lg:col-span-8 p-10">
          <div className="flex justify-between items-baseline mb-12 border-b border-outline pb-6">
            <h4 className="font-serif italic text-3xl text-primary flex items-center gap-4">
              Forecast Registry
            </h4>
            <div className="flex gap-8 tag-pill font-bold">
              <span className="flex items-center gap-2 text-primary">● Actual telemetry</span>
              <span className="flex items-center gap-2 text-secondary italic opacity-60">○ AI Projection</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.03}/>
                    <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#E5E4DE" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E4DE', borderRadius: '0px', boxShadow: '10px 10px 20px rgba(0,0,0,0.05)' }}
                  itemStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="actual" stroke="#1A1A1A" strokeWidth={1} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="predict" stroke="#8C8A84" strokeWidth={1} strokeDasharray="6 6" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-6 tag-pill opacity-40">
            <span>08:00 AM</span>
            <span>12:00 PM</span>
            <span>04:00 PM</span>
            <span>08:00 PM</span>
            <span>12:00 AM</span>
          </div>
        </GlassPanel>

        {/* Alerts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h4 className="tag-pill border-b border-outline pb-4 px-2">Critical Notifications</h4>
          <div className="flex flex-col gap-4">
            {[
              { title: 'Harmonic Resonance Detected', desc: 'Turbine B-42 exhibiting unexpected 120Hz harmonics. Structural integrity risk in 4.2h.', tag: 'CRITICAL', color: 'error', time: '2m ago' },
              { title: 'Bearing Wear Prediction', desc: 'Lubrication viscosity drop detected. Scheduled maintenance advised within 72 operating hours.', tag: 'PREDICTIVE', color: 'secondary', time: '14m ago' },
              { title: 'Efficiency Drift', desc: 'Load distribution optimized by AI. Current gain: +1.2% throughput efficiency.', tag: 'ADVISORY', color: 'primary', time: '1h ago' },
            ].map((alert, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-6 border transition-all cursor-pointer group relative",
                  alert.color === 'error' ? "border-error bg-error/5" : "border-outline bg-white hover:border-primary"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className={cn("font-serif italic text-xl leading-tight", 
                    alert.color === 'error' ? "text-error" : "text-primary",
                  )}>{alert.title}</p>
                </div>
                <p className="text-xs text-secondary leading-relaxed mb-6 line-clamp-2">{alert.desc}</p>
                <div className="flex justify-between items-baseline border-t border-outline/30 pt-4">
                  <span className="tag-pill opacity-40">{alert.time}</span>
                  <span className={cn("tag-pill", 
                    alert.color === 'error' ? "text-error" : "text-primary"
                  )}>{alert.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const AnalyticsScreen = () => {
  const [data, setData] = useState<{name: string, temp: number, rpm: number, load: number}[]>([]);

  useEffect(() => {
    const mockData = Array.from({ length: 20 }, (_, i) => ({
      name: `${i}`,
      temp: 70 + Math.random() * 5,
      rpm: 2400 + Math.random() * 200,
      load: 40 + Math.random() * 10
    }));
    setData(mockData);
  }, []);

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-outline pb-10">
        <div>
          <p className="tag-pill mb-3">Telemetry Synthesis // Issue 04</p>
          <h2 className="font-serif text-6xl text-primary tracking-tight italic">Analytics Command</h2>
        </div>
        <div className="flex border border-outline bg-white p-1">
          <button className="px-8 py-3 bg-primary text-white tag-pill !text-[10px]">Current Hour</button>
          <button className="px-8 py-3 text-secondary hover:text-primary transition-all tag-pill !text-[10px]">Last 24h</button>
          <button className="px-8 py-3 text-secondary hover:text-primary transition-all tag-pill !text-[10px]">Weekly Archive</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Hero Chart */}
        <div className="md:col-span-8 border border-outline bg-white relative overflow-hidden group shadow-[10px_10px_0px_rgba(0,0,0,0.02)]">
          <div className="p-10 flex flex-col h-full relative">
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="max-w-md">
                <h3 className="font-serif italic text-3xl text-primary mb-3 flex items-center gap-4">
                  <DeviceThermostat className="text-primary w-6 h-6" />
                  Thermal Resonance
                </h3>
                <p className="text-secondary text-sm leading-relaxed italic">Real-time thermal monitoring of Induction Unit #4. Thermal thresholds mapped against structural baseline resonance.</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-5xl text-primary font-bold">72.4°C</p>
                <p className="tag-pill mt-2 opacity-50">Nominal Range</p>
              </div>
            </div>
            <div className="flex-grow min-h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E4DE" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E4DE', borderRadius: '0px' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area type="monotone" dataKey="temp" stroke="#1A1A1A" strokeWidth={1} fill="#F8F7F2" activeDot={{ r: 4, fill: '#1A1A1A' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="md:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container border border-outline p-8 relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-1 h-full bg-secondary shadow-sm" />
            <div className="flex justify-between items-center mb-6">
              <span className="tag-pill text-secondary">AI Synthesis</span>
              <IndicatorPip color="secondary" />
            </div>
            <p className="font-serif italic text-4xl text-primary mb-4 leading-tight">99.4%<br/>Efficiency</p>
            <p className="text-xs text-secondary leading-relaxed italic">System operating at peak theoretical output. No maintenance predicted for 144 hours.</p>
          </div>
          
          <div className="bg-white border border-outline p-8 flex flex-col items-center justify-center relative flex-1">
            <h4 className="tag-pill mb-10 self-start opacity-50">Pulse Latency</h4>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="75" fill="transparent" stroke="#F1F0E8" strokeWidth="2" />
                <circle cx="80" cy="80" r="75" fill="transparent" stroke="#1A1A1A" strokeWidth="4" strokeDasharray="471" strokeDashoffset="410" strokeLinecap="square" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-serif text-3xl italic text-primary">12ms</span>
                <span className="tag-pill !text-[8px] mt-1 opacity-40">Ultra Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassPanel className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-serif italic text-2xl text-primary flex items-center gap-3">
              <SettingsBackupRestore size={20} className="text-secondary" />
              RPM Stability
            </h3>
            <span className="tag-pill">2,450 RPM</span>
          </div>
          <div className="h-48 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="stepAfter" dataKey="rpm" stroke="#1A1A1A" strokeWidth={1} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-serif italic text-2xl text-primary flex items-center gap-3">
              <Bolt size={20} className="text-secondary" />
              Consumption Archive
            </h3>
            <span className="tag-pill">45.8 A</span>
          </div>
          <div className="h-48 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <Area type="monotone" dataKey="load" stroke="#8C8A84" strokeWidth={1} fill="#F0EEE4" fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      <div className="border border-outline bg-white overflow-hidden shadow-[20px_20px_40px_rgba(0,0,0,0.03)]">
        <div className="p-8 border-b border-outline bg-surface-dim flex justify-between items-center">
          <h4 className="font-serif italic text-2xl text-primary font-bold">System Incident Log</h4>
          <button className="cta-button">
            <Download size={14} className="inline mr-2" /> Export Protocol
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10px]">
            <thead>
              <tr className="text-secondary border-b border-outline bg-surface-container/30 uppercase tracking-widest font-bold">
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">Registry ID</th>
                <th className="px-8 py-5">Metric Analysis</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Magnitude</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {[
                { time: '2024-05-24 14:32:01', id: 'EV_7822_X', metric: 'THERMAL_THRESHOLD', status: 'NOMINAL', val: '71.2°C' },
                { time: '2024-05-24 14:31:55', id: 'EV_7821_X', metric: 'RPM_STABILITY', status: 'WARNING', val: '2,580 RPM' },
                { time: '2024-05-24 14:31:40', id: 'EV_7820_X', metric: 'LOAD_V_CURR', status: 'NOMINAL', val: '44.1 A' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-surface-dim transition-all group">
                  <td className="px-8 py-6 text-secondary opacity-60 font-medium">{row.time}</td>
                  <td className="px-8 py-6 text-primary italic font-serif text-base">{row.id}</td>
                  <td className="px-8 py-6 tracking-tight">{row.metric}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 border text-[9px] font-bold uppercase tracking-wider",
                      row.status === 'NOMINAL' ? "border-outline text-secondary" : "border-error text-error bg-error/5"
                    )}>{row.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right text-primary font-bold text-sm tracking-tighter">{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AlertsScreen = () => {
  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-outline pb-10">
        <div>
          <h2 className="font-serif text-6xl text-primary tracking-tight italic">Alert Registry</h2>
          <p className="description text-secondary italic mt-2">Real-time anomaly detection and predictive maintenance oversight in severe environments.</p>
        </div>
        <div className="border border-outline px-4 py-3 bg-white flex items-center gap-3 w-full md:w-96 shadow-md">
          <Search size={18} className="text-secondary opacity-40" />
          <input 
            type="text" 
            placeholder="Search registry ID..." 
            className="bg-transparent border-none focus:ring-0 text-sm text-primary w-full font-sans italic" 
          />
          <FilterList size={18} className="text-primary cursor-pointer hover:rotate-90 transition-transform" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Severity Groups */}
        {[
          { label: 'Critical Anomaly', color: 'error', count: '02', items: [
            { id: '#MCH-8821', title: 'Bearing Wear Detected', desc: 'AI models detect vibration patterns consistent with stage-3 bearing failure. Probability of failure within 12 hours: 87%.', action: 'Initiate immediate lubrication cycle and schedule emergency spindle replacement.' },
            { id: '#SYS-COOL-04', title: 'Coolant Pressure Drop', desc: 'Sudden 14% drop in line pressure detected at Manifold 4B. Possible seal breach or valve bypass malfunction.', action: 'Activate redundant cooling pump B-02 and dispatch maintenance drone.' }
          ]},
          { label: 'Moderate Drift', color: 'secondary', count: '05', items: [
            { id: '#ROB-610', title: 'Thermal Anomaly', desc: 'Arm servo motor J3 temperature rising above historical baseline. Current: 68°C. Limit: 75°C.', action: 'Reduce cycle speed by 15% to allow passive dissipation. Check fan filters.' },
            { id: '#LNE-PREP-A', title: 'Sub-optimal Yield', desc: 'Raw material feed rate is fluctuating beyond tolerance. Reject rate increased to 2.4%.', action: 'Recalibrate ultrasonic feed sensors and verify hopper moisture levels.' }
          ]},
          { label: 'Standard Protocol', color: 'primary', count: '12', items: [
            { id: '#SEN-PH-29', title: 'Routine Calibration Due', desc: 'pH sensor in Tank 3 is scheduled for its bi-weekly drift calibration check in 4 hours.', action: 'Perform standard buffer test at start of shift. No immediate risk detected.' }
          ]}
        ].map((group) => (
          <div key={group.label} className="space-y-8">
            <div className="flex items-center gap-4 mb-4 border-b border-outline pb-4">
              <IndicatorPip color={group.color === 'error' ? 'red' : group.color === 'secondary' ? 'purple' : 'primary'} />
              <h3 className={cn("tag-pill text-[11px]",
                group.color === 'error' ? 'text-error' : 'text-primary'
              )}>{group.label}</h3>
              <span className="font-serif italic text-2xl text-secondary ml-auto opacity-20">{group.count}</span>
            </div>
            
            {group.items.map((alert, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "border border-outline bg-white p-8 transition-all hover:bg-surface-dim group relative",
                  group.color === 'error' && "border-error shadow-[4px_4px_0px_#B02A2A10]"
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <h4 className="font-serif italic text-2xl text-primary group-hover:underline decoration-outline underline-offset-8 transition-all">{alert.title}</h4>
                  <span className="tag-pill !text-[8px] opacity-40">{alert.id}</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed mb-8 italic">{alert.desc}</p>
                <div className={cn(
                  "p-6 border-t border-outline/30 mb-8",
                  group.color === 'error' ? "bg-error/5" : "bg-surface-container"
                )}>
                  <div className="flex items-center gap-3 mb-3">
                     <span className="tag-pill text-primary opacity-60">AI Resolution Strategy</span>
                  </div>
                  <p className="text-[11px] font-bold text-primary leading-tight tracking-tight uppercase">{alert.action}</p>
                </div>
                <button className={cn(
                  "cta-button w-full",
                  group.color === 'error' ? "bg-error border-error text-white hover:bg-white hover:text-error" : ""
                )}>Acknowledge Registry</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ConfigScreen = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div className="space-y-4 border-b border-outline pb-10">
        <h2 className="font-serif text-6xl text-primary tracking-tight italic">System Configuration</h2>
        <p className="description text-secondary italic">Manage industrial nodes, AI thresholds, and security parameters across the facility.</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* IoT Gateway */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Router className="text-secondary opacity-40 w-5 h-5" />
            <h3 className="tag-pill">IoT Protocol Gateway</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-8 border border-outline hover:bg-surface-dim transition-colors cursor-pointer group">
              <div className="flex items-center gap-6">
                <DeveloperBoard className="text-primary opacity-40 group-hover:text-primary transition-colors" />
                <div>
                  <p className="font-serif italic text-xl text-primary">ESP32-Node-01</p>
                  <p className="font-mono text-[10px] text-secondary opacity-60 mt-1">MAC: 34:85:18:05:AF:C2</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="tag-pill text-primary bg-surface-container border-none">Active Link</span>
                <ChevronRight size={18} className="text-secondary opacity-30" />
              </div>
            </div>
            <div className="flex items-center justify-between p-8 border border-outline">
              <div className="flex items-center gap-6">
                <div className="tag-pill !bg-transparent border border-outline/30 px-3 py-1">Wi-fi</div>
                <p className="font-serif italic text-xl text-primary">Auto-Reconnect Protocol</p>
              </div>
              <div className="w-12 h-6 border border-outline bg-white flex items-center px-1">
                <div className="w-4 h-4 bg-primary ml-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* AI Inference */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Analytics className="text-secondary opacity-40 w-5 h-5" />
            <h3 className="tag-pill">AI Baseline & Thresholds</h3>
          </div>
          <div className="space-y-6">
            <div className="p-8 border border-outline bg-white">
              <div className="flex justify-between mb-6">
                <p className="font-serif italic text-xl text-primary">Vibration Anomaly Tolerance</p>
                <span className="font-serif italic text-2xl text-primary">88%</span>
              </div>
              <div className="relative w-full h-[1px] bg-outline">
                <div className="absolute left-0 top-0 h-full bg-primary w-[88%]" />
                <div className="absolute left-[88%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border border-primary cursor-pointer rotate-45" />
              </div>
            </div>
            <div className="flex items-center justify-between p-8 border border-outline">
              <div className="flex items-center gap-6">
                <Notifications className="text-secondary opacity-40" size={20} />
                <p className="font-serif italic text-xl text-primary">Predictive Maintenance Alerts</p>
              </div>
              <div className="w-12 h-6 border border-outline bg-surface-dim flex items-center px-1">
                <div className="w-4 h-4 bg-primary ml-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Access Control */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Lock className="text-secondary opacity-40 w-5 h-5" />
            <h3 className="tag-pill">Access & Identity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-8 border border-outline bg-white">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 border border-outline overflow-hidden grayscale">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" alt="Admin" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-serif italic text-2xl text-primary leading-tight">Director Chen</p>
                  <p className="tag-pill mt-2 !text-[8px] opacity-60">Authentication: Tier 1 Admin</p>
                </div>
              </div>
              <MoreVert size={18} className="text-secondary opacity-30 cursor-pointer" />
            </div>
            <div className="flex items-center justify-between p-8 border border-outline border-dashed hover:bg-surface-dim transition-all cursor-pointer group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 border border-outline border-dashed flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Add size={24} />
                </div>
                <p className="font-serif italic text-2xl text-secondary group-hover:text-primary transition-colors">Register New Proxy Operator</p>
              </div>
              <ChevronRight size={18} className="text-secondary opacity-30 group-hover:translate-x-2 transition-all" />
            </div>
          </div>
        </section>
      </div>

      <div className="p-10 border border-outline bg-surface-container space-y-8">
        <h4 className="tag-pill text-error flex items-center gap-2">
          <Warning size={16} /> Danger Zone / Immutable Operations
        </h4>
        <div className="flex flex-wrap gap-6">
          <button className="cta-button border-error text-error hover:bg-error hover:text-white">Factory Reset Gateway</button>
          <button className="tag-pill border border-outline h-12 px-8 hover:bg-white transition-colors">Purge Registry Archive</button>
        </div>
      </div>
    </div>
  );
};

const VoiceScreen = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-full max-w-7xl mx-auto pb-24">
      <section className="lg:col-span-7 flex flex-col gap-12">
        <div className="border border-outline bg-white p-16 flex flex-col items-center justify-center min-h-[500px] relative">
          <div className="absolute top-8 left-8 flex items-center gap-3">
            <span className="w-2 h-2 bg-primary" />
            <span className="tag-pill opacity-40 tracking-widest">Acoustic_Stream//Active</span>
          </div>
          <div className="absolute top-8 right-8">
            <span className="tag-pill opacity-20">SR-77-VOICE-TX</span>
          </div>

          <div className="relative group mb-16">
            <div className="relative w-48 h-48 border-[1.5px] border-outline text-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-500 z-10 bg-white">
              <Mic size={64} className="opacity-80" />
            </div>
            <div className="absolute -inset-6 border-[0.5px] border-outline opacity-20 animate-[ping_4s_linear_infinite]" />
          </div>

          <div className="flex items-end justify-center h-20 w-full max-w-sm gap-2 mb-16">
            {[4, 8, 12, 16, 10, 14, 8, 12, 6, 4].map((h, i) => (
              <motion.div 
                key={i}
                animate={{ height: [`${h * 4}px`, `${h * 8}px`, `${h * 4}px`] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                className="w-[2px] bg-primary opacity-30" 
              />
            ))}
          </div>

          <p className="font-serif italic text-3xl text-primary text-center leading-relaxed">Processing industrial telemetry through neural synthesis...</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: 'Boost Output', icon: RocketLaunch },
            { label: 'Total E-Stop', icon: EmergencyHome },
            { label: 'Registry Sync', icon: Analytics },
            { id: 'analytics', label: 'AI Synthesis', icon: Psychology },
          ].map((action, i) => (
            <button key={i} className="border border-outline bg-white p-8 flex flex-col items-center gap-4 hover:bg-surface-dim transition-all active:scale-95">
              <action.icon className="text-secondary w-6 h-6" />
              <span className="tag-pill text-[10px]">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="lg:col-span-5 flex flex-col">
        <div className="border border-outline flex flex-col h-full bg-white shadow-[20px_20px_60px_rgba(0,0,0,0.03)]">
          <div className="p-8 border-b border-outline flex items-center justify-between bg-surface-dim">
            <div className="flex items-center gap-4">
              <History size={20} className="text-primary opacity-40" />
              <h2 className="font-serif italic text-2xl text-primary font-bold">Transmission Log</h2>
            </div>
            <span className="tag-pill opacity-30">v4.2 Archive</span>
          </div>

          <div className="flex-1 p-10 space-y-12 overflow-y-auto max-h-[600px] scrollbar-hide">
             {[
              { type: 'user', text: '"What is the current machine status?"', meta: 'Proxy-01 // 14:20' },
              { type: 'bot', text: 'System Alpha is operating within nominal parameters. Thermal output is 42°C, pressure is 102kPa.', meta: 'AI Synthesis // 14:20' },
              { type: 'user', text: '"Show RPM for Turbine 4."', meta: 'Proxy-01 // 14:22' },
              { type: 'bot', text: 'Turbine 4 is currently at 14,200 RPM. This is consistent with the shift target baseline.', meta: 'AI Synthesis // 14:22', highlighted: '14,200 RPM' },
              { type: 'user', text: '"Initiate diagnostic cycle..."', meta: 'Receiving Data...', pending: true },
             ].map((msg, idx) => (
                <div key={idx} className={cn("flex flex-col gap-3", msg.type === 'user' ? "items-end" : "items-start", msg.pending && "opacity-40")}>
                  <div className={cn(
                    "p-6 text-base leading-relaxed tracking-tight max-w-[90%]",
                    msg.type === 'user' ? "bg-surface-container border border-outline italic font-serif text-primary" : "bg-white border border-outline font-sans text-secondary italic"
                  )}>
                    {msg.text.split(msg.highlighted || '').map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && <span className="text-primary underline decoration-error underline-offset-4 font-bold not-italic">{msg.highlighted}</span>}
                      </span>
                    ))}
                  </div>
                  <span className="tag-pill !text-[8px] opacity-40">{msg.meta}</span>
                </div>
              ))}
          </div>

          <div className="p-8 bg-surface-dim border-t border-outline">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Type command manually..." 
                className="w-full bg-transparent border-0 border-b border-outline focus:border-primary focus:ring-0 text-primary px-4 py-4 transition-all font-serif italic text-lg"
              />
              <button className="absolute right-2 text-primary p-2 hover:translate-x-2 transition-transform">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('monitor');

  return (
    <div className="min-h-screen bg-surface selection:bg-primary selection:text-white">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[40%] h-full border-l border-outline/5 pointer-events-none" />
      <div className="fixed top-20 left-40 w-px h-[60%] bg-outline/5 pointer-events-none" />
      
      <TopBar activeScreen={screen} />
      <Sidebar activeScreen={screen} setScreen={setScreen} />
      
      <main className="md:ml-20 pt-32 pb-32 px-10 md:px-20 max-w-[1600px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {screen === 'monitor' && <MonitorScreen setScreen={setScreen} />}
            {screen === 'analytics' && <AnalyticsScreen />}
            {screen === 'alerts' && <AlertsScreen />}
            {screen === 'config' && <ConfigScreen />}
            {screen === 'voice' && <VoiceScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Contextual FAB (Restyled as a Stamp) */}
      {screen !== 'voice' && (
        <button 
          onClick={() => screen === 'monitor' ? setScreen('voice') : console.log('Action for', screen)}
          className="fixed bottom-24 right-8 md:bottom-12 md:right-12 w-20 h-20 bg-white border-2 border-primary text-primary flex items-center justify-center z-50 hover:bg-primary hover:text-white transition-all duration-500 group overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-2 border border-current opacity-20 group-hover:scale-110 transition-transform" />
          {screen === 'monitor' && <Mic className="w-8 h-8 z-10" />}
          {screen === 'analytics' && <Add className="w-8 h-8 z-10" />}
          {screen === 'alerts' && <AddAlert className="w-8 h-8 z-10" />}
          {screen === 'config' && <Bolt className="w-8 h-8 z-10" />}
        </button>
      )}

      <BottomNav activeScreen={screen} setScreen={setScreen} />
    </div>
  );
}
