//for ech table produced by text-editor in CMS
if (elemDOM('table')) {
    //wrap each table element in a div so table element can mantain its ideal width and be scrollable inside div if container is narrower
    $.each($('table'), function () {

        var el = $(this),
            th = el.find('th'),
            tr = el.find('tr'),
            td = el.find('td'),
            title = el.find('[data-title]');

        if (!el.parents().is('.tbl--result')) {
            el.wrap('<div class="tbl_wrap"></div>');
        }
        if (elemDOM(th)) {

            $.each(th, function () {
                var th = $(this);

                if (th.text().length > 0 && !th.is('[scope]')) {
                    th.attr('scope', 'col');
                }
            });
        }

        if (elemDOM(td)) {

            $.each(tr, function (i) {
                var td = $(this).find('td');

                //add scope=col to each first cell per row
                if (!$(td[0]).is('[scope]')) {
                    $(td[0]).attr('scope', 'row');
                }
                //for each cell in each row
                $.each(td, function (i) {
                    var td = $(this);
                    //add data-title with value of its column header (for mobile styling)
                    if (!td.is('[data-title]') && elemDOM(th)) {
                        td.attr('data-title', $(th[i]).text());
                    }
                });
            });


        }
    });

};

$('*').off('focus focusout').on('focus.focus', function (e) {
    e.stopPropagation();

    if ($(e.target).is('select')) {
        $('.select.focus').removeClass('focus');
        $(e.target).parent('.select').addClass('focus');
    }

    var el;
    if ($(e.currentTarget).is('[aria-haspopup="true"]') || $(e.target).parents().is('[aria-haspopup="true"]')) {
        $(e.target).find('[aria-controls]').addClass('focus');
        $(e.target).find('[aria-hidden]').attr({
            //'aria-hidden': false
        }).addClass('show');
    } else {
        $('[aria-haspopup="true"] a.focus').removeClass('focus');
        $('[aria-haspopup="true"]').removeClass('focus active');
        $('[aria-haspopup="true"] [aria-hidden]').attr({
            'aria-hidden': true
        }).removeClass('show');
    }

    if ($(e.target).parent().is('[aria-hidden]')) {
        $(e.target).parent('[aria-hidden]').attr({
            'aria-hidden': false
        });
    }



    if ($(e.target).is('input[type="checkbox"]') || $(e.target).is('input[type="radio"]')) {
        $('.input_chk.focus').removeClass('focus');
        $(e.target).parent('.input_chk').addClass('focus');
    }
}).on('focusout', function (e) {
    e.stopPropagation();

    if ($(e.target).is('select') || $(e.target).is('input[type="checkbox"]') || $(e.target).is('input[type="radio"]')) {
        $(e.target).parent('.focus').removeClass('focus');
    }


}).on('mousedown', function (e) {
    e.stopPropagation();

    $(this).removeClass('focus');

    if (!$(e.target).parents().is('[aria-haspopup="true"]')) {
        $('[aria-haspopup="true"] a.focus').removeClass('focus');
        $('[aria-haspopup="true"]').removeClass('focus active');
        $('[aria-haspopup="true"] [aria-hidden]').attr({
            'aria-hidden': true
        }).removeClass('show');
    } else if ($(e.target).parents().is('[aria-haspopup="true"]') && !$(e.target).parents().is('[aria-hidden]')) {
        e.preventDefault();
        var selector = $(e.target).parents('[aria-haspopup="true"]').find('[aria-hidden]');

        if (selector.is('.show')) {
            $(e.target).parents('[aria-haspopup="true"]').removeClass('active');
            selector.attr({
                'aria-hidden': true
            }).removeClass('show');
        } else {
            $(e.target).parents('[aria-haspopup="true"]').addClass('active');
            selector.attr({
                'aria-hidden': false
            }).addClass('show');
        }
    }

});