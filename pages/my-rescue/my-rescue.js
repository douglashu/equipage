// pages/my-rescue/my-rescue.js
var amapFile = require('../../resources/map/amap-wx.js');
var QQMapWX = require('../../resources/map/qqmap-wx-jssdk.js');
var qqmapsdk;
var amapInstance;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLocation: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var size = options.size
    if (typeof size != "undefined") {
      this.setData({
        size: size
      })
    }
    qqmapsdk = new QQMapWX({
      key: 'VRNBZ-M7ZCG-HK6QD-IDM5Y-RMAF6-6VBO5'
    });
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            var location = {
              latitude: res.latitude,
              longitude: res.longitude,
              name: address
            }
            that.setData({
              location: location
            })
          }
        })
      }
    })
  },
  // 下一步
  next: function () {
    var param = this.data.location
    wx.navigateTo({
      url: '/pages/vehicle-submit/vehicle-submit?param=' + JSON.stringify(param)
    })
  }
})