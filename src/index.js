import game from "./game";
import smtGame from "./smt/game";

const elements = [];
const main = () => {
  let g;
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    g = new smtGame();
  } else {
    g = new game();
  }
  g.run();
}

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
