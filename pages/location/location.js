// 引入SDK核心类
var app = getApp()
var amapFile = require('../../resources/map/amap-wx.js');
var url = app.globalData.url
var get401 = app.globalData.get401
var amapInstance;
Page({
  //数据信息
  data: {
    markers: [],
    longitude: 0,
    latitude: 0,
    distance: '',
    cost: '',
    polyline: [],
    origin: null,
    destination: null,
    briefAddr: null,
    toiletName: null,
    active: false,
    current: 0,
    table: [
      { label: '洗车', status: 0},
      { label: '汽车救援', status: 2 },
      { label: '停车', status: 1}
    ],
    navigateImag: "/images/daozhequ.png",
    makePhone: '/images/dianhua.png',
    userInfo: {},
    page: 0
  },
  //页面加载事件
  onLoad: function (option) {
    //初始化地图接口实例
    amapInstance = new amapFile.AMapWX({ key: 'cd17f895f7d70ef688f4bf600e067a8e' });
  },

  // 页面显示
  onShow() {
    this.setData({
      current: 0,
      page: 0
    })
    this.getToken()
  },

  /**
  * 获取token
  */
  getToken: function () {
    let that = this
    wx.getStorage({
      key: 'accessToken',
      success: function (res) {
        if (typeof res.data == 'undefined') {
          app.globalData.wxLogin(that.getData, that, 0)
        } else {
          that.setData({
            accessToken: res.data
          })
          that.getData(0)
        }
      },
      fail: function (res) {
        app.globalData.wxLogin(that.getData, that, 0)
      }
    })
  },

  //获取数据
  getData: function (chooseType) {
    var that = this;
    wx.showLoading({ title: "获取数据中" });
    //确保人员再次移动进行定位，获取经纬度
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var data = {
          page: that.data.page,
          size: 20,
          type: chooseType,
          longitude: longitude,
          latitude: latitude
        }
        //设置经纬度值
        that.setData({
          latitude: latitude,
          longitude: longitude
        });
        // 请求参数
        wx.request({
          url: `${url}api/index/search/service`,
          header: {
            "access-token": that.data.accessToken
          },
          data: data,
          success: function (res) {
            var data = res.data.data
            if (res.data.code == 0 && data.content.length != 0) {
              that.setData({
                onLine: false,
                totalPages: data.totalPages,
                questionList: data.content,
                totalPages: data.totalPages,
                chooseType: chooseType
              })
              that.data.page ++
              that.setList(data.content)
            } else if (res.data.code == 0 && data.content.length == 0) {
              //关闭loading
              wx.hideLoading();
              that.setData({
                markers: data.content,
                size: data.content.length,
                chooseType: chooseType
              });
            } else {
              get401(res, that.getData, that, chooseType)
            }
          },
          complete: function (err) {
            console.log(err)
          }
        })
      },
      fail: function (json) {
        console.log(json)
        //关闭loading
        wx.hideLoading();
        //没有权限
        that.setData({
          noAuth: true
        });
      }
    });
  },

  //组装数据信息
  setList: function (data) {
    var that = this;
    var result = [];
    var destination = data[0].location.longitude + "," + data[0].location.latitude;
    data.forEach(function (item, index) {
        result.push({
          width: 30,
          height: 39,
          iconPath: "/images/dingwei.png",
          id: item.id,
          latitude: item.location.latitude,
          longitude: item.location.longitude,
          briefAddr: item.location.address,
          toiletName: item.name
        })
    });
    //设置data
    that.setData({
      markers: result,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      briefAddr: data[0].location.address,
      toiletName: data[0].name,
      tel: data[0].phones[0],
      list: data,
      size: data.length,
      noAuth: false
    });
    //关闭loading
    wx.hideLoading();
     // //初始化路径规划
    that.doWalkingRoute(destination);
    //TODO 设置控件定位或者复位控件，计算位置的时候需要使用系统方法，获取屏幕宽度来进行设置
  },

  //点击marker事件
  doMarkertap: function (obj) {
    var that = this;
    //查询marker的详细信息
    var marker = that.getMarkerById(obj.markerId);
    that.doWalkingRoute(marker.longitude + "," + marker.latitude);
    that.setData({
      briefAddr: marker.briefAddr,
      toiletName: marker.toiletName,
      distance: marker.distance
    });
  },
  //进行路径规划
  doWalkingRoute: function (destination) {
    var that = this;
    //调用高德地图路径规划
    wx.getLocation({
      type: 'gcj02', //适用于微信的位置精度
      success: function (res) {
        //设置详细路径需要的值
        that.setData({
          origin: [res.longitude, res.latitude],
          destination: destination
        });
        //路径规划
        amapInstance.getWalkingRoute({
          origin: res.longitude + "," + res.latitude,
          destination: destination,
          success: function (data) {
            var points = [];
            if (data.paths && data.paths[0] && data.paths[0].steps) {
              var steps = data.paths[0].steps;
              for (var i = 0; i < steps.length; i++) {
                var poLen = steps[i].polyline.split(';');
                for (var j = 0; j < poLen.length; j++) {
                  points.push({
                    longitude: parseFloat(poLen[j].split(',')[0]),
                    latitude: parseFloat(poLen[j].split(',')[1])
                  })
                }
              }
            }
            that.setData({
              polyline: [{
                points: points,
                color: "#0091ff",
                width: 6
              }]
            });
            if (data.paths[0] && data.paths[0].distance) {
              that.setData({
                distance: data.paths[0].distance
              });
            }
            // if (data.paths[0] && data.paths[0].duration) {
            //   that.setData({
            //     cost: parseInt(data.paths[0].duration / 60) + ' 分钟'
            //   });
            // }
          },
          fail: function (info) {
            console.log(info)
          }
        })
      }
    })
  },
  //根据marker的id获取详情信息
  getMarkerById: function (id) {
    var that = this;
    var markers = that.data.markers;
    var len = markers.length;
    var result;
    for (var i = 0; i < len; i++) {
      if (markers[i]["id"] === id) {
        result = markers[i];
        break;
      }
    }
    return result;
  },
  //详细的路径规划
  goDetail: function (e) {
    var that = this;
    var value = e.currentTarget.dataset.value
    var status = that.data.current
    // 判断是否汽车救援table,跳转救援页面
    if (status == 2) {
      var size = that.data.size
      app.location = value
      wx.navigateTo({
        url: '/pages/my-rescue/my-rescue?size=' + size
      })
    } else {
        wx.openLocation({
          longitude: Number(value.location.longitude),
          latitude: Number(value.location.latitude),
          name: value.name,
          address: value.location.address
        })
    }
  },

  // 加载更多
  loadMore: function () {
    var that = this
    var current = that.data.current
    if (that.data.page < that.data.totalPages) {
      that.getData(current)
    }
  },

  // 底部弹出
  showActionSheet: function (e) {
    var that = this;
   //  设置点击关闭
    that.setData({
      active: !that.data.active
    })
  },

  // table切换
  bindTable: function (e) {
    let value = e.currentTarget.dataset.value
    // 设置当前点击项
    this.setData({
      current: value.status,
      page: 0
    })
    this.getData(value.status)
  },

  //刷新数据
  doRefresh: function () {
    var status = this.data.current
    this.getData(status)
  },

  // 打电话
  makePhone: function (e) {
    var that = this,
          tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel,
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },

  //菜单中心
  bindMenu: function () {
    wx.navigateTo({
      url: '/pages/menu/menu'
    })
  },

  //个人中心
  personalCenter: function () {
    wx.navigateTo({
      url: '../personalCenter/personalCenter'
    })
  },

  //再次获取权限
  doAuth: function () {
    var that = this;
    wx.openSetting({
      success: (res) => {
        that.getData(0)
      }
    })
  },
})
