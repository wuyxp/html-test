function Barrier(parent, options){
  this.options = options || {};
  this.options.parentString = parent;
  this.step = this.options.step;
  this.speed = this.options.initSpeed;
  this.init();
}

// 继承util对象方法
var proto = Barrier.prototype = Object.create(Util);

proto.init = function(){
  var self = this;
  this.initBarrier();
  this.style = this.getStyle(this.barrier);
  this.targetInfo = this.getDomInfo(this.style);
  this.parentInfo = this.getDomInfo(this.getStyle(this.parent));
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
    x: this.movePoint.x + this.targetInfo.x,
    y: this.movePoint.y + this.targetInfo.y,
  }
}
proto.changePoint = function(movePoint){
  // 这里处理坐标
  // 飞船的宽高和坐标
  var targetPoint = this.options.targetCoord.endPoint;
  var targetMovePoint = this.options.targetCoord.movePoint;
  var targetSize = this.options.targetCoord.targetDomInfo;
  // 飞船的中心坐标
  var c_target = {
    x: targetPoint.x + targetMovePoint.x + (targetSize.width/2),
    y: targetPoint.y + targetMovePoint.y + (targetSize.height/2),
  }

  // 障碍物的宽高和坐标
  console.log('----zwb-----');
  var movePoint = this.getMovePoint();
  // 障碍物的中心坐标
  var c_souce = {
    x: movePoint.x + (this.targetInfo.width/2),
    y: movePoint.y + (this.targetInfo.height/2),
  }

  // 计算两个物体的角度坐标
  var deg = Math.atan2(c_target.y - c_souce.y, c_target.x - c_souce.x);
  // 当前两个物体之间的距离
  var z = (c_target.x - c_souce.x) / Math.cos(deg);
  if(z <= this.options.maxSize){
    this.speed = this.options.minSpeed;
  }else{
    this.speed = this.options.initSpeed;
  }


  // 这次移动的距离
  var x_speed = Math.cos(deg) * this.step;
  var y_speed = Math.sin(deg) * this.step;

  this.movePoint.x = x_speed + this.movePoint.x;
  this.movePoint.y = y_speed + this.movePoint.y;
  console.log('源原点：', c_souce);
  console.log('目标原点：', c_target);
  this.options.move && this.options.move.call(this, movePoint);
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

  // 重写定时器
  var self = this;
  this.callback = this.changePoint.bind(this);
  this.__render = function() {
      if (!this.enable) {
          // 通过直接return取消定时器
          return;
      }
      this.callback && this.callback(this.movePoint);
      this.setTransform(false, this.barrier, this.movePoint);
      window.setTimeout(function(){ 
        self.__render.call(self);
      }, this.speed)
  }
  this.__render();
},

proto.end = function(){

}