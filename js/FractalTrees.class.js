var ft = null;

function FractalTrees() {
  this.deg2rad              = Math.PI / 180.0;
  // Canvas dimensions
  this.canvas               = {};
  this.canvas.height        = 480;
  this.canvas.width         = 740;
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
  this.tree.pos.y       = (this.canvas.height - 40);
  this.tree.pos.yTree   = (this.tree.pos.y - this.tree.params.trunkLength);
  // Object status
  this.isDrawing    = false;
  return null;
}

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
  x2 = x1 - (Math.cos(angle * this.deg2rad) / 2 * (this.tree.params.branchLength - (depth * 9)));
  y2 = y1 - (Math.sin(angle * this.deg2rad) / 2 * (this.tree.params.branchLength - (depth * 9)));
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
      lineWidth = this.tree.params.leafSize;
      lineColor = '#007800';
      break;
  }
  $('#' + this.html.canvasId).drawLine({
    layer: true,
    strokeStyle: lineColor,
    strokeWidth: lineWidth,
    x1: x1, y1: y1,
    x2: x2, y2: y2,
    rounded: true
  });
  randNum = Math.floor(Math.random()*11);
  if (randNum % 2 == 0) {
    setTimeout("ft.drawBranches(" + x2 + ", " + y2 + ", (" + angle + " + (" + this.tree.params.branchAngle + " + " + randNum + ")), (" + depth + " + 1));", this.tree.params.drawSpeed);
    setTimeout("ft.drawBranches(" + x2 + ", " + y2 + ", (" + angle + " - (" + this.tree.params.branchAngle + " + " + randNum + ")), (" + depth + " + 1));", this.tree.params.drawSpeed);
  } else {
    setTimeout("ft.drawBranches(" + x2 + ", " + y2 + ", (" + angle + " + (" + this.tree.params.branchAngle + " - " + randNum + ")), (" + depth + " + 1));", this.tree.params.drawSpeed);
    setTimeout("ft.drawBranches(" + x2 + ", " + y2 + ", (" + angle + " - (" + this.tree.params.branchAngle + " - " + randNum + ")), (" + depth + " + 1));", this.tree.params.drawSpeed);
  }
}

FractalTrees.prototype.drawTree = function() {
  ft.showLoading();
  $('#' + this.html.canvasId).clearCanvas();
  this.tree.params.branchAngle      = parseInt($('#' + this.html.branchAngleId).val());
  this.tree.params.branchLength     = parseInt($('#' + this.html.branchLengthId).val());
  this.tree.params.drawSpeed        = (900 - (parseInt($('#' + this.html.drawSpeedId).val()) * 100));
  this.tree.params.leafSize         = parseInt($('#' + this.html.leafSizeId).val());
  this.tree.params.treeAge          = parseInt($('#' + this.html.treeAgeId).val());
  this.tree.params.trunkLength      = parseInt($('#' + this.html.trunkLengthId).val());
  this.tree.params.branchWidth      = (this.tree.params.treeAge + 2);
  this.tree.pos.yTree               = (this.tree.pos.y - this.tree.params.trunkLength);
  this.drawTrunk();
  this.drawBranches(this.tree.pos.x, this.tree.pos.yTree, this.tree.params.treeAngle, 0);
  return null;
}

FractalTrees.prototype.drawTrunk = function() {
  $('#' + this.html.canvasId).drawLine({
    layer: true,
    strokeStyle: this.tree.params.trunkColor,
    strokeWidth: this.tree.params.branchWidth,
    x1: this.tree.pos.x, y1: this.tree.pos.y,
    x2: this.tree.pos.x, y2: this.tree.pos.yTree,
  });
  return null;
}

FractalTrees.prototype.showButton = function() {
  $('#' + this.html.loadingBarId).hide();
  $('#' + this.html.buttonBarId).show();
  return null;
}

FractalTrees.prototype.showLoading = function() {
  $('#' + this.html.buttonBarId).hide();
  $('#' + this.html.loadingBarId).show();
  return null;
}