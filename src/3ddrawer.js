import settings from "./settings";

export default class threeDrawer {
  constructor(g) {
    this.camera = new BABYLON.FreeCamera(
      "camera",
      new BABYLON.Vector3(g.player.x, 0.5, g.player.y),
      g.scene,
    );
    this.camera.rotation.y = Math.PI;
    // this.camera.rotation.x = 5;
    // this.camera.attachControl(g.canvas3DEl, true);
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

    const gMaterial = new BABYLON.StandardMaterial("g-material", g.scene);
    gMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);

    const ground = BABYLON.Mesh.CreateGround("ground", settings.canvasWidth, settings.canvasHeight, 0, g.scene, false);
    ground.material = gMaterial;

    let x, y;

    for (x = 0; x < settings.width; x++) {
      for (y = 0; y < settings.height; y++) {
        box = BABYLON.Mesh.CreateBox(`wall-${x}-${y}`, 1, g.scene);
        box.position.x = x;
        box.position.z = y;
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

    for ({ x, y } of stage.pathPositions) {
      box = g.scene.getMeshByName(`wall-${x}-${y}`);
      if (box) {
        box.dispose();
      }
    }
  }

  update(g) {
    if (g.player.angle === "u") {
      this.camera.rotation.y = Math.PI;
    } else if (g.player.angle === "r") {
      this.camera.rotation.y = Math.PI / 2;
    } else if (g.player.angle === "d") {
      this.camera.rotation.y = 0;
    } else if (g.player.angle === "l") {
      this.camera.rotation.y = Math.PI + Math.PI / 2;
    }

    this.camera.position.x = g.player.x;
    this.camera.position.z = g.player.y;
    // if (g.player.angle === "u") {
    //   this.camera.position.x = g.player.x;
    //   this.camera.position.z = g.player.y + 1;
    // } else if (g.player.angle === "r") {
    //   this.camera.position.x = g.player.x - 1;
    //   this.camera.position.z = g.player.y;
    // } else if (g.player.angle === "d") {
    //   this.camera.position.x = g.player.x;
    //   this.camera.position.z = g.player.y - 1;
    // } else if (g.player.angle === "l") {
    //   this.camera.position.x = g.player.x + 1;
    //   this.camera.position.z = g.player.y;
    // }
  }

  draw(g) {

  }
}