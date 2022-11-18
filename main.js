import "./style.css";

import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

let container, clock, mixer, camera, action, scene, renderer, model, clip;

let rotFlag = false;

let majica,
  dzemper,
  pantalone,
  sorc,
  karakter,
  naocare,
  suncane,
  brkovi,
  sesir,
  kacket,
  cipelaL,
  cipelaD,
  carapaL,
  carapaD,
  papucaL,
  papucaD,
  sat,
  narukvica,
  kosa,
  obrvaL,
  obrvaD,
  okoL,
  okoD,
  kapakL,
  kapakD;

const params = {
  trs: true,
  onlyVisible: true,
  binary: false,
  maxTextureSize: 4096,
  exportScene: exportScene,
};

function main() {
  init();
  animate();
}

main();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.005,
    100
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  // renderer.toneMapping = THREE.LinearToneMapping;
  // renderer.toneMappingExposure = 0.4;
  container.appendChild(renderer.domElement);

  camera.position.set(7, 0, 2);
  camera.lookAt(new THREE.Vector3(0, 1, 0));
  camera.updateProjectionMatrix();

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0xa9d0d9);
  scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

  clock = new THREE.Clock();

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0x1a8237, depthWrite: false })
  );
  mesh.position.set(0, -1, 0);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(0, 20, 10);
  scene.add(dirLight);

  // new RGBELoader().load("hdri6.hdr", (text) => {
  //   text.mapping = THREE.EquirectangularReflectionMapping;
  //   scene.background = text;
  //   scene.environment = text;
  // });

  const loader = new GLTFLoader();
  loader.load(
    "./model8.glb",
    (gltf) => {
      model = gltf.scene;
      model.position.set(-1, -1, -2.2);
      model.rotation.set(0, 0.7, 0);
      model.scale.set(1, 1, 1);
      model.name = "lik";
      scene.add(model);

      mixer = new THREE.AnimationMixer(model);

      clip = gltf.animations[0];
      action = mixer.clipAction(clip);

      action.clampWhenFinished = true;
      action.loop = THREE.LoopRepeat;
      action.loop.unroll_loop_end;
      action.play();

      majica = model.getObjectByName("majica");
      dzemper = model.getObjectByName("dzemper");
      karakter = model.getObjectByName("karakter");
      sorc = model.getObjectByName("sorc");
      naocare = model.getObjectByName("cvike");
      suncane = model.getObjectByName("suncane");
      sesir = model.getObjectByName("kapa");
      kacket = model.getObjectByName("kacket");
      pantalone = model.getObjectByName("pantalone");
      cipelaL = model.getObjectByName("cipelal");
      cipelaD = model.getObjectByName("cipelad");
      papucaD = model.getObjectByName("papucad");
      papucaL = model.getObjectByName("papucal");
      carapaL = model.getObjectByName("carapal");
      carapaD = model.getObjectByName("carapad");
      brkovi = model.getObjectByName("brkovi");
      kosa = model.getObjectByName("kosa");
      obrvaL = model.getObjectByName("obrval");
      obrvaD = model.getObjectByName("obrvad");
      okoD = model.getObjectByName("okod");
      okoL = model.getObjectByName("okol");
      kapakD = model.getObjectByName("kapakd");
      kapakL = model.getObjectByName("kapakl");
      sat = model.getObjectByName("sat");
      narukvica = model.getObjectByName("narukvica");

      suncane.visible = false;
      papucaL.visible = false;
      sorc.visible = false;
      papucaD.visible = false;
      dzemper.visible = false;
      kacket.visible = false;
      narukvica.visible = false;
    },
    undefined,
    (e) => {
      console.error(e);
    }
  );

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  const dt = clock.getDelta();

  if (mixer) mixer.update(dt);

  requestAnimationFrame(animate);

  if (rotFlag) {
    model.rotation.y += 0.04;
  }

  TWEEN.update();

  renderer.render(scene, camera);
}

function exportGLTF(input) {
  const gltfExporter = new GLTFExporter();

  const options = {
    trs: params.trs,
    onlyVisible: params.onlyVisible,
    binary: params.binary,
    maxTextureSize: params.maxTextureSize,
    animations: [clip],
  };

  gltfExporter.parse(
    input,
    function (result) {
      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, "scene.glb");
      } else {
        const output = JSON.stringify(result, null, 2);
        console.log(output);
        saveString(output, "scene.gltf");
      }
    },
    function (error) {
      console.log("An error happened during parsing", error);
    },
    options
  );
}

const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link);

function exportScene() {
  exportGLTF(scene);
}

