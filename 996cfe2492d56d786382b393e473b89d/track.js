var campaignID = "5d408e652ed23800013aac39";
var rtkClickID;
function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param, params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
};
var urlParams = new URLSearchParams(window.location.search);
var pixelParams = '';
var refId = urlParams.get('ref_id');
var cost = urlParams.get('cost');
for (var pair of urlParams.entries()) {
    if (pair[0].startsWith('sub')) {
        pixelParams += '&' + pair[0] + '=' + pair[1]
    }
}
if (refId) {
    pixelParams += '&ref_id=' + refId
}
if (cost) {
    pixelParams += '&cost=' + cost
}
if (campaignID == "") {
    campaignID = urlParams.get('rtkcmpid')
}
var initialSrc = "https://offers.asseenofftv.com/"+campaignID+"?format=json";
for (var i = 1; i <= 10; i++) {
    initialSrc = removeParam("sub" + i, initialSrc)
};
function stripTrailingSlash(str) {
    return str.replace(/\/$/, "");
}
var rawData;
initialSrc = removeParam("cost", initialSrc);
initialSrc = removeParam("ref_id", initialSrc);
setTimeout(function(){
    if (!urlParams.get('rtkcid')) {
        xhr = new XMLHttpRequest;
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                rawData = JSON.parse(xhr.responseText);
                rtkClickID = rawData.clickid
                document.querySelectorAll('a').forEach(function(el) {
                    if (el.href.indexOf("offers.asseenofftv.com/click")>-1) {
                        if (el.href.indexOf('?')>-1) {
                            el.href = stripTrailingSlash(el.href)+"&clickid="+rawData.clickid
                        } else {
                            el.href = stripTrailingSlash(el.href)+"?clickid="+rawData.clickid
                        }
                    }
                });
                xhrr = new XMLHttpRequest;
                xhrr.open("GET", "https://offers.asseenofftv.com/view?clickid="+rawData.clickid)
                xhrr.send();
            }
        }
        xhr.open("GET", initialSrc+pixelParams)
        xhr.send();
    }
    else {
        rtkClickID = urlParams.get('rtkcid')
        xhrTrack = new XMLHttpRequest;
        xhrTrack.open("GET", "https://offers.asseenofftv.com/view?clickid="+rtkClickID )
        xhrTrack.send();
        document.querySelectorAll('a').forEach(function(el) {
            if (el.href.indexOf("offers.asseenofftv.com/click")>-1) {
                if (el.href.indexOf('?')>-1) {
                    el.href = stripTrailingSlash(el.href)+"&clickid="+rtkClickID
                } else {
                    el.href = stripTrailingSlash(el.href)+"?clickid="+rtkClickID
                }
            }
        });
    }
}, 5e1)
