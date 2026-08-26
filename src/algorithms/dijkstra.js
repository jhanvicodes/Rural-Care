// ============================================================
// DIJKSTRA — Single-source shortest path (optimised for timeMin)
// Returns { path, time, distance } or null if unreachable
// ============================================================

import { MinHeap } from './MinHeap.js';

/**
 * @param {Object} graph - adjacency list: nodeId -> [{neighbor, distanceKm, timeMin}]
 * @param {string} start
 * @param {string} target
 * @returns {{ path: string[], time: number, distance: number } | null}
 */
export function dijkstra(graph, start, target) {
  if (!graph[start] || !graph[target]) return null;

  if (start === target) {
    return { path: [start], time: 0, distance: 0 };
  }

  // dist[node] = { time, distance }
  const dist = {};
  const prev = {};
  const visited = new Set();

  // Initialise all distances to Infinity
  for (const node of Object.keys(graph)) {
    dist[node] = { time: Infinity, distance: Infinity };
    prev[node] = null;
  }
  dist[start] = { time: 0, distance: 0 };

  // Min-heap: [time, node]
  const heap = new MinHeap((a, b) => a[0] - b[0]);
  heap.push([0, start]);

  while (!heap.isEmpty()) {
    const [currentTime, u] = heap.pop();

    if (visited.has(u)) continue;
    visited.add(u);

    if (u === target) break;

    for (const edge of (graph[u] || [])) {
      const { neighbor, timeMin, distanceKm } = edge;
      if (visited.has(neighbor)) continue;

      const newTime = currentTime + timeMin;
      if (newTime < dist[neighbor].time) {
        dist[neighbor] = {
          time: newTime,
          distance: dist[u].distance + distanceKm,
        };
        prev[neighbor] = u;
        heap.push([newTime, neighbor]);
      }
    }
  }

  if (dist[target].time === Infinity) return null; // unreachable

  // Reconstruct path
  const path = [];
  let cur = target;
  while (cur !== null) {
    path.unshift(cur);
    cur = prev[cur];
  }

  return {
    path,
    time: dist[target].time,
    distance: dist[target].distance,
  };
}
