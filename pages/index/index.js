//获取应用实例
var app = getApp()
var get401 = app.globalData.get401
var url = app.globalData.url

Page({
  data: {
    
  },
  // 页面加载
  onLoad: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'accessToken',
      success: function (res) {
        if (typeof res.data == 'undefined') {
          app.globalData.wxLogin(that.getCard, that)
        } else {
          that.setData({
            accessToken: res.data
          })
        }
      },
      fail: function (err) {
        app.globalData.wxLogin(that.getCard, that)
      }
    })
  },
  
  // 跳转到主页
  open: function () {
    wx.navigateTo({
      url: '../location/location'
    })
  }
})
