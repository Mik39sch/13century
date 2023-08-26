import game from "./game";
import settings from "./settings";
import smtGame from "./smt/game";

const elements = [];
const main = () => {
  let g;
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    g = new smtGame(settings.canvasWidth, settings.canvasHeight);
  } else {
    g = new game(settings.canvasWidth, settings.canvasHeight);
  }
  g.run();
}

const ua = navigator.userAgent.toLowerCase();
const isiPhone = (ua.indexOf('iphone') > -1);
const isiPad = (ua.indexOf('ipad') > -1);
const isAndroid = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') > -1);
const isAndroidTablet = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') == -1);

if (isiPhone || isiPad) {
  window.onorientationchange = directionCheck;
}
if (isAndroid || isAndroidTablet) {
  window.onresize = directionCheck;
}
const direct = directionCheck();

function directionCheck() {
  const direction = Math.abs(window.orientation);
  if (direction == 90) {
    return '横向き';
  }
  return '縦向き';
}

if (
  (isiPhone || isiPad || isAndroid || isAndroidTablet) &&
  direct === '縦向き'
) {
  document.getElementById("app").innerHTML = "横向きにしてください";
} else {
  let count = 0;
  if (elements.length === 0) {
    main();
  }
  for (var i = 0; i < elements.length; ++i) {
    elements[i].onload = function () {
      ++count;
      if (count == elements.length) {
        main();
      }
    };
  }

}

