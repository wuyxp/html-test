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
  // movePoint.y = movePoint.y + 1;
  // 飞船的宽高和坐标
  var targetPoint = this.options.targetCoord.endPoint;
  var targetMovePoint = this.options.targetCoord.movePoint;
  var targetSize = this.options.targetCoord.targetSize;
  // 飞船的中心坐标
  var c_target = {
    x: targetPoint.x + targetMovePoint.x + (targetSize.width/2),
    y: targetPoint.y + targetMovePoint.y + (targetSize.height/2),
  }

  // 障碍物的宽高和坐标
  console.log('----zwb-----');
  var soucePoint = this.getPosition(this.style);
  var souceSize = this.targetSize;

  // 障碍物的中心坐标
  var c_souce = {
    x: soucePoint.x + (souceSize.width/2),
    y: soucePoint.y + (souceSize.height/2),
  }

  // 计算两个物体的角度坐标
  var deg = Math.atan2(c_target.y - c_souce.y, c_target.x - c_souce.x);


  // 这次移动的距离
  var speed = this.options.initSpeed;


  var x_speed = Math.cos(deg) * speed;
  var y_speed = Math.sin(deg) * speed;

  var x = x_speed;
  var y = y_speed;
  movePoint.x = movePoint.x + x;
  movePoint.y = movePoint.y + y;
  console.log('源原点：', c_souce);
  console.log('目标原点：', c_target);
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
  // this.render(false, this.barrier, this.movePoint, this.targetPosition, this.changePoint.bind(this));

  // 重写定时器
  var self = this;
  this.callback = this.changePoint.bind(this);
  this.__render = function() {
      if (!self.enable) {
          // 通过直接return取消定时器
          return;
      }
      self.callback && self.callback(self.movePoint);
      self.setTransform(true, self.barrier, self.movePoint, self.targetPosition);
      window.setTimeout(function(){ 
        self.__render();
      }, 100)
  }
  this.__render();
},

proto.end = function(){

}