function error(text) {
  const e = document.getElementById('error');
  e.textContent = text;
  e.style.display = 'block';
}

function px(a) {
  return a.toFixed(2) + 'px';
}

function nopx(a) {
  return a.toFixed(2);
}

function create(what, classname) {
  const e = document.createElement(what);
  if (classname) {
    e.className = classname;
  }
  return e;
}

function lerp(a, b, p) {
  if (a.constructor == Array) {
    const c = [];
    for (let i = 0; i < a.length; i++) {
      c.push(lerp(a[i], b[i], p));
    }
    return c;
  } else {
    return b * p + a * (1 - p);
  }
}

function setDims(element, width, height) {
  element.style.width = px(width);
  element.style.height = px(height);
}

// Heatmaps for depth visualisation.

function colorLerp(a, b, p) {
  var q = 1 - p;
  return [q * a[0] + p * b[0], q * a[1] + p * b[1], q * a[2] + p * b[2], q * a[3] + p * b[3]];
}

function colorHeat(f, min, max, colors) {
  var c;
  f = (f - min) / (max - min);
  f = f * (colors.length - 1);
  var idx = Math.floor(f);
  if (idx > colors.length - 2) {
    c = colors[colors.length - 1];
  } else if (idx < 0) {
    c = colors[0];
  } else {
    var frac = f - idx;
    c = colorLerp(colors[idx], colors[idx + 1], frac);
  }
  return c;
}

const rainbow = [
  [0.18995, 0.07176, 0.23217], [0.22500, 0.16354, 0.45096],
  [0.25107, 0.25237, 0.63374], [0.26816, 0.33825, 0.78050],
  [0.27628, 0.42118, 0.89123], [0.27543, 0.50115, 0.96594],
  [0.25862, 0.57958, 0.99876], [0.21382, 0.65886, 0.97959],
  [0.15844, 0.73551, 0.92305], [0.11167, 0.80569, 0.84525],
  [0.09267, 0.86554, 0.76230], [0.12014, 0.91193, 0.68660],
  [0.19659, 0.94901, 0.59466], [0.30513, 0.97697, 0.48987],
  [0.42778, 0.99419, 0.38575], [0.54658, 0.99907, 0.29581],
  [0.64362, 0.98999, 0.23356], [0.72596, 0.96470, 0.20640],
  [0.80473, 0.92452, 0.20459], [0.87530, 0.87267, 0.21555],
  [0.93301, 0.81236, 0.22667], [0.97323, 0.74682, 0.22536],
  [0.99314, 0.67408, 0.20348], [0.99593, 0.58703, 0.16899],
  [0.98360, 0.49291, 0.12849], [0.95801, 0.39958, 0.08831],
  [0.92105, 0.31489, 0.05475], [0.87422, 0.24526, 0.03297],
  [0.81608, 0.18462, 0.01809], [0.74617, 0.13098, 0.00851],
  [0.66449, 0.08436, 0.00424], [0.47960, 0.01583, 0.01055]];
const magma = [
  [0.001462, 0.000466, 0.013866], [0.013708, 0.011771, 0.068667],
  [0.039608, 0.031090, 0.133515], [0.074257, 0.052017, 0.202660],
  [0.113094, 0.065492, 0.276784], [0.159018, 0.068354, 0.352688],
  [0.211718, 0.061992, 0.418647], [0.265447, 0.060237, 0.461840],
  [0.316654, 0.071690, 0.485380], [0.366012, 0.090314, 0.497960],
  [0.414709, 0.110431, 0.504662], [0.463508, 0.129893, 0.507652],
  [0.512831, 0.148179, 0.507648], [0.562866, 0.165368, 0.504692],
  [0.613617, 0.181811, 0.498536], [0.664915, 0.198075, 0.488836],
  [0.716387, 0.214982, 0.475290], [0.767398, 0.233705, 0.457755],
  [0.816914, 0.255895, 0.436461], [0.863320, 0.283729, 0.412403],
  [0.904281, 0.319610, 0.388137], [0.937221, 0.364929, 0.368567],
  [0.960949, 0.418323, 0.359630], [0.976690, 0.476226, 0.364466],
  [0.986700, 0.535582, 0.382210], [0.992785, 0.594891, 0.410283],
  [0.996096, 0.653659, 0.446213], [0.997325, 0.711848, 0.488154],
  [0.996898, 0.769591, 0.534892], [0.995131, 0.827052, 0.585701],
  [0.992440, 0.884330, 0.640099], [0.987053, 0.991438, 0.749504]];