function save(blob, filename) {
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function saveString(text, filename) {
  save(new Blob([text], { type: "text/plain" }), filename);
}

function saveArrayBuffer(buffer, filename) {
  save(new Blob([buffer], { type: "application/octet-stream" }), filename);
}

const download = document.querySelector(".download");
download.addEventListener("click", () => {
  const coordsm = {
    x: model.position.x,
    y: model.position.y,
    z: model.position.z,
  };

  const coordsr = {
    x: model.rotation.x,
    y: model.rotation.y,
    z: model.rotation.z,
  };

  model.rotation.set(0, 0, 0);
  model.position.set(0, 0, 0);

  exportScene();

  model.position.set(coordsm.x, coordsm.y, coordsm.z);
  model.rotation.set(coordsr.x, coordsr.y, coordsr.z);
});

const rotacija = document.querySelector(".rotacija");
rotacija.addEventListener("mousedown", (e) => {
  rotFlag = true;
});

const pause = document.querySelector(".pauza");
pause.addEventListener("click", () => {
  if (!action.paused) {
    pause.textContent = "PLAY";
  } else {
    pause.textContent = "PAUSE";
  }
  action.paused = !action.paused;
});

rotacija.addEventListener("mouseup", () => {
  rotFlag = false;
});

function cameraToHead() {
  const coordsm = {
    x: model.position.x,
    y: model.position.y,
    z: model.position.z,
  };

  new TWEEN.Tween(coordsm)
    .to({ x: -1, y: -1.5, z: -2.5 }, 500)
    .onUpdate(() => model.position.set(coordsm.x, coordsm.y, coordsm.z))
    .start();

  const coords = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };
  new TWEEN.Tween(coords)
    .to({ x: 4.15, y: 0, z: 0.5 }, 500)
    .onUpdate(() => camera.position.set(coords.x, coords.y, coords.z))
    .start();
}

function cameraToBody() {
  const coordsm = {
    x: model.position.x,
    y: model.position.y,
    z: model.position.z,
  };

  new TWEEN.Tween(coordsm)
    .to({ x: -1, y: -1, z: -2.2 }, 500)
    .onUpdate(() => model.position.set(coordsm.x, coordsm.y, coordsm.z))
    .start();

  const coords = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };
  new TWEEN.Tween(coords)
    .to({ x: 7, y: 0, z: 2 }, 500)
    .onUpdate(() => camera.position.set(coords.x, coords.y, coords.z))
    .start();
}

function cameraToWatch() {
  const coordsm = {
    x: model.position.x,
    y: model.position.y,
    z: model.position.z,
  };

  new TWEEN.Tween(coordsm)
    .to({ x: -1, y: -1, z: -2.5 }, 500)
    .onUpdate(() => model.position.set(coordsm.x, coordsm.y, coordsm.z))
    .start();

  const coords = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };
  new TWEEN.Tween(coords)
    .to({ x: 3, y: 0, z: 0 }, 500)
    .onUpdate(() => camera.position.set(coords.x, coords.y, coords.z))
    .start();
}

const navItems = document.querySelectorAll(".nav-item");
const assetSets = document.querySelectorAll(".asset-set");

const navMorph = document.querySelector(".nav-morph");
const navMajica = document.querySelector(".nav-majica");
const navPantalone = document.querySelector(".nav-pantalone");
const navKosa = document.querySelector(".nav-kosa");
const navSmajli = document.querySelector(".nav-smajli");
const navNaocare = document.querySelector(".nav-naocare");
const navSesir = document.querySelector(".nav-sesir");
const navCipele = document.querySelector(".nav-cipele");
const navSat = document.querySelector(".nav-sat");
const navDownload = document.querySelector(".nav-download");

const setMorph = document.querySelector(".morph-set");
const setMajica = document.querySelector(".majica-set");
const setPantalone = document.querySelector(".pantalone-set");
const setKosa = document.querySelector(".kosa-set");
const setSmajli = document.querySelector(".smajli-set");
const setNaocare = document.querySelector(".naocare-set");
const setSesir = document.querySelector(".sesir-set");
const setCipele = document.querySelector(".cipele-set");
const setSat = document.querySelector(".sat-set");
const setDownload = document.querySelector(".download-set");

navMorph.addEventListener("click", () => {
  cameraToBody();
  navItems.forEach((item) => {
    item.classList.remove("active");
  });
  navMorph.classList.add("active");
  assetSets.forEach((set) => {
    set.classList.add("hide");
  });
  setMorph.classList.remove("hide");
});

