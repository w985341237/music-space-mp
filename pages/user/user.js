// pages/user/user.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      app.pageOnLoad(this);
  },

  loadData: function (options) {
    wx.showLoading({
      title: "正在加载",
      mask: true,
    });

    var page = this;
    app.request({
      url: "/user/index",
      success: function (res) {
        if (res.code == 0) {
          page.setData(res.data);
          wx.setStorafeSync('user_indo', res.data.user_info);
          wx.hideLoading();
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.pageOnShow(this);
    var page = this;
    const user_info = wx.getStorageSync('user_info');
    page.loadData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})