var animTime = 400;
var className = 'show';
//console.log('data-tgl js');
/*
    have elements set with class of "hide" by default to work
    the "show" class will be added to show the element in view, also, 
    resist from adding a display: setting in CSS file to the targeted which will override the .hide/.show settings of display: none/show;

-- Usage --
    Example A:
        <a href="#" 
            data-tgl-target=".foo">
                Show Foo</a>
        <div class="foo hide">Hide and Show Me</div>

        When <a> is clicked, 
        the className of "show" will be added to .foo which will then be visible in page from display: none to display: show

    Example B:
        <a href="#" 
            data-tgl-target=".foo"
            data-tgl-fx="fade">
                Show Foo</a>
        <div class="foo hide">Fade me in and out</div>

        When <a> is clicked, 
        .foo will fadeIn and the className of "show" is added on fadeIn callback

        If <a> is clicked again,
        .foo will fadeOut and the className of "show" is removed on fadeOut callback

    Example C:
        <a href="#" 
            data-tgl-target=".foo"
            data-tgl-fx="fade"
            data-tgl-sync="groupA">
                Show Foo</a>
        <div class="foo hide">Fade me in and out</div>

        <a href="#" 
            data-tgl-target=".bar"
            data-tgl-fx="scroll"
            data-tgl-sync="groupA">
                Show Bar</a>
        <div class="bar hide">Scroll to me</div>

        When <a[data-tgl-target=".bar"]> is clicked, 
        ".body,html" will scroll to .bar and hide .foo (animate depending on the data-tgl-fx if declared)
*/
$('body').off('.dataTgl').on('click.dataTgl', '[data-tgl-target]', function (e) {

    //Stop bubbling event to parent object
    e.stopPropagation();
    e.preventDefault();
    /*
        Created for the ease of toggle hide-show states of elements with set states/animations:
            hide/show
            slide left-right/right-left
            slide up/down
            fade in/out
            scroll to element in page
    */

    var el = $(this);

    var getPercent = 100 * ($('.constant').width() / $('.constant').parent().width());
    var percent = Math.round(getPercent);

    var dataTarget = el.attr('data-tgl-target'),
        dataFX = el.attr('data-tgl-fx'), //animation type
        dataSync = el.attr('data-tgl-sync'), //group name
        target = $(dataTarget); //targeted element

    var txtFront = el.attr('data-txt-front'),
        txtBack = el.attr('data-txt-back');


    if (target.length > 0) { //if targeted element exists in DOM

        if (!target.is('.' + className)) {

            if (typeof dataSync !== 'undefined') { //if group name exists

                $.each($('[data-tgl-sync="' + el.attr('data-tgl-sync') + '"]'), function () {
                    $(this).removeClass('active');
                    //loop through each element that belongs in group and hide (animate depending on the data-tgl-fx if declared)
                    targetFXHide($('' + $(this).attr('data-tgl-target') + ''), $(this).attr('data-tgl-fx'), $(this).attr('data-tgl-sync'));
                });

            }
            el.addClass('active'); //add active state to selector

            $.each($('[data-tgl-target="' + el.attr('data-tgl-target') + '"]'), function () {
                //if target belongs to two different sync group, remove active states for all selector of same target
                var newEl = $(this),
                    newSync = $(this).attr('data-tgl-sync');

                if (typeof newSync !== 'undefined') {
                    $.each($('[data-tgl-sync="' + newEl.attr('data-tgl-sync') + '"]'), function () {
                        $(this).removeClass('active');
                    });
                }
                //re add active state to current selector
                //newEl.addClass('active');
            });
            $('[data-tgl-target="' + el.attr('data-tgl-target') + '"]').addClass('active');

            if (typeof txtBack !== "undefined" && typeof txtBack !== "undefined") {
                if (el.find('.data_tgl-txt').length > 0) {
                    el.find('.data_tgl-txt').text(txtBack).show();
                    el.find('.txt_dd-chng').hide();
                } else {
                    el.text(txtBack).show();
                }
            }

            targetFXShow(target, dataFX, dataSync);


        } else {
            //hide targeted element
            if (typeof dataSync !== 'undefined') {

                $.each($('[data-tgl-sync="' + el.attr('data-tgl-sync') + '"]'), function () {
                    $(this).removeClass('active');
                });
            }

            if (typeof txtFront !== "undefined" && typeof txtFront !== "undefined") {
                if (el.find('.data_tgl-txt').length > 0) {
                    el.find('.data_tgl-txt').text(txtFront).hide();
                    el.find('.txt_dd-chng').css('display', '');
                } else {
                    el.text(txtFront).show();
                }
            }

            targetFXHide(target, dataFX, dataSync);
            el.removeClass('active');

        }
    }


});

