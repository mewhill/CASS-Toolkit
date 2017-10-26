//load dependecies for this file
define(['plugin/jquery.gsap.min'], function () {

    var onLoad = function () {
        _frm();
    };

    return {
        init: onLoad
    }

});

var scrollChange = true;


function _frm() {

    var winWidth = $(window).width(),
        winHeight = $(window).height();

    $('.form.loading').removeClass('loading');

    //use for generic animation time
    var animTime = 400;

    //Public Property
    windowHeight = $(window).height();
    windowWidth = $(window).width();

    $('.input__chk').each(function () {
        var el = $(this),
            label = $(this),
            input = el.find('input');

        input.on('change', function () {
            //this.blur();
            //this.focus();
            var chk = $(this);
            if (chk.attr('type') == "radio") {
                var radioOther = $('input[name="' + chk.attr('name') + '"]');
                radioOther.closest('.input__chk').removeClass('checked');
            }
            if (chk.is(':checked')) {
                el.addClass('checked');
            } else {
                el.removeClass('checked');
            }

        }).change();

    });

    $.each($('.select'), function () {
        var el = $(this),
            span = el.find('span');
        var sel = el.find('select'),
            required = sel.attr('data-required');
        //change text of span > sibling of <select> element based on selected option of <select> element (custom styling)
        span.html(sel.find('option:selected').text());
        sel.find('option:selected').index() > 0 ? el.removeClass('error').addClass('active') : el.removeClass('active');

        if (sel.is('.error'))
            el.addClass('error')

        sel.change(function () {
            span.html(sel.find('option:selected').text());
            sel.find('option:selected').index() > 0 ? el.removeClass('error').addClass('active') : el.removeClass('active');

            if (sel.find('option:selected').index() == 0) {
                if (typeof required !== "undefined" && required) {
                    el.addClass('error');
                }
            } else {

            }
        });
    });
    $('select').off('focusout, focus');

    $('select').on('focus', function () {
        var el = $(this);
        el.parent('.select').addClass('active');
    });

    $('select').on('blur', function () {

        var el = $(this),
            val = el.find('option:selected').index(),
            isRequired = el.attr('data-required'),
            parent = el.parent('.select');
        parent.removeClass('active');
        if (typeof isRequired !== "undefined") {

            if (isRequired) {
                if (val == 0) {
                    //if select option is still as first and set as required apply "error" state
                    parent.addClass('error');
                } else {
                    parent.removeClass('error').addClass('active');
                }
            }
        }
    });

    var inputType = 'input[type="text"], input[type="password"], input[type="email"], input[type="number"]';

    $(inputType).on('input.type', function (e) {
        e.stopPropagation();
        var el = $(this),
            val = el.val();

        inputValChecker(el, val);
    });

    $.each($('.form-required'), function () {
        var label = $(this),
            el = label.parents('.form-item').find('input');

        el.attr('data-required', true);

    });

    //Input submit, check for empty required fields
    $('input[type="submit"]').off('.submit').on('click.submit', function (e) {
        //check for any input fields with error class or empty values

        var el = $(this),
            form = el.parents('.form'),
            isRequired = form.find('[data-required="true"]');

        $.each(isRequired, function () {
            inputValChecker($(this), $(this).val());
        });

        if (isRequired.is('.error')) {
            e.preventDefault();
        }
    });

    $.each($('input.error'), function () {
        var el = $(this),
            val = el.val();

        inputValChecker(el, val);
    });

}

function inputValChecker(el, val) {

    var length = val.length,
    isRequired = el.is('.required') ? true : el.attr('data-required'),
    parent = el.parents('.form-item');

    if (!isRequired)
        return false;

    if (length > 0) {

        //if (el.attr('type') == 'text' || el.attr('type') == 'password') {
        //    el.addClass('complete').removeClass('active error');
        //}

        if (el.attr('type') == 'email') {
            emailAddress = val;
            if (!isValidEmailAddress(emailAddress))
                el.addClass('error').removeClass('active complete');
                //el.addClass('complete').removeClass('active error');            
            else
                el.removeClass('active error');
        }

        if (el.attr('type') == 'number') {
            phone = val;
            if (!isValidNumber(phone))
                el.addClass('error').removeClass('active complete');
                //el.addClass('complete').removeClass('active error');
            else
                el.removeClass('active error');
        }

        if (el.is('[id*="edit-date-datepicker"]')) {
            date = val;
            if (!isValidDate(date))
                el.addClass('error').removeClass('active complete');
                //el.addClass('complete').removeClass('active error');
            else
                el.removeClass('active error');
        }

        form_alerts(el, "type");

    } else {
        el.addClass('error').removeClass('active complete');
        form_alerts(el, "length");
    }
}