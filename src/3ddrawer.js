import settings from "./settings";

export default class threeDrawer {
  constructor(g) {
    this.camera = new BABYLON.UniversalCamera(
      "camera",
      new BABYLON.Vector3(0, 30, 0),
      g.scene,
    );
    this.camera.attachControl(g.canvas3DEl, true);
    new BABYLON.PointLight(
      "light",
      new BABYLON.Vector3(10, 10, 0),
      g.scene,
    );
  }

  drawMap(g, stage) {
    let box;
    const material = new BABYLON.StandardMaterial("material", g.scene);
    material.emissiveColor = new BABYLON.Color3(0, 0.58, 0.86);

    let x, y;

    for (x = 0; x < settings.width; x++) {
      for (y = 0; y < settings.height; y++) {
        box = BABYLON.Mesh.CreateBox(`wall-${x}-${y}`, 2, g.scene);
        box.position.x = x;
        box.position.y = y;
        box.material = material;
      }
    }

    for (const r of stage.realms) {
      for (x = r.roomLeft; x <= r.roomRight; x++) {
        for (y = r.roomTop; y <= r.roomBottom; y++) {
          box = g.scene.getMeshByName(`wall-${x}-${y}`);
          if (box) {
            box.dispose();
          }
        }
      }
    }

    console.log(stage.pathPositions);
    let cnt = 1;
    for ({ x, y } of stage.pathPositions) {
      box = g.scene.getMeshByName(`wall-${x}-${y}`);
      if (box) {
        console.log(cnt, box);
        box.dispose();

        box = g.scene.getMeshByName(`wall-${x}-${y}`);
        console.log("removed", box);

        cnt++;
      }
    }
  }

  update(g) {

  }

  draw(g) {

  }
}