// pages/my-vehicle/my-vehicle.js
var app = getApp()
var url = app.globalData.url
var get401 = app.globalData.get401
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexList: [
      {name: '先生', id: 0},
      {name: '女士', id: 1 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToken()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    console.log(currPage)
    if (typeof currPage.data.brandName != "undefined") {
      this.setData({
        brand: currPage.data.brandName
      });
    }
    if (typeof currPage.data.colorName != "undefined") {
      this.setData({
        color: currPage.data.colorName
      });
    }
  },

  /**
 * 获取token
 */
  getToken: function () {
    var that = this
    wx.getStorage({
      key: 'accessToken',
      success: function (res) {
        if (typeof res.data == 'undefined') {
          app.globalData.wxLogin(that.getOrderList, that)
        } else {
          that.setData({
            accessToken: res.data
          })
          that.getCardInfo()
        }
      },
      fail: function (res) {
        app.globalData.wxLogin(that.getOrderList, that)
      }
    })
  },

  /**
 * 获取车辆信息
 */
  getCardInfo: function () {
    var that = this
    wx.request({
      url: `${url}api/cardInfo/getCardInfo`,
      header: {
        "access-token": that.data.accessToken
      },
      success: function (res) {
        if (res.data.code == 0) {
          var cardInfo = res.data.data
          that.setData({
            appellation: cardInfo.appellation,
            brand: cardInfo.brand,
            name: cardInfo.name,
            plateNumber: cardInfo.plateNumber,
            tel: cardInfo.tel,
            color: cardInfo.color
          })
          console.log(res.data.data)
        } else {
          get401(res, that.getCardInfo, that)
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  // 性别选择
  bindSex: function (e) {
    var value = e.currentTarget.dataset.value
    this.setData({
      current: value.id,
      appellation: value.name
    })
  },

  // 车牌大小写转换
  plateNumber: function (e) {
    var value = e.detail.value
    return {
      value: value.toUpperCase()
    }
  },

  // 提交表单
  formSubmit: function (e) {
    var that = this
    var data = e.detail.value
    console.log(data)
    if (data.appellation && data.brand && data.color && data.name && data.plateNumber && data.tel) {
      if ((/^1[3|4|5|6|7|8][0-9]{9}$/).test(data.tel)) {
        that.setData({
          loading: true
        })
        wx.request({
          url: `${url}api/cardInfo/addOrUpdateCardInfo`,
          method: 'POST',
          header: {
            'access-token': that.data.accessToken
          },
          data: data,
          success: function (res) {
            if (res.data && res.data.code == 0) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                loading: false
              })
              that.getCardInfo()
            } else {
              get401(res, that.formSubmit, that, e)
            }
          },
          fail: function (err) {
            wx.showToast({
              title: '保存失败',
              icon: 'error',
              duration: 2000
            })
            that.setData({
              loading: false
            })
            console.log(err)
          }
        })
      } else {
        wx.showModal({
          title: '提示信息',
          content: '请填写正确的手机号码',
          showCancel: false,
          confirmText: "确定"
        })
      }
    } else {
      wx.showModal({
        title: '提示信息',
        content: '请将信息填写完整',
        showCancel: false,
        confirmText: "确定"
      })
    }
  }
})