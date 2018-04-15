var Util = function() {

}
// 判断是否支持手机触屏 
Util.prototype.checkIsTouch = function() {
    return 'ontouchstart' in window ||
        navigator.maxTouchPoints;
}

Util.prototype.getDom = function(elem) {
  if (typeof elem === 'string') {
      return document.querySelector(elem);
  } else {
      return elem;
  }
}
// hack定时器

Util.prototype.hackRequestAnimationFrame = function(arguments) {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    // requestAnimationFrame的回退
    if (!requestAnimationFrame) {
        var lastTime = 0;
        requestAnimationFrame = function(callback) {
            var now = new Date().getTime();
            var time = Math.max(16 - now - lastTime, 0);
            var id = setTimeout(callback, time);
            lastTime = now + time;
            return id;
        }
    }
    return requestAnimationFrame;
}

// 兼容transform

Util.prototype.hackTransform = function() {
    // 兼容transform和WebkitTransform
    var docElem = document.documentElement;
    this.transformProperty = typeof docElem.style.transform == 'string' ?
        'transform' : 'WebkitTransform';
}

// 兼容eventListerne
Util.prototype.hackEventListener = function() {
    if (document.addEventListener) this.eventListener = true;
}

// 获取样式

Util.prototype.hackStyle = function(elem) {
    // 兼容IE8的样式获取
    if (window.getComputedStyle) {
        return window.getComputedStyle(elem);
    } else {
        return elem.currentStyle;
    }
}

Util.prototype.setTransform = function(backToPosition, targetDom, movePoint, targetPosition) {
  if (!backToPosition) {
      targetDom.style[this.transformProperty] = 'translate3d(' + movePoint.x + 'px,' + movePoint.y + 'px,' + '0)';
  } else {
      var cssString = 'left:' + (movePoint.x + targetPosition.x) + 'px;top:' + (movePoint.y + targetPosition.y) + 'px;';
      // cssText会覆盖原样式 所以需要写+ 另外;是为了兼容IE8的cssText不返回; 不加上会出BUG
      targetDom.style.cssText += ';' + cssString;
  }
}
Util.prototype.render = function(backToPosition=false, targetDom, movePoint, targetPosition, callback=function(){}, timer = 0) {
  var context = this;
  this.timeout = this.hackRequestAnimationFrame();
  this.backToPosition = backToPosition;
  this.targetDom = targetDom;
  this.movePoint = movePoint;
  this.targetPosition = targetPosition;
  this.callback = callback;
  if(timer != 0){
    console.log(timer);
    this.timeout = function(callback){
      setTimeout(callback, timer)
    };
  }
  this._render = function() {
      if (!context.enable) {
          // 通过直接return取消定时器
          return;
      }
      callback && callback(context.movePoint);
      context.setTransform(context.backToPosition, context.targetDom, context.movePoint, context.targetPosition);
      context.timeout.call(window, context._render);
  }
  this.timeout.call(window, this._render);
}
Util.prototype.getPosition = function(style) {
  var position = {};
  position.x = style.left == 'auto' ? 0 : parseInt(style.left, 10);
  position.y = style.top == 'auto' ? 0 : parseInt(style.top, 10);
  position = this.addTransform(position);
  return position;
}

Util.prototype.getSize = function(style){
  var size = {};
  size.width = style.width == 'auto' ? 0 : parseInt(style.width, 10);
  size.height = style.height == 'auto' ? 0 : parseInt(style.height, 10);
  return size;
}
Util.prototype.addTransform = function(position) {
  var transform = this.style[this.transformProperty];
  if (!transform || transform.indexOf('matrix') == '-1') {
      // 如果当前元素没有设置transform属性，那么我们可以直接返回position
      return position;
  }
  // 如果是2D的transform，那么translate的值的索引以4开始，否则就是3D，以12开始
  var translateIndex = transform.indexOf('matrix3d') == '-1' ? 4 : 12;
  var transformArray = transform.split(',');
  this.translateX = parseInt(transformArray[translateIndex], 10);
  this.translateY = parseInt(transformArray[translateIndex + 1], 10);
  position.x += this.translateX;
  position.y += this.translateY;
  return position;
}