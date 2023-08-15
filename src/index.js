import { setLoadAllCallback } from "./util";
import game from "./base/game";

setLoadAllCallback([], function () {
  console.log("running");
  const gCls = new game();
  gCls.run()
});
