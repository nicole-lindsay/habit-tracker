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


    // //Meant to append rewards from Habitica and post to HABITracker
    // $.ajax({
    //     type: 'POST',
    //     beforeSend: function(request) {
    //         request.setRequestHeader("x-api-key", "3191fef4-baf6-41eb-862f-4c6b84cfc985");
    //         request.setRequestHeader('x-api-user', "70e37e61-a410-486d-856c-3eaa2ea3dcd1");
    //     },
    //     data: {
    //         type: 'reward'
    //     },
    //     url: "https://habitica.com/api/v3/tasks/user",
    //     success: function(response) {
    //         if (response.data.type == "rewards") {
    //             $("#rewards").append('<p><button class="rewardCategory"><span id="rewardsVal">' + response.data.value +'</span><img src="http://i.imgur.com/T4BNxw7.jpg"></button>' + response.data.text + '</p>')
    //         }
    //     }
    // });




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
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].type == "reward") {
                	console.log('reward', response.data[i], response.data[i]);
                    $("#rewards").append('<p><button class="rewardCategory"><span class="rewardsVal">'+ 
                    	response.data[i].value +'</span><img src="http://i.imgur.com/T4BNxw7.jpg"></button>'+ 
                    	response.data[i].text +'</p>');
                }
            }
        }
    });


    // event listener?
    $('body').on('click', '.rewardCategory', function(){
    	// $(this)
    	// console.log($(this).find('.rewardsVal').text()); // .find()
    	// reduce the bar by the value of the reward
    	var value = parseInt($(this).find('.rewardsVal').text());
    	progressCount -= value;
        if (progressCount >= 0) {
            $('.progress-bar').animate({
                width: progressCount + '%'
            });
        } else {
            progressCount = 0;
        }
    })


});

//Options for instructions
//At login screen<--easiest option...
//tool-tips :(
//jquery tool plugin<--fav option so far