$(".parseresult ul").on("click", "a", function(event){
	var EnglishWord = $(this).parent().children("#word").html();
	
	$.ajax({
                method: "POST",
                url: "/searchresult",
                data: { English: EnglishWord}
                });
});