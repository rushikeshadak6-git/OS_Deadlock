export interface Process {
  id: number;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

interface ProcessDetail {
  processId: number;
  arrivalTime: number;
  burstTime: number;
  startTime: number;
  completionTime: number;
  waitingTime: number;
  turnaroundTime: number;
}

interface ScheduleBlock {
  processId: number;
  start: number;
  end: number;
}

interface ScheduleResult {
  processDetails: ProcessDetail[];
  schedule: ScheduleBlock[];
  totalWaitingTime: number;
  avgWaitingTime: number;
  avgTurnaroundTime: number;
}

export function scheduleFCFS(processes: Process[]): ScheduleResult {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const processDetails: ProcessDetail[] = [];
  const schedule: ScheduleBlock[] = [];
  let currentTime = 0;

  sorted.forEach((proc) => {
    const startTime = Math.max(currentTime, proc.arrivalTime);
    const completionTime = startTime + proc.burstTime;
    const turnaroundTime = completionTime - proc.arrivalTime;
    const waitingTime = turnaroundTime - proc.burstTime;

    processDetails.push({
      processId: proc.id,
      arrivalTime: proc.arrivalTime,
      burstTime: proc.burstTime,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime,
    });

    schedule.push({
      processId: proc.id,
      start: startTime,
      end: completionTime,
    });

    currentTime = completionTime;
  });

  const totalWaitingTime = processDetails.reduce((sum, p) => sum + p.waitingTime, 0);
  const avgWaitingTime = totalWaitingTime / processDetails.length;
  const avgTurnaroundTime =
    processDetails.reduce((sum, p) => sum + p.turnaroundTime, 0) /
    processDetails.length;

  return {
    processDetails,
    schedule,
    totalWaitingTime,
    avgWaitingTime,
    avgTurnaroundTime,
  };
}

export function scheduleSJF(processes: Process[]): ScheduleResult {
  const processDetails: ProcessDetail[] = [];
  const schedule: ScheduleBlock[] = [];
  const remaining = [...processes];
  let currentTime = 0;

  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      currentTime = Math.min(...remaining.map((p) => p.arrivalTime));
      continue;
    }

    const shortest = available.reduce((min, p) =>
      p.burstTime < min.burstTime ? p : min
    );

    const startTime = currentTime;
    const completionTime = startTime + shortest.burstTime;
    const turnaroundTime = completionTime - shortest.arrivalTime;
    const waitingTime = turnaroundTime - shortest.burstTime;

    processDetails.push({
      processId: shortest.id,
      arrivalTime: shortest.arrivalTime,
      burstTime: shortest.burstTime,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime,
    });

    schedule.push({
      processId: shortest.id,
      start: startTime,
      end: completionTime,
    });

    currentTime = completionTime;
    remaining.splice(remaining.indexOf(shortest), 1);
  }

  const totalWaitingTime = processDetails.reduce((sum, p) => sum + p.waitingTime, 0);
  const avgWaitingTime = totalWaitingTime / processDetails.length;
  const avgTurnaroundTime =
    processDetails.reduce((sum, p) => sum + p.turnaroundTime, 0) /
    processDetails.length;

  return {
    processDetails,
    schedule,
    totalWaitingTime,
    avgWaitingTime,
    avgTurnaroundTime,
  };
}

export function scheduleLJF(processes: Process[]): ScheduleResult {
  const processDetails: ProcessDetail[] = [];
  const schedule: ScheduleBlock[] = [];
  const remaining = [...processes];
  let currentTime = 0;

  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      currentTime = Math.min(...remaining.map((p) => p.arrivalTime));
      continue;
    }

    const longest = available.reduce((max, p) =>
      p.burstTime > max.burstTime ? p : max
    );

    const startTime = currentTime;
    const completionTime = startTime + longest.burstTime;
    const turnaroundTime = completionTime - longest.arrivalTime;
    const waitingTime = turnaroundTime - longest.burstTime;

    processDetails.push({
      processId: longest.id,
      arrivalTime: longest.arrivalTime,
      burstTime: longest.burstTime,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime,
    });

    schedule.push({
      processId: longest.id,
      start: startTime,
      end: completionTime,
    });

    currentTime = completionTime;
    remaining.splice(remaining.indexOf(longest), 1);
  }

  const totalWaitingTime = processDetails.reduce((sum, p) => sum + p.waitingTime, 0);
  const avgWaitingTime = totalWaitingTime / processDetails.length;
  const avgTurnaroundTime =
    processDetails.reduce((sum, p) => sum + p.turnaroundTime, 0) /
    processDetails.length;

  return {
    processDetails,
    schedule,
    totalWaitingTime,
    avgWaitingTime,
    avgTurnaroundTime,
  };
}

