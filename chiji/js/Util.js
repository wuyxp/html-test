// hack 定时器
(function(){
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  // requestAnimationFrame的回退
  if (!window.requestAnimationFrame) {
      var lastTime = 0;
      window.requestAnimationFrame = function(callback) {
          var now = new Date().getTime();
          var time = Math.max(16 - now - lastTime, 0);
          var id = setTimeout(callback, time);
          lastTime = now + time;
          return id;
      }
  }
})()

// 改造util

var Util = {
  // 判断是否支持touch
  checkIsTouch: function(){
      return 'ontouchstart' in window || navigator.maxTouchPoints;
  },
  // 获取dom
  getDom: function(elem){
      if (typeof elem === 'string') {
          return document.querySelector(elem);
      } else {
          return elem;
      } 
  },
  // 获取随机数
  getRandom: function(min, max){
    return min + Math.round(Math.random() * (max - min));
  },
  // 兼容eventListerne
  hackEventListener: function(){
      return !!document.addEventListener;
  },
  // 兼容获取样式
  getStyle: function(elem){
      if(window.getComputedStyle){
          return window.getComputedStyle(elem);
      }else{
          return elem.currentStyle;
      }
  },
  // 设置位移
  setTransform: function(isTransform, targetDom, movePoint, targetPosition){
      if (!isTransform) {
          $(targetDom).css('transform', 'translate3d(' + movePoint.x + 'px,' + movePoint.y + 'px,' + '0)')
        //   targetDom.style.transform = 'translate3d(' + movePoint.x + 'px,' + movePoint.y + 'px,' + '0)';
      } else {
          var cssString = 'left:' + (movePoint.x + targetPosition.x) + 'px;top:' + (movePoint.y + targetPosition.y) + 'px;';
          // cssText会覆盖原样式 所以需要写+ 另外;是为了兼容IE8的cssText不返回; 不加上会出BUG
          targetDom.style.cssText += ';' + cssString;
          $(targetDom).css('transform', 'translate3d(0,0,0)')
        //   targetDom.style.transform = 'translate3d(0,0,0)';
      }
  },
  // 获取位置大小
  getDomInfo: function(style){
      var returnNum = function(pix){
          return pix == 'auto' ? 0 :parseInt(pix, 10);
      };
      return {
          x: returnNum(style.left),
          y: returnNum(style.top),
          width: returnNum(style.width),
          height: returnNum(style.height)
      };
  },
  // 碰撞检测函数
  isBang: function(target, result){
    // 敌人
    var w1 = target.w;
    var h1 = target.h;
    var x1 = target.x;
    var y1 = target.y;

    // 英雄
    var w2 = result.w;
    var h2 = result.h;
    var x2 = result.x;
    var y2 = result.y;

    // 敌人圆心和半径
    var o1 = {
      x: x1 + w1 /2,
      y: y1 + w1 /2  //以敌人的宽度为直径
    };
    var r1 = w1 /2;

    // 英雄的圆心和半径两个圆
    var o2_1 = {
      x: x2 + w2 /2,
      y: y2 + w2 /2
    }
    var r2_1 = w2 /2;

    var o2_2 = {
      x: x2 + w2 /2,
      y: y2 + w2 + (h2 - w2) /2
    };
    var r2_2 = (h2 - w2) /2;

    // 获取两个圆心的距离
    var getDistance = function(o1, o2){
      var x = o2.x - o1.x;
      var y = o2.y - o1.y;
      return Math.sqrt(x*x+y*y)
    }
    // 矩形块状检测
    /*
    if( ((x1 + w1) > x2) && ( x1 < (x2 + w2)) && (y1 < (y2 + h2) && ( ( h1 + y1) > y2 ))){
      return true
    }
    */

    // 圆形碰撞检测
    if(
      (r2_1 + r1) >= getDistance(o2_1,o1) ||
      (r2_2 + r1) >= getDistance(o2_2,o1)
    ){
      return true;
    }

    return false
  }

}