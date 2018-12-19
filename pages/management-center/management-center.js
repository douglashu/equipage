// pages/management-center/management-center.js
// 引入SDK核心类
var app = getApp()
// var QQMapWX = require('../../resources/map/qqmap-wx-jssdk.js');
var url = app.globalData.url
var get401 = app.globalData.get401
// var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [
      { name: '洗车', id: '0' },
      { name: '停车', id: '1' },
      { name: '救援', id: '2' }
    ],
    invTypeList:[-1, -1, -1],
    management: [
      { name: '新增', id: 0 },
      { name: '删除', id: 1 },
      { name: '修改', id: 2 }
    ],
    managementCurrent: '新增'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // qqmapsdk = new QQMapWX({
    //   key: '2EQBZ-3XM36-RUTSG-MIO6B-GXH4E-B3FC5'
    // });
    this.getToken()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
        //  app.globalData.wxLogin(that.getOrderList, that)
        } else {
          that.setData({
            accessToken: res.data
          })
          // that.getCardInfo()
        }
      },
      fail: function (res) {
        // app.globalData.wxLogin(that.getOrderList, that)
      }
    })
  },

  // table切换
  bindManagement: function (e) {
    var value = e.currentTarget.dataset.value
    this.setData({
      managementCurrent: value.name
    })
    // 新增时输入框置空
    if (value.name == '新增') {
      this.setData({
        contact: '',
        storefrontType: null,
        name: '',
        phones: '',
        latitude: '',
        longitude: '',
        id: null
      })
    }
  },

  //搜索框失去焦点存储数据
  blurInput: function (e) {
    var value = e.detail.value
    this.setData({
      searchValue: value
    })
  },

  // 搜索
  search: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var name = that.data.searchValue
    wx.request({
      url: `${url}api/storefrontCenter/search?name=${name}`,
      header: {
        "access-token": that.data.accessToken
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 0) {
          var serverInfo = res.data.data
          var storefrontType = serverInfo.storefrontType.split(',')
          that.setData({
            contact: serverInfo.contact,
            invTypeList: storefrontType,
            name: serverInfo.name,
            address: serverInfo.location.address,
            phones: serverInfo.phones[0],
            latitude: serverInfo.location.latitude,
            longitude: serverInfo.location.longitude,
            id: serverInfo.id
          })
        } else if (res.data.code == 500) {
          wx.showModal({
            title: '提示信息',
            content: res.data.msg,
            showCancel: false,
            confirmText: "确定"
          })
        } else {
          get401(res, that.search, that)
        }
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '操作失败',
          icon: 'error',
          duration: 2000
        })
        console.log(err)
      }
    })
  },

  // 类型选择
  bindType: function (e) {
    var id = e.currentTarget.dataset.value.id
    var typeList = this.data.typeList
    var invTypeList = this.data.invTypeList
    for (let i = 0; i < typeList.length; i++) {
      if (id == i && typeList[i].id != invTypeList[i]) {
        invTypeList[i] = typeList[i].id
        break;
      } else if (id == i && typeList[i].id == invTypeList[i]) {
        invTypeList[i] = -1
        break;
      }
    }
    for (var i = 0, selectInvTypeList = []; i < invTypeList.length; i++) {
      if (invTypeList[i] != -1) {
        selectInvTypeList.push(invTypeList[i])
      }
    };
    this.setData({
      invTypeList: invTypeList,
      selectInvTypeList: selectInvTypeList
    })
  },

  // 提交表单
  formSubmit: function (e) {
    var that = this
    var id = that.data.id
    var value = e.detail.value

    // 结构化表单数据
    var data = {
      contact: value.contact,
      location:{
        longitude: value.longitude,
        latitude: value.latitude,
        address: value.address
      },
      name: value.name,
      phones: [value.phones],
      status: 1,
      storefrontType: ''
    }
    if (that.data.selectInvTypeList) {
      data.storefrontType = (that.data.selectInvTypeList).join(',')
    } else {
      data.storefrontType = (that.data.invTypeList).join(',')
    }
    // 判断id，来新增和修改
    if (id) {
      data.id = id
      that.updateServer(data)
    } else {
      that.addServer(data)
    }
  },

  // 新增服务点
  addServer: function (data) {
    var that = this
    that.setData({
      loading: true
    })
    wx.request({
      url: `${url}api/storefrontCenter/add`,
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
          wx.showToast({
            title: '新增成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateTo({
            url: '/pages/location/location'
          })
        } else {
          get401(res, that.addServer, that,data)
        }
      },
      fail: function (err) {
        that.setData({
          loading: false
        })
        wx.showToast({
          title: '新增失败',
          icon: 'error',
          duration: 2000
        })
        console.log(err)
      }
    })
  },

  // 修改服务点
  updateServer: function (data) {
    var that = this
    that.setData({
      loading: true
    })
    wx.request({
      url: `${url}api/storefrontCenter/update`,
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
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateTo({
            url: '/pages/location/location'
          })
        } else {
          get401(res, that.updateServer, that, data)
        }
      },
      fail: function (err) {
        that.setData({
          loading: false
        })
        wx.showToast({
          title: '修改失败',
          icon: 'error',
          duration: 2000
        })
        console.log(err)
      }
    })
  },
  // 删除
  bindDelete: function () {
    var that = this
    var id = that.data.id
    // 判断是否搜索，ID是否存在
    if (id) {
      that.setData({
        loading: true
      })
      wx.request({
        url: `${url}api/storefrontCenter/delete?storefrontCenterId=${id}`,
        header: {
          "access-token": that.data.accessToken
        },
        success: function (res) {
          that.setData({
            loading: false
          })
          if (res.data.code == 0) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateTo({
              url: '/pages/location/location'
            })
          } else {
            get401(res, that.bindDelete, that)
          }
        },
        fail: function (err) {
          wx.showToast({
            title: '操作失败',
            icon: 'error',
            duration: 2000
          })
          console.log(err)
        }
      })
    }
  }
})