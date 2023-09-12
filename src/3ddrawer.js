import settings from "./settings";

export default class threeDrawer {
  constructor(g) {
    this.camera = new BABYLON.FreeCamera(
      "camera",
      new BABYLON.Vector3(g.player.x, 0.5, settings.height - g.player.y),
      g.scene,
    );
    this.camera.rotation.y = 0;

    new BABYLON.SpotLight(
      "spotLight_main",
      new BABYLON.Vector3(0, 5, 0),
      new BABYLON.Vector3(0, -2, 0),
      Math.PI,
      10, g.scene);
    this.light = new BABYLON.SpotLight(
      "spotLight",
      new BABYLON.Vector3(g.player.x, 2, settings.height - g.player.y),
      new BABYLON.Vector3(0, -2, 2),
      Math.PI / 3,
      80, g.scene);
    this.light.diffuse = new BABYLON.Color3(1, 1, 1);
    this.light.specular = new BABYLON.Color3(1, 1, 1);


    const m_ehead = new BABYLON.StandardMaterial("m_ehead", g.scene);
    m_ehead.emissiveColor = new BABYLON.Color3(0.99, 0.706, 0.443); // R:254 G:220 B:189


    const m_ebody = new BABYLON.StandardMaterial("m_ebody", g.scene);
    m_ebody.emissiveColor = new BABYLON.Color3(100, 0, 0);


    this.enemies = [];
    let idx = 0;
    let ehead, ebody;
    for (const enemy of g.enemies) {
      ehead = BABYLON.Mesh.CreateSphere("head" + idx, 32, 0.7, g.scene);
      ehead.position.y = 1;
      ehead.material = m_ehead;

      ebody = BABYLON.Mesh.CreateCylinder("body" + idx, 2, 0, 1, 24, 1, g.scene);
      ebody.position.y = 0;
      ebody.material = m_ebody;

      this.enemies[idx] = BABYLON.Mesh.MergeMeshes([ehead, ebody], true, true, undefined, false, true);
      this.enemies[idx].position.x = enemy.x;
      this.enemies[idx].position.z = settings.height - enemy.y;

      idx++;
    }

    const bhead = BABYLON.Mesh.CreateSphere("bhead", 32, 0.7, g.scene);
    bhead.position.y = 1;
    bhead.material = m_ehead;

    const m_bbody = new BABYLON.StandardMaterial("m_bbody", g.scene);
    m_bbody.emissiveColor = new BABYLON.Color3(0, 100, 0);
    const bbody = BABYLON.Mesh.CreateCylinder("bbody", 2, 0, 1, 24, 1, g.scene);
    bbody.position.y = 0;
    bbody.material = m_bbody;

    this.brother = BABYLON.Mesh.MergeMeshes([bhead, bbody], true, true, undefined, false, true);
    this.brother.position.x = g.brother.x;
    this.brother.position.z = settings.height - g.brother.y;
  }

  drawMap(g, stage) {
    let box, box2, box3;
    const imgPath = "./assets/images/"

    const gMaterial = new BABYLON.StandardMaterial("g-material", g.scene);
    gMaterial.diffuseTexture = new BABYLON.Texture(imgPath + "floor.png.jpg", g.scene);
    gMaterial.diffuseTexture.uScale = settings.canvasWidth;
    gMaterial.diffuseTexture.vScale = settings.canvasHeight;
    gMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    const ground = BABYLON.Mesh.CreateGround("ground", settings.canvasWidth, settings.canvasHeight, 0, g.scene, false);
    ground.material = gMaterial;

    let x, y;

    let m1 = true;
    for (x = 0; x < settings.width; x++) {
      for (y = 0; y < settings.height; y++) {
        box = BABYLON.Mesh.CreateBox(`wall-${x}-${y}`, 1, g.scene);
        box.position.x = x;
        box.position.z = y;
        box.material = gMaterial;

        box2 = BABYLON.Mesh.CreateBox(`wall-${x}-${y}-1`, 1, g.scene);
        box2.position.x = x;
        box2.position.z = y;
        box2.position.y = 1;
        box2.material = gMaterial;

        box3 = BABYLON.Mesh.CreateBox(`wall-${x}-${y}-2`, 1, g.scene);
        box3.position.x = x;
        box3.position.z = y;
        box3.position.y = 2;
        box.material = gMaterial;

        m1 = !m1;
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
          box3 = g.scene.getMeshByName(`wall-${x}-${settings.height - y}-2`);
          if (box3) {
            box3.dispose();
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

    for (const idx in this.enemies) {
      this.enemies[idx].position.x = g.enemies[idx].x;
      this.enemies[idx].position.z = settings.height - g.enemies[idx].y;
    }

    this.brother.position.x = g.brother.x;
    this.brother.position.z = settings.height - g.brother.y;
  }

  draw(g) {

  }
}