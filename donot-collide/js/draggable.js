/**
 * 拖动函数
 * @param {} config 
 * obj:
 * start
 * move
 * end
 */
function Draggable(elem, configs){
  this.options = configs || {};
  this.options.elemString = elem;
  this.init();
}

// 继承util对象方法
var proto = Draggable.prototype = Object.create(Util.prototype);

proto.init = function() {
  this.setTargetDom();
  if (this.checkIsTouch()) {
    // 说明是手机端 手机端的事件还需要兼容更多手机
    this.elem.addEventListener('touchstart', this);
  } else {
    this.elem.addEventListener('mousedown', this);
  }
  this.setDefaultTarget()
}

proto.setTargetDom = function() {
  this.elem = this.getDom(this.options.elemString);
  this.parentMove = this.getDom(this.options.parentMove);
  // 如果参数使用了parentMove接口，那么就使用parentMove作为拖拽的目标元素
  this.targetDom = this.parentMove || this.elem;
}
proto.setDefaultTarget = function(){
  this.movePoint = {
    x: 0,
    y: 0
  };
  this.style = this.hackStyle(this.targetDom);
  this.targetSize = this.getSize(this.style);
  this.parentSize = this.getSize(this.hackStyle(this.targetDom.parentNode))
  this.targetPosition = this.getPosition(this.style);
},
proto.dragDown = function(event) {
  this.enable = true;
  this.hackTransform();
  this.addClassName();
  this.setIndex();
  this.setDefaultTarget();
  this.startPoint = this.getCoordinate();
  this.setPositionProperty();
  this.bindCallBackEvent();
  this.render(this.options.backToPosition, this.targetDom, this.movePoint, this.targetPosition, function(){}, 0);
}
proto.addClassName=function(){
  if (this.options.addClassName) this.elem.className += ' ' + this.options.addClassName;
}
proto.setIndex=function(){
  // this.elem.style.zIndex=2147483647;
}


// 获取鼠标的坐标
proto.getCoordinate = function() {
  return {
      // 最后的0是为了避免当 this.event.pageX==0 的时候会取 touches[0] 的值
      x: this.event.pageX || (this.event.touches && this.event.touches[0].pageX) || 0,
      y: this.event.pageY || (this.event.touches && this.event.touches[0].pageY) || 0
  }
}
proto.setPositionProperty = function() {
  var p = {
      fix: true,
      absolute: true,
      relative: true
  };
  if (!p[this.style.position]) {
      this.targetDom.style.position = 'relative';
  }
  this.targetDom.style.cssText+=';'+'left:'+this.targetPosition.x + 'px;top:'+this.targetPosition.y + 'px;';
}

// 绑定之后的事件 比如mousemove和mouseup
proto.bindCallBackEvent = function() {
  var type = this.event.type;
  var handleObj = {
      mousedown: ['mousemove', 'mouseup'],
      touchstart: ['touchmove', 'touchend']
  }
  var handles = handleObj[type];
  this.handles = handles;
  // true绑定事件 false解绑事件
  this.bindEvent(true);
}
proto.bindEvent = function(isBind) {
  var context = this;
  var handles = this.handles;
  var eventListener = isBind ? 'addEventListener' : 'removeEventListener';
  handles.forEach(function(handle) {
      window[eventListener](handle, context);
  })
}

proto.dragMove = function() {
  var vector = this.getCoordinate();
  var moveVector = {
      x: vector.x - this.startPoint.x,
      y: vector.y - this.startPoint.y
  }
  moveVector = this.setGrid(moveVector);
  // outsideOfSwipper 是否可以脱离父级外框
  if(this.options.outsideOfSwipper){
    if(this.targetPosition.x + moveVector.x <=0 ){
      moveVector.x = -this.targetPosition.x;
    }
    if(this.targetPosition.y + moveVector.y <=0 ){
      moveVector.y = -this.targetPosition.y;
    }
    if(this.targetPosition.x + this.targetSize.width + moveVector.x >= this.parentSize.width){
      moveVector.x = (this.parentSize.width - this.targetPosition.x - this.targetSize.width)
    }
    if(this.targetPosition.y + this.targetSize.height + moveVector.y >= this.parentSize.height){
      moveVector.y = (this.parentSize.height - this.targetPosition.y - this.targetSize.height)
    }
  }
  if(this.options.axis){
    ['x','y'].forEach(function(i){
      if(this.options.axis.indexOf(i) > -1){
        this.movePoint[i] = moveVector[i];
      }
    })
  }else{
    this.movePoint.x =  moveVector.x;
    this.movePoint.y =  moveVector.y;
  }
}


proto.setGrid = function(moveVector) {
  if (!this.options.grid) return moveVector;
  var grid = this.options.grid;
  var vector = {};
  vector.x = grid.x ? Math.round(moveVector.x / grid.x) * grid.x : moveVector.x;
  vector.y = grid.y ? Math.round(moveVector.y / grid.y) * grid.y : moveVector.y;
  return vector;
}
proto.dragUp = function() {
  var context = this;
  this.enable = false;
  this.removeClassName();
  this.bindEvent(false);
  this.resetIndex();
  if (this.options.backToPosition) return;
  this.resetPosition();
}
proto.removeClassName=function(){
  if (this.options.addClassName) {
      var re = new RegExp("(?:^|\\s)" + this.options.addClassName + "(?:\\s|$)", "g");
      this.elem.className = this.elem.className.replace(re, '');
  }
}
proto.resetIndex=function(){
  // this.elem.style.zIndex='';
}
proto.resetPosition = function() {
  this.endPoint = {
      x: this.movePoint.x + this.targetPosition.x,
      y: this.movePoint.y + this.targetPosition.y
  }
  this.targetDom.style.cssText+=';left:'+this.endPoint.x + 'px;top:'+this.endPoint.y + 'px;transform:translate3d(0,0,0)';
}

proto.getMovePoint = function(){
  return {
    x: this.movePoint.x + this.targetPosition.x,
    y: this.movePoint.y + this.targetPosition.y,
  }
}
// 手动阻止移动清空所有事件
proto.stopMove = function(){
  this.dragUp();
}
proto.touchstart = proto.mousedown = function(event) {
  this.dragDown(event);
  this.options.start(this.targetPosition);
}
proto.mousemove = proto.touchmove = function() {
  this.dragMove();
  this.options.move(this.getMovePoint());
}

proto.mouseup = proto.touchend = function() {
  this.dragUp();
  this.options.end(this.endPoint);
}
// 通过handleEvent绑定事件
proto.handleEvent = function(event) {
  this.event = event;
  var type = this.event.type;
  if (type) this[type]();
}
