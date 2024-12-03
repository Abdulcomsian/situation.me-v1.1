(function ($) {
    'use strict';
    $(document).ready(function () {
        // sticky Header 
        $(window).on("scroll", function () {
            var scrollPosition = $(this).scrollTop();

            if (scrollPosition > 250) {
                $(".st_header_section").addClass("st_header_sticky");
            } else {
                $(".st_header_section").removeClass("st_header_sticky");
            }
        })
        // Popup Nav 
        $('.menu_btn').on('click', function (e) {
            e.preventDefault();
            $('.popup_menubar_sec').toggleClass('active');
        });
        $('.popup_menubar_overlay, #popup_nav_Closer').on('click', function () {
            $('.popup_menubar_sec').removeClass('active');
            $("body").removeClass("menu__open");
        });

        // Wow Js
        new WOW({
            animateClass: 'animate__animated'
        }).init();


        // Scroll to Top 
        let scroll_top = document.getElementById("scroll_top");
        if (scroll_top) {
            window.onscroll = function () {
                if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                    scroll_top.style.display = "block";
                    scroll_top.style.transform = "scale(1)";
                } else {
                    scroll_top.style.display = "none";
                }
            };
            scroll_top.addEventListener('click', function () {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            });
        }

        // Contact Form Submission
        $('#contact_form').on('submit', function (e) {
            e.preventDefault();
            var $this = $(this);

            $('button[type="submit"]', this).attr('disabled', 'disabled').val('Processing...');
            var form_data = $this.serialize();
            var required = 0;
            $(".required", this).each(function () {
                if ($(this).val() === '') {
                    $(this).addClass('reqError');
                    required += 1;
                } else {
                    if ($(this).hasClass('reqError')) {
                        $(this).removeClass('reqError');
                        if (required > 0) {
                            required -= 1;
                        }
                    }
                }
            });
            if (required === 0) {
                $.ajax({
                    type: 'POST',
                    url: 'ajax/mail.php',
                    data: {
                        form_data: form_data
                    },
                    success: function (data) {
                        $('button[type="submit"]', $this).removeAttr('disabled').val('Message');

                        $('.con_message', $this).fadeIn().html('<strong>Congratulations!</strong> Your Question has been submitted.').removeClass('alert-warning').addClass('alert-success');
                        setTimeout(function () {
                            $('.con_message', $this).fadeOut().html('').removeClass('alert-success alert-warning');
                        }, 5000);
                    }
                });
            } else {
                $('button[type="submit"]', $this).removeAttr('disabled').val('Message');
                $('.con_message', $this).fadeIn().html('<strong>Opps!</strong> Errpr found. Please fix those and re submit.').removeClass('alert-success').addClass('alert-warning');
                setTimeout(function () {
                    $('.con_message', $this).fadeOut().html('').removeClass('alert-success alert-warning');
                }, 5000);
            }
        });
        $(".required").on('keyup', function () {
            $(this).removeClass('reqError');
        });


        $('.input_field input, .input_field textarea').val("");
        $('.input_field input, .input_field textarea').focusout(function () {
            var text_val = $(this).val();
            if (text_val === "") {
                console.log("empty!");
                $(this).removeClass('has-value');
            } else {
                $(this).addClass('has-value');
            }
        });

    });



    $('.scroll').on('click', function () {



        // Get the target section ID from the link's href
        var target = $(this.hash);

        // Scroll to the target section smoothly
        $('html, body').animate({
            scrollTop: $(target).offset().top - 100
        }, 800);
    });

    if (window.location.hash) {
        // Scroll to the target section smoothly after the page has loaded
        $('html, body').animate({
            scrollTop: $(window.location.hash).offset().top - 100
        }, 800);
    }





    // Text area remaining character
    $(function () {
        $('#step_message').keyup(function () {
            var character_count = $(this).val().length,
                current = $('#current'),
                maximum = $('#maximum_limit'),
                the_count = $('#the_count');

            current.text(character_count);


            /*----- change color based on count -----*/
            if (character_count >= 400) {
                maximum.css('color', '#8f0001');
                current.css('color', '#8f0001');
                the_count.css('font-weight', 'bold');
            } else {
                maximum.css('color', '#444');
                the_count.css('font-weight', 'normal');
            }
        });
    });

    // Steps Acordion
    $(".accordion__title input[type='checkbox']").click(function (event) {
        event.stopPropagation();
    });
    $(".accordion__title").click(function (event) {
        if ($(event.target).is('input[type="checkbox"]')) {
            return;
        }

        const $accordion_wrapper = $(this).closest(".accordion_item");
        const $accordion_content = $accordion_wrapper.find(".accordion__content").first();
        const $accordion_open = "accordion--open";
        const $accordion_title = $(this); // The clicked title

        $accordion_content.stop(true, true);

        // $accordion_wrapper.siblings(".accordion_item").each(function () {
        //     $(this).removeClass($accordion_open);
        //     $(this).find(".accordion__title").removeClass("show");
        //     $(this).find(".accordion__content").stop(true, true).slideUp();
        // });

        if ($accordion_wrapper.hasClass($accordion_open)) {
            $accordion_content.slideUp();
            $accordion_wrapper.removeClass($accordion_open);
            $accordion_title.removeClass("show");
        } else {
            $accordion_content.slideDown();
            $accordion_wrapper.addClass($accordion_open);
            $accordion_title.addClass("show");
        }
    });


    // Step Form 
    const prevBtns = document.querySelectorAll(".btn_prev");
    const nextBtns = document.querySelectorAll(".btn_next");
    const progress = document.getElementById("progress");
    const formSteps = document.querySelectorAll(".form_step");
    const progressSteps = document.querySelectorAll(".progress_step");

    let formStepsNum = 0;

    nextBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            formStepsNum++;
            updateFormSteps();
            updateProgressbar();
        });
    });

    prevBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            formStepsNum--;
            updateFormSteps();
            updateProgressbar();
        });
    });

    function updateFormSteps() {
        formSteps.forEach((formStep) => {
            formStep.classList.contains("form_step_active") &&
                formStep.classList.remove("form_step_active");
        });

        formSteps[formStepsNum].classList.add("form_step_active");
    }

    function updateProgressbar() {
        progressSteps.forEach((progressStep, idx) => {
            if (idx < formStepsNum) {
                progressStep.classList.add("progress_step_active", "checked");
            } else if (idx === formStepsNum) {
                progressStep.classList.add("progress_step_active");
                progressStep.classList.remove("checked");
            } else {
                progressStep.classList.remove("progress_step_active", "checked");
            }
        });

        // Calculate progress width based on active steps
        const progressActive = document.querySelectorAll(".progress_step_active");
        progress.style.width = ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
    }



    // Form Data Store in sheet 
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzAwd7trKb6dA2jgOpMRJ5q143-8Q9yowST9qWoDCwlIuWQudeTnzr8hqKX7GslsgFc/exec'

    document.addEventListener("DOMContentLoaded", () => {
        const form = document.forms['situations-step-form'];

        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                fetch(scriptURL, {
                        method: 'POST',
                        body: new FormData(form)
                    })
                    .then(response => {
                        $(".subscribe_field").append("<span class='st_submit_form_alert'>Thanks. The form has been submitted</span>");
                        setTimeout(() => {
                            $(".subscribe_field .st_submit_form_alert").hide();
                        }, 3500);
                    })
                    .catch(error => console.error('Error!', error.message));
            });
        }
    });









})(jQuery);