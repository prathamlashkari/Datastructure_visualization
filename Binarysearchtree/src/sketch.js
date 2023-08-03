/***
 * sketch.js
 *
 * The main file for the binary tree visualization, an easy-to-use web-based
 * binary tree visualization
 *
 * Created by Colin Siles on July 6th, 2019
 * Last updated July 14th, 2019
 *
 * Inspired by Coding Train's Binary Tree Coding Challenge:
 * https://thecodingtrain.com/CodingChallenges/065.2-binary-tree-viz.html
***/

// Controls the size of the visualization. Defaults to full-screen
var CANVASWIDTH = window.innerWidth;
var CANVASHEIGHT = window.innerHeight;

// Constants for controlling the position of the binary tree
const TREEX = CANVASWIDTH / 2;     // The x-coordinate of the root node
const TREEY = 100;                 // The y-coordinate of the root node
const BACKGROUNDCOLOR = 60;       // Background color of the visualization

let canvas;

function setup() {
  const canvasContainer = select("#canvas-placeholder");
  canvas = createCanvas(canvasContainer.width, canvasContainer.height);
  canvas.parent("canvas-placeholder");
  
  // Create other necessary objects for the visualization
  var tree = new Tree(TREEX, TREEY, BACKGROUNDCOLOR);
  var explorer = new Explorer(canvas.canvas, tree.graphicsBuffer, tree.draw.bind(tree));
  var controls = new Controls(tree);
}

function draw() {
  background(0);
}
