// ============================================================
// PRIORITY QUEUE for dispatch requests
// Priority: CRITICAL (1) > HIGH (2) > STANDARD (3)
// FIFO within same urgency
// ============================================================

export class PriorityQueue {
  constructor() {
    this._queue = [];
    this._counter = 0; // for FIFO ordering within same priority
  }

  enqueue(item) {
    this._queue.push({
      ...item,
      _seq: this._counter++,
    });
    this._sort();
  }

  dequeue() {
    return this._queue.shift() || null;
  }

  peek() {
    return this._queue[0] || null;
  }

  get size() {
    return this._queue.length;
  }

  isEmpty() {
    return this._queue.length === 0;
  }

  getAll() {
    return [...this._queue];
  }

  _sort() {
    this._queue.sort((a, b) => {
      if (a.urgency !== b.urgency) return a.urgency - b.urgency; // lower number = higher priority
      return a._seq - b._seq; // FIFO within same urgency
    });
  }

  clear() {
    this._queue = [];
  }
}
