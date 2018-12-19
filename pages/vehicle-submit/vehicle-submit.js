// pages/vehicle-submit/vehicle-submit.js
var app = getApp()
var url = app.globalData.url
var get401 = app.globalData.get401
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexList: [
      { name: '先生', id: 0 },
      { name: '女士', id: 1 }
    ],
    demandList: [
      { id: 0, name: '搭电 电瓶', img: '/images/dianqi.png', status: true, imgActive: '/images/dianqi-active.jpg'},
      { id: 1, name: '加气 换胎 补胎', img: '/images/genghuan.jpg', status: false, imgActive: '/images/genghuan-active.png'},
      { id: 2, name: '保养 机电 维修', img: '/images/che.jpg', status: true, imgActive: '/images/che-active.png' },
      { id: 3, name: '上门洗车美容', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png' },
      { id: 4, name: '上门安装 加装', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png' },
      { id: 5, name: '上门保险代驾', img: '/images/fankui.jpg', status: false, imgActive: '/images/fankui-active.png' }
    ],
    hasLocation: false,
    colorName: '其他'
  },

  //页面加载事件
  onLoad: function (options) {
    this.getToken()
    var param;
    if (typeof options.param != 'undefined') {
      param = JSON.parse(options.param);
      this.setData({
        hasLocation: true,
        location: param
      })
      console.log(param)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (typeof app.location != "undefined") {
      console.log()
      this.setData({
        colorName: app.location.name
      });
    }
    if (typeof currPage.data.brandName != "undefined") {
      this.setData({
        brandName: currPage.data.brandName
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
          app.globalData.wxLogin(that.getCardInfo, that)
        } else {
          that.setData({
            accessToken: res.data
          })
          that.getCardInfo()
        }
      },
      fail: function (res) {
        app.globalData.wxLogin(that.getCardInfo, that)
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
        if (res.data.code == 0 && res.data.data) {
          var cardInfo = res.data.data
          console.log(cardInfo)
          that.setData({
            appellation: cardInfo.appellation,
            brandName: cardInfo.brand,
            name: cardInfo.name,
            plateNumber: cardInfo.plateNumber,
            tel: cardInfo.tel
          })
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

  // 选择位置
  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          location: res
        })
      }
    })
  },

  // 选择需求
  bindDemand: function (e) {
    var value = e.currentTarget.dataset.value
    this.setData({
      active: value.id,
      demand: value.name
    })
  },

  // 提交表单
  formSubmit: function (e) {
    var that = this
    var value = e.detail.value
    // 格式化参数
    var data = {
      appellation: value.appellation,
      brand: value.brand,
      color: value.color,
      name: value.name,
      plateNumber: value.plateNumber,
      tel: value.tel,
      rescueDemand: value.rescueDemand,
      location: {
        longitude: value.longitude,
        latitude: value.latitude,
        address: value.address
      }
    }
    // 验证是否填写完整
    if (data.appellation && data.brand && data.name && data.color && data.plateNumber && data.tel && data.rescueDemand && data.location.longitude && data.location.latitude && data.location.address){
      // 验证手机号是否正确
      if ((/^1[3|4|5|6|7|8][0-9]{9}$/).test(data.tel)) {
        that.setData({
          loading: true
        })
        wx.request({
          url: `${url}api/cardInfo/saveRescueCardInfo`,
          method: 'POST',
          header: {
            'access-token': that.data.accessToken
          },
          data: data,
          success: function (res) {
            that.setData({
              loading: false
            })
            if (res.data && res.data.code == 0) {
              wx.showModal({
                title: '提示信息',
                content: '您已发布\n车马仕即将上门服务',
                showCancel: false,
                color: '#f90',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '/pages/rescue-orders/rescue-orders'
                    })
                  }
                }
              })
            } else {
              get401(res, that.formSubmit, that, e)
            }
          },
          fail: function (err) {
            that.setData({
              loading: false
            })
            wx.showToast({
              title: '保存失败',
              icon: 'error',
              duration: 2000
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