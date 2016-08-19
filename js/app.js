$(document).ready(function() {

    $("#login").fadeIn(1000);

    $(".enter").click(function(e) {
        e.preventDefault();
        var userName = $("input[name='username']").val();
        if (userName == '') {
            alert("Please enter your username!");
        } else {
            localStorage.setItem("userName", userName);
            $("#login").fadeOut(1000);
            $('#avatar').attr('src', 'https://robohash.org/' + localStorage.getItem("userName") + '.png')
        }
    });



    //Takes the name & habit of user and adds it to the list
    $(".add").click(function() {
        var userInput = localStorage.getItem("userName") + " - " + $(".input").val();
        //prohibits user from submitting blank field
        if ($('.input').val() == '') {
            alert("Oops! You forgot to add a habit!");
        } else {
            $.ajax({
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("x-api-key", "3191fef4-baf6-41eb-862f-4c6b84cfc985");
                    request.setRequestHeader('x-api-user', "70e37e61-a410-486d-856c-3eaa2ea3dcd1");
                },
                data: {
                    text: userInput,
                    type: 'habit'
                },
                url: "https://habitica.com/api/v3/tasks/user",
                success: function(response) {
                    if (response.data.type == "habit") {
                        $(".items").append('<p><button class="plus"><i class="fa fa-plus" aria-hidden="true"></i></button>&nbsp;<button class="minus"><i class="fa fa-minus" aria-hidden="true"></i></button>' + response.data.text + '<button class="trash" data-id="' + response.data._id + '"><i class="fa fa-trash" aria-hidden="true"></i></button></p>');
                    }
                    $(".input").val('');
                }
            });
        }
    });

    //deletes the habit and buttons
    $('body').on('click', '.trash', function() {
        var id = $(this).data('id');
        if (id !== undefined) {
            $(this).parent().remove();
            $.ajax({
                type: 'DELETE',
                beforeSend: function(request) {
                    request.setRequestHeader("x-api-key", "3191fef4-baf6-41eb-862f-4c6b84cfc985");
                    request.setRequestHeader('x-api-user', "70e37e61-a410-486d-856c-3eaa2ea3dcd1");
                },
                url: "https://habitica.com/api/v3/tasks/" + id,
                success: function(response) {
                    console.log(response.data);
                }
            })
        }

    });

    //plus button, will add to progress bar
    var progressCount;
    if (localStorage.getItem("progressCount") > 0) {
        $('.progress-bar').animate({
            width: localStorage.getItem("progressCount") + '%'
        });
        progressCount = localStorage.getItem("progressCount")

    } else {
        progressCount = 0;
    }

    $('body').on('click', '.plus', function() {

        progressCount += 5;
        if (progressCount <= 100) {
            $('.progress-bar').animate({
                width: progressCount + '%'
            });
        } else {
            progressCount = 100;
        }

        localStorage.setItem("progressCount", progressCount);
    });

    //minus button will subtract from progress bar
    $('body').on('click', '.minus', function() {

        progressCount -= 5;
        if (progressCount >= 0) {
            $('.progress-bar').animate({
                width: progressCount + '%'
            });
        } else {
            progressCount = 0;
        }

        localStorage.setItem("progressCount", progressCount);
    });


    //Gets habits posted on Habitica, appends to HABITracker
    $.ajax({
        type: 'GET',
        beforeSend: function(request) {
            request.setRequestHeader("x-api-key", "3191fef4-baf6-41eb-862f-4c6b84cfc985");
            request.setRequestHeader('x-api-user', "70e37e61-a410-486d-856c-3eaa2ea3dcd1");
        },
        url: "https://habitica.com/api/v3/tasks/user",
        success: function(response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].type == "habit") {
                    $(".items").append('<p><button class="plus"><i class="fa fa-plus" aria-hidden="true"></i></button>&nbsp;<button class="minus"><i class="fa fa-minus" aria-hidden="true"></i></button>' + response.data[i].text + '<button class="trash" data-id="' + response.data[i]._id + '"><i class="fa fa-trash" aria-hidden="true"></i></button></p>');
                }
            }
        }
    });

    //Gets rewards posted on Habitica
    $.ajax({
        type: 'GET',
        beforeSend: function(request) {
            request.setRequestHeader("x-api-key", "3191fef4-baf6-41eb-862f-4c6b84cfc985");
            request.setRequestHeader('x-api-user', "70e37e61-a410-486d-856c-3eaa2ea3dcd1");
        },
        url: "https://habitica.com/api/v3/tasks/user",
        success: function(response) {
            var rewards = [];
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].type == "reward") {
                    rewards.push(response.data[i]);
                }
            }
            rewards = _.sortBy(rewards, "value");
            for (var i = 0; i < rewards.length; i++) {
                var dataVal = rewards[i].value;
                $("#rewards").append('<p><button class="rewardCategory"><span class="rewardsVal">' +
                    dataVal + '</span><img src="http://i.imgur.com/T4BNxw7.jpg"></button>' +
                    rewards[i].text + '</p>');
            }
        }
    });


    $('body').on('click', '.rewardCategory', function() {
        var value = parseInt($(this).find('.rewardsVal').text());
        progressCount -= value;
        if (progressCount >= 0) {
            $('.progress-bar').animate({
                width: progressCount + '%'
            });
        } else {
            progressCount = 0;
        }
        localStorage.setItem("progressCount", progressCount);
    });


    // $(window).load(function() {
    //     console.log('running');
    //     $("#joyRideTipContent").joyride({
    //         postStepCallback: function(index, tip) {
    //             if (index == 2) {
    //                 $(this).joyride('set_li', false, 1);
    //             }
    //         },
    //         modal: true,
    //         expose: true
    //     });
    // });

});