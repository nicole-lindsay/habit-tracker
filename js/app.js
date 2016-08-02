$(document).ready(function() {

    //Takes the name & habit of user and adds it to the list
    $(".add").click(function() {
        var userInput = $(".input").val();
        $(".items").append('<p><button type="submit" class="add"><i class="fa fa-plus" aria-hidden="true"></i></button>&nbsp;<button class="minus"><i class="fa fa-minus" aria-hidden="true"></i></button>' + userInput + '<button class="trash"><i class="fa fa-trash" aria-hidden="true"></i></button></p>');
        $(".input").val('');
    });


    //deletes the habit and buttons
    $('body').on('click', '.trash', function() {
        $(this).parent().remove();
    });

    //plus button functionality, will add to progress bar
});

//Progress bar, if it starts at 0 and the plus button being pressed builds up funds to spend on rewards, great way to reinforce good habits
//However, if the minus button is pressed, can't very well go into negative funds...does it stay at 0 until the plus button is pressed again?