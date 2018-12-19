var base64 = require('base64.js')
var mpToken = base64.base64encode('wxb689513acfe531f6')
// 返回401, token过期，重新登录
function get401(val, func, that, options) {
  if (val.data.code == 401) {
    wxLogin(func, that, options)
  };
}
// 重新登录
function wxLogin(cb, that, options) {
  if (typeof (cb) === 'undefined') {
    var cb = function () {
      console.log('this is a demo')
    }
  }
  var encryptedData = '';
  var iv = '';
  wx.login({
    success: function (res) {
      console.log("login...")
      var code = res.code
      console.log("code is " + code)
      console.log("mpToken is " + mpToken)
      let promise = new Promise(function (resolve, reject) {
        wx.getUserInfo({
          success: resolve
        })
      })
      promise.then(function (value) {
        console.log('getUserInfo succ...')
        try {
          wx.setStorageSync('iv', value.iv)
          wx.setStorageSync('userInfo', value.userInfo)
          wx.setStorageSync('encryptedData', value.encryptedData)
          wx.setStorageSync('mpToken', mpToken)
        } catch (e) {
          console.log(e)
        }
        encryptedData = value.encryptedData
        iv = value.iv

      }).then(function (value) {
        wx.request({
          url: 'https://www.zhengjiao.org/chemashi-api/api/user/getAccessToken',
          data: {
            'code': code
          },
          header: {
            'Accept': 'application/json',
            'mp-token': mpToken
          },
          success: function (res) {
            if (res.data && res.data.code == 0) {
              var token = res.data.data.accessToken
              wx.request({
                url: `https://www.zhengjiao.org/chemashi-api/api/user/encode`,
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'access-token': token
                },
                data: {
                  encryptedData: encryptedData,
                  iv: iv
                },
                success: function (res) {
                  console.log(res.data)
                  var accessToken = res.data.data.accessToken
                  wx.setStorage({
                    key: "accessToken",
                    data: accessToken,
                    success: function () {
                      that.setData({
                        accessToken: accessToken
                      })
                      cb(options)
                    }
                  })
                },
                fail: function (err) {
                  console.log(err)
                }
              })
            } else {
              console.log('请求token失败')
              wx.showToast({
                title: '请求数据失败',
                duration: 2000
              })
            }
          },
          fail: function (err) {
            console.log(err)
          }
         })
      }).catch(function (err) {
        console.log(err)
      })
    }
  })
}
module.exports = {
  get401: get401,
  wxLogin: wxLogin
}