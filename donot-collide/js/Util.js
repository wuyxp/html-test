var Util = function() {

}

Util.prototype.checkIsTouch = function() {
    return 'ontouchstart' in window ||
        navigator.maxTouchPoints;
}

Util.prototype.hackRequestAnimationFrame = function(arguments) {
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
}

Util.prototype.hackTransform = function() {
    // 兼容transform和WebkitTransform
    var docElem = document.documentElement;
    this.transformProperty = typeof docElem.style.transform == 'string' ?
        'transform' : 'WebkitTransform';
}

Util.prototype.hackEventListener = function() {
    if (document.addEventListener) this.eventListener = true;
}

Util.prototype.hackStyle = function(elem) {
    // 兼容IE8的样式获取
    if (window.getComputedStyle) {
        return window.getComputedStyle(elem);
    } else {
        return elem.currentStyle;
    }
}