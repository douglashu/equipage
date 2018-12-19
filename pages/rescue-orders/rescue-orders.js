// pages/rescue-orders/rescue-orders.js
var app = getApp()
var url = app.globalData.url
var get401 = app.globalData.get401
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToken()
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
          that.getOrderList()
        }
      },
      fail: function (res) {
        app.globalData.wxLogin(that.getOrderList, that)
      }
    })
  },

  /**
  * 获取订单列表
  */
  getOrderList: function () {
    var that = this
    wx.request({
      url: `${url}api/cardInfo/getRescueCardInfos?page=0&size=20`,
      header: {
        "access-token": that.data.accessToken
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            totalPages: res.data.data.totalPages,
            orderList: res.data.data.content
          })
        } else {
          get401(res, that.getOrderList, that)
        }
      },
      complete: function (err) {
        console.log(err)
      }
    })
  },

  // 跳转到详情页
  ordersDetail: function (e) {
    var value = e.currentTarget.dataset.value
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?value=' + JSON.stringify(value)
    })
  },

  /**
 * 页面到底加载更多
 */
  onReachBottom: function () {
    const that = this
    if (that.data.page < that.data.totalPages) {
      wx.request({
        url: `${url}api/cardInfo/getRescueCardInfoes?page=${that.data.page}&size=20`,
        header: {
          "access-token": that.data.accessToken
        },
        success: function (res) {
          if (res.data.code == 0) {
            var orderList = that.data.orderList
            res.data.data.content.forEach(value => {
              orderList.push(value)
            })
            that.setData({
              orderList: orderList
            })
          } else {
            get401(val, that.onReachBottom, that)
          }
          that.setData({
            page: ++that.data.page
          })
        },
        complete: function (err) {
          console.log(err)
        }
      })
    }
  },
})