$(document).ready(function() {

    //Takes the name & habit of user and adds it to the list
    $(".add").click(function() {
        var userInput = $(".input").val();
        //prohibits user from submitting blank field
        if ($('.input').val('')) {
            alert("Oops! You forgot to add a habit! ex. Anna - bites nails");
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
                    console.log(response.data);
                }
            });
            $(".items").append('<p><button class="plus"><i class="fa fa-plus" aria-hidden="true"></i></button>&nbsp;<button class="minus"><i class="fa fa-minus" aria-hidden="true"></i></button>' + userInput + '<button class="trash"><i class="fa fa-trash" aria-hidden="true"></i></button></p>');
            $(".input").val('');
        }
    });


    //deletes the habit and buttons
    $('body').on('click', '.trash', function() {
        var id = $(this).data('id');
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

    });

    //plus button, will add to progress bar
    var progressCount = 0;

    $('body').on('click', '.plus', function() {

        progressCount += 5;
        if (progressCount <= 100) {
            $('.progress-bar').animate({
                width: progressCount + '%'
            });
        } else {
            progressCount = 100;
        }
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
    });

    //pressing coin subtracts from progress bar
    $('body').on('click', '.fiveCoin', function() {
        progressCount -= 5;
        if (progressCount >= 0) {
            $('.progress-bar').animate({
                width: progressCount + '%'
            });
        } else {
            progressCount = 0;
        }
    });

    //Gets habits posted on Habitica
    $.ajax({
        type: 'GET',
        beforeSend: function(request) {
            request.setRequestHeader("x-api-key", "3191fef4-baf6-41eb-862f-4c6b84cfc985");
            request.setRequestHeader('x-api-user', "70e37e61-a410-486d-856c-3eaa2ea3dcd1");
        },
        url: "https://habitica.com/api/v3/tasks/user",
        success: function(response) {
            // console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
                // console.log('habit', response.data[i]);
                if (response.data[i].type == "habit") {
                    $(".items").append('<p><button class="plus"><i class="fa fa-plus" aria-hidden="true"></i></button>&nbsp;<button class="minus"><i class="fa fa-minus" aria-hidden="true"></i></button>' + response.data[i].text + '<button class="trash" data-id="' + response.data[i]._id + '"><i class="fa fa-trash" aria-hidden="true"></i></button></p>');
                }
            }
        }
    });


});