require.config({
    //http://requirejs.org/docs/api.html#jsfiles
    //default location of files: /_assets/scripts/files.js
	urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        //changes location of files if needed to: 
        //app/files.js = /_assets/scripts/app/files.js
        //App folder = front end specific functions that require libraries/plugins
        app: 'app',
        lib: 'lib',
        plugin: 'plugin',
        admin: 'admin',
        ckEditor: '../ckeditor',

        //create value that is easier to reference, 
        //'jquery': 'jquery-1.9.1.min' in this case uses the baseURL location and reference of 'jquery'
        'jquery': 'lib/jquery-2.2.4.min',
        'placholders': 'lib/Placeholders.min',
        'fancybox': 'plugin/fancybox'
    },
    //shim grabs the depencies of the files before the file you require e.g jquery BEFORE lazyload declared in shim
    shim: {
        //setup all libraries that will be used in project, reference them later in relevant modules (i.e. app/main.js)
        'plugin/modernizr.min' : ['jquery'], //modernizr        
        'plugin/TweenLite': ['jquery'], //tweenlite
        'plugin/jquery.gsap.min': ['jquery'],
        //'plugin/jquery.fitvids': ['jquery'],
        'plugin/fancybox/jquery.fancybox': ['jquery'],
        'plugin/smartresize.min': ['jquery'],
        'plugin/lazyload.min': ['jquery'],
        'app/lightbox-helper': ['plugin/fancybox/jquery.fancybox']
    }
});

if (window.jQuery) {  
    LoadInCoreScripts(window.jQuery);
} else {
    require(['jquery'], function($){
        LoadInCoreScripts($);
    });
}

function LoadInCoreScripts($) {

    require(['app/main', 'placholders', 'plugin/modernizr.min', 'plugin/lazyload.min'], function (App) {

        //App.scroll();
        ////initialise app/main.js module when loaded
        App.init();

        $('a[href="#"], a[href="##"]').bind('click', function (e) {
            e.preventDefault();
        });

        //snap links
        $('a[href^="#"]:not(a[href="#"])').bind('click', function (e) {

            e.preventDefault();

            var target = $($(this).attr("href"));
            if (target.length > 0) {
                $('body, html').animate({
                    scrollTop: target.offset().top
                }, 500, function () { scrollChange = true; });
            }

        });

        $('.lazyLoad').lazyload({
            load: function () {
                //fade in element
                if ($(this).parents().is('.fade--in')) {
                    var el = $(this).parents('.fade--in');
                    el.addClass('loaded');

                } else if ($(this).is('.fade--in')) {
                    var el = $(this);
                    el.addClass('loaded');
                }
            }
        });

    });

    //Load Assistive Libraries
    if (elemDOM('[data-tgl-target]')) {
        require(['app/data-tgl']);
    }
    
    //Load Applications
    if (elemDOM('.form, .input_chk, .select, .input-txt')) {
        require(['app/form', 'app/formVal'], function (Init) {
            Init.init();
        });
    }
    
    require(['app/accessibility']);
    

    if (elemDOM('.fancy-btn')) {
        require(['app/lightbox-helper']);
    }
}

function elemDOM(el) {
    if (typeof $ !== 'function') {
        if (document.querySelectorAll(el).length > 0 && typeof document.querySelectorAll(el)[0] !== "undefined")
            return true;
    } else {
        if ($(el).length > 0 && typeof $(el)[0] !== "undefined")
            return true;
    }
}