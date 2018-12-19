// pages/order-detail/order-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    demandList: [
      { id: 0, name: '搭电 电瓶', img: '/images/dianqi.png', status: true, imgActive: '/images/dianqi-active.jpg' },
      { id: 1, name: '加气 换胎 补胎', img: '/images/genghuan.jpg', status: false, imgActive: '/images/genghuan-active.png' },
      { id: 2, name: '维修 拖车', img: '/images/che.jpg', status: true, imgActive: '/images/che-active.png'  },
      { id: 3, name: '不知道故障原因', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var value = JSON.parse(option.value);
    console.log(value)
    this.setData({
      orderDetail: value
    })
  }

})