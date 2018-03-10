/**
 * Created by Yuwei.
 *
 * MultiSelectBox
 */

/* 使用案例
 * var $app = $("#app");
 * var box = new MultiSelectBox({
 container: $app, //用于生成插件的父元素
 leftTitle: "人员名单",
 rightTitle: "公开人员名单",
 isSearchable: true,
 dataList: [
 [{id: 1, value: 'data1'}, {id: 2, value: 'data2'}], // 左侧列表
 [{id: 3, value: 'data3'}, {id: 4, value: 'data4'}]  // 右侧列表
 ]
 });
 * box.addItem(1); // 用于下面获得变化列表用，一般通过UI界面操作。
 * box.removeItem(3); // 用于下面获得变化列表用，一般通过UI界面操作。
 * console.log(box.getChangedData()); // 获取变化列表
 * box.setData([
 *   [{id: 1, value: 'data1'}, {id: 2, value: 'data2'}], // 左侧列表
 *   [{id: 3, value: 'data3'}, {id: 4, value: 'data4'}]  // 右侧列表
 * ]);
 * console.log(box.getData("left")); // 获取左侧的最终列表
 */

  var MultiSelectBox = function(option) {
    this.leftTitle = option.leftTitle;
    this.rightTitle = option.rightTitle;
    this.isSearchable = option.isSearchable || true;
    this.leftBoxDataList = option.dataList[0] || [];
    this.rightBoxDataList = option.dataList[1] || [];

    this.leftBoxChangeList = [];
    this.rightBoxChangeList = [];

    this.renderBox(option.container);

    this.listeningAddRemove();
    this.listeningSearch();
  };

  MultiSelectBox.prototype.renderDataList = function(element, dataList, side) {
    var list = '';
    if (side === "left") {
      dataList.map(function(item) {
        list += '<li data-id="'+ item.id +'"><span>'+ item.value +'</span><button>+</button></li>';
      });
    } else {
      dataList.map(function(item) {
        list += '<li data-id="'+ item.id +'"><span>'+ item.value +'</span><button>-</button></li>';
      });
    }
    element.find('ul').html($(list));
  };

  MultiSelectBox.prototype.renderBox = function(element) {
    var multiSelectBoxHTML = $('' +
      '<div class="multi-select-box">' +
      '  <div class="multi-select-box-half multi-select-box-left">' +
      '    <div class="multi-select-box-header multi-select-box-header-left">' +
      '      <h5></h5>' +
      '    </div>' +
      '    <div class="multi-select-box-content multi-select-box-content-left">' +
      '      <ul>' +
      '      </ul>' +
      '    </div>' +
      '  </div>' +
      '  <div class="multi-select-box-half multi-select-box-right">' +
      '    <div class="multi-select-box-header multi-select-box-header-right">' +
      '      <h5></h5>' +
      '    </div>' +
      '    <div class="multi-select-box-content multi-select-box-content-right">' +
      '      <ul>' +
      '      </ul>' +
      '    </div>' +
      '  </div>' +
      '</div>');

    var searchArea = '' +
      '<div class="multi-select-box-search">' +
      '  <div class="multi-select-box-search-input"><input type="text" class="multi-select-box-input" placeholder="请输入您要搜索的内容" /></div>' +
      '  <button class="multi-select-box-search-btn">搜</button>' +
      '</div>';

    element.html(multiSelectBoxHTML);

    var $leftHeader = $(".multi-select-box-header-left");
    var $rightHeader = $(".multi-select-box-header-right");

    var $leftTitle = $leftHeader.find("h5");
    var $rightTitle = $rightHeader.find("h5");
    $leftTitle.text(this.leftTitle);
    $rightTitle.text(this.rightTitle);

    if (this.isSearchable) {
      $leftHeader.append($(searchArea));
      $rightHeader.append($(searchArea));
    }

    // 用于整个插件的变量
    this.$leftBox = $(".multi-select-box-content-left");
    this.$rightBox = $(".multi-select-box-content-right");

    this.renderDataList(this.$leftBox, this.leftBoxDataList, "left");
    this.renderDataList(this.$rightBox, this.rightBoxDataList, "right");
  };

  MultiSelectBox.prototype.listeningAddRemove = function() {
    var BtnAdd = this.$leftBox.find("button");
    var BtnRemove = this.$rightBox.find("button");

    var _this = this;
    BtnAdd.on("click", function() {
      var itemId = $(this).parent().data('id');
      _this.addItem(itemId);
    });
    BtnRemove.on("click", function() {
      var itemId = $(this).parent().data('id');
      _this.removeItem(itemId);
    });
  };

  MultiSelectBox.prototype.addItem = function(id) {
    var selectedItem;
    var _this = this;
    this.leftBoxDataList.map(function(item, index) {
      if (item.id === id) {
        selectedItem = _this.leftBoxDataList.splice(index, 1);
        _this.rightBoxDataList.push(selectedItem[0]);
        _this.leftBoxChangeList.push({
          type: "remove",
          data: selectedItem[0]
        });
        _this.rightBoxChangeList.push({
          type: "add",
          data: selectedItem[0]
        });
      }
    });

    this.renderDataList(this.$leftBox, this.leftBoxDataList, "left");
    this.renderDataList(this.$rightBox, this.rightBoxDataList, "right");
    this.listeningAddRemove();
  };

  MultiSelectBox.prototype.removeItem = function(id) {
    var selectedItem;
    var _this = this;
    this.rightBoxDataList.map(function(item, index) {
      if (item.id === id) {
        selectedItem = _this.rightBoxDataList.splice(index, 1);
        _this.leftBoxDataList.push(selectedItem[0]);
        _this.leftBoxChangeList.push({
          type: "add",
          data: selectedItem[0]
        });
        _this.rightBoxChangeList.push({
          type: "remove",
          data: selectedItem[0]
        });
      }
    });

    this.renderDataList(this.$leftBox, this.leftBoxDataList, "left");
    this.renderDataList(this.$rightBox, this.rightBoxDataList, "right");
    this.listeningAddRemove();
  };

  MultiSelectBox.prototype.listeningSearch = function() {
    var _this = this;
    var leftSearchBtn = $(".multi-select-box-left .multi-select-box-search-btn");
    var rightSearchBtn = $(".multi-select-box-right .multi-select-box-search-btn");

    var $leftInputBox = $(".multi-select-box-left .multi-select-box-input");
    var $rightInputBox = $(".multi-select-box-right .multi-select-box-input");

    leftSearchBtn.on("click", function() {
      var currentValue = $leftInputBox.val();
      _this.searchItem(currentValue, 'left');
    });

    rightSearchBtn.on("click", function() {
      var currentValue = $rightInputBox.val();
      _this.searchItem(currentValue, 'right');
    });

    $leftInputBox.on("change", function() {
      if ($(this).val() === "") {
        _this.renderDataList(_this.$leftBox, _this.leftBoxDataList, "left");
      }
    });
    $rightInputBox.on("change", function() {
      if ($(this).val() === "") {
        _this.renderDataList(_this.$rightBox, _this.rightBoxDataList, "right");
      }
    });
  };

  MultiSelectBox.prototype.searchItem = function(item, side) {
    var resultList = [];
    if (side === 'left') {
      this.leftBoxDataList.map(function(listItem) {
        if (listItem.value.indexOf(item) !== -1) {
          resultList.push(listItem);
        }
      });
      this.renderDataList($('.multi-select-box-content-left'), resultList, "left");
    } else {
      this.rightBoxDataList.map(function(listItem) {
        if (listItem.value.indexOf(item) !== -1) {
          resultList.push(listItem);
        }
      });
      this.renderDataList($('.multi-select-box-content-right'), resultList, "right");
    }
  };

  MultiSelectBox.prototype.setData = function(dataList) {
    this.leftBoxDataList = dataList[0];
    this.rightBoxDataList = dataList[1];
  };

  // 返回列表，默认返回两边的列表
  MultiSelectBox.prototype.getData = function(type) {
    switch (type) {
      case "left":
        return [this.leftBoxDataList];
        break;
      case "right":
        return [this.rightBoxDataList];
        break;
      default:
        return [this.leftBoxDataList, this.rightBoxDataList];
        break;
    }
  };

  // 返回变化的数据，默认返回两边的变化列表
  MultiSelectBox.prototype.getChangedData = function(type) {
    switch (type) {
      case "left":
        return [this.leftBoxChangeList];
        break;
      case "right":
        return [this.rightBoxChangeList];
        break;
      default:
        return [this.leftBoxChangeList, this.rightBoxChangeList];
        break;
    }
  };
