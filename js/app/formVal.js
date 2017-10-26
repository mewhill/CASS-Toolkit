
(function (formVal, $, undefined) {

    var classes = {
        error: 'is-error',
        tooltip: 'frm_tip',
        wrapper: 'input_wrap'
    };

    var overlays,
        buttons,
        reqSel = '[data-required]:visible',
        reqRadioSel = '[data-radio-required]:visible',
        reqOneSel = '[data-requireone]:visible',
        matchSel = '[data-match]:visible',
        typedSel = '[data-type]:visible',
        maxWordSel = '[data-max-words]:visible',
        validationMsg = 'Complete this field';

    formVal.init = function () {
        overlays = $('.' + classes.tooltip);

        overlays.on('click.val', function () {
            if ($(this).attr('id') == 'serverErrorMsg') {
                $(this).hide();
            } else {
                var parent = $(this).parent();
                parent.removeClass(classes.error);
                parent.find('input').focus();
            }
        });

        overlays.siblings(':input').focus(function () {
            $(this).parent().removeClass(classes.error);
        });
    };

    formVal.validate = function (form) {
        var parent = form,
            requiredFields = parent.find(reqSel),
            requiredRadioFields = parent.find(reqRadioSel),
            requireOneFields = parent.find(reqOneSel),
            typeValFields = parent.find(typedSel),
            maxWordFields = parent.find(maxWordSel),
            matchFields = parent.find(matchSel),
            isValid = true,
            errMsg = "",
            customErrorSelector = "data-customerror",
            customTipSelector = "data-customtip";

        requiredFields.filter('input[type=text], input[type=password], textarea').each(function () {
            var that = $(this),
                val = that.val();

            if (val.length == 0) {

                var tipMsg = validationMsg,
                    cusTip = that.attr(customTipSelector);
                if (typeof (cusTip) !== 'undefined' && cusTip.length > 0)
                    tipMsg = cusTip;

                that.parents('.' + classes.wrapper).addClass(classes.error).find('.' + classes.tooltip).html(tipMsg);
                isValid = false;
                var cusErr = that.attr(customErrorSelector);
                if (typeof (cusErr) !== 'undefined' && cusErr.length > 0) {
                    errMsg += "<br/>";
                    errMsg += cusErr;
                }
            } else {
                $(this).parents('.' + classes.wrapper).removeClass(classes.error);
            }
        });
        requiredFields.filter('select').each(function () {
            var that = $(this),
                val = that.find('option:selected').val();

            if (val.length == 0 || val == '-1') {
                var tipMsg = validationMsg,
                    cusTip = that.attr(customTipSelector);
                if (typeof (cusTip) !== 'undefined' && cusTip.length > 0)
                    tipMsg = cusTip;

                that.parents('.' + classes.wrapper).addClass(classes.error).find('.' + classes.tooltip).html(tipMsg);

                isValid = false;
                var cusErr = that.attr(customErrorSelector);
                if (typeof (cusErr) !== 'undefined' && cusErr.length > 0) {
                    if (errMsg.length > 0)
                        errMsg += "<br/>";
                    errMsg += cusErr;
                }
            } else {
                $(this).parents('.' + classes.wrapper).removeClass(classes.error);
            }
        });

        requiredRadioFields.each(function () {
            var that = $(this),
                radBtn = that.find('input[type=radio]')[0],
                name = $(radBtn).attr('name'),
                val = parent.find('input[type=radio][name="' + name + '"]:checked').val();

            if (typeof (val) === 'undefined' || val.length == 0 || val == '-1') {
                var tipMsg = validationMsg,
                    cusTip = that.attr(customTipSelector);
                if (typeof (cusTip) !== 'undefined' && cusTip.length > 0)
                    tipMsg = cusTip;
                that.parents('.' + classes.wrapper).addClass(classes.error).find('.' + classes.tooltip).html(tipMsg);

                isValid = false;
                var cusErr = that.attr(customErrorSelector);
                if (typeof (cusErr) !== 'undefined' && cusErr.length > 0) {
                    errMsg += "<br/>";
                    errMsg += cusErr;
                }
            } else {
                that.parents('.' + classes.wrapper).removeClass(classes.error);
            }
        });

        requireOneFields.filter('input[type=text], input[type=password], textarea').each(function () {
            var val = $(this).val(),
                otherSel = $(this).attr('data-requireone'),
                otherField = parent.find(otherSel),
                otherVal = '';

            if (otherField.is('select')) {
                otherVal = otherField.find('option:selected').val();
            } else {
                otherVal = otherField.val();
            }

            if (val.length == 0 && otherVal.length == 0 || (otherField.is('select') && otherVal == "-1")) {
                $(this).parents('.' + classes.wrapper).addClass(classes.error);
                if (otherField.is('select'))
                    otherField.parents('.select').addClass(classes.error);
                else
                    otherField.parents('.' + classes.wrapper).addClass(classes.error);
                isValid = false;
                var cusErr = $(this).attr(customErrorSelector);
                if (typeof (cusErr) !== 'undefined' && cusErr.length > 0) {
                    errMsg += "<br/>";
                    errMsg += cusErr;
                }
            } else {
                $(this).parents('.' + classes.wrapper).removeClass(classes.error);
                if (otherField.is('select')) {
                    $(otherField).parents('.select').removeClass(classes.error);
                } else {
                    $(otherField).parents('.' + classes.wrapper).removeClass(classes.error);
                }
            }
        });

        typeValFields.each(function () {
            var that = $(this);
            //If the field has already been flagged by the required vals, we'll ignore it
            if (that.parents('.' + classes.wrapper).hasClass(classes.error))
                return;

            var dataType = that.attr('data-type'),
                val = that.val(),
                localValid = true,
                errorMsg = '';

            switch (dataType) {
                case "email":
                    errorMsg = "Please enter a valid email address";
                    if (!formVal.validateEmail(val))
                        localValid = false;
                    break;
                case "money":
                    errorMsg = "Please enter a valid monetary value i.e. 111.15";
                    localValid = validateCurrency(val);

                    break;
            }
            if (!localValid) {
                that.parents('.' + classes.wrapper).addClass(classes.error).find('.' + classes.tooltip).html(errorMsg);
                isValid = false;
                var cusErr = that.attr(customErrorSelector);
                if (typeof (cusErr) !== 'undefined' && cusErr.length > 0) {
                    errMsg += "<br/>";
                    errMsg += cusErr;
                }
            } else {
                that.parents('.' + classes.wrapper).removeClass(classes.error);
            }
        });

        maxWordFields.each(function () {
            var that = $(this),
                val = that.val(),
                maxAllowed = parseInt(that.attr('data-max-words'));

            if (isNaN(maxAllowed)) {
                return;
            }
            if (val.length > 0) {
                var wordCount = val.match(/(\w+)/g).length;
                if (wordCount > maxAllowed) {
                    errorMsg = "You can only have a maximum of " + maxAllowed + " words";
                    that.parents('.' + classes.wrapper).addClass(classes.error).find('.' + classes.tooltip).html(errorMsg);
                    isValid = false;
                } else {
                    that.parents('.' + classes.wrapper).removeClass(classes.error);
                }
            }
        });

        matchFields.filter('input[type=password]').each(function () {
            var that = $(this),
                val = that.val(),
                otherSel = that.attr('data-match'),
                otherField = parent.find(otherSel),
                otherVal = otherField.val();

            if (val != otherVal) {
                errorMsg = "Your passwords do not match";
                that.parents('.' + classes.wrapper).addClass(classes.error).find('.' + classes.tooltip).html(errorMsg);
                isValid = false;
                errMsg += "<br/>Your passwords do not match.";
            } else {
                //$(this).parents('.' + classes.wrapper).removeClass(classes.error);
            }
        });

        errMsg = "There's a problem with your details." + errMsg + "<br />Please review the highlighted areas to continue.";

        if (!isValid) {
            var topError = parent.find('.' + classes.error + ':visible').first();
            $('.error-msg').html(errMsg).addClass('show');
            $('body, html').animate({ scrollTop: topError.offset().top - 150 }, 500, function () { scrollChange = true; });
        }

        return isValid;
    };


}(window.formVal = window.formVal || {}, jQuery));

var unsightlyEmailCharacters = ['{', '}', '|', '~', '\'', '"'];
formVal.validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
        for (var i = 0; i < unsightlyEmailCharacters.length; i++) {
            if (email.indexOf(unsightlyEmailCharacters[i]) > -1)
                return false;
        }
    }
    else {
        return false;
    }
    return true;
}

function validateCurrency(val) {
    var regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    if (regex.test(val))
        return true;
    return false;
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

function isValidNumber(phone) {
    var pattern2 = new RegExp(/^\d+$/);
    return pattern2.test(phone);
};

//http://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript
// Validates that the input string is a valid date formatted as "dd/mm/yyyy"
function isValidDate(dateString) {

    var pattern = /^([0-9]{1,2})\-([0-9]{1,2})\-([0-9]{4})$/;

    // First check for the pattern
    if (!pattern.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

formVal.init();

$('a[data-validate]').click(function (e) {
    var form = $(this).attr('data-validate');
    if (!formVal.validate($(form))) {
        e.preventDefault();
        return false;
    }
});