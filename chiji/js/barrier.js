function Barrier(parent, options){
  var dpi = ($('body').width() / 375 || 1);
  this.options = options || {};
  this.options.parentString = parent;
  // 根据dpi动态算step长度
  this.step = this.options.step * dpi;
  this.maxSize = this.options.maxSize * dpi;
  this.speed = this.options.initSpeed;
  this.enddeg = 0;
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
  this.resetPosition();
}

proto.initBarrier = function(){
  this.parent = this.getDom(this.options.parentString);
  this.barrier = this.createBarrier();
  this.parent.appendChild(this.barrier);
}

proto.createBarrier = function(){
  var barrier = document.createElement('div');
  barrier.className = this.options.className;
  return barrier;
}

proto.randomXY = function(){
  // 偏离系数
  var offset = 300;
  var getRandom = this.getRandom;
  var parentInfo = this.parentInfo;
  var targetInfo = this.targetInfo;

  var xy = [
    {
      x: getRandom(-targetInfo.width,parentInfo.width),
      y: -targetInfo.height,
    },{
      x: -targetInfo.width,
      y: getRandom(-targetInfo.height, offset),
    },{
      x: parentInfo.width,
      y: getRandom(-targetInfo.height, offset),
    }
  ]
  return xy[this.getRandom(0,2)];
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
  var deg = this.enddeg;

  // 障碍物的宽高和坐标
  // console.log('----zwb-----');
  var movePoint = this.getMovePoint();
  // 障碍物的中心坐标
  var c_souce = {
    x: movePoint.x + (this.targetInfo.width/2),
    y: movePoint.y + (this.targetInfo.height/2),
  }

  if(this.enddeg === 0){
    // 计算两个物体的角度坐标
    deg = Math.atan2(c_target.y - c_souce.y, c_target.x - c_souce.x);
    // 当前两个物体之间的距离
    var z = (c_target.x - c_souce.x) / Math.cos(deg);
    if(z <= this.maxSize){
      this.speed = this.options.minSpeed;
      this.enddeg = deg;
    }
  }


  

  // 这次移动的距离
  var x_speed = Math.cos(deg) * this.step;
  var y_speed = Math.sin(deg) * this.step;

  this.movePoint.x = x_speed + this.movePoint.x;
  this.movePoint.y = y_speed + this.movePoint.y;
  // console.log('源原点：', c_souce);
  // console.log('目标原点：', c_target);
  this.options.move && this.options.move.call(this, movePoint);
}
proto.stopMove = function(){
  this.enable = false;
}
// 重置元素随机出位置
proto.resetPosition = function(){
  var xy = this.randomXY();
  this.barrier.style.left = xy.x + 'px';
  this.barrier.style.top = xy.y + 'px';
}

proto.start = function(){
  this.enable = true;
  this.movePoint = {
    x: 0,
    y: 0
  };
  this.resetPosition();
  this.targetInfo = this.getDomInfo(this.style); 
  this.enddeg = 0;
  this.speed = this.options.initSpeed;

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
  this.enable = false;
}