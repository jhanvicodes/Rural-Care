// ============================================================
// BINARY MIN-HEAP for Dijkstra priority queue
// ============================================================

export class MinHeap {
  constructor(compareFn) {
    this._heap = [];
    this._compare = compareFn || ((a, b) => a - b);
  }

  get size() {
    return this._heap.length;
  }

  isEmpty() {
    return this._heap.length === 0;
  }

  push(item) {
    this._heap.push(item);
    this._bubbleUp(this._heap.length - 1);
  }

  pop() {
    if (this._heap.length === 0) return undefined;
    const top = this._heap[0];
    const last = this._heap.pop();
    if (this._heap.length > 0) {
      this._heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  peek() {
    return this._heap[0];
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this._compare(this._heap[i], this._heap[parent]) < 0) {
        [this._heap[i], this._heap[parent]] = [this._heap[parent], this._heap[i]];
        i = parent;
      } else {
        break;
      }
    }
  }

  _sinkDown(i) {
    const n = this._heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this._compare(this._heap[left], this._heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < n && this._compare(this._heap[right], this._heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest !== i) {
        [this._heap[i], this._heap[smallest]] = [this._heap[smallest], this._heap[i]];
        i = smallest;
      } else {
        break;
      }
    }
  }
}
