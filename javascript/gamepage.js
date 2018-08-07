// $(".game .true").click(function(event){
// 	$(this).fadeIn(500,function(){
// 	$(this).css("background", "#2cd42c");
// });
// 	$(".game li .iconT").fadeIn(500,function(){
// 		$(".game li .iconT").css({
// 		opacity: "1.0",
// 		color: "white"
// 	});
// });
// 	event.stopPropagation();
// 	player1 ++;
// 	$(".jumbotron #score1").text(player1);
// });


// $(".game .false").click(function(event){
// 	$(this).fadeIn(500,function(){
// 	$(this).css("background", "#e22929");
// });
// 	$(".game li .iconF").fadeIn(500,function(){
// 		$(".game li .iconF").css({
// 		opacity: "1.0",
// 		color: "white"
// 	});
// });
// 	event.stopPropagation();
// });


    function goToNext(){
      return setTimeout(function(){
            window.location.reload(true);    
              }, 1000);
    };

$(".game ul").on("click", "li", function(){
	var word = $(this).children("span").html();
	var classOfi = $(this).children("i").attr("class");
	if (classOfi == "fas fa-check") {
		$(this).fadeIn(3000,function(){
		$(this).css("background", "#2cd42c");
	});
	
		$(this).fadeIn(3000,function(){
			$(this).css({
				color: "white",
			});
			$(this).children("i").css({
				color: "white",
				opacity: "1.0"
			});
		});
		
    	goToNext();
		
		// $.ajax({
  //              method: "POST",
  //              url: "/gamepage",
  //              data: { sign: "true" }
  //      });
	event.stopPropagation();
	
	} else {
		
		$(this).fadeIn(3000,function(){
		$(this).css("background", "#e22929");
	});	
		
		$(this).fadeIn(3000,function(){
			$(this).css({
				color: "white"
			});
			$(this).children("i").css({
				color: "white",
				opacity: "1.0"
			});
	});
	
			$.ajax({
                method: "POST",
                url: "/gamepage",
                data: { wrongWord: word}
        });
	
	
	goToNext();
	
		// $.ajax({
  //              method: "POST",
  //              url: "/gamepage",
  //              data: { sign: "true" }
  //      });
        
	event.stopPropagation();
		
	}
});