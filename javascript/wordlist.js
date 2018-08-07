// $(".wordlist ul").on("click", "li", function(){
// 	if ($(this).css("color") === "rgb(128, 128, 128)"){
// 		$(this).css({
// 			color: "rgb(102, 102, 102)",
// 			textDecoration: "none"
// 		});
// 		}
// 	else{
// 		$(this).css({
// 			color: "rgb(128, 128, 128)",
// 			textDecoration: "line-through"
// 		});
// 	}
// 	event.stopPropagation();
// 	});


$(".wordlist ul").on("click", "a", function(event){
	var EnglishWord = $(this).parent().children("#word").html();
	
	$.ajax({
                method: "POST",
                url: "/searchresult",
                data: { English: EnglishWord}
                });
});


$(".wordlist ul").on("click", "#trash", function(event){
	$(this).parent().fadeOut(500,function(){
		var EnglishWord = $(this).children("#word").html();
		
		$(this).remove();
		
		$.ajax({
                method: "POST",
                url: "/wordlist",
                data: { name: EnglishWord, sign: "false" }
                });
	});
	event.stopPropagation();
});


$('.wordlist input[type="text"]').keypress(function(event){
	if (event.which === 13) {
		var word = $(this).val();
		$(this).val("");

		$(".wordlist ul").append("<li><span id='trash'><i class='fas fa-trash-alt'></i></span> " + "<span id='word'>" + word +"</span>" 
		+ '<a href="/searchresult"><span id="search" class="glyphicon glyphicon-search" aria-hidden="true"></span></a>' + "</li>");
		
		$.ajax({
                method: "POST",
                url: "/wordlist",
                data: { name: word, sign: "true" }
                });
	}
});


$(".fa-pencil-alt").click(function(){
	$('input[type="text"]').fadeToggle()
});


// $(".container h4 button").click(function(){
// 	$.ajax({
//                 method: "POST",
//                 url: "/gamepage/restart",
//                 });
// });

