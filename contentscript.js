chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log(sender.tab ?
    //            "from a content script:" + sender.tab.url :
    //            "from the extension");
    //if (request.greeting == "hello")
    //  sendResponse({farewell: "goodbye"});
      //getImageUrl();
      getTitleUrl();
  });

function sendMsg(content, isover){
    chrome.runtime.sendMessage({msg: content, over: isover}, function(response) {
});
}

function getImageUrl(){
    //图片链接
  $("img[id^=aimg_]").each(function(index){
      console.log($(this).attr("src"));
  });
    //文章内容
    console.log($("td.t_msgfont").text());
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
      sendMsg(msg, 0);
    } else {
      //alert("over:1");
      sendMsg(msg, 1);
    }
}