navMajica.addEventListener("click", () => {
  cameraToBody();
  navItems.forEach((item) => {
    item.classList.remove("active");
  });
  navMajica.classList.add("active");
  assetSets.forEach((set) => {
    set.classList.add("hide");
  });
  setMajica.classList.remove("hide");
});

navPantalone.addEventListener("click", () => {
  cameraToBody();
  navItems.forEach((item) => {
    item.classList.remove("active");
  });
  navPantalone.classList.add("active");
  assetSets.forEach((set) => {
    set.classList.add("hide");
  });
  setPantalone.classList.remove("hide");
});

navKosa.addEventListener("click", () => {
  cameraToHead();
  navItems.forEach((item) => {
    item.classList.remove("active");
  });
  navKosa.classList.add("active");
  assetSets.forEach((set) => {
    set.classList.add("hide");
  });
  setKosa.classList.remove("hide");
});

navSmajli.addEventListener("click", () => {
  cameraToHead();
  navItems.forEach((item) => {
    item.classList.remove("active");
  });
  navSmajli.classList.add("active");
  assetSets.forEach((set) => {
    set.classList.add("hide");
  });
  setSmajli.classList.remove("hide");
});

navNaocare.addEventListener("click", () => {
  cameraToHead();
  navItems.forEach((item) => {
    item.classList.remove("active");
  });
  navNaocare.classList.add("active");
  assetSets.forEach((set) => {
    set.classList.add("hide");
  });
  setNaocare.classList.remove("hide");
});

navSat.addEventListener("click", () => {
  cameraToWatch();
  navItems.forEach((item) => {
    item.classList.remove("active");
  });
  navSat.classList.add("active");
  assetSets.forEach((set) => {
    set.classList.add("hide");
  });
  setSat.classList.remove("hide");
});

navSesir.addEventListener("click", () => {
  cameraToHead();
  navItems.forEach((item) => {
    item.classList.remove("active");
  });
  navSesir.classList.add("active");
  assetSets.forEach((set) => {
    set.classList.add("hide");
  });
  setSesir.classList.remove("hide");
});

navCipele.addEventListener("click", () => {
  cameraToBody();
  navItems.forEach((item) => {
    item.classList.remove("active");
  });
  navCipele.classList.add("active");
  assetSets.forEach((set) => {
    set.classList.add("hide");
  });
  setCipele.classList.remove("hide");
});

navDownload.addEventListener("click", () => {
  cameraToBody();
  navItems.forEach((item) => {
    item.classList.remove("active");
  });
  navDownload.classList.add("active");
  assetSets.forEach((set) => {
    set.classList.add("hide");
  });
  setDownload.classList.remove("hide");
});

const glavaInput = document.querySelector(".glava");
glavaInput.addEventListener("click", (e) => {
  console.log(123);
  e.preventDefault();
  console.log(naocare);
  karakter.morphTargetInfluences[0] = parseFloat(e.target.value);
  kacket.morphTargetInfluences[0] = parseFloat(e.target.value);
  sesir.morphTargetInfluences[0] = parseFloat(e.target.value);
  naocare.morphTargetInfluences[0] = parseFloat(e.target.value);
  brkovi.morphTargetInfluences[0] = parseFloat(e.target.value);
  suncane.morphTargetInfluences[0] = parseFloat(e.target.value);
  obrvaL.morphTargetInfluences[0] = parseFloat(e.target.value);
  obrvaD.morphTargetInfluences[0] = parseFloat(e.target.value);
  kosa.morphTargetInfluences[0] = parseFloat(e.target.value);
  okoL.morphTargetInfluences[0] = parseFloat(e.target.value);
  okoD.morphTargetInfluences[0] = parseFloat(e.target.value);
  kapakL.morphTargetInfluences[0] = parseFloat(e.target.value);
  kapakD.morphTargetInfluences[0] = parseFloat(e.target.value);
});

const stomakInput = document.querySelector(".stomak");
stomakInput.addEventListener("click", (e) => {
  e.preventDefault();
  karakter.morphTargetInfluences[1] = parseFloat(e.target.value);
  pantalone.morphTargetInfluences[0] = parseFloat(e.target.value);
  sorc.morphTargetInfluences[0] = parseFloat(e.target.value);
  majica.morphTargetInfluences[0] = parseFloat(e.target.value);
  dzemper.morphTargetInfluences[0] = parseFloat(e.target.value);
});

const smajliInput = document.querySelector(".smajli");
smajliInput.addEventListener("click", (e) => {
  e.preventDefault();
  karakter.morphTargetInfluences[2] = parseFloat(e.target.value);
});

