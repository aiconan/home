window.onload = function(){
    var app = new Vue({
        el: '#app',
        data: {
            menu: false,
            list: list,
            s_list: s_list,
            s_choose: false,
            s_text: null,
            s_now: 'baidu',
            s_sug: false
        },
        methods: {
            ajax: function(obj){
                obj = obj || {};
                var xmlhttp, type, url, async, dataType, data;
                type = obj.type || 'GET';
                type = trim(type).toUpperCase();
                url = obj.url
                url = trim(url);
                async = obj.async || true;
                dataType = obj.dataType || 'HTML';
                dataType = trim(dataType).toUpperCase();
                data = obj.data || {};
                function trim(str) {
                    return str.replace(/^\s+|\s+$/g, "");
                };
                var formatParams = function() {
                    if (typeof(data) == "object") {
                        var str = "";
                        for (var pro in data) {
                            str += pro + "=" + data[pro] + "&";
                        }
                        data = str.substr(0, str.length - 1);
                    }
                    if (type == 'GET' || dataType == 'JSONP') {
                        if (url.lastIndexOf('?') == -1) {
                            url += '?' + data;
                        } else {
                            url += '&' + data;
                        }
                    }
                }
                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                } else {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                if (dataType == 'JSONP') {
                    if (typeof(obj.beforeSend) == 'function') obj.beforeSend(xmlhttp);
                    var callbackName = ('jsonp_' + Math.random()).replace(".", "");
                    var oHead = document.getElementsByTagName('head')[0];
                    data.cb = callbackName;
                    var ele = document.createElement('script');
                    ele.type = "text/javascript";
                    oHead.appendChild(ele);
                    window[callbackName] = function(json) {
                        oHead.removeChild(ele);
                        window[callbackName] = null;
                        obj.success && obj.success(json);
                    };
                    formatParams();
                    ele.src = url;
                    return;
                }
            },
            get_sug: function(t){
                if(!t) return false;
                this.ajax({
                    url: 'https://unionsug.baidu.com/su?wd='+t,
                    type: 'get',
                    dataType: 'jsonp',
                    success: function(data){
                        if (data.s !== []) app.s_sug = data.s || false;
                    }
                })
            }
        }
    })
}