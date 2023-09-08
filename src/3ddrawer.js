import settings from "./settings";

export default class threeDrawer {
  constructor(g) {
    this.camera = new BABYLON.FreeCamera(
      "camera",
      new BABYLON.Vector3(g.player.x, 0.5, settings.height - g.player.y),
      g.scene,
    );
    this.camera.rotation.y = 0;
    // this.camera.rotation.x = 5;
    // this.camera.attachControl(g.canvas3DEl, true);
    this.light = new BABYLON.SpotLight(
      "spotLight",
      new BABYLON.Vector3(g.player.x, 2, settings.height - g.player.y),
      new BABYLON.Vector3(0, -2, 2),
      Math.PI / 3,
      80, g.scene);
    this.light.diffuse = new BABYLON.Color3(1, 1, 1);
    this.light.specular = new BABYLON.Color3(1, 1, 1);

    const material = new BABYLON.StandardMaterial("material", g.scene);
    material.emissiveColor = new BABYLON.Color3(100, 0, 0);
    this.enemy = BABYLON.Mesh.CreateBox(`enemy`, 1, g.scene);
    this.enemy.position.x = g.enemies[0].x;
    this.enemy.position.z = settings.height - g.enemies[0].y;
    this.enemy.position.y = 0.5
    this.enemy.material = material;
  }

  drawMap(g, stage) {
    let box, box2;
    const imgPath = "./assets/images/"
    const material = new BABYLON.StandardMaterial("material", g.scene);
    material.diffuseTexture = new BABYLON.Texture(imgPath + "floor.png.jpg", g.scene);
    material.diffuseTexture.uScale = settings.canvasWidth;
    material.diffuseTexture.vScale = settings.canvasHeight;
    material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    // material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);


    const skyMaterial = new BABYLON.StandardMaterial("skyMaterial", g.scene);
    skyMaterial.emissiveColor = new BABYLON.Color3(160, 216, 239);
    const skyBox = BABYLON.Mesh.CreateBox("skyBox", settings.width, g.scene);
    skyBox.material = skyMaterial;

    const gMaterial = new BABYLON.StandardMaterial("g-material", g.scene);
    gMaterial.diffuseTexture = new BABYLON.Texture(imgPath + "floor.png.jpg", g.scene);
    gMaterial.diffuseTexture.uScale = settings.canvasWidth;
    gMaterial.diffuseTexture.vScale = settings.canvasHeight;
    gMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    const ground = BABYLON.Mesh.CreateGround("ground", settings.canvasWidth, settings.canvasHeight, 0, g.scene, false);
    ground.material = gMaterial;

    let x, y;

    for (x = 0; x < settings.width; x++) {
      for (y = 0; y < settings.height; y++) {
        box = BABYLON.Mesh.CreateBox(`wall-${x}-${y}`, 1, g.scene);
        box.position.x = x;
        box.position.z = y;
        box.material = material;

        box2 = BABYLON.Mesh.CreateBox(`wall-${x}-${y}-1`, 1, g.scene);
        box2.position.x = x;
        box2.position.z = y;
        box2.position.y = 1;
        box2.material = material;
      }
    }

    for (const r of stage.realms) {
      for (x = r.roomLeft; x <= r.roomRight; x++) {
        for (y = r.roomTop; y <= r.roomBottom; y++) {
          box = g.scene.getMeshByName(`wall-${x}-${settings.height - y}`);
          if (box) {
            box.dispose();
          }
          box2 = g.scene.getMeshByName(`wall-${x}-${settings.height - y}-1`);
          if (box2) {
            box2.dispose();
          }
        }
      }
    }

    for ({ x, y } of stage.pathPositions) {
      box = g.scene.getMeshByName(`wall-${x}-${settings.height - y}`);
      if (box) {
        box.dispose();
      }
      box2 = g.scene.getMeshByName(`wall-${x}-${settings.height - y}-1`);
      if (box2) {
        box2.dispose();
      }
    }
  }

  update(g) {
    if (g.player.angle === "u") {
      this.camera.rotation.y = 0;
      this.light.direction.z = 2;
      this.light.direction.x = 0;
    } else if (g.player.angle === "r") {
      this.camera.rotation.y = Math.PI / 2;
      this.light.direction.z = 0;
      this.light.direction.x = 2;
    } else if (g.player.angle === "d") {
      this.camera.rotation.y = Math.PI;
      this.light.direction.z = -2;
      this.light.direction.x = 0;
    } else if (g.player.angle === "l") {
      this.camera.rotation.y = Math.PI + Math.PI / 2;
      this.light.direction.z = 0;
      this.light.direction.x = -2;
    }

    this.camera.position.x = g.player.x;
    this.camera.position.z = settings.height - g.player.y;

    this.light.position.x = g.player.x;
    this.light.position.z = settings.height - g.player.y;

    this.enemy.position.x = g.enemies[0].x;
    this.enemy.position.z = settings.height - g.enemies[0].y;


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