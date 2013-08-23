/**
 * @author Anthony Dry
 */
		var Delay = ["",""];
		var Chorus = ["",""];
		var Phaser = ["",""];
		var LoFi = ["",""];
		var Reverb = ["",""];
		var EqTrackA = ["","",""];
		var EqTrackB = ["","",""];
		var MediaObjectAreRunnig = [false,false];
		var SourceDeckA;
		var SourceDeckB
		var context;
		var tuna;
	function initialize()
	{
		if (typeof AudioContext !== "undefined") {
		    context = new AudioContext();
		    tuna = new Tuna(context);
		} else if (typeof webkitAudioContext !== "undefined") {
		    context = new webkitAudioContext();
		    tuna = new Tuna(context);
		} else {
		    throw new Error('AudioContext not supported. :(');
		}
		
		$('.effect1dropdown li').on('click', function() {
			if($(this).find('a').html() == "Advanced")
			{
				OpenAdvancedSetup(true);
			}
			else
			{
		    	$('#Fx1').html($(this).find('a').html());
		    }
		});
		    
		$('.effect2dropdown li').on('click', function() {
			if($(this).find('a').html() == "Advanced")
			{
				OpenAdvancedSetup(false);
			}
			else
			{
    			$('#Fx2').html($(this).find('a').html());
    		}
    	});
		document.getElementById("CloseAdvancedFx").onclick = CloseAdvancedFx;
		document.getElementById("Fx1").onclick = function(){
					
					
					if(!$("#Fx1").hasClass('active'))
					{
						$("#Fx1Select").addClass("disabled");
						AddEffect(true, $("#Fx1").html());
						//AddEffect(true, );
					}
					else
					{
						$("#Fx1Select").removeClass("disabled");
						RemoveEffect(true, $("#Fx1").html());
						//RemoveEffect(true, $("#Fx1").innerHTML);
					}
		}
		
		document.getElementById("Fx2").onclick = function(){
					
					
					if(!$("#Fx2").hasClass('active'))
					{
						$("#Fx2Select").addClass("disabled");
						AddEffect(false, $("#Fx2").html());
						//AddEffect(true, $("#Fx1").innerHTML);
					}
					else
					{
						$("#Fx2Select").removeClass("disabled");
						RemoveEffect(false, $("#Fx2").html());
						//RemoveEffect(true, $("#Fx1").innerHTML);
					}
		}
		
		document.getElementById("PlayTrack1").onclick = function(){
					PressedPlay(true,SourceDeckA.mediaElement);
		}
		document.getElementById("PlayTrack2").onclick = function(){
					PressedPlay(false,SourceDeckB.mediaElement);	
		}
				
		document.getElementById("StopTrack1").onclick = function(){
					PressedStop(SourceDeckA.mediaElement);
		}
		document.getElementById("StopTrack2").onclick = function(){
					PressedStop(SourceDeckB.mediaElement);
		}
		document.getElementById("customLinkButton").onclick	= function(){
			$(function(){
		
				var active = null;
				$(".customLinkDeck button").each(function(){
					if($(this).hasClass('active')){
						active = ($(this)[0].innerHTML);
						
					}
				});
				
				if(active === "Deck A")
				{
					ForcePause(SourceDeckA.mediaElement);
					LoadASong(true,$("#customLinkText").val());
				}
				else if(active === "Deck B")
				{
					ForcePause(SourceDeckB.mediaElement);
					LoadASong(false,$("#customLinkText").val());	
				}
				else{
					//DO SOMETHING;
				}
				CloseSeach();
			});
		}
	SetupFX();
	SetupEq();
	$(function() {
		$( "#sliderA" ).draggable({
			axis: "y", 
			containment: "parent",
			drag:function(event, ui){
				var currentPosition = ui.position.top;
				var currentPosition = 180 - currentPosition;
	    		normVal = currentPosition/180;
	    		
	    		VOLYM_REFERENCE_TRACK_A = normVal;
	    		
	    		SetupVolume(true);
		   	},
		});
				    		
		$( "#sliderB" ).draggable({
			axis: "y", 
			containment: "parent",
		 	drag:function(event, ui){
		 		var currentPosition = ui.position.top;
		 		var currentPosition = 180 - currentPosition;
		  		normVal = currentPosition/180;
		   		VOLYM_REFERENCE_TRACK_B = normVal;
		
		   		
		   		SetupVolume(false);   			
			},
	 	});
		$( "#sliderC" ).draggable({
		 	axis: "x", 
	    	containment: "parent",
	    	drag:function(event, ui){
	    		/*var currentPositionDeckB = ui.position.left;
	    		var currentPositionDeckA = 235 - ui.position.left;	    			
			   	var normValA = currentPositionDeckA/235;
		 		var normValB = currentPositionDeckB/235;  			
			    //SourceDeckA.mediaElement.volume = Math.cos(normValB * 0.5*Math.PI);
				//SourceDeckB.mediaElement.volume = Math.cos(normValA * 0.5*Math.PI);
				*/
				SetupVolume(true);	
			},
	   	});	
	  });	
	}
	function SetupAudio(val, sound){

		if(val)
		{
			SourceDeckA = context.createMediaElementSource(sound);
			
			SourceDeckA.connect(EqTrackA[0].input);
			EqTrackA[0].connect(context.destination);
			EqTrackA[0].connect(EqTrackA[1].input);
			EqTrackA[1].connect(context.destination);
			EqTrackA[1].connect(EqTrackA[2].input);
			
			EqTrackA[2].connect(Delay[0].input);
			//Delay[0].connect(context.destination);
			Delay[0].connect(LoFi[0].input);
			//LoFi[0].connect(context.destination);
			LoFi[0].connect(Chorus[0].input);
			//Chorus[0].connect(context.destination);
			Chorus[0].connect(Phaser[0].input);
			//Phaser[0].connect(context.destination);	
			Phaser[0].connect(Reverb[0].input);
			//Reverb[0].connect(context.destination);
			
			Reverb[0].connect(context.destination);
		}
		if(!val)
		{
			SourceDeckB = context.createMediaElementSource(sound);
			SourceDeckB.connect(EqTrackB[0].input);
			EqTrackB[0].connect(context.destination);
			EqTrackB[0].connect(EqTrackB[1].input);
			EqTrackB[1].connect(context.destination);
			EqTrackB[1].connect(EqTrackB[2].input);
			
			EqTrackB[2].connect(Delay[1].input);
			//Delay[1].connect(context.destination);
			Delay[1].connect(LoFi[1].input);
			//LoFi[1].connect(context.destination);
			LoFi[1].connect(Chorus[1].input);
			//Chorus[1].connect(context.destination);
			Chorus[1].connect(Phaser[1].input);
			//Phaser[1].connect(context.destination);
			Phaser[1].connect(Reverb[1].input);
			//Reverb[1].connect(context.destination);
			
			Reverb[1].connect(context.destination);
		SetupVolume(val);	
	}	
	function AddEffect(val, type){
		var i;
		if(val == true){
			i = 0;
		}
		else{
			i = 1
		}
		switch(type)
		{
			case "Phaser":
				
				Phaser[i].bypass = 0;
				break;
			case "Delay":
			
				Delay[i].bypass = 0;
				break;
			case "LoFi":
			
				LoFi[i].bypass = 0;
				break;
			case "Chorus":
			
				Chorus[i].bypass = 0;
				break;
			case "Reverb":
				Reverb[i].bypass = 0;
				break;
		}	
	}
	function RemoveEffect(val, type){
		var i;
		if(val == true){
			i = 0;
		}
		else{
			i = 1
		}
		switch(type)
		{
			case "Phaser":
				Phaser[i].bypass = 1;
				break;
			case "Delay":
				Delay[i].bypass = 1;
				break;
			case "LoFi":
				LoFi[i].bypass = 1;
				break;
			case "Chorus":
				Chorus[i].bypass = 1;
				break;
			case "Reverb":
				Reverb[i].bypass = 1;
				break;
		}	
	}
	function CloseSeach(){
	
		$('.seachContainer').animate({top: '600px'}, 500);
	}
	function SetupFX(){
		Chorus[0] = new tuna.Chorus({
                 rate: 0.5,
                 feedback: 0.8,
                 delay: 0.0145,
                 bypass: 1
        });
       Chorus[1] = new tuna.Chorus({
                 rate: 1.5,
                 feedback: 0.8,
                 delay: 0.0145,
                 bypass: 1
        });
        Delay[0] = new tuna.Delay({
                feedback: 0.75,    //0 to 1+
                delayTime: 500,    //how many milliseconds should the wet signal be delayed? 
                wetLevel: 0.95,    //0 to 1+
                dryLevel: 1,       //0 to 1+
                cutoff: 5000,        //cutoff frequency of the built in highpass-filter. 20 to 22050
                bypass: 1
        });
        Delay[1] = new tuna.Delay({
                feedback: 0.75,    //0 to 1+
                delayTime: 500,    //how many milliseconds should the wet signal be delayed? 
                wetLevel: 0.95,    //0 to 1+
                dryLevel: 1,       //0 to 1+
                cutoff: 5000,        //cutoff frequency of the built in highpass-filter. 20 to 22050
                bypass: 1
        });
        Phaser[0] = new tuna.Phaser({
                 rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
                 depth: 0.8,                    //0 to 1
                 feedback: 0.9,                 //0 to 1+
                 stereoPhase: 180,               //0 to 180
                 baseModulationFrequency: 700,  //500 to 1500
                 bypass: 1
        });
        Phaser[1] = new tuna.Phaser({
                 rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
                 depth: 0.8,                    //0 to 1
                 feedback: 0.9,                 //0 to 1+
                 stereoPhase: 180,               //0 to 180
                 baseModulationFrequency: 700,  //500 to 1500
                 bypass: 1
        });
        LoFi[0] = new tuna.Overdrive({
                    outputGain: 1,         //0 to 1+
                    drive: 0.8,              //0 to 1
                    curveAmount: 1,          //0 to 1
                    algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
                    bypass: 1
        });
        LoFi[1] = new tuna.Overdrive({
                    outputGain: 1,         //0 to 1+
                    drive: 0.8,              //0 to 1
                    curveAmount: 1,          //0 to 1
                    algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
                    bypass: 1
        });
        
        Reverb[0] = new tuna.Convolver({
                    highCut: 22050,                         //20 to 22050
                    lowCut: 200,                             //20 to 22050
                    dryLevel: 0.3,                            //0 to 1+
                    wetLevel: 2,                            //0 to 1+
                    level: 1,                               //0 to 1+, adjusts total output of both wet and dry
                    impulse: "impulses/impulse_rev.wav",    //the path to your impulse response
                    bypass: 1
       });
       Reverb[1] = new tuna.Convolver({
                    highCut: 22050,                         //20 to 22050
                    lowCut: 200,                             //20 to 22050
                    dryLevel: 0.3,                            //0 to 1+
                    wetLevel: 2,                            //0 to 1+
                    level: 1,                               //0 to 1+, adjusts total output of both wet and dry
                    impulse: "impulses/impulse_rev.wav",    //the path to your impulse response
                    bypass: 1
       });
         
	}
	function SetupEq(){
		//LOW EQ
		EqTrackA[0] = new tuna.Filter({
		                 frequency: 80,         //20 to 22050
		                 Q: 100,                  //0.001 to 100
		                 gain: 0,               //-40 to 40
		                             //0 to 1+
		                 filterType: 3,         //0 to 7, corresponds to the filter types in the native filter node: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass in that order
		                 bypass: 0
		             });
		EqTrackB[0] = new tuna.Filter({
		                 frequency: 80,         //20 to 22050
		                 Q: 1,                  //0.001 to 100
		                 gain: 0,               //-40 to 40
		                            //0 to 1+
		                 filterType: 3,         //0 to 7, corresponds to the filter types in the native filter node: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass in that order
		                 bypass: 0
		             });
		//MID EQ
		EqTrackA[1] = new tuna.Filter({
		                 frequency: 1000,         //20 to 22050
		                 Q: 20,                  //0.001 to 100
		                 gain: 0,               //-40 to 40
		                             //0 to 1+
		                 filterType: 5,         //0 to 7, corresponds to the filter types in the native filter node: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass in that order
		                 bypass: 0
		             });
		EqTrackB[1] = new tuna.Filter({
		                 frequency: 1000,         //20 to 22050
		                 Q: 20,                  //0.001 to 100
		                 gain: 0,               //-40 to 40
		                 bypass: 1,             //0 to 1+
		                 filterType: 5,         //0 to 7, corresponds to the filter types in the native filter node: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass in that order
		                 bypass: 0
		             });
		//HIGH EQ
		EqTrackA[2] = new tuna.Filter({
		                 frequency: 8000,         //20 to 22050
		                 Q: 1,                  //0.001 to 100
		                 gain: 0,               //-40 to 40
		                              //0 to 1+
		                 filterType: 4,         //0 to 7, corresponds to the filter types in the native filter node: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass in that order
		                 bypass: 0
		             });
		EqTrackB[2] = new tuna.Filter({
		                 frequency: 8000,         //20 to 22050
		                 Q: 1,                  //0.001 to 100
		                 gain: 0,               //-40 to 40
		                              //0 to 1+
		                 filterType: 4,         //0 to 7, corresponds to the filter types in the native filter node: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass in that order
		                 bypass: 0
		             });
	}
	function ForcePause(soundElement)
	{
		soundElement.pause();
		soundElement.playState = 0;
	}
	function PressedStop(soundElement){
		soundElement.pause();
		soundElement.currentTime = 0;
	}
	function PressedPlay(icon,soundElement)
	{
		var theIcon = '';
				
		if(soundElement.paused === true)
		{
			soundElement.play();	
		}
		else
		{
			soundElement.pause();			
		}
		if(icon){
			theIcon = document.getElementById("PlayTrack1");
			Startjock("A", soundElement);
		}
		else{
			theIcon = document.getElementById("PlayTrack2");
			Startjock("B", soundElement)
		}
				
		if(theIcon.innerHTML === '<i class="icon-play"></i>')
		{
			theIcon.innerHTML = '<i class="icon-pause"></i>';		
		}
		else{
			theIcon.innerHTML = '<i class="icon-play"></i>';	
		}
	}
	
	//THESE NEEDS TO GET SEPEATED SOME HOW DAMN!
	
	function AddToAudioBuff(player,url,volume)
	{
		
		if(player)
		{
			//console.log(SourceDeckA.activeSourceCounts);
			if(THE_SONG_OBJECT_OF_TRACKA)
			{
				
				THE_SONG_OBJECT_OF_TRACKA.remove();
			}
			if(SourceDeckA)
			{
				
				SourceDeckA.disconnect();
				//console.log(SourceDeckA.activeSourceCounts);
				Delay[0].disconnect();
				Phaser[0].disconnect();
				Chorus[0].disconnect();
				LoFi[0].disconnect();
				EqTrackA[0].disconnect();
				EqTrackA[1].disconnect();
				EqTrackA[2].disconnect();
				THE_SONG_OBJECT_OF_TRACKA = new Audio();
				THE_SONG_OBJECT_OF_TRACKA.src = url;
				Reverb[0].disconnect();
				THE_SONG_OBJECT_OF_TRACKA.addEventListener("canplaythrough", function()
				{
					SetupAudio(true, THE_SONG_OBJECT_OF_TRACKA);
					DURATION_TRACKA = THE_SONG_OBJECT_OF_TRACKA.duration;
				});
				THE_SONG_OBJECT_OF_TRACKA.addEventListener("timeupdate", function()
				  {
				  	var elapsedTime = THE_SONG_OBJECT_OF_TRACKA.duration;
				  		if(THE_SONG_OBJECT_OF_TRACKA.duration === NaN)
				  		{
				  			
				  		}
				  		else
				  		{
				  			var elapsedTime = THE_SONG_OBJECT_OF_TRACKA.currentTime;
				  			var proc = elapsedTime/DURATION_TRACKA;
				  			var m = Math.round(proc * 4000);
				  			var margin = 0 - m;
					  		$('#trackA').css({"margin-left": margin});
					  	}
				  }
				);
			}
			else
			{
				THE_SONG_OBJECT_OF_TRACKA = new Audio();
				THE_SONG_OBJECT_OF_TRACKA.src = url;
				THE_SONG_OBJECT_OF_TRACKA.addEventListener("canplaythrough", function()
				{
					SetupAudio(true, THE_SONG_OBJECT_OF_TRACKA);
					DURATION_TRACKA = THE_SONG_OBJECT_OF_TRACKA.duration;
				});
				THE_SONG_OBJECT_OF_TRACKA.addEventListener("timeupdate", function()
				  {
				  	var elapsedTime = THE_SONG_OBJECT_OF_TRACKA.duration;
				  		if(THE_SONG_OBJECT_OF_TRACKA.duration === NaN)
				  		{
				  			
				  		}
				  		else
				  		{
				  			var elapsedTime = THE_SONG_OBJECT_OF_TRACKA.currentTime;
				  			var proc = elapsedTime/DURATION_TRACKA;
				  			var m = Math.round(proc * 4000);
				  			var margin = 0 - m;
					  		$('#trackA').css({"margin-left": margin});
					  	}
				  }
				);
			}
		}
		else{
			if(THE_SONG_OBJECT_OF_TRACKB)
			{
				
				THE_SONG_OBJECT_OF_TRACKB.remove();
			}
			if(SourceDeckB)
			{
				
				SourceDeckB.disconnect();
				//console.log(SourceDeckA.activeSourceCounts);
				Delay[1].disconnect();
				Phaser[1].disconnect();
				Chorus[1].disconnect();
				LoFi[1].disconnect();
				EqTrackB[0].disconnect();
				EqTrackB[1].disconnect();
				EqTrackB[2].disconnect();
				THE_SONG_OBJECT_OF_TRACKB = new Audio();
				THE_SONG_OBJECT_OF_TRACKB.src = url;
				Reverb[1].disconnect();
				THE_SONG_OBJECT_OF_TRACKB.addEventListener("canplaythrough", function()
				{
					SetupAudio(false, THE_SONG_OBJECT_OF_TRACKB);
					DURATION_TRACKB = THE_SONG_OBJECT_OF_TRACKB.duration;
				});
				THE_SONG_OBJECT_OF_TRACKB.addEventListener("timeupdate", function()
				  {
				  	var elapsedTime = THE_SONG_OBJECT_OF_TRACKB.duration;
				  		if(THE_SONG_OBJECT_OF_TRACKB.duration === NaN)
				  		{
				  			
				  		}
				  		else
				  		{
				  			var elapsedTime = THE_SONG_OBJECT_OF_TRACKB.currentTime;
				  			var proc = elapsedTime/DURATION_TRACKB;
				  			 var m = Math.round(proc * 4000);
				  			 var margin = 0 - m;
				  			
					  		$('#trackB').css({"margin-left": margin});
					  		
					  	}
				  }
				);
			}
			else
			{
				THE_SONG_OBJECT_OF_TRACKB = new Audio();
				THE_SONG_OBJECT_OF_TRACKB.src = url;
				//THE_SONG_OBJECT_OF_TRACKB.volume = volume;
				$( "#sliderC" ).trigger("drag");
				THE_SONG_OBJECT_OF_TRACKB.addEventListener("canplaythrough", function()
				{
					SetupAudio(false, THE_SONG_OBJECT_OF_TRACKB);
					DURATION_TRACKB = THE_SONG_OBJECT_OF_TRACKB.duration;
				});
				THE_SONG_OBJECT_OF_TRACKB.addEventListener("timeupdate", function()
				  {
				  	var elapsedTime = THE_SONG_OBJECT_OF_TRACKB.duration;
				  		if(THE_SONG_OBJECT_OF_TRACKB.duration === NaN)
				  		{
				  			
				  		}
				  		else
				  		{
				  			var elapsedTime = THE_SONG_OBJECT_OF_TRACKB.currentTime;
				  			var proc = elapsedTime/DURATION_TRACKB;
				  			 var m = Math.round(proc * 4000);
				  			 var margin = 0 - m;
				  			
					  		$('#trackB').css({"margin-left": margin});
					  		
					  	}
				  }
				);
			}
		}
	}
	function SetupVolume(val){
		//THE Val is pretty pointless will fix when i have the time.
		if(val)
		{
			var a = $("#sliderA").position();
			a = a.top;
			a = 180 - a;
			var aNorm = a/180;
			VOLYM_REFERENCE_TRACK_A = aNorm;
			//SourceDeckA.mediaElement.volume = aNorm;
			MediaObjectAreRunnig[0] = true;
		}
		else
		{
			var b = $("#sliderB").position();
			b = b.top;
			b = 180 - b;
			var bNorm = b/180;
			VOLYM_REFERENCE_TRACK_B = bNorm;
			//SourceDeckB.mediaElement.volume = bNorm;
			MediaObjectAreRunnig[1] = true;
		}
		if(MediaObjectAreRunnig[0] == true && MediaObjectAreRunnig[1] == true)
		{
			var c = $("#sliderC").position()
			c = c.left;
		    var cb = 235 - c;	    			
			var normValB = c/235;
			var normValA = cb/235; 
			var Avolym = normValA * VOLYM_REFERENCE_TRACK_A;
			var Bvolym = normValB * VOLYM_REFERENCE_TRACK_B;
			if(Avolym < 0)
			{
				Avolym = 0;
			}
			if(Bvolym < 0)
			{
				Bvolym = 0;
			}						
			SourceDeckA.mediaElement.volume = Avolym;
			SourceDeckB.mediaElement.volume = Bvolym;	
		}
	}
	
	//ADVANCED EFFECT SETUP
	function OpenAdvancedSetup(val)
	{
		$('.AdvancedFxContainer').animate({top: '130px'}, 500);
	}
	function CloseAdvancedFx(){
		
		$('.AdvancedFxContainer').animate({top: '600px'}, 500);
	}
	
	
	
	
	
	$( document ).ready(function() {
    initialize();
});
	
	