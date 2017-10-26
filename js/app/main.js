//load dependecies for this file
define(['plugin/smartresize', 'plugin/jquery.gsap.min'], function () {

    var onLoad = function () {
        //console.log('main init');
        var getPercent = 100 * ($('.constant').width() / $('.constant').parent().width()),
            percent = Math.round(getPercent);

        document.body.style.opacity = 1;

        _global();
    };

    //var onScroll = function () {
    //    //http://stackoverflow.com/a/18927969
    //    jQuery.fn.scrollTo = function (elem, speed) {

    //        var getPercent = 100 * ($('.constant').width() / $('.constant').parent().width());
    //        var percent = Math.round(getPercent);
    //        var offset = 0, scroll = 0;

    //        if ($(this).is("html")) {
    //            offset = percent <= 50 ? 40 : 50;
    //            scroll = elem.offset().top - offset;
    //        } else {
    //            scroll = $(this).scrollTop() - $(this).offset().top + elem.offset().top;
    //        }

    //        $(this).animate({
    //            scrollTop: scroll
    //        }, speed == undefined ? 1000 : speed);
    //        return this;
    //    };
    //};

    return {
        //scroll: onScroll,
        init: onLoad
    }

});


var scrollChange = true;

var _global = function () {

    if (!Modernizr.svg) {
        //if browser does not support SVGs, replace any img[src] of .svg with .png fallback
        $.each($('img, input[type="image"]'), function () {
            var el = this;

            if (el.src.indexOf(".svg") !== -1) {
                el.src = el.src.replace(".svg", ".png");
            }
        });
    };
    
    //Public Property
    windowHeight = $(window).height();
    windowWidth = $(window).width();
    
    var getPercent = 100 * ($('.constant').width() / $('.constant').parent().width()),
    percent = Math.round(getPercent);
    
    $(window).smartresize(function () {

        var getPercent = 100 * ($('.constant').width() / $('.constant').parent().width()),
            percent = Math.round(getPercent);
    });

}

function pageScroll() {
    scrollTop();

    $(window).scroll(function () {
        scrollTop();
    });

    function scrollTop() {

    }

    setInterval(function () {
        scrollTop();
    }, 50);
}


function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default, if not specified.

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
    }

    document.body.appendChild(form);    // Needed for cross browser
    form.submit();
}


function characterLimit(sender, maxChars, onlyNumbers, e) {
    var keynum
    var keychar
    var numcheck

    if (window.event) // IE
    {
        keynum = e.keyCode
    }
    else if (e.which) // Netscape/Firefox/Opera
    {
        keynum = e.which
    }

    keychar = String.fromCharCode(keynum);
    if (sender.value.length == maxChars) {
        return !keynum || keynum == 8;
    }

    if (onlyNumbers) {
        numcheck = /\d/
        return numcheck.test(keychar) || !keynum || keynum == 8;
    }

    return true;
}