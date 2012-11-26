/**
 * External libraries and resources:
 * 
 * http://rosettacode.org/wiki/Fractal_tree
 * http://jquery.com/
 * http://calebevans.me/projects/jcanvas/index.php
 * http://twitter.github.com/bootstrap/index.html
 *
 */

var ft = null;    // I be global, yo.

/**
 * @class FractalTrees
 * @function FractalTrees
 * @description FractalTrees javascript class.
 * @returns null
 * @usage
 * 
 * ft = new FractalTrees();
 * $('#ftDrawTreeBtn').click(function() {
 *   ft.drawTree();
 * });
 * 
 */
function FractalTrees() {
  this.deg2rad              = Math.PI / 180.0; // Converts a degree to its radian number.
  // Canvas dimensions
  this.canvas               = {};
  this.canvas.height        = 460;
  this.canvas.width         = 600;
  // HTML tag id's
  this.html                 = {};
  this.html.branchAngleId   = 'ftBranchAngle';
  this.html.branchLengthId  = 'ftBranchLength';
  this.html.buttonBarId     = 'ftButtonBar';
  this.html.canvasId        = 'ftFractalTree';
  this.html.drawSpeedId     = 'ftDrawSpeed';
  this.html.drawTreeId      = 'ftDrawTreeBtn';
  this.html.leafSizeId      = 'ftLeafSize';
  this.html.loadingBarId    = 'ftLoadingBar';
  this.html.treeAgeId       = 'ftTreeAge';
  this.html.trunkLengthId   = 'ftTrunkLength';
  // Tree object
  this.tree                 = {};
  // Tree params
  this.tree.params                  = {};
  this.tree.params.branchAngle      = 20;
  this.tree.params.branchColor      = '#532e03';
  this.tree.params.branchLength     = 100;
  this.tree.params.drawSpeed        = 8;
  this.tree.params.leafSize         = 8;
  this.tree.params.treeAge          = 8;
  this.tree.params.treeAngle        = 90;
  this.tree.params.trunkColor       = '#532e03';
  this.tree.params.trunkLength      = 60;
  this.tree.params.branchWidth      = (this.tree.params.treeAge + 2);
  // Tree positions
  this.tree.pos         = {};
  this.tree.pos.x       = (this.canvas.width / 2);
  this.tree.pos.y       = (this.canvas.height - 20);
  this.tree.pos.yTree   = (this.tree.pos.y - this.tree.params.trunkLength);
  // Object status
  this.isDrawing    = false;
  return null;
}

/**
 * @function drawBranches
 * @description This is a rescursive function.  Each iteration draws a new
 * level of branches / leaves.
 * 
 * @param {Integer} x1 Starting x position for the current interation.
 * @param {Integer} y1 Starting y position for the current interation.
 * @param {Float} angle Branch angle.
 * @param {Integer} depth Current interation.
 *
 * @returns null
 * @see http://calebevans.me/projects/jcanvas/index.php
 */