function buildHeatFilters(num_layers, min = 0, max = 1) {
  const filters = document.querySelector('.filters');
  const text = [];
  for (let i = 0; i < num_layers; i++) {
    const c = colorHeat(i / (num_layers - 1), min, max, rainbow);
    const d = colorHeat(i / (num_layers - 1), min, max, magma);
    const filter1 = `<filter id=depthcol1_${i}><feColorMatrix type=matrix values="0 0 0 0 ${nopx(c[0])} 0 0 0 0 ${nopx(c[1])} 0 0 0 0 ${nopx(c[2])} 0 0 0 1 0"></feColorMatrix></filter>`;
    const filter2 = `<filter id=depthcol2_${i}><feColorMatrix type=matrix values="0 0 0 0 ${nopx(d[0])} 0 0 0 0 ${nopx(d[1])} 0 0 0 0 ${nopx(d[2])} 0 0 0 1 0"></feColorMatrix></filter>`;
    text.push(filter1);
    text.push(filter2);
  }
  filters.innerHTML = text.join('');
}

function buildMPI(layers, width, height) {
  const mpi = create('div', 'mpi');
  setDims(mpi, width, height);
  for (let i = 0; i < layers.length; i++) {
    const layer = create('div');
    const url = layers[i].url;
    const depth = layers[i].depth;
    const img = create('div', 'img');
    img.style.backgroundImage = `url(${url})`;
    layer.style.transform = `scale(${nopx(depth)}) translateZ(-${px(depth)})`;
    layer.appendChild(img);
    mpi.appendChild(layer);
  }
  return mpi;
}

function digits(i, min) {
  const s = '' + i;
  if (s.length >= min) {
    return s;
  } else {
    return ('00000' + s).substr(-min);
  }
}

function loadScene(layerzero, num_layers, width, height, near, far, fov, mode) {
  const focal_length_px = 0.5 * width / Math.tan(fov / 2 * Math.PI / 180);
  // Near and far are in metres. ppm = pixels per metre.
  const ppm = 3600;
  const layers = [];
  const depths = [];
  ratio = near / far;
  // If layerzero contains $, look for the last group of $. Otherwise, look for
  // the last group of digits, which should be zeros.
  layerzero = layerzero.replace(/%24/g, '$');
  const match = (layerzero.match(/^(.*[^$|])([$]+)([^$]*)$/)
    || layerzero.match(/^(.*[\D]|)([0]+)([\D]*)$/));
  if (!match) {
    error(`Path "${layerzero}" doesn't look like a layer zero URL.`);
    return;
  }
  const prefix = match[1];
  const mindigits = match[2].length;
  const postfix = match[3];

  for (let i = 0; i < num_layers; i++) {
    layers.push({
      url: prefix + digits(i, mindigits) + postfix,
      depth: 1 / lerp(ratio, 1, i / (num_layers - 1))
    });
  }
  buildHeatFilters(layers.length);
  const mpi = buildMPI(layers, width, height);
  mpi.postTransform = `translateZ(${px(focal_length_px)})`;
  mpi.preTransform = `scale3D(${ppm / focal_length_px}, ${ppm / focal_length_px}, ${ppm})`;
  const view = create('div', 'view');
  setDims(view, width, height);
  view.innerHTML = '';
  view.appendChild(mpi);
  view.style.perspective = px(focal_length_px);
  view.setAttribute('id', 'view');
  pose.offset = 1.5 * ppm;
  const viewSpace = document.querySelector('.viewspace');
  const half = create('div', 'half');
  half.setAttribute('id', 'half');
  const whole = create('div', 'whole');
  whole.setAttribute('id', 'whole')
  setDims(half, 0, height * 0.5625);
  setDims(whole, 0, height);
  viewSpace.innerHTML = '';
  viewSpace.appendChild(view);
  viewSpace.appendChild(half);
  viewSpace.appendChild(whole);
  setPose();
    
  // Individual layers
  if (mode == 2) {
    buildMinis(layers, width, height);   
  }
}

// Changing the viewpoint

const pose = {
  rx: 0,
  ry: 0,
  tx: 0,
  ty: 0,
  tz: 0,
  offset: 0
}

let moveScale = 1.0;

function setPose() {
  const mpi = document.querySelector('.mpi');
  const transform = `translateZ(${px(-pose.offset)}) translate3D(${px(pose.tx * moveScale)}, ${px(pose.ty * moveScale)}, ${px(pose.tz * moveScale)}) rotateX(${pose.rx * moveScale}deg) rotateY(${pose.ry * moveScale}deg) translateZ(${px(pose.offset)})`;
  mpi.style.transform = mpi.postTransform + ' ' + transform + ' ' + mpi.preTransform;
}

