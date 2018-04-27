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
            targetDom.style.transform = 'translate3d(' + movePoint.x + 'px,' + movePoint.y + 'px,' + '0)';
        } else {
            var cssString = 'left:' + (movePoint.x + targetPosition.x) + 'px;top:' + (movePoint.y + targetPosition.y) + 'px;';
            // cssText会覆盖原样式 所以需要写+ 另外;是为了兼容IE8的cssText不返回; 不加上会出BUG
            targetDom.style.cssText += ';' + cssString;
            targetDom.style.transform = 'translate3d(0,0,0)';
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
}