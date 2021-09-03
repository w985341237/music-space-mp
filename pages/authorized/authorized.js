// pages/authorized/authorized.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    isGetMobile: true,
    isUserInfo: "",
    ssKey: "",
    canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var e = this;
    wx.login({
      success: function (a) {
        if (a.code) {
          console.log("-------wx.login-------" + a.code);
          e.setData({
            code: a.code,
          });
        }
      },
    });
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var page = this;
    page.setData({
      isUserInfo: !!wx.getStorageSync("user_info"),
    });
    //判断当前用户是否有手机号码
    if (wx.getStorageSync("user_info").mobile) {
      page.setData({
        isGetMobile: false,
      });
    }
  },

  getUserProfile: function (e) {
    let that = this;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("getUserProfile", res);
        wx.getUserInfo({
          success: function (data) {
            console.log("getUserProfile-getUserInfo", data);
            data.userInfo = res.userInfo;
            that._login(data);
          },
          fail: function (e) {
            console.warn("getUserProfile-getUserInfo-error", e);
          },
        });
      },
    });
  },

  userInfoHandler: function (e) {
    console.log("userInfoHandler", e.detail);
    this._login(e.detail);
  },

  _login(e) {
    let that = this;
    if (e.userInfo) {
      getApp().request({
        url: "/passport/login",
        method: "post",
        data: {
          code: that.data.code,
          userInfo: JSON.stringify(e.userInfo),
          rawData: e.rawData,
          encryptedData: e.encryptedData,
          iv: e.iv,
          signature: e.signature,
        },
        success: function (t) {
          if ((wx.hideLoading(), 0 == t.status)) {
            wx.setStorageSync("access_token", t.data.accessToken),
              wx.setStorageSync("user_info", {
                nickname: t.data.userInfo.nickName,
                avatar_url: t.data.userInfo.avatarUrl,
                id: t.data.userInfo.id,
                ss_key: t.data.sessionKey,
                addtime: t.data.userInfo.addTime,
                last_login_time: t.data.userInfo.lastLoginTime,
              });
            wx.setStorageSync("ssKey", {
              ss_key: t.data.sessionKey,
            });

            if (!wx.getStorageSync("user_info").mobile) {
              wx.navigateTo({
                url: "/pages/authorized/authorized",
              });
            }
          } else
            wx.showToast({
              title: t.msg,
            });
        },
      });

      wx.navigateBack(); //返回上一页
    } else {
      wx.showModal({
        title: "用户信息授权失败",
        showCancel: false,
        success() {
          wx.navigateBack(); //返回上一页
        },
      });
    }
  },

  //获取手机号码
  getPhoneNumber: function (e) {
    console.log("getPhoneNumber");
    var page = this;
    var ss_key = wx.getStorageSync("ssKey")["ss_key"];
    app.request({
      url: "/user/bindPhone",
      method: "post",
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: ss_key,
      },
      success: function (res) {
        page.bindMobile(res.data.phoneNumber);
        var user_info = wx.getStorageSync("user_info");
        user_info.mobile = res.data.phoneNumber;
        wx.setStorageSync("user_info", user_info);
      },
      error: function (e) {
        wx.showToast({
          title: e.msg,
        });
      },
    });
  },
  bindMobile: function (mobile) {
    app.request({
      url: "api.share.bind_mobile",
      method: "post",

      data: {
        mobile,
      },
      success: function (res) {
        if (res.code == 0) {
          wx.navigateTo({
            url: "/pages/index/index",
          });
        } else {
          console.error(res);
        }
      },
      error: function (e) {
        wx.showToast({
          title: e.msg,
        });
      },
    });
  },
  cancelLogin: function () {
    wx.navigateTo({
      url: "/pages/index/index?cancel=true",
    });
  },
});
