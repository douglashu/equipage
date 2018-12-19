// pages/color-selection/color-selection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorList: [
      { name: '洋红色', bg: '#660000', id:0},
      { name: '白色', bg: '#ffffff', id: 1},
      { name: '黑色', bg: '#000000', id: 2},
      { name: '蓝色', bg: '#0000FF', id: 3},
      { name: '绿色', bg: '#009900', id: 4 },
      { name: '银色', bg: '#eeeeee', id: 5},
      { name: '灰色', bg: '#aaaaaa', id: 6},
      { name: '红色', bg: '#cc0000', id: 7 },
      { name: '橙色', bg: '#FF9900', id: 8 },
      { name: '黄色', bg: '#FFFF00', id: 9},
      { name: '墨绿色', bg: '#003300', id: 10}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  // 选择颜色
  bindColor: function (e) {
    var value = e.currentTarget.dataset.value
    this.setData({
      active: value.id,
      name: value.name
    })
  },

  //确认选择
  submit: function () {
    var that = this
    var pages = getCurrentPages();//当前页面
    var prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({ //直接给上移页面赋值
      colorName: that.data.name
    });
    wx.navigateBack({
      delta: 1
    })
  }
})