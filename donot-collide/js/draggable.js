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

var proto = Draggable.prototype = Object.create(Util);

proto.init = function() {
  this.initTargetDom();
  this.initEventListener();
  this.setDefaultTarget();
  this.resetPosition();
}

proto.initTargetDom = function() {
  this.elem = this.getDom(this.options.elemString);
  this.parentNode = this.getDom(this.options.parentNode);
  // 留出elem和targetDom不是一个元素的位置
  this.targetDom = this.elem;
}
proto.initEventListener = function(){
  if (this.checkIsTouch()) {
    this.elem.addEventListener('touchstart', this);
  } else {
    this.elem.addEventListener('mousedown', this);
  }
}
proto.setDefaultTarget = function(){
  this.style = this.getStyle(this.targetDom);
  this.parentDomInfo = this.getDomInfo(this.getStyle(this.parentNode));
}
proto.resetPosition = function() {
  this.targetDomInfo = this.getDomInfo(this.style);
  this.movePoint = {
    x: 0,
    y: 0
  };
  this.endPoint = {
      x: this.movePoint.x + this.targetDomInfo.x,
      y: this.movePoint.y + this.targetDomInfo.y
  }
  this.setTransform(true, this.targetDom, this.movePoint, this.targetDomInfo);
}


proto.dragDown = function(event) {
  this.enable = true;
  this.setDefaultTarget();
  this.startPoint = this.getCoordinate();
  this.bindCallBackEvent();
}

// 获取鼠标的坐标
proto.getCoordinate = function() {
  return {
      // 最后的0是为了避免当 this.event.pageX==0 的时候会取 touches[0] 的值
      x: this.event.pageX || (this.event.touches && this.event.touches[0].pageX) || 0,
      y: this.event.pageY || (this.event.touches && this.event.touches[0].pageY) || 0
  }
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
  handles && handles.forEach(function(handle) {
      window[eventListener](handle, context);
  })
}

proto.dragMove = function() {
  var vector = this.getCoordinate();
  var moveVector = {
      x: vector.x - this.startPoint.x,
      y: vector.y - this.startPoint.y
  }
  // outsideOfSwipper 是否可以脱离父级外框
  if(this.options.outsideOfSwipper){
    if(this.targetDomInfo.x + moveVector.x <=0 ){
      moveVector.x = -this.targetDomInfo.x;
    }
    if(this.targetDomInfo.y + moveVector.y <=0 ){
      moveVector.y = -this.targetDomInfo.y;
    }
    if(this.targetDomInfo.x + this.targetDomInfo.width + moveVector.x >= this.parentDomInfo.width){
      moveVector.x = (this.parentDomInfo.width - this.targetDomInfo.x - this.targetDomInfo.width)
    }
    if(this.targetDomInfo.y + this.targetDomInfo.height + moveVector.y >= this.parentDomInfo.height){
      moveVector.y = (this.parentDomInfo.height - this.targetDomInfo.y - this.targetDomInfo.height)
    }
  }
  this.movePoint.x =  moveVector.x;
  this.movePoint.y =  moveVector.y;
  this.setTransform(false, this.targetDom, this.movePoint);
}

proto.dragUp = function() {
  this.enable = false;
  this.bindEvent(false);
  this.setTransform(true, this.targetDom, this.movePoint, this.targetDomInfo);
  this.resetPosition();
}

proto.getMovePoint = function(){
  return {
    x: this.movePoint.x + this.targetDomInfo.x,
    y: this.movePoint.y + this.targetDomInfo.y,
  }
}
// 手动阻止移动清空所有事件
proto.stopMove = function(){
  this.dragUp();
}
proto.touchstart = proto.mousedown = function(event) {
  this.dragDown(event);
  this.options.start(this.targetDomInfo);
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
