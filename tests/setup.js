/**
 * Test Setup
 * Initialize globals and mocks for testing
 */

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = String(value);
  },
  removeItem: function(key) {
    delete this.store[key];
  },
  clear: function() {
    this.store = {};
  }
};

global.localStorage = localStorageMock;

// Mock console for cleaner test output
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  // Keep warn and error for debugging
  warn: console.warn,
  error: console.error
};

// Reset localStorage before each test
beforeEach(() => {
  localStorage.clear();
});