function resetPose() {
  pose.rx = 0;
  pose.ry = 0;
  pose.tx = 0;
  pose.ty = 0;
  pose.tz = 0;
  setPose();
}

// UI controls.

const rotSpeed = 0.003;
const transSpeed = .3;
const wheelSpeed = .5;
const hoverAngle = 2;

let moveMode = 0;
let moveStartTime = 0;

function dragStart(dragState) {
  if (moveMode != 1) {
    return false;
  }
  return true;
}

function dragDuring(dragState, x, y) {
  if (dragState.shiftKey) {
    pose.tx += transSpeed * (x - dragState.x);
    pose.ty += transSpeed * (y - dragState.y);
  } else {
    pose.ry += rotSpeed * (x - dragState.x);
    pose.rx -= rotSpeed * (y - dragState.y);
  }
  dragState.x = x;
  dragState.y = y;
  setPose();
}

function dragEnd(dragState) { }

function addHandlers() {
  const view = document.querySelector('.view');
  view.addEventListener('wheel', function (e) {
    pose.tz += wheelSpeed * e.deltaY;
    setPose();
    e.preventDefault();
  });
  // Drag support, allows draging outside view.
  let dragging = false;
  let dragState = {};

  view.addEventListener('mousedown', function (e) {
    dragState.x = e.clientX;
    dragState.y = e.clientY;
    dragState.shiftKey = e.shiftKey;
    e.preventDefault();
    dragging = dragStart(dragState);
  });
  view.addEventListener('dblclick', function (e) {
    resetPose();
    e.preventDefault();
  });
  view.addEventListener('mousemove', function (e) {
    if (moveMode != 0) {
      return;
    }
    const x = 2 * e.offsetX / view.clientWidth - 1;
    const y = 2 * e.offsetY / view.clientHeight - 1;
    pose.rx = -hoverAngle * y;
    pose.ry = hoverAngle * x;
    setPose();
  });
  view.addEventListener('mouseleave', function (e) {
    if (moveMode != 0) {
      return;
    }
    resetPose();
  });
  document.body.addEventListener('mousemove', function (e) {
    if (!dragging) {
      return;
    } else {
      dragDuring(dragState, e.clientX, e.clientY);
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
  document.body.addEventListener('mouseup', function (e) {
    if (!dragging) {
      return;
    } else {
      dragging = false;
      dragEnd(dragState);
      e.preventDefault();
    }
  }, true);
  // So that if you happen to drag over thumbnails, they don't trigger.
  document.body.addEventListener('mouseenter', function (e) {
    if (!dragging) {
      return;
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
  document.body.addEventListener('mouseleave', function (e) {
    if (!dragging || e.fromElement != document.body) {
      return;
    } else {
      dragging = false;
      dragEnd(dragState);
      e.preventDefault();
    }
  }, true);
}


function updateButtons(id, mode) {
  const buttons = document.querySelectorAll(`#${id} a`);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].className = i == mode ? "on" : "off";
  }
}

function setMoveMode(mode) {
  moveMode = mode;
  moveStartTime = 0;
  updateButtons('movemode', mode);
  resetPose();
  const view = document.querySelector('.view');
  view.setAttribute('nav', mode);
}

function setViewSize(s) {
  updateButtons('viewsize', s);
  viewSpace = document.querySelector('.viewspace');
  viewSpace.setAttribute('size', s);
  document.getElementById("viewcontrols").style.marginTop = s === 0 ? "288px": "512px";
}

// static grid
function setGrid(mode) {
    
  width = 910
  height = 512
    
  updateButtons('gridcontrols', mode);
  viewSpace = document.querySelector('.viewspace');
  const grid = create('div', 'grid');
  grid.setAttribute('id', 'grid');
    
  const query = window.location.search;
  const param = new URLSearchParams(query);
  const mpiid = param.get('i');
    
  gridImage = document.createElement('img');

  if (mpiid == null) {
    gridImage.src = "mpi/1/grid.png";
  }
  else {
    gridImage.src = "mpi/"+ mpiid + "/grid.png";
  }

  
  setDims(gridImage, width, height);
  grid.appendChild(gridImage);
    
  if (mode == 0 && document.getElementById('grid')) {viewSpace.removeChild(document.getElementById('grid'));}
  else if (mode == 1 && !document.getElementById('grid')) {viewSpace.appendChild(grid);}
}

// dynamic grid
function setDot(mode) {
  updateButtons('dotcontrols', mode);
  initFromParameters(mode);
  addHandlers();
  const rows = document.querySelectorAll('.minis .row');
  for (i = 0; i < 32; i++) {
    if (rows[i].hasAttribute('selected')) {
      // Clear it.
      rows[i].removeAttribute('selected');
    }
  }
}

function readText() {
  const time = document.getElementById('time');
  const params = new URL(window.location).searchParams;
  let file = '';
  let query = parseInt(params.get('i'));
  if (query) {
    file = 'mpi/' + parseInt(params.get('i')) + '/time.html';
  }
  else {
    file = 'mpi/1/time.html';
  }
  let html = '';
  html = ('<iframe src=' + file + ' type="text/plain" width="60em" height="19em" scrolling="no" style="border:none"></iframe>');
  time.innerHTML += html;
}

// Display a description for the current scene
function showDesc() {
  let descriptions = [
    "Works well along horizontal and vertical axes. Reflections stay in appropriate layers. A hole in the depth map exists on the back wall.",  // living room
    "Works best along horizontal axis. Objects in mirror are correctly placed farther away. There are some small holes in the depth map throughout.",  // bathroom mirror
    "Works best along horizontal axis. Objects in mirror are correctly placed farther away. The light source moves correctly according to the reflections. No notable holes in the depth map.", // mirror flash
    "Works best along horizontal axis. Objects in reflection are correctly placed farther away. There are several large holes in the depth map throughout that make vertical motion look strange.",   // window
    "Works well along horizontal and vertical axes. Several objects are placed too close, such as the bottom of the door and the edge of the countertop. There are several large holes in the depth map throughout.", // entryway
    "Works best along horizontal axis. Glasses are too thin to retain their shape. Reflections on the glass cup are slightly warped. The back cabinet is incorrectly placed closer in the scene since it is reflected in the table."  // reflective table
  ];
  
  const query = window.location.search;
  const param = new URLSearchParams(query);
  const mpiid = param.get('i') - 1;
  
  let desc = document.getElementById('desc');
    
  if (mpiid == -1) {
    desc.append(descriptions[0]);
  }
  else {
    desc.append(descriptions[mpiid]);
  }
}

// Depth control

function showDepth(mode) {
  let layers = document.querySelectorAll('.mpi .img');
  for (let i = 0; i < layers.length; i++) {
    if (mode > 0) {
      layers[i].style.filter = `url(#depthcol${mode}_${i})`;
    } else {
      layers[i].style.filter = '';
    }
  }
  updateButtons('viewmode', mode);
}

// Show only one layer

function showSelected(indices) {
  let layers = document.querySelectorAll('.mpi .img');
  let i = 0;
  const first = indices[0];
  const last = indices[indices.length - 1];
  let j = 0;
  for (; i < Math.min(first, layers.length); i++) {
    layers[i].className = 'img under';
  }
  for (; i < Math.min(last + 1, layers.length); i++) {
    if (i == indices[j]) {
      layers[i].className = 'img selected';
      j++;
    } else {
      layers[i].className = 'img mid';
    }
  }
  for (; i < layers.length; i++) {
    layers[i].className = 'img over';
  }
}
function showAll() {
  let layers = document.querySelectorAll('.mpi .img');
  for (let i = 0; i < layers.length; i++) {
    layers[i].className = 'img';
  }
}

function clickRow(index, add) {
  const rows = document.querySelectorAll('.minis .row');
  const minis = document.querySelector('.minis');

  if (rows[index].hasAttribute('selected')) {
    // Clear it.
    rows[index].removeAttribute('selected');
  } else {
    if (!add) {
      for (let i = 0; i < rows.length; i++) {
        rows[i].removeAttribute('selected');
      }
    }
    rows[index].setAttribute('selected', '1');
  }
  const selected = document.querySelectorAll('.minis .row[selected]');
  if (selected.length) {
    minis.setAttribute('selected', '1');
    const selected_layers = [];
    for (let row of selected) {
      selected_layers.push(row.layer);
    }
    showSelected(selected_layers);
  } else {
    minis.setAttribute('selected', '0');
    showAll();
  }
}

function enterRow(index) {
  if (document.querySelector('.minis[selected="0"]')) {
    showSelected([index]);
  }
}

function leaveRow(index) {
  if (document.querySelector('.minis[selected="0"]')) {
    showAll(index);
  }
}

// Layer thumbnails ("minis") on the right-hand side.

function buildMinis(layers, width, height) {
  const minis = document.querySelector('.minis');
  // Scale down
  const scale = 100 / Math.max(width, height);
  width = Math.floor(width * scale);
  height = Math.round(height * scale);
  // Always an even number of layers per row.
  const groupsize = 2;
  for (let i = 0; i < layers.length; i += groupsize) {
    const group = create('div', 'group');
    for (let j = i; j < layers.length && j < i + groupsize; j++) {
      const row = create('div', 'row');
      row.layer = j;
      const thumb = create('div', 'thumb');
      thumb.style.backgroundImage = `url(${layers[j].url})`;
      setDims(thumb, width, height);
      const num = create('div', 'num');
      num.textContent = j;
      row.appendChild(thumb);
      row.appendChild(num);
      row.addEventListener('click', (e) => { clickRow(j, e.shiftKey || e.metaKey); });
      row.addEventListener('mouseenter', () => { enterRow(j); });
      row.addEventListener('mouseleave', () => { leaveRow(); });
      group.appendChild(row);
    }
    minis.appendChild(group);
  }
}

function miniMode(mode) {
  updateButtons('minimodes', mode);
  document.body.setAttribute('mode', mode);
}

function backgroundMode(mode) {
  updateButtons('backgroundmodes', mode);
  document.body.setAttribute('background', mode);
}

function behindMode(mode) {
  updateButtons('behindmodes', mode);
  document.body.setAttribute('under', mode);
}

function frontMode(mode) {
  updateButtons('frontmodes', mode);
  document.body.setAttribute('over', mode);
}

function tick(time) {
  window.requestAnimationFrame(tick);
  if (moveMode < 2) {
    return;
  }
  if (!moveStartTime) {
    moveStartTime = time;
  }
  time -= moveStartTime;
  if (moveMode == 2) {
    pose.tx = 100 * Math.sin(Math.PI * time / 3000);
    setPose();
  } else {
    pose.ry = 2 * Math.sin(Math.PI * time / 4300);
    pose.rx = Math.cos(Math.PI * time / 5000);
    pose.tz = 200 * Math.sin(Math.PI * time / 8012);
    setPose();
  }

}

//creates a navigation list for navigating to different images
function showNavigation() {
  let imageNames = [
    "Living Room",
    "Bathroom Mirror",
    "Mirror Flash",
    "Window",
    "Entryway",
    "Reflective Table"
  ];
  let navList = document.createElement("ul");

  //add a new list element for each dataset 
  for(i = 0; i < imageNames.length; i++) {
    let listElement = document.createElement("li")
    listLink = document.createElement('a');
    listImage = document.createElement('img');
    listDesc = document.createElement('div');
    listImage.src = "previews/image"+(i+1) + ".jpg";
    listImage.alt = imageNames[i];
    listImage.id = "previewImage";
    listImage.className = "img-thumbnail";
    listDesc.append(imageNames[i]);
    listLink.appendChild(listImage);
    listLink.href = "/?i=" + (i+1); //url for image
    listElement.appendChild(listDesc);
    listElement.appendChild(listLink);
    navList.appendChild(listElement);
  }
  
  let navElement = document.getElementById("navigation");
  navElement.appendChild(navList);
}

function initFromParameters(mode) {
  const params = new URL(window.location).searchParams;
  let layerzero = '';
  let query = parseInt(params.get('i'));
  if (mode == 1) {
    if (query) {
      layerzero = 'mpi/' + parseInt(params.get('i')) + '/dot/dot_mpi_rgba_$$.png';
    }
    else {
        layerzero = 'mpi/1/dot/dot_mpi_rgba_$$.png';
    } 
  }
  else {
    if (query) {
      layerzero = 'mpi/' + parseInt(params.get('i')) + '/rgba_$$.png';
    }
    else {
        layerzero = 'mpi/1/rgba_$$.png';
    }
    
  } 

  const num_layers = 32;
  const width = 910;
  const height = 512;
  const near = 1.0;
  const far = 100.0;
  const fov = 60;
    
  loadScene(layerzero, num_layers, width, height, near, far, fov, mode);

  moveScale = 1.0;
  setMoveMode(0);
  showDepth(0);
  setViewSize(0);
  setGrid(0);
  miniMode(0);
  if (mode == 2) {
      readText();
      showDesc();
  };

}  

initFromParameters(2);
addHandlers();
showNavigation();
tick();