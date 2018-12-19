// pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    demandList: [
      { id: 0, name: '洗车', img: '/images/dianqi.png', status: true, imgActive: '/images/dianqi-active.jpg' , url: '/pages/location/location'},
      { id: 1, name: '停车', img: '/images/genghuan.jpg', status: false, imgActive: '/images/genghuan-active.png', url: '/pages/location/location'},
      { id: 2, name: '汽车救援', img: '/images/che.jpg', status: true, imgActive: '/images/che-active.png', url: '/pages/location/location'},
      { id: 3, name: '上门搭电 电瓶', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png', url: '/pages/vehicle-submit/vehicle-submit'},
      { id: 3, name: '上门机油保养', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png', url: '/pages/vehicle-submit/vehicle-submit'},
      { id: 3, name: '上门机电维修', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png', url: '/pages/vehicle-submit/vehicle-submit'},
      { id: 3, name: '上门轮胎加气补胎', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png', url: '/pages/vehicle-submit/vehicle-submit'},
      { id: 3, name: '上门安装加装车品', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png', url: '/pages/vehicle-submit/vehicle-submit'},
      { id: 3, name: '上门保险理赔', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png', url: '/pages/vehicle-submit/vehicle-submit'},
      { id: 3, name: '上门汽车美容', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png', url: '/pages/vehicle-submit/vehicle-submit' },
      { id: 3, name: '上门司机代驾', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png', url: '/pages/vehicle-submit/vehicle-submit' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 跳转页面
   */
  navigator: function (e) {
    var value = e.currentTarget.dataset.value
    console.log(value)
    wx.navigateTo({
      url: value.url
    })
  }
})