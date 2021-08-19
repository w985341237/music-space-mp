var WxParse = require('../../wxParse/wxParse.js');

var article = '';
var app = getApp();
/**
* WxParse.wxParse(bindName , type, data, target,imagePadding)
* 1.bindName绑定的数据名(必填)
* 2.type可以为html或者md(必填)
* 3.data为传入的具体数据(必填)
* 4.target为Page对象,一般为this(必填)
* 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
*/

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