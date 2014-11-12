/**
 * @author Anthony Dry
 */
			
			function CreateNewSoundObject(streamUrl,BPM,duration,title){
				var splitter = streamUrl.replace("http://api.soundcloud.com", "");
				var newsplit = splitter.slice(0,-6);
				if(BPM === null){
					BPM = "-";
				}
				
				this.StreamUrl = newsplit;
				this.BPM = BPM;
				this.Duration = duration;
				this.Title = title;
			}
			
			
			function Startjock(val, soundObj){
				var Jock = "";
				
				
				if(val === "A")
				{
					var timer = setInterval(function(){
						self = this;
						if(soundObj.paused === false)
						{
							
							$(function(){
								
								//var newVal = $("#jockA").val();
								//newVal++;
								//$("#jockA").val(newVal).trigger('change');
							});
						}
						else
						{
							
							clearInterval(timer);
						}
					},100);
				}
				if(val === "B")
				{
					var timer = setInterval(function(){
						if(soundObj.paused === false)
						{
							$(function(){
								//var newVal = $("#jockB").val();
								//newVal++;
							//	$("#jockB").val(newVal).trigger('change');
							});
						}
						else
						{
							clearInterval(timer);
						}
					},100);
				}
				
				
			}
			
					function init(){
				
				
				MY_CLIENTID = "37e07441ed46f4f3216ad3f762f1269d";
				DURATION_TRACKA = null;
				DURATION_TRACKB = null;
				THE_SONG_OBJECT_OF_TRACKA = new Audio();
				THE_SONG_OBJECT_OF_TRACKB = new Audio();

				VOLYM_REFERENCE_TRACK_A = 1;
				VOLYM_REFERENCE_TRACK_B = 1;
				SC.initialize({client_id: MY_CLIENTID,});
				//SC2.initialize({client_id: MY_CLIENTID,});
			    waveform1 = new Waveform({container: document.getElementById("trackA"),});
				waveform2 = new Waveform({container: document.getElementById("trackB"),});
				LoadASong(true, "https://soundcloud.com/aleksander-vinter/savant-storm-the-gates");
				setTimeout(function(){LoadASong(false, "https://soundcloud.com/earmilk/kimbra-settle-down-death-by-3")},1500);
				
				
				
				
				//INTERACTIVE INPUTS//
				$(function() {
					var AH_ref = 0;
					var AM_ref = 0;
					var AL_ref = 0;
					var BH_ref = 0;
					var BM_ref = 0;
					var BL_ref = 0;
					var Aup=0;
					var Adown=0;
					var Bup=0;
					var Bdown=0;
					
				     $("#jockA").knob({
					 min : 0,
					 max : 50,
					 stopper : false,
					 change:function(val){
					 	if(val > this.cv){
                        	if(Aup){
                                var TimeBeing = THE_SONG_OBJECT_OF_TRACKA.currentTime + 0.5;
                                THE_SONG_OBJECT_OF_TRACKA.currentTime = TimeBeing;                       
                          		Aup=0;
                            }
                            else{Aup=1;Adown=0;}
                     	} 
                     	else 
                     	{
                        	if(val < this.cv){
                            	if(Adown){
                            		var TimeBeing = THE_SONG_OBJECT_OF_TRACKA.currentTime - 0.5;
                                	THE_SONG_OBJECT_OF_TRACKA.currentTime = TimeBeing; 
                                	Adown=0;
	                            }
	                            else{Adown=1;Aup=0;}
                            }
                        }
                        val = this.cv;
					 }, 
					 
					});
					$("#jockB").knob({
					 min : 0,
					 max : 25,
					 stopper : false, 
					 change:function(val){
					 	if(val > this.cv){
                        	if(Bup){
                                var TimeBeing = THE_SONG_OBJECT_OF_TRACKB.currentTime + 0.5;
                                THE_SONG_OBJECT_OF_TRACKB.currentTime = TimeBeing;                       
                          		Aup=0;
                            }
                            else{Bup=1;Bdown=0;}
                     	} 
                     	else 
                     	{
                        	if(val < this.cv){
                            	if(Bdown){
                            		var TimeBeing = THE_SONG_OBJECT_OF_TRACKB.currentTime - 0.5;
                                	THE_SONG_OBJECT_OF_TRACKB.currentTime = TimeBeing; 
                                	Adown=0;
	                            }
	                            else{Bdown=1;Bup=0;}
                            }
                        }
                        val = this.cv;
					 }, 
					 
					});
					//TODO: GET THIS SHIT TO WORK VISUALY: THEY WORKED THE LAST TIME SO.
					$("#Eq_A_H").knob({
					 min : -40,
					 max : 40,
					 stopper : true, 
					 change:function(v){
					 	var val = v;
					 	if(AH_ref < -25 && val > 25)
					 	{
					 		
					 		
					 	}
					 	else if(AH_ref > 25 && val < -25)
					 	{
					 		
					 		
					 	}
					 	else
					 	{
					 		EqTrackA[2].gain = val;
					 		AH_ref = val;
					 	}
					 }
					});
					$("#Eq_A_M").knob({
					 min : -40,
					 max : 40,
					 stopper : true, 
					 change:function(val){
					 	if(AM_ref < -25 && val > 25)
					 	{
					 		val = AM_ref;
					 	}
					 	else if(AM_ref > 25 && val < -25)
					 	{
					 		val = AM_ref;
					 	}
					 	else
					 	{
					 		EqTrackA[1].gain = val;
					 		AM_ref = val;
					 	}
					 }
					});
					$("#Eq_A_L").knob({
					 min : -40,
					 max : 40,
					 stopper : true, 
					 change:function(val){
					 	if(AL_ref < -25 && val > 25)
					 	{
					 		val = AL_ref;
					 	}
					 	else if(AM_ref > 25 && val < -25)
					 	{
					 		val = AL_ref;
					 	}
					 	else
					 	{
					 		EqTrackA[0].gain = val;
					 		AL_ref = val;
					 	}
					 }
					});
					
					$("#Eq_B_H").knob({
					 min : -40,
					 max : 40,
					 stopper : true, 
					 change:function(val){
					 	if(BH_ref < -25 && val > 25)
					 	{
					 		val = BH_ref;
					 	}
					 	else if(BH_ref > 25 && val < -25)
					 	{
					 		val = BH_ref;
					 	}
					 	else
					 	{
					 		EqTrackB[2].gain = val;
					 		BH_ref = val;
					 	}
					 }
					});
					$("#Eq_B_M").knob({
					 min : -40,
					 max : 40,
					 stopper : true, 
					 change:function(val){
					 	if(BH_ref < -25 && val > 25)
					 	{
					 		val = BH_ref;
					 	}
					 	else if(BH_ref > 25 && val < -25)
					 	{
					 		val = BH_ref;
					 	}
					 	else
					 	{
					 		EqTrackB[1].gain = val;
					 		BH_ref = val;
					 	}
					 
					 }
					});
					$("#Eq_B_L").knob({
					 min : -40,
					 max : 40,
					 stopper : true, 
					 change:function(val){
					 	if(BL_ref < -25 && val > 25)
					 	{
					 		val = BL_ref;
					 	}
					 	else if(BL_ref > 25 && val < -25)
					 	{
					 		val = BL_ref;
					 	}
					 	else
					 	{
					 		EqTrackB[0].gain = val;
					 		BL_ref = val;
					 	}
					 }
					});
					//REVERB KNOBS
					$("#ReverbKnob1").knob({
					 min : 20,
					 max : 22050,
					 stopper : true,
					 change:function(v){
					 	Reverb[0].highCut = v;
					 	Reverb[1].highCut = v;
					 }, 
					});
					$("#ReverbKnob2").knob({
					 min : 20,
					 max : 22050,
					 stopper : true,
					 change:function(v){
					 	Reverb[0].lowCut = v;
					 	Reverb[1].lowCut = v;
					 },  
					});
					$("#ReverbKnob3").knob({
					 min : 0,
					 max : 100,
					 change:function(v){
					 	var newV = v/100;
					 	Reverb[0].dryLevel = newV;
					 	Reverb[1].dryLevel = newV;
					 }, 
					 //This needs to be normalized.
					 stopper : true, 
					});
					$("#ReverbKnob4").knob({
					 min : 0,
					 max : 200,
					 change:function(v){
					 	var newV = v/100;
					 	Reverb[0].wetLevel = newV;
					 	Reverb[1].wetLevel = newV;
					 }, 
					 //nomalize it.
					 stopper : true, 
					});
					//DELAY KNOBS
					$("#DelayKnob1").knob({
					 min : 0,
					 max : 100,
					 //normalize
					 stopper : true,
					 change:function(v){
					 	var newV = v/100;
					 	Delay[0].feedback = newV;
					 	Delay[1].feedback = newV;
					 },  
					});
					$("#DelayKnob2").knob({
					 min : 100,
					 max : 3000,
					 stopper : true,
					 change:function(v){
					 	//var newV = v/100;
					 	Delay[0].delayTime = v;
					 	Delay[1].delayTime = v;
					 },   
					});
					$("#DelayKnob3").knob({
					 min : 0,
					 max : 100,
					 stopper : true,
					 change:function(v){
					 	var newV = v/100;
					 	Delay[0].dryLevel = newV;
					 	Delay[1].dryLevel = newV;
					 },   
					});
					$("#DelayKnob4").knob({
					 min : 0,
					 max : 100,
					 change:function(v){
					 	var newV = v/100;
					 	Delay[0].wetLevel = newV;
					 	Delay[1].wetLevel = newV;
					 },  
					 stopper : true, 
					});
					$("#DelayKnob5").knob({
					 min : 20,
					 max : 22050,
					 stopper : true,
					 change:function(v){
					 	//var newV = v/100;
					 	Delay[0].cutoff = v;
					 	Delay[1].cutoff = v;
					 },   
					});
					//CHORUS
				    $("#ChorusKnob1").knob({
					 min : 0,
					 max : 100,
					 //step most be small.
					 //normalized with 10;
					 stopper : true,
					 change:function(v){
					 	var newV = v/10;
					 	Chorus[0].rate = newV;
					 	Chorus[1].rate = newV;
					 },   
					});
					$("#ChorusKnob2").knob({
					 min : 10,
					 max : 3000,
					 stopper : true,
					 change:function(v){
					 	var newV = v/300;
					 	Chorus[0].delay = newV;
					 	Chorus[1].delay = newV;
					 },   
					});
					$("#ChorusKnob3").knob({
					 min : 0,
					 max : 100,
					 stopper : true,
					 change:function(v){
					 	var newV = v/100;
					 	Chorus[0].feedback = newV;
					 	Chorus[1].feedback = newV;
					 },   
					});	
					//PHASER
					$("#PhaserKnob1").knob({
					 min : 0,
					 max : 100,
					 stopper : true,
					 change:function(v){
					 	var newV = v/10;
					 	Phaser[0].rate = newV;
					 	Phaser[1].rate = newV;
					 },   
					});
					$("#PhaserKnob2").knob({
					 min : 0,
					 max : 100,
					 stopper : true,
					 change:function(v){
					 	var newV = v/100;
					 	Phaser[0].depth = newV;
					 	Phaser[1].depth = newV;
					 },  
					});
					$("#PhaserKnob3").knob({
					 min : 0,
					 max : 100,
					 stopper : true,
					 change:function(v){
					 	var newV = v/100;
					 	Phaser[0].feedback = newV;
					 	Phaser[1].feedback = newV;
					 },   
					});
					$("#PhaserKnob4").knob({
					 min : 0,
					 max : 180,
					 stopper : true,
					 change:function(v){
					 	//var newV = v/100;
					 	Phaser[0].stereoPhase = v;
					 	Phaser[1].stereoPhase = v;
					 },  
					});
					$("#PhaserKnob5").knob({
					 min : 500,
					 max : 1500,
					 stopper : true,
					 change:function(v){
					 	//var newV = v/100;
					 	Phaser[0].baseModulationFrequency = v;
					 	Phaser[1].baseModulationFrequency = v;
					 },   
					});	
					//LOFI
				    $("#LoFiKnob1").knob({
					 min : 0,
					 max : 100,
					 stopper : true,
					 change:function(v){
					 	var newV = v/100;
					 	LoFi[0].outputGain = newV;
					 	LoFi[1].outputGain = newV;
					 },    
					});
					$("#LoFiKnob2").knob({
					 min : 0,
					 max : 100,
					 stopper : true,
					 change:function(v){
					 	var newV = v/100;
					 	LoFi[0].drive = newV;
					 	LoFi[1].drive = newV;
					 },  
					});
					$("#LoFiKnob3").knob({
					 min : 0,
					 max : 100,
					 stopper : true,
					 change:function(v){
					 	var newV = v/100;
					 	LoFi[0].curveAmount = newV;
					 	LoFi[1].curveAmount = newV;
					 },  
					});
					
					$("#reverbOption button").each(function(){
						
						$(this).click(function(){
							switch($(this).html())
							{
								case "Room":
									Reverb[0].impulse = "impulses/room_rev.wav";
									Reverb[1].impulse = "impulses/room_rev.wav";
									break;
								case "Plate":
									Reverb[0].impulse = "impulses/plate_rev.wav";
									Reverb[1].impulse = "impulses/plate_rev.wav";
									break;
								case "Hall":
									Reverb[0].impulse = "impulses/hall_rev.wav";
									Reverb[1].impulse = "impulses/hall_rev.wav";
									break;
								case "Church":
									Reverb[0].impulse = "impulses/church_rev.wav";
									Reverb[1].impulse = "impulses/church_rev.wav";
									break;
								case "Orginal":
									Reverb[0].impulse = "impulses/impulse_rev.wav";
									Reverb[1].impulse = "impulses/impulse_rev.wav";
									break;
							}
						});
							
					});
					
					$("#distOption button").each(function(){
						
						$(this).click(function(){
							switch($(this).html())
							{
								case "Dist1":
									LoFi[0].algorithmIndex = 0;   
									LoFi[1].algorithmIndex = 0;   
									break;
								case "Dist2":
									LoFi[0].algorithmIndex = 1;   
									LoFi[1].algorithmIndex = 1;
									break;
								case "Dist3":
									LoFi[0].algorithmIndex = 2;   
									LoFi[1].algorithmIndex = 2;
									break;
								case "Dist4":
									LoFi[0].algorithmIndex = 3;   
									LoFi[1].algorithmIndex = 3;
									break;
								case "Dist5":
									LoFi[0].algorithmIndex = 4;   
									LoFi[1].algorithmIndex = 4;
									break;
							}
						});
							
					});
					//MIDI THINGYS
					$("#OpenMIDISetup").click(function(){
						ActivateMIDISetup();
					})
					$("#CloseMIDISetup").click(function(){
						CloseMIDISetup();
					})
					function ActivateMIDISetup(){
						$('.MIDISetupContainer').animate({top: '130px'}, 500);
						
					}
					function CloseMIDISetup(){
						$('.MIDISetupContainer').animate({top: '600px'}, 500);
						
					}
						
									
				});
			}
			window.onload = init();