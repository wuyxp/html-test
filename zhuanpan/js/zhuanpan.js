var Lottery = (function(){
  // 抽奖构造函数
  function Lottery(config){
      var defalutConfig = {
          arrDom:[], //旋转dom
          className: 'active', // 在当前旋转的dom加入class
          finishNum:undefined, // 最终奖品
          timer:null, // 定时器
          isStop:true, // 转盘是否停止转动
          resolve:function(){}, // 成功函数
          reject:function(){}, // 失败函数
      }
      $.extend(this, defalutConfig, config);
      var reject = this.reject;
      this.reject = function(){
          this._reset();
          reject.apply(this, arguments);
      }
  }

  // 转动函数
  Lottery.prototype._rotate = function(){
      
      var self = this;

      var coefficient = .9; // 速度变化系数
      var ispeed = 150; // 初始化速度
      var length = this.arrDom.length;
      var cycle = 1; // 统计圈数
      var maxCycle = 2; // 总圈数
      var maxSpeed = 200; // 最大转速
      var minSpeed = 100; // 最小转速
      var index = -1; // 初始指针
      
      function moveSelect(){
          if(index >= length-1){
              index = 0;
              cycle++;
          }else{
              index++;
          }
          self.arrDom.removeClass(self.className);
          self.arrDom.eq(index).addClass(self.className);
      }; 

      function setTime(fun,ispeed){
          clearTimeout(self.timer);
          if(self.isStop){
              return false;
          }
          self.timer = setTimeout(function(){
              fun.apply(self,arguments);
              ispeed = self._generatorSpeed(ispeed, cycle, maxCycle, maxSpeed, minSpeed, coefficient);
              if((cycle <= maxCycle || self.finishNum === undefined)){ 
                  setTime(moveSelect,ispeed); 
              }else{
                  if(index !== self.finishNum){
                      setTime(moveSelect,ispeed); 
                  }else{
                      self.resolve(self.finishNum);
                      self._reset();
                  }
              }
          },ispeed);
      };
      
      setTime(moveSelect,ispeed);
  }

  // 计算出当前转速
  Lottery.prototype._generatorSpeed = function(ispeed, cycle, maxCycle, maxSpeed, minSpeed, coefficient){
      var scale = maxCycle / cycle;
      if(scale >= 3 ){
          if(ispeed <= minSpeed){
              return minSpeed;
          }
          return ispeed * coefficient;
      }
      if(scale >= 1.6){
          return ispeed
      }else{
          if(ispeed <= maxSpeed){
              return ispeed * (2 - coefficient);
          }else{
              return ispeed;
          }
      }
  }

  // 重置函数
  Lottery.prototype._reset = function(){
      this.finishNum = undefined;
      this.timer = null;
      this.isStop = true;
  }

  // 结束函数
  Lottery.prototype._end = function(num){
      this.finishNum = num;
  }
  
  // 启动函数
  Lottery.prototype.start = function(){
      this._reset();
      this.isStop = false;
      this._rotate();
  }

  // 设置中奖信息
  Lottery.prototype.setLevel = function(num){
      // TODO 对参数的校验
      this._end(parseInt(num));
  }
  return Lottery;
})()  // 抽奖工厂方法

