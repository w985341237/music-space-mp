var app = getApp();

Page({

    data: {
        id: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        console.log(app.apiurl);
        // app.pageOnLoad(this);
        console.log(wx.getSystemInfoSync());

        this.setData({
            a: "bbb"
        })
        var _html = '<div>Hello World!</div>';
        app.request({
            url: "/room/player/index",
            success: function (res) {
                that.setData({
                    html: res
                })
            }
        })
    },
})