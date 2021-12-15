console.log("plugin loaded");
(function($) {

  let doc = $(document);
  let win = $(window);
  let progressbar = $('.progress-bar');
  let inititalArrNum = 0;
  let macy;
  let dataArr = [];

  doc.ready(function() {
    let si_wrapper = $('#si_wrapper');
    let si_fullTextWrapper = $('#si_fullTextWrapper');
    if ( si_wrapper.length != 0 ) {
      getSheetData();

      $('body').on("click", '.postsColsMore', function(e) {

        let postTitle = $(this).parent().find("h2").html();
        let postContent = $(this).parent().find(".postsColsText").html();
        let postImg = $(this).data("image");
        let postID = $(this).data("postid");

        si_wrapper.removeClass("isOpen");
        si_fullTextWrapper.find("h2").html(postTitle);
        si_fullTextWrapper.find("p").html(postContent);
        si_fullTextWrapper.find("img").attr("src", postImg);
        window.history.replaceState(null, null, "?id=" + postID);

        $('body').fadeOut(500, function() {
          si_wrapper.hide();

          si_fullTextWrapper.show();
          si_fullTextWrapper.addClass("show");

            $('html, body').animate({
                scrollTop: 0
            }, 0, function() {
              $('body').fadeIn(500);
            });


        });

        return false;
        e.preventDefault();
      });

      $('body').on("click", '.si_backBtn', function(e) {

          let postIDUrl = $.urlParam('id');
          let scrollTarget = $('#post' + postIDUrl);
          let postLoc = scrollTarget.css("top");

          console.log(postLoc);

          $('body').fadeOut(500, function(){
            si_fullTextWrapper.hide();
            si_wrapper.show();
            si_fullTextWrapper.removeClass("show");
            $('body').fadeIn(500, function() {
              macy.reInit();
              $('html, body').animate({
                  scrollTop: postLoc
              }, 1000)
            });
            si_wrapper.addClass("isOpen");
          });

        return false;
        e.preventDefault();
      });
    }
  });

  win.on("scroll", function() {

    let footerHeight = $('#brandBuilderWrap').height() + $('#footer').height() + 400;

    if ( $('#si_wrapper').hasClass("isOpen") ) {
      if ( $(document).height() - $(this).height() - footerHeight < $(this).scrollTop() ) {
          initBuild(inititalArrNum, dataArr, 5);
      }
    }

  });

  document.onreadystatechange = function () {
      if (document.readyState === "complete") {
      } else {
      }
  }

  function getSheetData() {

    let SHEET_ID = "<SheetID>";
    let API_KEY = '<APIKEY>';

    var url = "https://sheets.googleapis.com/v4/spreadsheets/" + SHEET_ID + "/values/Sheet1?key=" + API_KEY;
    $.getJSON(url,{}, function (response) {
        let data = response.values;
        for(var i = 1; i < data.length; i++){
         dataArr.push({
           title: data[i][0],
           image: data[i][4],
           content: data[i][1],
           date: data[i][2],
           category: data[i][3]
         });
       }
       dataArr.reverse();
       initBuild(inititalArrNum, dataArr, 5);
    });
  }

  function initBuild(initPos, data, length) {
    let i = initPos;
    let bounds = initPos + length;
    while(i < bounds){
      let colSize = 6;
      let exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	    let text1 = data[i].content.replace(exp, "<a href='$1'>$1</a>");
	    let exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      let formatText = data[i].content.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "</br>").replace(exp, '<a target="_blank" href="$1">$1</a>');
      let bgImage = '';
      if ( data[i].image != null ) {
        bgImage = '<div style="background: url(' + data[i].image + ') center center no-repeat;" class="postsImg"></div>';
      }
      let hashTitle = data[i].title.replace(" ", "_");

      let div = $('<div id="post' + [i] + '" class="postsCols hidden"><div class="postsColsInner"><h2 class="h2">' + data[i].title + '</h2>' + bgImage + '<a href="#" data-postid="' + [i] + '" data-image="' + data[i].image + '" data-hash="' + hashTitle + '" class="postsColsMore">Read Full Article</a><div class="postsColsText"><p>' + formatText + '</p></div></div></div>');
      $('#si_wrapper').append(div);
      i++;
      if ( i == bounds - 1 ) {
        inititalArrNum = inititalArrNum + 7;
      }
    }
    let fadeInIndex = 0;
    $('.postsCols.hidden').each(function(index) {
      let elem = $(this);
      setTimeout(function() {
        fadeInElem(elem);
      }, 500 * fadeInIndex);
      fadeInIndex++;
    });
    if ( initPos == 0 ) {
      masonryBuild();
    } else {
      macy.reInit();
    }
  }

function fadeInElem(elem) {
  elem.removeClass("hidden");
  elem.addClass("show");
}

  function masonryBuild() {
    macy = Macy({
        container: '#si_wrapper',
        trueOrder: false,
        waitForImages: false,
        margin: 50,
        columns: 2,
        breakAt: {
            500: 1
        }
    });
  }

  $.urlParam = function(name){
  	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  	return results[1] || 0;
  }


})(jQuery);
