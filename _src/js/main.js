$(document).ready(function () {
  var passInput = $("#login-password");
  var emailInput = $('#login-email');
  var errorWeight = $("<label class='error'>Моля, въведете тегло</label>");
  var errorHeight = $("<label class='error'>Моля, въведете височина</label>");
  var errorWeek = $("<label class='error'>Моля, изберете седмица</label>");
  var errorEmail = $("<label class='error'>Моля, въведете валиден имейл</label>");
  var errorPass = $("<label class='error'>Моля, въведете парола</label>");
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var hamburgerBool = false;
  var loginBool = false;
  var emailBool = false;
  var passBool = false;

  /* Hanburger menu */
  $('.hamburger-btn').on('click', function() {
    $('.global-overlay').addClass('active');
    $('.global-overlay').outerHeight();
    $('.global-overlay').fadeTo("slow", "0.18");
    $('.hamburger-menu').animate({ "left": "0px" }, 500);
    $('body').css("overflow", "hidden");
    hamburgerBool = true;
  });
  $('.global-overlay, .closeBtn, .hamburger-menu a').on('click', function(event) {
    if(hamburgerBool == true) {
      $('.global-overlay').fadeTo("slow","0");
      const timeout = setTimeout(function() {
        $('.global-overlay').removeClass('active');
      }, 500);   
      $('.hamburger-menu').animate({"left":"-316px"}, 500);
      $('body').css("overflow","visible");
    }
  });

  /* Open login */
  $('.login-link').click(function() {
    $('.global-overlay').addClass('active');
    $('.global-overlay').outerHeight();
    $('.global-overlay').fadeTo(400, "0.18");
    $('.login-popup').addClass('active');
    $('.login-popup').outerHeight();
    $('.login-popup').fadeTo(400, "1");
    loginBool = true;
  });

  function closeLogin() {
    if(loginBool == true) {
      $('.login-popup').fadeTo(400,"0");
      $('.global-overlay').fadeTo(400,"0");
      const timeout = setTimeout(function() {
        $('.global-overlay').removeClass('active');
        $('.login-popup').removeClass('active');
      }, 400);
    }   
  }
  $('.close-popup, .global-overlay').click(function() {
    closeLogin();
  });
  
  /* Email validation */
  emailInput.blur(function() {
    if($(this).val().match(mailformat)) {
      $(this).parent('div').removeClass('invalid');
      $('.error').remove();
      $(this).addClass("filled");
      emailBool = false;
    } else {
      $(this).focus();
      $(this).parent('div').addClass('invalid');
      errorEmail.insertAfter(this);
      $(this).addClass("filled");
      emailBool = true;
    }
  })
  emailInput.on('keyup', function() { 
    if(emailBool == true) {
      if($(this).val().match(mailformat)) {
        $(this).parent('div').removeClass('invalid');
        $('.error').remove();
        $(this).addClass("filled");
      } else {
        $(this).focus();
        $(this).parent('div').addClass('invalid');
        errorEmail.insertAfter(this);
        $(this).addClass("filled");
      }
    }
  });
  /* reveal password */
  $(".see-password").click(function() {
    if (passInput.attr('type') === "password") {
      passInput.attr('type','text');
    } else {
      passInput.attr('type','password');
    }
  });
  /* Password validation */
  passInput.blur(function() {
    if(passInput.val() == 0) {
      errorPass.insertAfter(this);
      $(this).parent('div').addClass('invalid');
      passBool = true;
    } else {
      $('.error').remove();
      $(this).parent('div').removeClass('invalid');
      $(this).addClass("filled");
      passBool = false;
    }
  });
  passInput.on('keyup', function() {
    if(passBool == true) {
      if(passInput.val().length > 1) {
        $('.error').remove();
        $(this).parent('div').removeClass('invalid');
      }
    }
  });
  /* Login button */
  $('.gtm-Login-Btn-click').click(function() {
    if(emailInput.val() == 0) {
      emailInput.parent('div').addClass('invalid');
      errorEmail.insertAfter(emailInput);
      emailBool = true;
    }
    if(passInput.val() == 0) {
      passInput.parent('div').addClass('invalid');
      errorPass.insertAfter(passInput);
      passBool = true;
    }
    if(emailBool == false && passBool == false) {
      closeLogin();
    }
  });
  
  /* Sign accordion */
  $(".accordion").click(function () {
    $(this).closest(".accordion").toggleClass("is-open").find(".accordion-content").slideToggle(400);
    return false;
  });
  $.getJSON("../ajax/signsTxt.json", function (data) {
    var obj = jQuery.parseJSON(JSON.stringify(data));
    $(".accordion h3").html(obj[0].title + ' <span class="dates">' + obj[0].period + '</span>');
    $(".horoscope-text p").text(obj[0].description);
    $('.zodiac-list li').click(function () {
      var num = $(this).index();
      $('.accordion h3').html(obj[num].title + ' <span class="dates">' + obj[num].period + '</span>');
      $('.horoscope-text p').text(obj[num].description);
      $('.img-sign img').attr('src','images/'+obj[num].image);
    });
  });

  /* Search */

  var submitIcon = $('.searchbox-icon');
  var closeSearch = $('.icon--close-search');
  var inputBox = $('.searchbox-input');
  var searchBox = $('.searchbox');
  submitIcon.click(function () {
    searchBox.addClass('searchbox-open');
    inputBox.focus();
  });
  closeSearch.click(function() {
    searchBox.removeClass('searchbox-open');
    inputBox.focusout();
  });

  /* Calculator start */
  /* Calculator typing validation */
  $("#weight-before, #weight-now, #height").on('keyup', function () {
    var inputVal = $(this).val();
    if ($.isNumeric(inputVal) || inputVal == 0) {
      $(this).parent('div').removeClass('invalid');
      $('.error').remove();
    } else {
      $(this).parent('div').addClass('invalid');
      if ($(this).is('#weight-before') || $(this).is('#weight-now')) {
        errorWeight.insertAfter(this);
      } else {
        errorHeight.insertAfter(this);
      }
    }
  });
  $("#weight-before, #weight-now, #height").blur(function () {
    var inputVal = $(this).val();
    if (inputVal != 0) {
      $(this).addClass("filled");
    } else {
      $(this).removeClass("filled");
    }
  });
  /* Calculator select */
  $( "#week" ).change(function() {
    var inputVal = $(this).val();
    if(inputVal == 0) {
      errorWeek.insertAfter(this);
      $(this).parent('div').addClass('invalid');
    } else {
      $('.error').remove();
      $(this).parent('div').removeClass('invalid');
    }
  });
  $("#week").blur(function() {
    var inputVal = $(this).val();
    var error = $('#week label').hasClass('error');
    if(inputVal == 0 && error) {
      $(this).parent('div').addClass('invalid');
    } else {
      $(this).parent('div').removeClass('invalid');
      $('.error').remove();
    }
  });

  /* Calculator validation */
  var inputs = $("#weight-before, #weight-now, #height, #week");
  inputs.each(function() {
    var inputVal = $(this).val();
    if ($(this).parents('div').hasClass('invalid') || inputVal) {
      $(this).focus();
      $(this).parents('div').addClass('invalid');
    } else {
      $(this).parents('div').removeClass('invalid');
    }
  })

  /* Calculator submit */
  $(".weight-form").submit(function(event) {
    event.preventDefault();
    var dataArr = [];
    dataArr = $(this).serializeArray();
    var noError = true;
    for(var input in dataArr) {
      var element = $('#'+dataArr[input].name);
      var invalid = element.parent().hasClass('invalid');
      var empty = dataArr[input].value;
      if(invalid || empty == 0) {
        element.parent().addClass('invalid');
        if (element.is('#weight-before') || element.is('#weight-now')) {
          errorWeight.insertAfter(element);
        } else if(element.is('#height')) {
          errorHeight.insertAfter(element);
        } else {
          errorWeek.insertAfter(element);
        }
        noError = false;
      }
    }
    if (!noError){
      event.preventDefault(); 
    } else {
      $(".weight-form").promise().done(function() {    
        var weightBefore = dataArr[0].value;
        var weightAfter = dataArr[1].value;        
        var height = dataArr[2].value;
        var week = dataArr[3].value;
        if (dataArr.length == 5) {
          var twins = 1.5;
        } else {
          twins = 1;
        }
        var minWeight = height - 105 + week * 8/40 * twins;
        var maxWeight = height - 105 + week * 20/40 * twins;
        if(weightAfter < minWeight) {
          $('.your-weight').text('по-ниско');
        } else if(weightAfter > maxWeight) {
          $('.your-weight').text('по-високо');
        } else {
          $('.your-weight').text('нормално');
        }
        $('.result-weight').text(weightAfter + 'кг');
        $('.result-weights').html(minWeight + ' - ' + maxWeight+'кг');
        $('.form-wrapper').hide();
        $('.result-wrapper').css('display','block');
      });
    }
  });

  /* Calculator reset */
  $('.reset').click(function() {
    const newLocal = 'input[type=text], select';
    $('.weight-form').find(newLocal).val('');   
    $('input[type=checkbox]').prop('checked',false);
    $('.form-wrapper').show();
    $('.result-wrapper').css('display','none');
    $('.result-weight').text('');

    var uri = window.location.toString();
    if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
    }
  });

  /* Bottom drawer */
  $(function() {
    var initHeight = $('.new-overlay-section').height();
    var drawerHeight;
    var drawerBool = false;
    var somth = false;

    $('.new-overlay-section').css('bottom', - initHeight);

    $( window ).resize(function() {
      if(drawerBool == true) {
        $('.new-overlay-section').css('bottom', '0');
      } else {
        drawerHeight = $('.new-overlay-section').height();
        $('.new-overlay-section').css('bottom', - drawerHeight);
      }
    });
    $('.new-overlay-toggle').click(function() {
      if(drawerBool == false) {
        $('.new-overlay-section').animate({ "bottom": "0" }, 500);
        $(this).addClass('is-open');
        drawerBool = true;
        somth = true;
      } else {
        drawerHeight = $('.new-overlay-section').height()
        $('.new-overlay-section').animate({ "bottom": - drawerHeight }, 500);
        $(this).removeClass('is-open');
        drawerBool = false;
        somth = true;

      }
      
    });
  });
  
   
  




});