const obrveInput = document.querySelector(".obrve");
obrveInput.addEventListener("click", (e) => {
  e.preventDefault();
  obrvaL.morphTargetInfluences[1] = parseFloat(e.target.value);
  obrvaD.morphTargetInfluences[1] = parseFloat(e.target.value);
});

const kratkaMajica = document.querySelector(".majica-kratka");
kratkaMajica.addEventListener("click", () => {
  kratkaMajica.style.outline = "4px solid #8ff7a7";
  dugaMajica.style.outline = "3px solid #555555";
  majica.visible = true;
  dzemper.visible = false;
});

const dugaMajica = document.querySelector(".majica-duga");
dugaMajica.addEventListener("click", () => {
  dugaMajica.style.outline = "4px solid #8ff7a7";
  kratkaMajica.style.outline = "3px solid #555555";
  majica.visible = false;
  dzemper.visible = true;
});

const majice = document.querySelectorAll(".majica-input");

const majicaBoja = document.querySelector(".majica-boja");
majicaBoja.addEventListener("change", (e) => {
  e.preventDefault();
  majice.forEach((majica) => {
    majica.style.fill = e.target.value;
  });
  majica.material.color.set(e.target.value);
  dzemper.material.color.set(e.target.value);
});

const kratkePantalone = document.querySelector(".pantalone-kratke");
kratkePantalone.addEventListener("click", () => {
  kratkePantalone.style.outline = "4px solid #8ff7a7";
  dugePantalone.style.outline = "3px solid #555555";
  sorc.visible = true;
  pantalone.visible = false;
});

const dugePantalone = document.querySelector(".pantalone-duge");
dugePantalone.addEventListener("click", () => {
  dugePantalone.style.outline = "4px solid #8ff7a7";
  kratkePantalone.style.outline = "3px solid #555555";
  sorc.visible = false;
  pantalone.visible = true;
});

const pantalones = document.querySelectorAll(".pantalone-input");

const pantaloneBoja = document.querySelector(".pantalone-boja");
pantaloneBoja.addEventListener("change", (e) => {
  e.preventDefault();
  pantalones.forEach((pantalone) => {
    pantalone.style.fill = e.target.value;
  });
  sorc.material.color.set(e.target.value);
  pantalone.material.color.set(e.target.value);
});

let brkoviFlag = true;
const brkoviDiv = document.querySelector(".brkovi");
brkoviDiv.addEventListener("click", () => {
  if (brkoviFlag) {
    brkoviDiv.style.outline = "3px solid #555555";
    brkoviFlag = false;
  } else {
    brkoviDiv.style.outline = "4px solid #8ff7a7";
    brkoviFlag = true;
  }
  brkovi.visible = !brkovi.visible;
});

let kosaFlag = true;
const kosaDiv = document.querySelector(".kosa");
kosaDiv.addEventListener("click", () => {
  if (kosaFlag) {
    kosaDiv.style.outline = "3px solid #555555";
    kosaFlag = false;
  } else {
    kosaDiv.style.outline = "4px solid #8ff7a7";
    kosaFlag = true;
  }
  kosa.visible = !kosa.visible;
});

const kosaInput = document.querySelectorAll(".kosa-input");

const kosaBoja = document.querySelector(".kosa-boja");
kosaBoja.addEventListener("change", (e) => {
  e.preventDefault();
  kosaInput.forEach((kosa) => {
    kosa.style.fill = e.target.value;
  });
  brkovi.material.color.set(e.target.value);
  kosa.material.color.set(e.target.value);
  obrvaL.material.color.set(e.target.value);
  obrvaD.material.color.set(e.target.value);
});

let suncaneFlag = false;
const suncaneDiv = document.querySelector(".suncane");
suncaneDiv.addEventListener("click", () => {
  if (suncaneFlag) {
    suncane.visible = false;
    naocare.visible = false;
    suncaneFlag = false;
    suncaneDiv.style.outline = "3px solid #555555";
  } else {
    if (naocareFlag) {
      naocareFlag = false;
      naocareDiv.style.outline = "3px solid #555555";
    }
    suncane.visible = true;
    naocare.visible = true;
    suncaneFlag = true;
    suncaneDiv.style.outline = "4px solid #8ff7a7";
  }
});

let naocareFlag = true;
const naocareDiv = document.querySelector(".naocare");
naocareDiv.addEventListener("click", () => {
  if (naocareFlag) {
    naocare.visible = false;
    naocareFlag = false;
    naocareDiv.style.outline = "3px solid #555555";
  } else {
    if (suncaneFlag) {
      suncane.visible = false;
      naocare.visible = false;
      suncaneFlag = false;
      suncaneDiv.style.outline = "3px solid #555555";
    }
    naocare.visible = true;
    naocareFlag = true;
    naocareDiv.style.outline = "4px solid #8ff7a7";
  }
});

