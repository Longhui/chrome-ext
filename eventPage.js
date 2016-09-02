var start = 0;
var urls = new Array();
var titles = new Array();
var authors = new Array();
var uids = new Array();
var hrefs = new Array();
var tids = new Array();
var num = 0;
var max = 50;
var contentStr = "";

function init() {
  urls.length = 0;
  tids.length = 0;
  urls.length = 0;
  authors.length = 0;
  titles.length = 0;
  contentStr = "";
  num = 0;
}
chrome.browserAction.onClicked.addListener(function (tab) {
  if (0 == start) {
	init();
	sendMsg(tab.id, "msg");
	start = 1;
  } else {
	//保存文件
	var len = titles.length;
	for (var i = 0; i < len; i++) {
	  contentStr += titles[i] + " ;; ";
	  contentStr += tids[i] + " ;; ";
	  contentStr += authors[i] + " ;; ";
	  contentStr += uids[i] + " ;; ";
	  contentStr += urls[i] + "\n";
	}
	doSave(contentStr, "text/latex", "91porn.txt");
	alert("save");
	start = 0;
  }

});

//chrome.webNavigation.onDOMContentLoaded.addListener(function(tab){
//  alert("123");
//});
//
//chrome.extension.onMessage.addListener(function(tab){});
//chrome.webNavigation.onCompleted.addListener(function(tab){
//  alert("1111111111111------------");
//});

function sendMsg(tabid, msg) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
	chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function (response) {
	});
  });
}

function doSave(value, type, name) {
  var blob;
  if (typeof window.Blob == "function") {
	blob = new Blob([value], {type: type});
  } else {
	var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
	var bb = new BlobBuilder();
	bb.append(value);
	blob = bb.getBlob(type);
  }
  var URL = window.URL || window.webkitURL;
  var bloburl = URL.createObjectURL(blob);
  var anchor = document.createElement("a");
  if ('download' in anchor) {
	anchor.style.visibility = "hidden";
	anchor.href = bloburl;
	anchor.download = name;
	document.body.appendChild(anchor);
	var evt = document.createEvent("MouseEvents");
	evt.initEvent("click", true, true);
	anchor.dispatchEvent(evt);
	document.body.removeChild(anchor);
  } else if (navigator.msSaveBlob) {
	navigator.msSaveBlob(blob, name);
  } else {
	location.href = bloburl;
  }
}

chrome.runtime.onMessage.addListener(
function (request, sender, sendResponse) {
  if (0 == start) {
	return;
  }

  var len = request.msg.titles.length;
  for (var i = 0; i < len; i++) {
	titles.push(request.msg.titles[i]);
  }
  for (var i = 0; i < len; i++) {
	urls.push(request.msg.urls[i]);
  }
  for (var i = 0; i < len; i++) {
	authors.push(request.msg.authors[i]);
  }
  for (var i = 0; i < len; i++) {
	uids.push(request.msg.uids[i]);
  }
  for (var i = 0; i < len; i++) {
	tids.push(request.msg.tids[i]);
  }

  num = num + 1;
  if (num % max == 0 || request.over == 1) {
	var len = titles.length;
	for (var i = 0; i < len; i++) {
	  contentStr += titles[i] + " ;; ";
	  contentStr += tids[i] + " ;; ";
	  contentStr += authors[i] + " ;; ";
	  contentStr += uids[i] + " ;; ";
	  contentStr += urls[i] + "\n";
	}
	//保存文件
	doSave(contentStr, "text/latex", "91porn.txt");
	alert("over");
	start = 0;
  } else {
	setTimeout(function () {
	  //alert("send msg");
	  sendMsg(0, "msg");
	},
	3000);
  }
});
