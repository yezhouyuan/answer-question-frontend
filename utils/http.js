var domain = "https://macc.natapp4.cc"; //统一接口域名，测试环境

//统一的网络请求方法
function request(params, isGetTonken) {
  // 全局变量
  var globalData = getApp().globalData;
  // 如果正在进行登陆，就将非登陆请求放在队列中等待登陆完毕后进行调用
  // if (!isGetTonken && globalData.isLanding) {
  //   globalData.requestQueue.push(params);
  //   return;
  // }
  wx.showLoading({
    title: '',
  })
  wx.request({
    url: domain + params.url, //接口请求地址
    data: params.data,
    header: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      // 'Authorization': params.login ? undefined : wx.getStorageSync('token')
    },
    method: params.method == undefined ? "POST" : params.method,
    dataType: 'json',
    responseType: params.responseType == undefined ? 'text' : params.responseType,
    success: function(res) {
			const responseData = res.data
      // 00000 请求成功
      if (responseData.code === 200) {
        if (params.callBack) {
          params.callBack(responseData.data);
          wx.hideLoading();
        }
        return
      }

      // A00004 未授权
      if (responseData.code === 'A00004') {
        wx.navigateTo({
          url: '/pages/login/login',
        })
        wx.hideLoading();
				return
      }

      // A00005 服务器出了点小差
      if (responseData.code === 'A00005') {
        console.error('============== 请求异常 ==============')
        console.log('接口: ', params.url)
        console.log('异常信息: ', responseData)
        console.error('============== 请求异常 ==============')
        if (params.errCallBack) {
          params.errCallBack(responseData)
          return
        }
        wx.showToast({
          title: '服务器出了点小差~',
          icon: 'none'
        })
      }

      // A00001 用于直接显示提示用户的错误，内容由输入内容决定
      if (responseData.code === 'A00001') {
        if (params.errCallBack) {
          params.errCallBack(responseData)
          return
        }
        wx.showToast({
          title: responseData.msg || 'Error',
          icon: 'none'
        })
        return
      }

      // 其他异常
      if (responseData.code !== '00000') {
      	wx.hideLoading();
        if (params.errCallBack) {
          params.errCallBack(responseData)
        } else {
          console.log(`接口: ${params.url}`)
          console.log(`返回信息： `, res)
        }
      }
      if (!globalData.isLanding) {
        wx.hideLoading();
      }
    },
    fail: function(err) {
      wx.hideLoading();
      wx.showToast({
        title: "服务器出了点小差",
        icon: "none"
      });
    }
  })
}

//通过code获取token,并保存到缓存
var getToken = function() {
  var globalData = getApp().globalData;
  wx.showLoading({
    title: '',
  })
  wx.login({
    success: res => {
      wx.hideLoading();
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wx.request({
        url: 'https://macc.natapp4.cc/wx/login?code=' + res.code,
        method: "POST",
        success: (res) => {
          if (res.data.code == 200 ) {
            wx.redirectTo({
              url: '../home/home',
            }); 
            wx.setStorageSync('token', res.data.msg);
          } else {
            wx.setStorageSync('token', '');
          }
          wx.hideLoading();
        }
      })
    }
  })
}

// 更新用户头像昵称
function updateUserInfo() {
  wx.getUserInfo({
    success: (res) => {
      var userInfo = JSON.parse(res.rawData)
      request({
        url: "/p/user/setUserInfo",
        method: "PUT",
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName
        }
      });
    }
  })
}

exports.getToken = getToken;
exports.request = request;
exports.updateUserInfo = updateUserInfo;
