import { useState } from 'react';
import { Play, RefreshCw, Plus, Trash2, Download } from 'lucide-react';
import {
  Process,
  scheduleFCFS,
  scheduleSJF,
  scheduleLJF,
  schedulePriority,
  scheduleRoundRobin,
} from '../utils/scheduling';
import AnimatedGanttChart from './AnimatedGanttChart';
import ComparisonCharts from './ComparisonCharts';

type Algorithm = 'FCFS' | 'SJF' | 'LJF' | 'Priority' | 'Round Robin';

interface SchedulingSimulatorEnhancedProps {
  isDarkMode: boolean;
}

const SchedulingSimulatorEnhanced = ({ isDarkMode }: SchedulingSimulatorEnhancedProps) => {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: 2, arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 3, arrivalTime: 2, burstTime: 8, priority: 3 },
    { id: 4, arrivalTime: 3, burstTime: 6, priority: 2 },
  ]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('FCFS');
  const [roundRobinQuantum, setRoundRobinQuantum] = useState(2);
  const [results, setResults] = useState<any>(null);
  const [allResults, setAllResults] = useState<any>(null);

  const bgColor = isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50';
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-slate-300';
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const labelColor = isDarkMode ? 'text-blue-200' : 'text-blue-700';
  const inputBg = isDarkMode ? 'bg-slate-700' : 'bg-slate-200';
  const inputText = isDarkMode ? 'text-white' : 'text-slate-900';

  const addProcess = () => {
    const newId = Math.max(...processes.map((p) => p.id), 0) + 1;
    setProcesses([
      ...processes,
      { id: newId, arrivalTime: 0, burstTime: 5, priority: 1 },
    ]);
    setResults(null);
    setAllResults(null);
  };

  const removeProcess = (id: number) => {
    setProcesses(processes.filter((p) => p.id !== id));
    setResults(null);
    setAllResults(null);
  };

  const updateProcess = (id: number, field: keyof Process, value: number) => {
    setProcesses(
      processes.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    setResults(null);
    setAllResults(null);
  };

  const randomizeProcesses = () => {
    const newProcesses = processes.map((p) => ({
      ...p,
      arrivalTime: Math.floor(Math.random() * 10),
      burstTime: Math.floor(Math.random() * 10 + 1),
      priority: Math.floor(Math.random() * 5 + 1),
    }));
    setProcesses(newProcesses);
    setResults(null);
    setAllResults(null);
  };

  const runSimulation = () => {
    let result;
    switch (selectedAlgorithm) {
      case 'FCFS':
        result = scheduleFCFS(processes);
        break;
      case 'SJF':
        result = scheduleSJF(processes);
        break;
      case 'LJF':
        result = scheduleLJF(processes);
        break;
      case 'Priority':
        result = schedulePriority(processes);
        break;
      case 'Round Robin':
        result = scheduleRoundRobin(processes, roundRobinQuantum);
        break;
    }
    setResults(result);
  };

  const runAllComparisons = () => {
    const fcfs = scheduleFCFS(processes);
    const sjf = scheduleSJF(processes);
    const ljf = scheduleLJF(processes);
    const priority = schedulePriority(processes);
    const rr = scheduleRoundRobin(processes, roundRobinQuantum);

    const comparisonResults = [
      {
        name: 'FCFS',
        avgWaitingTime: fcfs.avgWaitingTime,
        avgTurnaroundTime: fcfs.avgTurnaroundTime,
        totalTime: fcfs.processDetails[fcfs.processDetails.length - 1]?.completionTime || 0,
        cpuUtilization: 100,
      },
      {
        name: 'SJF',
        avgWaitingTime: sjf.avgWaitingTime,
        avgTurnaroundTime: sjf.avgTurnaroundTime,
        totalTime: sjf.processDetails[sjf.processDetails.length - 1]?.completionTime || 0,
        cpuUtilization: 100,
      },
      {
        name: 'LJF',
        avgWaitingTime: ljf.avgWaitingTime,
        avgTurnaroundTime: ljf.avgTurnaroundTime,
        totalTime: ljf.processDetails[ljf.processDetails.length - 1]?.completionTime || 0,
        cpuUtilization: 100,
      },
      {
        name: 'Priority',
        avgWaitingTime: priority.avgWaitingTime,
        avgTurnaroundTime: priority.avgTurnaroundTime,
        totalTime: priority.processDetails[priority.processDetails.length - 1]?.completionTime || 0,
        cpuUtilization: 100,
      },
      {
        name: 'Round Robin',
        avgWaitingTime: rr.avgWaitingTime,
        avgTurnaroundTime: rr.avgTurnaroundTime,
        totalTime: rr.processDetails[rr.processDetails.length - 1]?.completionTime || 0,
        cpuUtilization: 100,
      },
    ];

    setAllResults(comparisonResults);
  };

  const exportResults = () => {
    if (!results) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      algorithm: selectedAlgorithm,
      quantum: selectedAlgorithm === 'Round Robin' ? roundRobinQuantum : null,
      processes,
      results,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scheduling-${selectedAlgorithm.replace(' ', '-')}-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className={`${bgColor} backdrop-blur-sm rounded-xl p-6 border ${borderColor}`}>
        <h2 className={`text-2xl font-bold ${textColor} mb-4`}>Algorithm Selection</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {(['FCFS', 'SJF', 'LJF', 'Priority', 'Round Robin'] as Algorithm[]).map((algo) => (
            <button
              key={algo}
              onClick={() => {
                setSelectedAlgorithm(algo);
                setResults(null);
              }}
              className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                selectedAlgorithm === algo
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-400/50 scale-105'
                  : isDarkMode
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>

        {selectedAlgorithm === 'Round Robin' && (
          <div className="mb-4">
            <label className={`block ${labelColor} mb-2 font-semibold`}>Time Quantum</label>
            <input
              type="number"
              min="1"
              value={roundRobinQuantum}
              onChange={(e) => setRoundRobinQuantum(parseInt(e.target.value) || 1)}
              className={`w-24 px-4 py-2 ${inputBg} ${inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
        )}

        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-200/50'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
            {selectedAlgorithm === 'FCFS' &&
              'First Come First Served - Processes execute in arrival order'}
            {selectedAlgorithm === 'SJF' &&
              'Shortest Job First - Process with shortest burst time executes first'}
            {selectedAlgorithm === 'LJF' &&
              'Longest Job First - Process with longest burst time executes first'}
            {selectedAlgorithm === 'Priority' &&
              'Priority Scheduling - Process with highest priority (lowest number) executes first'}
            {selectedAlgorithm === 'Round Robin' &&
              `Round Robin - Each process gets ${roundRobinQuantum} time units per turn`}
          </p>
        </div>
      </div>

      <div className={`${bgColor} backdrop-blur-sm rounded-xl p-6 border ${borderColor}`}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className={`text-2xl font-bold ${textColor}`}>Process Data</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={randomizeProcesses}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Randomize
            </button>
            <button
              onClick={addProcess}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${textColor}`}>
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className="px-4 py-3 text-left">Process ID</th>
                <th className="px-4 py-3 text-left">Arrival Time</th>
                <th className="px-4 py-3 text-left">Burst Time</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((proc) => (
                <tr key={proc.id} className={`border-b ${borderColor} hover:${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-200/30'}`}>
                  <td className="px-4 py-3 font-semibold text-purple-300">P{proc.id}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={proc.arrivalTime}
                      onChange={(e) =>
                        updateProcess(proc.id, 'arrivalTime', parseInt(e.target.value) || 0)
                      }
                      className={`w-20 px-2 py-1 ${inputBg} ${inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={proc.burstTime}
                      onChange={(e) =>
                        updateProcess(proc.id, 'burstTime', parseInt(e.target.value) || 1)
                      }
                      className={`w-20 px-2 py-1 ${inputBg} ${inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={proc.priority}
                      onChange={(e) =>
                        updateProcess(proc.id, 'priority', parseInt(e.target.value) || 1)
                      }
                      className={`w-20 px-2 py-1 ${inputBg} ${inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeProcess(proc.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 mt-4 flex-wrap">
          <button
            onClick={runSimulation}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-sm md:text-base"
          >
            <Play className="w-5 h-5" />
            Run {selectedAlgorithm}
          </button>
          <button
            onClick={runAllComparisons}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 text-sm md:text-base"
          >
            Compare All
          </button>
          {results && (
            <button
              onClick={exportResults}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 text-sm md:text-base"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          )}
        </div>
      </div>

      {results && (
        <div className={`${bgColor} backdrop-blur-sm rounded-xl p-6 border ${borderColor}`}>
          <h2 className={`text-2xl font-bold ${textColor} mb-6`}>
            {selectedAlgorithm} Simulation Results
          </h2>

          <div className="mb-6">
            <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Animated Gantt Chart</h3>
            <AnimatedGanttChart schedule={results.schedule} isDarkMode={isDarkMode} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-xl shadow-lg">
              <div className="text-blue-100 text-sm font-semibold mb-1">Total Waiting</div>
              <div className="text-white font-bold text-3xl">{results.totalWaitingTime}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-xl shadow-lg">
              <div className="text-purple-100 text-sm font-semibold mb-1">Avg Waiting</div>
              <div className="text-white font-bold text-3xl">
                {results.avgWaitingTime.toFixed(2)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-xl shadow-lg">
              <div className="text-green-100 text-sm font-semibold mb-1">Avg TAT</div>
              <div className="text-white font-bold text-3xl">
                {results.avgTurnaroundTime.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-sm ${textColor}`}>
              <thead>
                <tr className={`border-b ${borderColor}`}>
                  <th className="px-4 py-3 text-left">Process</th>
                  <th className="px-4 py-3 text-left">AT</th>
                  <th className="px-4 py-3 text-left">BT</th>
                  <th className="px-4 py-3 text-left">ST</th>
                  <th className="px-4 py-3 text-left">CT</th>
                  <th className="px-4 py-3 text-left">WT</th>
                  <th className="px-4 py-3 text-left">TAT</th>
                </tr>
              </thead>
              <tbody>
                {results.processDetails.map((detail: any) => (
                  <tr
                    key={detail.processId}
                    className={`border-b ${borderColor} hover:${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-200/30'}`}
                  >
                    <td className="px-4 py-3 font-semibold text-purple-300">P{detail.processId}</td>
                    <td className="px-4 py-3">{detail.arrivalTime}</td>
                    <td className="px-4 py-3">{detail.burstTime}</td>
                    <td className="px-4 py-3">{detail.startTime}</td>
                    <td className="px-4 py-3">{detail.completionTime}</td>
                    <td className="px-4 py-3 text-cyan-300 font-semibold">{detail.waitingTime}</td>
                    <td className="px-4 py-3 text-green-300 font-semibold">{detail.turnaroundTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {allResults && (
        <div className={`${bgColor} backdrop-blur-sm rounded-xl p-6 border ${borderColor}`}>
          <h2 className={`text-2xl font-bold ${textColor} mb-6`}>
            Algorithm Comparison Analysis
          </h2>
          <ComparisonCharts results={allResults} isDarkMode={isDarkMode} />
        </div>
      )}
    </div>
  );
};

export default SchedulingSimulatorEnhanced;
