

    // 障碍物工厂
    function createBarriers(num, speed, airship, bangCallback){
      var barriers = [];
      for(let i=0; i < num ;i++){
        // 障碍物
        // 初始化位置
        var initX = Math.random() * 320;
        var initY = Math.random() * 60;
        var barrier = new Barrier('#main', {
          className: 'barrier',
          initX: initX,
          initY: initY,
          initSpeed: speed, //初始速度
          maxSize: 300, // 最大距离开始进行加速
          minSpeed: speed/3, //减速至最小速度
          step: 4, // 每次移动步长
          targetCoord:airship,
          move(point){
            // 障碍物的 坐标和宽高
            var barriersXY = {
              w:this.targetInfo.width,
              h:this.targetInfo.height,
              x:point.x,
              y:point.y
            };
            // 飞船的 坐标和宽高
            var airshipXY = {
              w: airship.targetDomInfo.width,
              h: airship.targetDomInfo.height,
              x:airship.getMovePoint().x,
              y:airship.getMovePoint().y,
            }
            // log('飞船', airshipXY);
            // log('障碍物', barriersXY);
            if(isBang(barriersXY, airshipXY) && isBang(airshipXY, barriersXY)){
              airship.stopMove();
              barriers.forEach(function(b){
                b.stopMove()
              })
              log('闯上啦');
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
      var $airship = $('<div id="ariship">').addClass('airship').html('搞基飞船');
      var $main = $('#main');
      $main.append($airship);
      // 使飞船可以拖动
      // api 的使用
      var airship = new Draggable('#ariship', {
        outsideOfSwipper:true,
        parentNode: '#main',
        start(e){
          // log("点击了",e);
        },
        move(e){
          // log('飞船在移动',e);
        },
        end(e){
          // log('end', e)
        }
      });
      return airship;
    }

    
    
    // 碰撞检测函数
    function isBang(target, result){
      var w1 = target.w;
      var h1 = target.h;
      var x1 = target.x;
      var y1 = target.y;
      var w2 = result.w;
      var h2 = result.h;
      var x2 = result.x;
      var y2 = result.y;
      if( ((x1 + w1) > x2) && ( x1 < (x2 + w2)) && (y1 < (y2 + h2) && ( ( h1 + y1) > y2 ))){
        return true
      }
      return false
    }