function Barrier(parent, options){
  this.options = options || {};
  this.options.parentString = parent;
  this.init();
}

// 继承util对象方法
var proto = Barrier.prototype = Object.create(Util.prototype);

proto.init = function(){
  var self = this;
  this.initBarrier();
  this.style = this.hackStyle(this.barrier);
  this.targetSize = this.getSize(this.style);
  this.parentSize = this.getSize(this.hackStyle(this.parent))
  this.targetPosition = this.getPosition(this.style);
  setTimeout(function(){
    self.start();
  }, this.options.delay)
}

proto.initBarrier = function(){
  this.parent = this.getDom(this.options.parentString);
  this.barrier = this.createBarrier();
  this.parent.appendChild(this.barrier);
}

proto.createBarrier = function(){
  var barrier = document.createElement('div');
  barrier.className = this.options.className;
  barrier.style.top = this.options.initY + 'px';
  barrier.style.left = this.options.initX + 'px';
  return barrier;
}

proto.getMovePoint = function(){
  return {
    x: this.movePoint.x + this.targetPosition.x,
    y: this.movePoint.y + this.targetPosition.y,
  }
}
proto.changePoint = function(movePoint){
  // 这里处理坐标
  movePoint.y = movePoint.y + 1;
  this.options.move && this.options.move.call(this, this.getMovePoint());
}
proto.stopMove = function(){
  this.enable = false;
}

proto.start = function(){
  this.enable = true;
  this.movePoint = {
    x: 0,
    y: 0
  }
  this.hackTransform();
  this.render(false, this.barrier, this.movePoint, this.targetPosition, this.changePoint.bind(this), this.options.initSpeed);
},

proto.end = function(){

}