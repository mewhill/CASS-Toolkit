function _frm(){$(window).width(),$(window).height();$(".form.loading").removeClass("loading");windowHeight=$(window).height(),windowWidth=$(window).width(),$(".input__chk").each(function(){var e=$(this);$(this);e.find("input").on("change",function(){var t=$(this);"radio"==t.attr("type")&&$('input[name="'+t.attr("name")+'"]').closest(".input__chk").removeClass("checked"),t.is(":checked")?e.addClass("checked"):e.removeClass("checked")}).change()}),$.each($(".select"),function(){var e=$(this),t=e.find("span"),i=e.find("select"),r=i.attr("data-required");t.html(i.find("option:selected").text()),i.find("option:selected").index()>0?e.removeClass("error").addClass("active"):e.removeClass("active"),i.is(".error")&&e.addClass("error"),i.change(function(){t.html(i.find("option:selected").text()),i.find("option:selected").index()>0?e.removeClass("error").addClass("active"):e.removeClass("active"),0==i.find("option:selected").index()&&void 0!==r&&r&&e.addClass("error")})}),$("select").off("focusout, focus"),$("select").on("focus",function(){$(this).parent(".select").addClass("active")}),$("select").on("blur",function(){var e=$(this),t=e.find("option:selected").index(),i=e.attr("data-required"),r=e.parent(".select");r.removeClass("active"),void 0!==i&&i&&(0==t?r.addClass("error"):r.removeClass("error").addClass("active"))});$('input[type="text"], input[type="password"], input[type="email"], input[type="number"]').on("input.type",function(e){e.stopPropagation();var t=$(this);inputValChecker(t,t.val())}),$.each($(".form-required"),function(){$(this).parents(".form-item").find("input").attr("data-required",!0)}),$('input[type="submit"]').off(".submit").on("click.submit",function(e){var t=$(this).parents(".form").find('[data-required="true"]');$.each(t,function(){inputValChecker($(this),$(this).val())}),t.is(".error")&&e.preventDefault()}),$.each($("input.error"),function(){var e=$(this);inputValChecker(e,e.val())})}function inputValChecker(e,t){var i=t.length,r=!!e.is(".required")||e.attr("data-required");e.parents(".form-item");if(!r)return!1;i>0?("email"==e.attr("type")&&(emailAddress=t,isValidEmailAddress(emailAddress)?e.removeClass("active error"):e.addClass("error").removeClass("active complete")),"number"==e.attr("type")&&(phone=t,isValidNumber(phone)?e.removeClass("active error"):e.addClass("error").removeClass("active complete")),e.is('[id*="edit-date-datepicker"]')&&(date=t,isValidDate(date)?e.removeClass("active error"):e.addClass("error").removeClass("active complete")),form_alerts(e,"type")):(e.addClass("error").removeClass("active complete"),form_alerts(e,"length"))}define(["plugin/jquery.gsap.min"],function(){return{init:function(){_frm()}}});var scrollChange=!0;