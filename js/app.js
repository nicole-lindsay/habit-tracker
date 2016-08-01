$(document).ready(function(){

	//Takes the name & habit of user and adds it to the list
	$(".add").click(function(){
		var userInput = $(".input").val();
		$(".items").append('<p><button type="submit" class="add"><i class="fa fa-plus" aria-hidden="true"></i></button><button class="minus"><i class="fa fa-minus" aria-hidden="true"></i></button>' + userInput + '<button class="trash"><i class="fa fa-trash" aria-hidden="true"></i></button></p>');
		$(".input").val('');
	});

	//Once it works, it will delete the habit and buttons
	$('.trash').click(function(){
		$(this).parent().remove();
	});
});