const naocareInput = document.querySelectorAll(".naocare-input");

const naocareBoja = document.querySelector(".naocare-boja");
naocareBoja.addEventListener("change", (e) => {
  e.preventDefault();
  naocareInput.forEach((cale) => {
    cale.style.fill = e.target.value;
  });
  naocare.material.color.set(e.target.value);
});

let kacketFlag = false;
const kacketDiv = document.querySelector(".kacket");
kacketDiv.addEventListener("click", () => {
  if (kacketFlag) {
    kacket.visible = false;
    sesir.visible = false;
    kacketFlag = false;
    kacketDiv.style.outline = "3px solid #555555";
  } else {
    if (sesirFlag) {
      sesirFlag = false;
      sesirDiv.style.outline = "3px solid #555555";
    }
    kacket.visible = true;
    sesir.visible = false;
    kacketFlag = true;
    kacketDiv.style.outline = "4px solid #8ff7a7";
  }
});

let sesirFlag = true;
const sesirDiv = document.querySelector(".sesir");
sesirDiv.addEventListener("click", () => {
  if (sesirFlag) {
    sesir.visible = false;
    sesirFlag = false;
    sesirDiv.style.outline = "3px solid #555555";
  } else {
    if (kacketFlag) {
      kacket.visible = false;
      kacketFlag = false;
      kacketDiv.style.outline = "3px solid #555555";
    }
    sesir.visible = true;
    sesirFlag = true;
    sesirDiv.style.outline = "4px solid #8ff7a7";
  }
});

const sesirInput = document.querySelectorAll(".sesir-input");

const sesirBoja = document.querySelector(".sesir-boja");
sesirBoja.addEventListener("change", (e) => {
  e.preventDefault();
  sesirInput.forEach((kapa) => {
    kapa.style.fill = e.target.value;
  });
  sesir.material.color.set(e.target.value);
});

const cipeleDiv = document.querySelector(".cipele");
cipeleDiv.addEventListener("click", () => {
  cipeleDiv.style.outline = "4px solid #8ff7a7";
  papuceDiv.style.outline = "3px solid #555555";
  cipelaL.visible = true;
  cipelaD.visible = true;
  carapaD.visible = true;
  carapaL.visible = true;
  papucaL.visible = false;
  papucaD.visible = false;
});

const papuceDiv = document.querySelector(".papuce");
papuceDiv.addEventListener("click", () => {
  papuceDiv.style.outline = "4px solid #8ff7a7";
  cipeleDiv.style.outline = "3px solid #555555";
  cipelaL.visible = false;
  cipelaD.visible = false;
  carapaD.visible = false;
  carapaL.visible = false;
  papucaL.visible = true;
  papucaD.visible = true;
});

const cipele = document.querySelectorAll(".cipele-input");

const cipeleBoja = document.querySelector(".cipele-boja");
cipeleBoja.addEventListener("change", (e) => {
  e.preventDefault();
  cipele.forEach((cipela) => {
    cipela.style.fill = e.target.value;
  });
  papucaL.material.color.set(e.target.value);
  cipelaD.material.color.set(e.target.value);
});

let narukvicaFlag = false;
const narukvicaDiv = document.querySelector(".narukvica");
narukvicaDiv.addEventListener("click", () => {
  if (narukvicaFlag) {
    narukvica.visible = false;
    sat.visible = false;
    narukvicaFlag = false;
    narukvicaDiv.style.outline = "3px solid #555555";
  } else {
    if (satFlag) {
      satFlag = false;
      satDiv.style.outline = "3px solid #555555";
    }
    narukvica.visible = true;
    sat.visible = false;
    narukvicaFlag = true;
    narukvicaDiv.style.outline = "4px solid #8ff7a7";
  }
});

let satFlag = true;
const satDiv = document.querySelector(".sat");
satDiv.addEventListener("click", () => {
  if (satFlag) {
    sat.visible = false;
    satFlag = false;
    satDiv.style.outline = "3px solid #555555";
  } else {
    if (narukvicaFlag) {
      narukvica.visible = false;
      narukvicaFlag = false;
      narukvicaDiv.style.outline = "3px solid #555555";
    }
    sat.visible = true;
    satFlag = true;
    satDiv.style.outline = "4px solid #8ff7a7";
  }
});

const loader = document.querySelector(".load");
setTimeout(() => {
  loader.style.display = "none";
}, 200);
