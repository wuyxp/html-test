// 工厂函数
// 障碍物工厂
function createBarriers(num, speed, airship, bangCallback){
  var barriers = [];
  for(var i=0; i < num ;i++){
    // 障碍物
    var barrier = new Barrier('#gameMain', {
      className: 'enemy',
      initSpeed: speed, //初始速度
      maxSize: 300, // 最大距离开始进行加速
      minSpeed: speed/3, //减速至最小速度
      step: 4, // 每次移动步长
      targetCoord:airship,
      move:function(point){
        // 障碍物的 坐标和宽高
        var barriersXY = {
          w:this.targetInfo.width,
          h:this.targetInfo.height,
          x:point.x,
          y:point.y
        };
        // 障碍物如果超过屏幕后，清除对象
        var parentInfo = this.parentInfo;
        if(
          (
            (barriersXY.x > parentInfo.width) ||
            (barriersXY.y > parentInfo.height) ||
            (barriersXY.x < (-barriersXY.w)) ||
            (barriersXY.y < (-barriersXY.h)) 
          ) && (this.enddeg !== 0)
        ){
          // 出局
          this.stopMove();
          // 判断是否所有都停止了
          var allStop = barriers.every(function(b){
            return !b.enable;
          });
          if(allStop){
            setTimeout(function(){
              barriers.forEach(function(b){
                b.start()
              })
            }, 1000)
          }
        }
        // 飞船的 坐标和宽高
        var airshipXY = {
          w: airship.targetDomInfo.width,
          h: airship.targetDomInfo.height,
          x:airship.getMovePoint().x,
          y:airship.getMovePoint().y,
        }
        if(this.isBang(barriersXY, airshipXY)){
          airship.stopMove();
          barriers.forEach(function(b){
            b.end()
          })
          bangCallback && bangCallback();
        }
      }
    })
    barriers.push(barrier);
  }
  return barriers;
}


// 飞船工厂
function createAirship(){
  // 增加控制的飞船物体
  var $airship = $('<div id="ariship">').addClass('soldier');
  var $main = $('#gameMain');
  $main.append($airship);
  // 使飞船可以拖动
  // api 的使用
  var airship = new Draggable('#ariship', {
    outsideOfSwipper:true,
    parentNode: '#gameMain',
    start:function(e){
      $airship.addClass('soldier-move');
    },
    move:function(e){
    },
    end:function(e){
      $airship.removeClass('soldier-move');
    }
  });
  return airship;
};
