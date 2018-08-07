// $.ajax({
//   method: "POST",
//   url: "/wordlist",
//   data: { name: "John", location: "Boston" }
// })
//   .done(function( msg ) {
//     alert( "Data Saved: " + msg );
//   });
var EnglishWord = $(".result h1 #word").html();

$(".result h1 i").click(function(){
    if ($(this).attr("class") == "far fa-star") {
        $(this).attr("class", "fas fa-star");
        $(this).children("span").html("click to remove from wordlist");
        
        $.ajax({
                method: "POST",
                url: "/wordlist",
                data: { name: EnglishWord, sign: "true" }
                });
        } else {
            $(this).attr("class", "far fa-star");
            $(this).children("span").html("click to add to wordlist");
            
            $.ajax({
                method: "POST",
                url: "/wordlist",
                data: { name: EnglishWord, sign: "false" }
                });
        }
    });


$("#scrollit").on("click", ".fa-thumbs-up", function(){
    var numberOfLikes = Number($(this).next().html());
    var numberOfDislikes = Number($(this).next().next().next().html());
    numberOfLikes = numberOfLikes + 1;
    $(this).next().html(numberOfLikes);
    var ID = $(this).next().next().next().next().html();
    // var Text = $(this).next().next().next().next().next().html();
    console.log("OK");
    
    $.ajax({
        method: "POST",
        url: "/searchresult/comments/likes",
        data: {id: ID, likes: numberOfLikes, dislikes: numberOfDislikes}
    });
});

$("#scrollit").on("click", ".fa-thumbs-down", function(){
    var numberOfLikes = Number($(this).prev().html());
    var numberOfDislikes = Number($(this).next().html());
    numberOfDislikes = numberOfDislikes + 1;
    $(this).next().html(numberOfDislikes);
    var ID = $(this).next().next().html();
    // var Text = $(this).next().next().next().html();
    console.log("OK");
    
    $.ajax({
        method: "POST",
        url: "/searchresult/comments/dislikes",
        data: {id: ID, likes: numberOfLikes, dislikes: numberOfDislikes}
    });

});