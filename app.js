// app.js
App({
    apiurl: "http://localhost:8080",

    onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
        success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
    })
    },
    
    globalData: {
    userInfo: null
    },

    isBlank: function (str) {
        if (Object.prototype.toString.call(str) === "[object Undefined]") {
            //空
            return true;
        } else if (
            Object.prototype.toString.call(str) === "[object String]" ||
            Object.prototype.toString.call(str) === "[object Array]"
        ) {
            //字条串或数组
            return str.length == 0 ? true : false;
        } else if (Object.prototype.toString.call(str) === "[object Object]") {
            return JSON.stringify(str) == "{}" ? true : false;
        } else {
            return true;
        }
    },
    login: function () {
        //lzh需加前置判断，如果已授权,则不需要跳转；如果未授权，则跳转
        let that = this;
        wx.getSetting({
            success: function (res) {
                console.log(
                    "----------wx.getSetting--------" +
                    that.isBlank(wx.getStorageSync("access_token"))
                );
                if (
                    !res.authSetting["scope.userInfo"] ||
                    that.isBlank(wx.getStorageSync("access_token"))
                ) {
                    wx.navigateTo({
                        url: "/pages/authorized/authorized"
                    });
                }
            }
        });
    },

    currentPage: null,
    pageOnLoad: function (page) {
        this.currentPage = page;
        console.log("--------pageOnLoad----------");
        if (typeof page.openWxapp === "undefined") {
            page.openWxapp = this.openWxapp;
        }
        if (typeof page.showToast === "undefined") {
            page.showToast = this.pageShowToast;
        }
        // this.setNavigationBarColor();
        // this.setPageNavbar(page);
        // var app = this;
        // this.currentPage.naveClick = function (e) {
        //     var page = this;
        //     app.navigatorClick(e, page);
        // };
    },
    pageOnReady: function (page) {
        console.log("--------pageOnReady----------");
    },
    pageOnShow: function (page) {
        console.log("--------pageOnShow----------");
    },
    pageOnHide: function (page) {
        console.log("--------pageOnHide----------");
    },
    pageOnUnload: function (page) {
        console.log("--------pageOnUnload----------");
    },

    setPageNavbar: function (page) {
        console.log("----setPageNavbar----");
        console.log(page);
        var navbar = wx.getStorageSync("_navbar");

        if (navbar) {
            setNavbar(navbar);
        }
        this.request({
            url: api.default.navbar,
            success: function (res) {
                if (res.code == 0) {
                    setNavbar(res.data);
                    wx.setStorageSync("_navbar", res.data);
                }
            }
        });

        function setNavbar(navbar) {
            var in_navs = false;
            var route = page.route || page.__route__ || null;
            for (var i in navbar.navs) {
                if (navbar.navs[i].url === "/" + route) {
                    navbar.navs[i].active = true;
                    in_navs = true;
                } else {
                    navbar.navs[i].active = false;
                }
            }
            if (!in_navs) return;
            page.setData({
                _navbar: navbar
            });
        }
    },

    setNavigationBarColor: function () {
        var navigation_bar_color = wx.getStorageSync("_navigation_bar_color");
        if (navigation_bar_color) {
            wx.setNavigationBarColor(navigation_bar_color);
        }
    },

    navigatorClick: function (e, page) {
        var open_type = e.currentTarget.dataset.open_type;
        if (open_type == "redirect") {
            return true;
        }
        if (open_type == "wxapp") {
            var path = e.currentTarget.dataset.path;
            var str = path.substr(0, 1);
            if (str != "/") {
                path = "/" + path;
            }
            wx.navigateToMiniProgram({
                appId: e.currentTarget.dataset.appid,
                path: path,
                complete: function (e) {
                    console.log(e);
                }
            });
        }
        if (open_type == "tel") {
            var contact_tel = e.currentTarget.dataset.tel;
            wx.makePhoneCall({
                phoneNumber: contact_tel
            });
        }
        return false;

        function parseQueryString(url) {
            var reg_url = /^[^\?]+\?([\w\W]+)$/,
                reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
                arr_url = reg_url.exec(url),
                ret = {};
            if (arr_url && arr_url[1]) {
                var str_para = arr_url[1],
                    result;
                while ((result = reg_para.exec(str_para)) != null) {
                    ret[result[1]] = result[2];
                }
            }
            return ret;
        }
    },

    openWxapp: function (e) {
        console.log("--openWxapp---");
        if (!e.currentTarget.dataset.url) return;
        var url = e.currentTarget.dataset.url;
        url = parseQueryString(url);
        url.path = url.path ? decodeURIComponent(url.path) : "";
        console.log("Open New App");
        console.log(url);
        wx.navigateToMiniProgram({
            appId: url.appId,
            path: url.path,
            complete: function (e) {
                console.log(e);
            }
        });

        function parseQueryString(url) {
            var reg_url = /^[^\?]+\?([\w\W]+)$/,
                reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
                arr_url = reg_url.exec(url),
                ret = {};
            if (arr_url && arr_url[1]) {
                var str_para = arr_url[1],
                    result;
                while ((result = reg_para.exec(str_para)) != null) {
                    ret[result[1]] = result[2];
                }
            }
            return ret;
        }
    },

    pageShowToast: function (e) {
        console.log("--- pageToast ---");
        var page = this.currentPage;
        var duration = e.duration || 2500;
        var title = e.title || "";
        var success = e.success || null;
        var fail = e.fail || null;
        var complete = e.complete || null;
        if (page._toast_timer) {
            clearTimeout(page._toast_timer);
        }
        page.setData({
            _toast: {
                title: title
            }
        });
        page._toast_timer = setTimeout(function () {
            var _toast = page.data._toast;
            _toast.hide = true;
            page.setData({
                _toast: _toast
            });
            if (typeof complete == "function") {
                complete();
            }
        }, duration);
    },

    request: function (object) {
        console.log("----------------------------------" + this.apiurl);
        let that = this;
        if (!this.apiurl) {
            wx.getExtConfig({
                success: function (res) {
                    // module.exports.globalData = res.extConfig;
                    console.log("----------------------------------");
                    // console.log(res.extConfig.storeid);
                    // console.log(res.extConfig.apiurl);
                    // getApp().storeid = res.extConfig.storeid;
                    // getApp().apiurl = res.extConfig.apiurl;
                    that.requestMain(object);
                }
            });
        } else {
            that.requestMain(object);
        }
    },
    requestMain: function (object) {
        let that = this;
        if (!object.data) object.data = {};
        var access_token = wx.getStorageSync("access_token");
        if (access_token) {
            object.data.access_token = access_token;
        }
        // object.data._uniacid = this.siteInfo.uniacid;
        // object.data._acid = this.siteInfo.acid;
        var _api_root = this.apiurl;
        object.url = _api_root + object.url;
        console.log("url---------" + object.url + "1111");
        wx.request({
            url: object.url,
            header: object.header || {
                "content-type": "application/x-www-form-urlencoded",
            },
            data: object.data || {},
            method: object.method || "GET",
            dataType: object.dataType || "json",
            success: function (res) {
                console.warn("--- request success >>>");
                console.log(res);
                console.warn("<<< request success ---");
                that.login();
                if (res.data.code == -1) {
                    that.login();
                } else if (res.data.code == 6000) {
                    wx.showModal({
                        title: "网络请求出错",
                        content: res.data.msg,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                if (object.fail) object.fail(res);
                            }
                        }
                    });
                } else {
                    if (object.success) object.success(res.data);
                }
            },
            fail: function (res) {
                console.warn("--- request fail >>>");
                console.warn(res);
                console.warn("<<< request fail ---");
                var app = getApp();
                if (app.is_on_launch) {
                    app.is_on_launch = false;
                    wx.showModal({
                        title: "网络请求出错",
                        content: res.errMsg,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                if (object.fail) object.fail(res);
                            }
                        }
                    });
                } else {
                    wx.showToast({
                        title: res.errMsg,
                        image: "/images/icon-warning.png"
                    });
                    if (object.fail) object.fail(res);
                }
            },
            complete: function (res) {
                if (res.statusCode != 200) {
                    console.log("--- request http error >>>");
                    console.log(res.statusCode);
                    console.log(res.data);
                    console.log("<<< request http error ---");
                }
                if (object.complete) object.complete(res);
            }
        });
    },
})