function targetFXShow(tar, fx, sync) {
    if (typeof fx !== 'undefined') {
        switch (fx) {
            case 'slide':

                tar.css({
                    '-ms-transform': 'translateZ(0)',
                    '-webkit-transform': 'translateZ(0)',
                    'transform': 'translateZ(0)'
                }).slideDown(animTime, "easeInSine", function () {
                    targetShow(tar);
                });
                break;

            case 'right-left':
                var width = tar.width();

                tar.css({
                    'display': 'block',
                    '-ms-transform': 'translateZ(0)',
                    '-webkit-transform': 'translateZ(0)',
                    'transform': 'translateZ(0)',
                    right: -width
                });

                TweenLite.to(tar, 0.6, {
                    right: 0,
                    ease: Linear.easeIn,
                    onComplete: targetShow,
                    onCompleteParams: [tar]
                });

                break;

            case 'fade':
                if (tar.is('.glbl_nav')) {
                    $('header').addClass('nav--open');
                    $('body').addClass('nav--view');
                }
                tar.fadeIn(animTime, "easeInSine", function () {
                    targetShow(tar);
                });
                break;

            case 'scroll':
                scrollChange = false;


                $('body, html').animate({ scrollTop: tar.offset().top }, animTime, "easeInSine", function () { scrollChange = true; });
                break;
        }

    } else { targetShow(tar); }
}

function targetFXHide(tar, fx, sync) {

    if (typeof fx !== 'undefined') {
        switch (fx) {
            case 'slide':

                tar.css({
                    '-ms-transform': 'translateZ(0)',
                    '-webkit-transform': 'translateZ(0)',
                    'transform': 'translateZ(0)'
                }).slideUp(animTime, "easeOutSine", function () {
                    targetHide(tar);
                });
                break;

            case 'right-left':
                var width = tar.width();

                tar.css({
                    'display': 'block',
                    '-ms-transform': 'translateZ(0)',
                    '-webkit-transform': 'translateZ(0)',
                    'transform': 'translateZ(0)',
                    right: 0
                });


                TweenLite.to(tar, 0.6, {
                    right: -width - 10,
                    ease: Linear.easeOut,
                    onComplete: targetHide,
                    onCompleteParams: [tar]
                });

                break;

            case 'fade':

                if (tar.is('.glbl_nav')) {
                    $('header').removeClass('nav--open');
                    $('body').removeClass('nav--view');
                }

                tar.css({
                    'position': 'absolute',
                    top: 0, left: 0, width: '100%',
                    opacity: 0
                }).stop(true, true).fadeOut("slow", "easeOutSine", function () {
                    tar.children().stop(true, true).animate({ 'opacity': 1 }, 600, function () {
                        $(this).removeAttr('style');
                    });
                    targetHide(tar);
                });
                break;
        }
    } else { targetHide(tar); }
}


function targetHide(tar) {
    tar.removeClass(className).removeAttr('style');
}

function targetShow(tar) {
    tar.addClass(className).removeAttr('style');
}

function scroll() {

    forScroll();

    var tab = $('a[data-tgl-fx="scroll"]');


    tab.unbind('click.scroll');
    tab.bind('click.scroll', function () {
        tab.removeClass('active');
        $(this).addClass('active');
    });


    $(window).scroll(function () {
        forScroll();
    });
};


