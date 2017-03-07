//Just some variables
var quoteURL = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?"
var tweetURL = "https://twitter.com/intent/tweet?text=";
var animationT = 500; //changes the animation time
var quoteMarginTop = 40; //changes the gap between each quote
var quotesArray = []; //this is where the quote objects will live
//this will set the margin to the determined size above
//I didn't use css because the animations depend on the margin size
$('.quotes > ul > li').css({"margin-top": quoteMarginTop+"px"}); 

//DOM objects to be referenced soon
var $q1 = $('#quote1');
var $q2 = $('#quote2');
var $q3 = $('#quote3');
var $q4 = $('#quote4');

//Constructor function for each quote
var Quote = function(quote, author){
	this.quote = quote;
	if(author) {
		this.author = author;
	} else {
		this.author = 'Anonymous'
	}
	this.tweet = quote + ' - ' + author;
	this.tweetEscaped = escape(this.tweet);
};

//this function will build a new quote object from the api
//It will call the animation after building the quote
function getQuote(){
	$.getJSON(quoteURL, function(json){
		var quo = json.quoteText;
		var aut = json.quoteAuthor;
		var newQuote = new Quote(quo, aut);
		quotesArray.unshift(newQuote); 

		animation();
	});
}

function animation(){
	
	var numOfQuotes;

	//When a new quote is requested, each of the quotes are first moved into the li below
	//This happens instantly and then the li elements are made to look like they didn't change
	//Each li takes the place of the li above it instantly and then animates down
	//..
	//This for loop builds the list each time the animation is called with the first four quotes
	for(i=0; (i<quotesArray.length) && (i<4); i++){
		var iNum = i+1;
		var quoteNumStr = iNum.toString();
		$("#quote"+ quoteNumStr +" > p").html(quotesArray[i]['quote']);
		$('#quote'+ quoteNumStr +' > .author').html('- '+quotesArray[i]['author']);
		$('#quote'+ quoteNumStr +' > .tweet-button > a').attr('href', tweetURL + quotesArray[i]['tweetEscaped']);

		//Build the tweet button
		if(quotesArray[i]['tweet'].length > 140){
			$('#quote'+ quoteNumStr).find('.tweet-p').html('To long to tweet, that\'s a lot of wisdom');
		} else{
			$('#quote'+ quoteNumStr).find('.tweet-p').html('Tweet it!');
		}

		numOfQuotes = i+1;
	}
	//The height of the first element is used to determine the animation movements
	var h1 = $q1.outerHeight() + quoteMarginTop;

	//List items are not displayed until it is needed 
	$q1.show().css('visibility', 'hidden').delay(animationT-300).queue(function(next){
		$(this).css('visibility', 'visible');
		next();
	}).fadeOut(0).fadeIn(400);
	//The following animations are only called if necessary
	if (numOfQuotes > 1){$q2.show().animate({bottom: +h1}, 0).animate({'bottom': '-='+h1}, animationT)}
	if (numOfQuotes > 2){$q3.show().animate({bottom: +h1}, 0).css({'opacity':'1'}).animate({bottom: '-='+h1, 'opacity': .5}, animationT);}
	if (numOfQuotes > 3){$q4.show().animate({bottom: +h1}, 0).css({'opacity':'.5'}).animate({bottom: '-='+h1, 'opacity': 0}, animationT)}

	//used for testing purposes, hope you don't mind
	console.log('happy');
};

//on document load, let's do this
$(function(){

	$('.tweet-button > a').hover(function(){
		$(this).find('.tweet-icon').toggleClass('tweet-icon-hover');
	});

	$('.quote-refresh').on('click', getQuote);
	getQuote();

});