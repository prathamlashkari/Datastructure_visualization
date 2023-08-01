let canvas;
function setup() {
  const canvasContainer = select("#canvas-placeholder");
  canvas = createCanvas(canvasContainer.width, canvasContainer.height);
  canvas.parent("canvas-placeholder");
}

function draw() {
  background(0);
}
