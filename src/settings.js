export default {
  appElementID: "#app",
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
  gamemode: {
    "title": { val: 0, text: true },
    "playing": { val: 1, text: false },
    "gameclear": { val: 2, text: true },
    "gameover": { val: 3, text: true },
  },
  debugMode: true,
  pixel: 16,
  visibleRange: 3,
}