/**
 * @author Anthony Dry
 */
$(function(){
	var SPECIFIC_DECK = '';
	var genreTags = [	
		["Acid","acid","Acid House","acid house","Acid-House","acid-house","303", "Trap", "trap", "Acid Techno","acid techno", "Acid-Techno", "acid-techno", "Acid Trance", "Acid-Trance", "acid trance"],
		["Chill Out", "chill out", "ChillOut", "Chillout", "chillout", "slow", "Ambient", "ambient"],
		["Deep House", "Deep-House", "DeepHouse","deep house", "deep-house", "Tech House", "TechHouse", "tech house", "tech-house", "techhouse","Deep", "deep"],
		["Drum & Bass", "drum & bass", "DnB","DNB","dnb", "Drum And Bass", "drum and bass", "Drum n Bass", "drum n bass"],
		["Dubstep", "dubstep", "Grime", "grime", "Complextro", "complextro", "Dubstep Eletronic", "dubstep electronic", "Brostep", "brostep", "Clownstep", "clownstep", "Gorestep", "gorestep", "Dubhop", "dubhop", "Deepstep", "deepstep"],
		["Electro House", "Electro-House", "Electrohouse", "electro house", "electro-house", "electrohouse", "dance", "Dance", "Electronic House", "electronic house"],
		["Electronica", "electronica", "Electronic", "electronic", "Chiptunes", "chiptunes", "EDM", "edm", "Electro", "electro"],
		["Funk", "funk", "Funk house", "funk house", "Funkhouse", "funkhouse", "Funkstep", "funkstep"],
		["Glitch Hop", "Glitch hop", "glitch hop", "Glitch", "glitch", "Mumbathon", "mumbathon", "Breakbeats", "breakbeats", "Breakcore", "breakcore"],
		["Hard Dance", "Hard dance", "hard dance", "harddance", "Harddance", "Hardcore", "hardcore", "Gabber", "gabber", "Hardstyle", "hardstyle"],
		["Hiphop", "Hip Hop", "hiphop","hip hop","Rap", "rap", "Gangsta Rap", "Gangsta rap", "gangsta rap", "Gangstarap", "gangstarap", "Gangsta", "gangsta", "Crunk", "crunk"],
		["House", "house"],
		["Pop", "pop", "Indie Pop", "Indie pop", "indie pop", "PopPunk", "Poppunk", "poppunk"],
		["Progressive House", "progressive house", "Prog House", "prog house"],
		["Psy Trance", "psy trance", "Psy-Trance", "psy-trance", "Psytrance", "psytrance"],
		["Punk", "punk", "Punkrock", "PunkRock", "punkrock", "Hardcore Punk", "hardcore punk", "HxC"],
		["Reggae", "reggae", "Dub", "dub", "Reggae Dub", "reggae dub"],
		["Rock", "rock", "Classic Rock", "classic rock", "Classicrock", "classicrock", "Metal", "metal"],
		["Techno", "techno"],
		["Trance", "trance"]
	];
	var theGenres = ["Acid", "Chill Out", "Deep House", "Drum and Bass", "Dubstep", "Electro House", "Electronica", "Funk", "Glitch Hop", "Hard Dance", "Hiphop", "House","Pop","Progressive House", "Psy Trance", "Punk", "Reggae","Rock", "Techno", "Trance"];
function setHandlers(){
	document.getElementById("clickNewTrack1").onclick = function(){ActivateSearch(true)};
	document.getElementById("clickNewTrack2").onclick = function(){ActivateSearch(false)};
	document.getElementById("CloseSearch").onclick = CloseSeach;
	document.getElementById("searchButton").onclick	= function(){$(function(){
		DoASeach($("#seachQuery").val());
	});}
		
}
function CloseSeach(){
	
	$('.seachContainer').animate({top: '600px'}, 500);
}

function ActivateSearch(track){
	$('.seachContainer').animate({top: '130px'}, 500);
	SPECIFIC_DECK = track;
}
function DoASeach(query){
	//DONT FORGET TO SPECIFY WHICH PLAYER SHOULD DO THE SEACH;
	var genreFilter = [];
	var genreArr = [];
	$(".genreTable button").each(function(){
		if($(this).hasClass('active')){
			genreFilter.push($(this)[0].innerHTML);
			
		}
	});
	var active = "";
	for(var i = 0; i < genreFilter.length; i++)
	{
		active = genreFilter[i];
		for(var j = 0; j < theGenres.length; j++)
		{
			if(theGenres[j] === active)
			{
				genreArr.push(genreTags[j].join(","));
			}	
		}
	}
	
		SC.get('/tracks',{q:query, genres: genreArr.join(",")}, function(track){
		 	
		 	$("#SearchResults").empty();	  
		  for(var obj in track) {
		  	
		  	var Node = document.createElement("div");
		  	var fix = document.createElement("div");
		  	var Artwork = document.createElement("img");
		  	var Artist = document.createElement("p");
		  	var Title = document.createElement("p");
		  	var ButtonG = document.createElement("div");
		  	var buttonA = document.createElement("button");
		  	var buttonB = document.createElement("button");
		  	Node.setAttribute("class", "seachObjectContainer");
		  	Node.setAttribute("style", "background:url('"+track[obj].waveform_url+"'); background-size: 500px 100px");
		  	
		  	if(track[obj].artwork_url == null)
		  	{
		  		Artwork.setAttribute("src", "http://www.montero.co.uk/wp-content/themes/montero/images/soundcloud_thumb.gif");
		  	}
		  	else
		  	{
		  		Artwork.setAttribute("src", track[obj].artwork_url);
		  	}
		  	$(Artist).html(track[obj].user.username);
		  	$(Title).html(track[obj].title);
		  	
		  	$(fix).append(Artwork);
   			$(fix).append(Artist);
   			$(fix).append(Title);
		  	if(track[obj].bpm != null)
		  	{
		  		var BPM = document.createElement("span");
		  		BPM.setAttribute("class", "objectBPM");
		  		$(BPM).html(track[obj].bpm);
		  		$(Node).append(BPM);
		  	}
		  	if(track[obj].genre != null)
		  	{
		  		var Genre = document.createElement("span");
		  		Genre.setAttribute("class", "objectGenre");
		  		$(Genre).html(track[obj].genre);
		  		$(fix).append(Genre);
		  	}
		  	ButtonG.setAttribute("style", "position:absolute; top:60px; left:105px;");
		  	ButtonG.setAttribute("class", "btn-group");
		  	buttonA.setAttribute("class", "btn btn-inverse");
		  	$(buttonA).html("Deck A");
		  	var this_obj = track[obj];
		  	buttonA.onclick = (function(this_obj) {return function() {
		  		return scopeProblem(true,this_obj);
		  	};})(this_obj);
		  	//function(){scopeProblem(true,track[obj])};
	
		  	buttonB.setAttribute("class", "btn btn-inverse");
		  	$(buttonB).html("Deck B");
		  	buttonB.onclick = (function(this_obj) {return function() {
		  		return scopeProblem(false,this_obj);
		  	};})(this_obj);
		  	$(ButtonG).append(buttonA);
		  	$(ButtonG).append(buttonB);
		  	$(fix).append(ButtonG);
		  	$(Node).append(fix);
   			$("#SearchResults").append(Node);
   		
		  }
		});
		
}

function scopeProblem(val, obj){
	if(val)
	{
		ForcePause(SourceDeckA.mediaElement);
	}
	else{
		ForcePause(SourceDeckB.mediaElement);
	}
	LoadASongSeach(val, obj);
	
}

	$( document ).ready(function() {
	    setHandlers();
	});

});