// pages/brand-choice/brand-choice.js
var carList = require("../../common/vehicle.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList: [
      { id: 11, name: '宝马', src: 'http://img0.pcauto.com.cn/pcauto/1310/09/3189270_20.png'},
      { id: 14, name: '比亚迪', src: 'http://www1.pcauto.com.cn/piclib/107.png' }, 
      { id: 0, name: '宝马', src: 'http://img.pcauto.com.cn/images/upload/upc/tx/auto5/1604/22/c18/20630442_1461312318964_90x90.png' },
      { id: 12, name: '别克', src: 'http://www1.pcauto.com.cn/piclib/7.png' },
      { id: 38, name: '大众', src: 'http://img.pcauto.com.cn/images/upload/upc/tx/auto5/1602/16/c33/18332142_1455612793303_90x90.png' },
      { id: 54, name: '丰田', src: 'http://www1.pcauto.com.cn/piclib/10.png' },
      { id: 55, name: '福特', src: 'http://www1.pcauto.com.cn/piclib/21.png' },
      { id: 160, name: '日产', src: 'http://www1.pcauto.com.cn/piclib/15.png' },
      { id: 193, name: '雪佛兰', src: 'http://img0.pcauto.com.cn/pcauto/1402/18/3900743_xuefolan-90x90.png' }
    ],
    carList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(carList)
    this.setData({
      carList: carList.carList
    })
  },

  // 切换列表显示隐藏
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.carList;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      carList: list
    });
  },
  // 确认选择
  confirm: function (e) {
    var value = e.currentTarget.dataset.value
    var pages = getCurrentPages();//当前页面
    var prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({ //直接给上移页面赋值
      brandName: value.name
    });
    wx.navigateBack({
      delta: 1
    })
  }
})