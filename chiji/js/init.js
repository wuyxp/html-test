
function reload(){
  var len = window.location.href.indexOf("?");
  if(len>0){
    window.location.href=window.location.href.substring(0,len)+"?"+Math.random();
  }else{
    window.location.href=window.location.href+"?"+Math.random();
  }
}

// 解决active失效
document.addEventListener("touchstart", function() {},false);
//判断是否登录
// is_login 全局变量，如果登录为1，否则为0

// 奖品列表
var prizeMap = [
  {
      key:'1',
      title:'3元返现券',
      describe:'满3000元可用',
  },
  {
      key:'2',
      title:'5元返现券',
      describe:'满5000元可用',
  },
  {
      key:'3',
      title:'10元返现券',
      describe:'满10000元可用',
  },
  {
      key:'4',
      title:'30元返现券',
      describe:'满30000元可用',
  },
  {
      key:'5',
      title:'50元返现券',
      describe:'满50000元可用',
  },
  {
      key:'6',
      title:'100元返现券',
      describe:'满100000元可用',
  },
  {
      key:'7',
      title:'0.5%加息券',
      describe:'满10000元可用',
  },
  {
      key:'8',
      title:'1%加息券',
      describe:'满50000元可用',
  }            
];

// 领取奖品接口列表
function fetchGetPrize(couponsId){
  return new Promise(function(reslove, reject){
    $.ajax({
      url: '/activity/qbjract_clickToCoupons',
      method:'get',
      dataType:'json',
      data:{
        couponsId:couponsId,
        actCode:'518_CJ',
      }
    }).done(function(data){
        if(data.status == API_SUCCESS){
          data = data.result;
          if(data.status === 200){
            reslove(data);
          }
          else{
            reject(data.message);
          }
        }
        else{
          reject(data)
        }
    }).fail(function(err){
      reject(err.message)
    });
  })
}
$(function(){
  // 处理逻辑
  var airship; //英雄对象
  var barriers; // 敌人对象

  var timer; //倒计时
  var datatimer; // 游戏时间

  var couponsId; // 奖品id
  var max_date = 30; // 游戏最大时间

  var is_get_prize = false; //防止重复点击请求奖品

  // 关闭所有弹窗
  $('.popup-close').click(function(){
    $('#mask').hide();
    $('.popup').hide();
  });
  // 调回到首页
  $('.popup-reload').click(function(){
    reload();
  });
  // 重新挑战
  $('.popup-restart').click(function(){
    $('#mask').hide();   
    $('#none_prize').hide();
    $('#doget_prize').hide();
    $('#prize_popup').hide();
    $('#prizeTip').hide();
    start(); 
  });
  // 领取奖品
  $('#get_prize').click(function(){
    // TODO 领取奖品借口
    if(couponsId){
      if(is_get_prize){
        return false;
      }
      is_get_prize = true;
      $('#prizeTip').hide();
      fetchGetPrize(couponsId).then(function(){
        $('#prize_popup').hide();
        $('#result_prize').show();
        setTimeout(function(){
          is_get_prize = true;
          reload();
        },2000)
      }).catch(function(err){
        is_get_prize = true;
        if(err.status && err.status == 9998){
          dialog({},{
            setValue: {
                title: "",
                text: fFormatError(err.message),
                animation:false,
                confirmButtonText: "确定"
            },
            callback: [function(){
              login();
            }]
          });
        }else{
          dialog({},{
            setValue: {
                title: "",
                text: fFormatError(err),
                animation:false,
                confirmButtonText: "确定"
            },
            callback: [function(){
                window.location.reload();  // 刷新当前页面
            }]
          });
        }
      })
    }else{
      $('#prizeTip').show();
    }
  })
  // 查看活动规则
  $('#rule').click(function(){
    $('#mask').show();
    $('#active_rule').show();
  });
  // alert($('#mask')[0].style.transform)
  // 开始
  $('#start').click(function(){
    $('#mask').show();
    $('#game_rule').show();
  });
  // ok
  $('#ok').click(function(){
    $('#mask').hide();
    $('#game_rule').hide();

    $('#start_bg').hide();
    $('#game_mask').show();

    // 随机出现背景图
    var random = Math.round(Math.random())+1;
    $('.game_bg').hide();
    $('#game_bg_'+random).show();

    $('#dateTime').removeClass('game-data-1 game-data-2').addClass('game-data-'+random);
    $('#game_mask').removeClass('game-1 game-2').addClass('game-'+random);
    // 初始化
    create();

    // 倒计时
    $('#mask').show();
    $('#zone').show();
    var num = 3;
    timer = setInterval(function(){
      num = num -1;
      if(num <= 0){
        clearInterval(timer);
        $('#mask').hide();   
        $('#zone').hide();
        start();
      }else{
        $('#zone_date').removeClass('zone-date-bg-3 zone-date-bg-2 zone-date-bg-1').addClass('zone-date-bg-'+num);
      }
    }, 1000)

  });
  function create(){
    // 创建对象
    airship = createAirship();
    barriers = createBarriers(3, 30, airship, function(){
      clearInterval(datatimer);
      $('#ariship').removeClass('soldier-move');
      var num = max_date - parseInt($('#dateTime').html());
      $('#mask').show();
      if(num < 10){
        $('#none_prize').show(); 
      }else{
        if(status === 200){
          var prize_num;
          $('#popup_result').html('已坚持'+num+'秒');
          if(num >= 10 && num <20){
            prize_num = 4;
          }else if(num >= 20 && num < 30){
            prize_num = 6;
          }else{
            $('#popup_result').html('大吉大利，今晚吃鸡！');
            prize_num = 8;
          }
          $('#prize_num_span').html(prize_num+'种');
          $('#prize_popup').show();
        }else{
          $('#doget_prize_num').html(num);
          $('#doget_prize').show();
        }
      }
    });
  }
 
  function start(){
    // 重置位置
    airship.reset();
    // 启动运动
    barriers.forEach(function(element){
      element.enddeg = 0;
      element.start();
    });
    var num = 0;
    $('#dateTime').html((max_date - num)+ 's');
    datatimer = setInterval(function(){
      if(num < max_date){
        num++;
        $('#dateTime').html((max_date - num)+ 's');
      }else{
        clearInterval(datatimer);
        $('#ariship').removeClass('soldier-move');
        $('#mask').show();
        fetchIsGetPrize().then(function(status){
          if(status === 200){
            var prize_num;
            prize_num = 8;
            $('#popup_result').html('大吉大利，今晚吃鸡！');
            $('#prize_num_span').html(prize_num+'种');
            $('#prize_popup').show();
          }else{
            $('#doget_prize_num').html(num);
            $('#doget_prize').show();
          }
        }).catch(function(err){
          if(err.status && err.status == 9998){
            dialog({},{
              setValue: {
                  title: "",
                  text: fFormatError(err.message),
                  animation:false,
                  confirmButtonText: "确定"
              },
              callback: [function(){
                login();
              }]
            });
          }else{
            dialog({message:fFormatError(err)});
          }
        })
      }
    }, 1000)
  }

  
})