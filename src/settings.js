const pixel = 16;
const widthSize = 80;
const heightSize = 40;

export default {
  appElementID: "#app",
  canvasWidth: widthSize * pixel,
  canvasHeight: heightSize * pixel,
  gamemode: {
    "title": { val: 0, text: true },
    "playing": { val: 1, text: false },
    "gameclear": { val: 2, text: true },
    "gameover": { val: 3, text: true },
  },
  debugMode: true,
  pixel,
  visibleRange: 3,
}