FractalTrees.prototype.drawBranches = function(x1, y1, angle, depth) {
  if (depth > this.tree.params.treeAge) {
    ft.showButton();
    return null;
  }
  var x2, y2;
  var randNum = 0;
  var randOp = '+';
  var lineColor = this.tree.params.branchColor;
  var lineWidth = (this.tree.params.branchWidth - depth);
  if (lineWidth < 1) {
    lineWidth = 1;
  }
  // Determine the ending x and y coordinates for the current iteration.
  x2 = x1 - (Math.cos(angle * this.deg2rad) / 2 * (this.tree.params.branchLength - (depth * 9)));
  y2 = y1 - (Math.sin(angle * this.deg2rad) / 2 * (this.tree.params.branchLength - (depth * 9)));
  // Branches get slightly lighter with each iteration.
  switch (depth) {
    case (this.tree.params.treeAge - 3):
      lineColor = '#573206';
      break;
    case (this.tree.params.treeAge - 2):
      lineColor = '#5f3b11';
      break;
    case (this.tree.params.treeAge - 1):
      lineWidth = 2;
      lineColor = '#613e14';
      break;
    case this.tree.params.treeAge:
      // This is the final iteration so we're drawing leaves.
      // Let's use a different size and make them green.
      lineWidth = this.tree.params.leafSize;
      lineColor = '#007800';
      break;
  }
  // jCanvas drawLine() function
  $('#' + this.html.canvasId).drawLine({
    layer: true,
    strokeStyle: lineColor,
    strokeWidth: lineWidth,
    x1: x1, y1: y1,
    x2: x2, y2: y2,
    rounded: true
  });
  // A little bit of chaos is what makes fractal geometry so damn cool.
  randNum = Math.floor(Math.random()*11);
  // Recurse / iterate.
  if (randNum % 2 == 0) {
    setTimeout("ft.drawBranches(" + x2 + ", " + y2 + ", (" + angle + " + (" + this.tree.params.branchAngle + " + " + randNum + ")), (" + depth + " + 1));", this.tree.params.drawSpeed);
    setTimeout("ft.drawBranches(" + x2 + ", " + y2 + ", (" + angle + " - (" + this.tree.params.branchAngle + " + " + randNum + ")), (" + depth + " + 1));", this.tree.params.drawSpeed);
  } else {
    setTimeout("ft.drawBranches(" + x2 + ", " + y2 + ", (" + angle + " + (" + this.tree.params.branchAngle + " - " + randNum + ")), (" + depth + " + 1));", this.tree.params.drawSpeed);
    setTimeout("ft.drawBranches(" + x2 + ", " + y2 + ", (" + angle + " - (" + this.tree.params.branchAngle + " - " + randNum + ")), (" + depth + " + 1));", this.tree.params.drawSpeed);
  }
}

/**
 * @function drawTree
 * @description Button click event that draws the HTML5 canvas fractal tree.
 * @returns null
 * @see  FractalTrees
 * @usage
 *
 * $('#ftDrawTreeBtn').click(function() {
 *   ft.drawTree();
 * });
 * 
 */
FractalTrees.prototype.drawTree = function() {
  // Hide the Draw Tree button and show a cool spinny gif.
  ft.showLoading();
  // Clear the HTML5 canvas.
  $('#' + this.html.canvasId).clearCanvas();
  // Read in the tree parameters from the Tree Options form.
  this.tree.params.branchAngle      = parseInt($('#' + this.html.branchAngleId).val());
  this.tree.params.branchLength     = parseInt($('#' + this.html.branchLengthId).val());
  this.tree.params.drawSpeed        = (900 - (parseInt($('#' + this.html.drawSpeedId).val()) * 100));
  this.tree.params.leafSize         = parseInt($('#' + this.html.leafSizeId).val());
  this.tree.params.treeAge          = parseInt($('#' + this.html.treeAgeId).val());
  this.tree.params.trunkLength      = parseInt($('#' + this.html.trunkLengthId).val());
  // Determine the starting branch width by tree age.
  this.tree.params.branchWidth      = (this.tree.params.treeAge + 2);
  // Determine the trunk's ending y coordinate based trunk length.
  this.tree.pos.yTree               = (this.tree.pos.y - this.tree.params.trunkLength);
  // Draw the tree's trunk.
  this.drawTrunk();
  // Draw the tree's branches.  THIS IS A RECURSIVE FUNCTION!
  this.drawBranches(this.tree.pos.x, this.tree.pos.yTree, this.tree.params.treeAngle, 0);
  return null;
}

/**
 * @function drawTrunk
 * @description Draws the fractal tree's trunk.
 * @returns null
 */
FractalTrees.prototype.drawTrunk = function() {
  // jCanvas drawLine() function
  $('#' + this.html.canvasId).drawLine({
    layer: true,
    strokeStyle: this.tree.params.trunkColor,
    strokeWidth: this.tree.params.branchWidth,
    x1: this.tree.pos.x, y1: this.tree.pos.y,
    x2: this.tree.pos.x, y2: this.tree.pos.yTree,
  });
  return null;
}

/**
 * @function showButton
 * @description Show the Draw Tree button and hide the spinny gif.
 * @returns null
 */
FractalTrees.prototype.showButton = function() {
  $('#' + this.html.loadingBarId).hide();
  $('#' + this.html.buttonBarId).show();
  return null;
}

/**
 * @function showLoading
 * @description Show the spinny gif and hide the Draw Tree button.
 * @returns null
 */
FractalTrees.prototype.showLoading = function() {
  $('#' + this.html.buttonBarId).hide();
  $('#' + this.html.loadingBarId).show();
  return null;
}