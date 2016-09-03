chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log(sender.tab ?
    //            "from a content script:" + sender.tab.url :
    //            "from the extension");
    //if (request.greeting == "hello")
    //  sendResponse({farewell: "goodbye"});
      getImageUrl();
      getTitleUrl();
  });

function sendMsg(content, isover, mtype){
    chrome.runtime.sendMessage({msg: content, over: isover, type: mtype}, function(response) {
});
}

function getImageUrl(){
  var imgUrls= [];
    //图片链接
  $("img[id^=aimg_]").each(function(index){
    imgUrls.push($(this).attr("src"))
  });
    //文章内容
  var text = $("td.t_msgfont").text();
  var tid= $("span[id=post_reply] a").attr("href");
  var msg={}
  msg.imgUrls= imgUrls;
  msg.content= text;
  msg.tid= tid;
  sendMsg(msg, 0, "image");
}

function getTitleUrl(){
    urls=[];
    titles=[];
    authors=[];
    uids=[];
    tids=[];

    $("span[id^=thread_]").each(function(){
      tids.push($(this).attr("id"));
    });
    $("span[id^=thread_] a").each(function(index){
        urls.push($(this).attr("href"));
        titles.push($(this).text());
    });
    $("td.author cite a").each(function(index){
        uids.push($(this).attr("href"));
        authors.push($(this).text());
    });

  if(tids.length <= 0 || titles.length <=0 ){
    return;
  }

    msg={};
    msg.urls=urls;
    msg.titles=titles;
    msg.authors=authors;
    msg.uids=uids;
    msg.tids=tids;
    //for(var i=0; i<urls.length; i++){
    //    hrefs[i].click(function(){
    //        getImageUrl();
    //    });
    //}
    if($("a.next").length > 0){
      //alert("over:0");
      //跳到下一页
      $("a.next")[0].click();
      //将结果发给eventPage处理
      sendMsg(msg, 0, "title");
    } else {
      //alert("over:1");
      sendMsg(msg, 1, "title");
    }
}