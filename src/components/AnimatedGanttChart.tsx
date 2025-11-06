import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

interface ScheduleBlock {
  processId: number;
  start: number;
  end: number;
}

interface AnimatedGanttChartProps {
  schedule: ScheduleBlock[];
  isDarkMode: boolean;
}

const AnimatedGanttChart = ({ schedule, isDarkMode }: AnimatedGanttChartProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);

  const maxTime = Math.max(...schedule.map((s) => s.end), 1);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }
        return prev + 0.1 * speed;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying, maxTime, speed]);

  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-cyan-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  const getProcessColor = (processId: number) => colors[processId % colors.length];

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentTime(0)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-300 hover:bg-slate-400 text-slate-900'
              }`}
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentTime(Math.max(0, currentTime - 1));
                setIsPlaying(false);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-300 hover:bg-slate-400 text-slate-900'
              }`}
              title="Step Back"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setCurrentTime(Math.min(maxTime, currentTime + 1));
                setIsPlaying(false);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-300 hover:bg-slate-400 text-slate-900'
              }`}
              title="Step Forward"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Speed:
            </label>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className={`px-3 py-1 rounded-lg ${
                isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-900'
              }`}
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          <div className={`text-sm font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Time: {currentTime.toFixed(1)} / {maxTime}
          </div>
        </div>

        <div className={`w-full h-12 rounded-lg border-2 overflow-hidden relative ${
          isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-white'
        }`}>
          {schedule.map((block, idx) => {
            const startPercent = (block.start / maxTime) * 100;
            const endPercent = (block.end / maxTime) * 100;
            const width = endPercent - startPercent;

            const isActive = currentTime >= block.start && currentTime < block.end;
            const isCompleted = currentTime >= block.end;

            return (
              <div
                key={idx}
                className={`absolute h-full transition-all duration-100 border-r-2 border-slate-900 flex items-center justify-center font-bold text-white ${getProcessColor(
                  block.processId
                )} ${isActive ? 'animate-pulse' : ''} ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
                style={{
                  left: `${startPercent}%`,
                  width: `${width}%`,
                  zIndex: isActive ? 10 : 5,
                }}
              >
                <span className="text-xs md:text-sm">P{block.processId}</span>
              </div>
            );
          })}

          <div
            className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-lg shadow-red-500/50 transition-all"
            style={{ left: `${(currentTime / maxTime) * 100}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs">
          {Array.from({ length: Math.ceil(maxTime) + 1 }).map((_, i) => (
            <span key={i} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>
              {i}
            </span>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Process Legend
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {schedule.map((block, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${getProcessColor(block.processId)}`} />
              <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                P{block.processId}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedGanttChart;
