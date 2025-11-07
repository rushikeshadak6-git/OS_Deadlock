interface ProcessData {
  allocation: number[];
  max: number[];
}

export interface ProcessDetail {
  processId: number;
  burstTime: number;
  waitingTime: number;
  turnaroundTime: number;
}

export interface SafeSequence {
  sequence: number[];
  processDetails: ProcessDetail[];
  totalTime: number;
  avgBurstTime: number;
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  timeComplexityScore: number;
}

function calculateNeed(processes: ProcessData[]): number[][] {
  return processes.map((proc) =>
    proc.max.map((max, idx) => max - proc.allocation[idx])
  );
}

function canAllocate(need: number[], available: number[]): boolean {
  return need.every((n, idx) => n <= available[idx]);
}

function findAllSafeSequences(
  processes: ProcessData[],
  available: number[]
): number[][] {
  const need = calculateNeed(processes);
  const sequences: number[][] = [];

  function backtrack(
    currentSequence: number[],
    finished: boolean[],
    work: number[]
  ) {
    if (currentSequence.length === processes.length) {
      sequences.push([...currentSequence]);
      return;
    }

    for (let i = 0; i < processes.length; i++) {
      if (!finished[i] && canAllocate(need[i], work)) {
        const newWork = work.map((w, idx) => w + processes[i].allocation[idx]);
        finished[i] = true;
        currentSequence.push(i);

        backtrack(currentSequence, finished, newWork);

        currentSequence.pop();
        finished[i] = false;
      }
    }
  }

  const finished = Array(processes.length).fill(false);
  backtrack([], finished, [...available]);

  return sequences;
}

function calculateSequenceMetrics(
  sequence: number[],
  processes: ProcessData[]
): SafeSequence {
  const need = calculateNeed(processes);
  let currentTime = 0;
  const processDetails: ProcessDetail[] = [];
  let timeComplexityScore = 0; // sum of turnaround times as a proxy for time complexity

  sequence.forEach((procIdx, order) => {
    // Treat the "work" for each process as the sum of its remaining need.
    // This provides a consistent basis to compare sequences without adding arbitrary constants.
    const burstTime = need[procIdx].reduce((sum, val) => sum + val, 0);
    const waitingTime = currentTime;
    const turnaroundTime = waitingTime + burstTime;

    processDetails.push({
      processId: procIdx,
      burstTime,
      waitingTime,
      turnaroundTime,
    });

    currentTime += burstTime;
    timeComplexityScore += turnaroundTime;
  });

  const totalTime = currentTime;
  const avgBurstTime =
    processDetails.reduce((sum, p) => sum + p.burstTime, 0) / processDetails.length;
  const avgWaitingTime =
    processDetails.reduce((sum, p) => sum + p.waitingTime, 0) / processDetails.length;
  const avgTurnaroundTime =
    processDetails.reduce((sum, p) => sum + p.turnaroundTime, 0) /
    processDetails.length;

  return {
    sequence,
    processDetails,
    totalTime,
    avgBurstTime,
    avgWaitingTime,
    avgTurnaroundTime,
    timeComplexityScore,
  };
}

export interface AvoidanceStrategy {
  type: 'reduce_allocation' | 'increase_resources' | 'reduce_max';
  processId: number;
  resourceId: number;
  originalValue: number;
  suggestedValue: number;
  description: string;
}

export interface AvoidanceResult {
  strategy: AvoidanceStrategy;
  newProcesses: ProcessData[];
  newAvailable: number[];
  safeSequence: SafeSequence;
}

export function detectDeadlock(
  processes: ProcessData[],
  available: number[]
): {
  isSafe: boolean;
  safeSequences: SafeSequence[];
  optimalSequence: SafeSequence | null;
} {
  const allSequences = findAllSafeSequences(processes, available);

  if (allSequences.length === 0) {
    return {
      isSafe: false,
      safeSequences: [],
      optimalSequence: null,
    };
  }

  const safeSequences = allSequences.map((seq) =>
    calculateSequenceMetrics(seq, processes)
  );

  const optimalSequence = safeSequences.reduce((min, seq) =>
    // Choose the sequence that minimizes overall time complexity (sum of turnaround times)
    seq.timeComplexityScore < min.timeComplexityScore ? seq : min
  );

  return {
    isSafe: true,
    safeSequences,
    optimalSequence,
  };
}

export function suggestDeadlockAvoidance(
  processes: ProcessData[],
  available: number[]
): AvoidanceResult | null {
  const need = calculateNeed(processes);

  // Strategy 1: Try reducing allocation for processes with high allocation
  for (let i = 0; i < processes.length; i++) {
    for (let r = 0; r < available.length; r++) {
      if (processes[i].allocation[r] > 0) {
        const newProcesses = JSON.parse(JSON.stringify(processes)) as ProcessData[];
        const newAvailable = [...available];

        // Reduce allocation by 1
        newProcesses[i].allocation[r] -= 1;
        newAvailable[r] += 1;

        const result = detectDeadlock(newProcesses, newAvailable);
        if (result.isSafe && result.optimalSequence) {
          return {
            strategy: {
              type: 'reduce_allocation',
              processId: i,
              resourceId: r,
              originalValue: processes[i].allocation[r],
              suggestedValue: processes[i].allocation[r] - 1,
              description: `Reduce allocation of R${r} for P${i} from ${processes[i].allocation[r]} to ${processes[i].allocation[r] - 1}`,
            },
            newProcesses,
            newAvailable,
            safeSequence: result.optimalSequence,
          };
        }
      }
    }
  }

  // Strategy 2: Try increasing available resources
  for (let r = 0; r < available.length; r++) {
    const newAvailable = [...available];
    newAvailable[r] += 1;

    const result = detectDeadlock(processes, newAvailable);
    if (result.isSafe && result.optimalSequence) {
      return {
        strategy: {
          type: 'increase_resources',
          processId: -1,
          resourceId: r,
          originalValue: available[r],
          suggestedValue: available[r] + 1,
          description: `Increase available R${r} from ${available[r]} to ${available[r] + 1}`,
        },
        newProcesses: processes,
        newAvailable,
        safeSequence: result.optimalSequence,
      };
    }
  }

  // Strategy 3: Try reducing maximum need for processes
  for (let i = 0; i < processes.length; i++) {
    for (let r = 0; r < available.length; r++) {
      if (processes[i].max[r] > processes[i].allocation[r]) {
        const newProcesses = JSON.parse(JSON.stringify(processes)) as ProcessData[];

        // Reduce max by 1 (but not below current allocation)
        newProcesses[i].max[r] -= 1;

        const result = detectDeadlock(newProcesses, available);
        if (result.isSafe && result.optimalSequence) {
          return {
            strategy: {
              type: 'reduce_max',
              processId: i,
              resourceId: r,
              originalValue: processes[i].max[r],
              suggestedValue: processes[i].max[r] - 1,
              description: `Reduce maximum need of R${r} for P${i} from ${processes[i].max[r]} to ${processes[i].max[r] - 1}`,
            },
            newProcesses,
            newAvailable: available,
            safeSequence: result.optimalSequence,
          };
        }
      }
    }
  }

  return null;
}
