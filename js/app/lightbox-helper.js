$('a.fancy-btn').each(function () {
    $(this).addClass('loaded');
});

$("a.fancy-btn").fancybox({
    maxWidth: 800,
    maxHeight: 600,
    height: '100%',
    fitToView: false,
    width: '100%',
    autoSize: false,
    type: 'iframe',
    closeBtn: true,
    scrolling: 'no',
    padding: 0
    ////resize fancybox to actual height of content
    //afterLoad: function () {
    //    this.height = $('.fancybox-iframe').contents().find('body').outerHeight() + 30;
    //    if ($('.fancybox-iframe').contents().find('.bg--blue').length > 0) {
    //        $('.fancybox-wrap').find('.fancybox-close').addClass('white');
    //    };
    //}
});
calcHref = $('.calc').attr('data-link');
$('.calc').attr('href', calcHref);