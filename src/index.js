 /**
     * 为特定url增删search参数
     *
     * @param {string} url 需要处理的url地址
     * @param {Array} delParams 需要删除的search参数的key集合
     * @param {Object} newParams 需要新增的search参数键值对集合
     *
     * @return {string} 完成增删search参数后的新url
     */
    function filterUrl(url, delParams, newParams) {
      url = url.split("#")[0]; // 先去掉 hash

      if (delParams) {
        delParams = delParams.split(",").map(item => item.trim());
      } else {
        delParams = [];
      }
      newParams = newParams || {};

      var urlArr = url.split("?");
      var origin = urlArr[0];
      var search = urlArr[1] || "";

      var queryArr = search.split("&");
      var query = {};

      for (var i = 0; i < queryArr.length; i++) {
        if (queryArr[i].length > 0) {
          var temp = queryArr[i].split("=");

          query[temp[0]] = temp[1];
        }
      }

      var newSearch = "";

      for (var key in newParams) {
        query[key] = newParams[key];
      }
      for (var _key in query) {
        if (delParams.indexOf(_key) !== -1) {
          continue;
        }
        newSearch =
          newSearch +
          encodeURIComponent(_key) +
          "=" +
          encodeURIComponent(query[_key]) +
          "&";
      }
      newSearch = newSearch.replace(/&{1}$/, "");

      if (newSearch.length > 0) newSearch = "?" + newSearch;

      var href = origin + newSearch + location.hash;

      return href;
    }

    /**
     * url的search键值组合成的对象
     *
     * @type {Object}
     * @final
     */
    const shareOpenid = (() => {
      let qs = location.search.length > 0 ? location.search.substring(1) : "";
      let args = {};
      let items = qs.length > 0 ? qs.split("&") : [];
      let item = null;
      let name = null;
      let value = null;
      let i = 0;
      let len = items.length;

      for (i = 0; i < len; i++) {
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length > 0) {
          args[name] = value;
        }
      }

      return args;
    })()["openid"];

    function initWxShare() {
      wechat = new Wechat("<%= wxAppid %>").config();
      wechat.shareFriend(
        {
          appmessageTitle: shareParams.title,
          appmessageDesc: shareParams.desc,
          link: fiboSDK.dealUrl(
            filterUrl(shareParams.link, shareParams.delQuery)
          ),
          imgUrl: shareParams.imgUrl
        },
        function() {
          try {
            fiboSDK.share("friend");
          } catch (e) {}
        }
      );
      wechat.shareTimeline(
        {
          appmessageTitle: shareParams.title,
          appmessageDesc: shareParams.desc,
          link: fiboSDK.dealUrl(
            filterUrl(shareParams.link, shareParams.delQuery)
          ),
          imgUrl: shareParams.imgUrl
        },
        function() {
          try {
            fiboSDK.share("timeline");
          } catch (e) {}
        }
      );
    }

    window.onload = function() {
      var btnDom = document.getElementById("btn");
      btnDom.addEventListener("click", function() {
        try {
          fiboSDK.btnClick("btn-share-meto", "我也要养");
          PALifeWebSDK.addRecord("108", "708-20190513861614-0067", {
            isProd: !!"<%= isProd %>",
            uid: shareOpenid ? shareOpenid : "", // 根据需求，选传，可传分享者在金管家的 openId
            ext: {
              act_action: "read"
            }
          });
        } catch (e) {}
        window.location.href = "<%= wxToApgUrl%>";
      });
      initWxShare();
    };