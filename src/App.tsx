import { useState } from 'react';
import { Cpu, Shield, Clock, Sun, Moon, Home } from 'lucide-react';
import DeadlockSimulatorEnhanced from './components/DeadlockSimulatorEnhanced';
import SchedulingSimulatorEnhanced from './components/SchedulingSimulatorEnhanced';
import DashboardOverview from './components/DashboardOverview';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'deadlock' | 'scheduling'>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50'
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <header className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className={`w-12 h-12 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h1 className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                OS Simulator
              </h1>
            </div>
            <p className={`text-lg ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              Interactive Deadlock Detection & CPU Scheduling Visualizer
            </p>
          </header>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-lg transition-all ${
              isDarkMode
                ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400'
                : 'bg-slate-700 text-yellow-300 hover:bg-slate-600'
            }`}
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
              activeTab === 'home'
                ? isDarkMode
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/50 scale-105'
                  : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-400/50 scale-105'
                : isDarkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <Home className="w-6 h-6" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('deadlock')}
            className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
              activeTab === 'deadlock'
                ? isDarkMode
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-400/50 scale-105'
                : isDarkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <Shield className="w-6 h-6" />
            Deadlock Detection
          </button>
          <button
            onClick={() => setActiveTab('scheduling')}
            className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
              activeTab === 'scheduling'
                ? isDarkMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-400/50 scale-105'
                : isDarkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <Clock className="w-6 h-6" />
            CPU Scheduling
          </button>
        </div>

        <div className="transition-all duration-500">
          {activeTab === 'home' && <DashboardOverview isDarkMode={isDarkMode} />}
          {activeTab === 'deadlock' && (
            <DeadlockSimulatorEnhanced isDarkMode={isDarkMode} />
          )}
          {activeTab === 'scheduling' && (
            <SchedulingSimulatorEnhanced isDarkMode={isDarkMode} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