export function schedulePriority(processes: Process[]): ScheduleResult {
  const processDetails: ProcessDetail[] = [];
  const schedule: ScheduleBlock[] = [];
  const remaining = [...processes];
  let currentTime = 0;

  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      currentTime = Math.min(...remaining.map((p) => p.arrivalTime));
      continue;
    }

    const highestPriority = available.reduce((min, p) =>
      p.priority < min.priority ? p : min
    );

    const startTime = currentTime;
    const completionTime = startTime + highestPriority.burstTime;
    const turnaroundTime = completionTime - highestPriority.arrivalTime;
    const waitingTime = turnaroundTime - highestPriority.burstTime;

    processDetails.push({
      processId: highestPriority.id,
      arrivalTime: highestPriority.arrivalTime,
      burstTime: highestPriority.burstTime,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime,
    });

    schedule.push({
      processId: highestPriority.id,
      start: startTime,
      end: completionTime,
    });

    currentTime = completionTime;
    remaining.splice(remaining.indexOf(highestPriority), 1);
  }

  const totalWaitingTime = processDetails.reduce((sum, p) => sum + p.waitingTime, 0);
  const avgWaitingTime = totalWaitingTime / processDetails.length;
  const avgTurnaroundTime =
    processDetails.reduce((sum, p) => sum + p.turnaroundTime, 0) /
    processDetails.length;

  return {
    processDetails,
    schedule,
    totalWaitingTime,
    avgWaitingTime,
    avgTurnaroundTime,
  };
}

export function scheduleRoundRobin(processes: Process[], quantum: number): ScheduleResult {
  const processDetails: ProcessDetail[] = [];
  const schedule: ScheduleBlock[] = [];
  const queue: (Process & { remainingTime: number })[] = [];
  const processMap = new Map<number, ProcessDetail>();

  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  let queueIndex = 0;

  sorted.forEach((proc) => {
    queue.push({ ...proc, remainingTime: proc.burstTime });
  });

  while (queue.length > 0) {
    const process = queue[queueIndex];

    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }

    const timeSlice = Math.min(quantum, process.remainingTime);
    const startTime = currentTime;
    const endTime = currentTime + timeSlice;

    schedule.push({
      processId: process.id,
      start: startTime,
      end: endTime,
    });

    process.remainingTime -= timeSlice;
    currentTime = endTime;

    if (process.remainingTime === 0) {
      const detail = {
        processId: process.id,
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        startTime: schedule.filter((s) => s.processId === process.id)[0]?.start || 0,
        completionTime: endTime,
        waitingTime: endTime - process.arrivalTime - process.burstTime,
        turnaroundTime: endTime - process.arrivalTime,
      };
      processDetails.push(detail);
      processMap.set(process.id, detail);
      queue.splice(queueIndex, 1);
      if (queueIndex >= queue.length && queue.length > 0) {
        queueIndex = 0;
      }
    } else {
      queueIndex = (queueIndex + 1) % queue.length;
    }
  }

  const totalWaitingTime = processDetails.reduce((sum, p) => sum + p.waitingTime, 0);
  const avgWaitingTime = totalWaitingTime / processDetails.length;
  const avgTurnaroundTime =
    processDetails.reduce((sum, p) => sum + p.turnaroundTime, 0) /
    processDetails.length;

  return {
    processDetails,
    schedule,
    totalWaitingTime,
    avgWaitingTime,
    avgTurnaroundTime,
  };
}
