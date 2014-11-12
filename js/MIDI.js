/**
 * @author Anthony Dry
*/
/*
 * GLOBAL VARS
 */

var selectMIDI = null;
var midiAccess = null;
var midiIn = null;
var CCexclusiveFunc = {
	//Deck Specific.
	DeckAVolume:null, //Default null;
	DeckBVolume:null,
	DeckAEqHigh:null,
	DeckBEqHigh:null,
	DeckAEqMid:null,
	DeckBEqMid:null,
	DeckAEqLow:null,
	DeckBEqLow:null,
	DeckATurnTable:null,
	DeckBTurnTable:null,
	//Mixer and effects.
	
	CrossFader:null,
	ReverbHighCut:null,
	ReverbLowCut:null,
	ReverbDry:null,
	ReverbWet:null,
	DelayFeed:null,
	DelayTime:null,
	DelayDry:null,
	DelayWet:null,
	DelayCutoff:null,
	ChorusRate:null,
	ChorusTime:null,
	ChorusFeed:null,
	PhaserRate:null,
	PhaserDepth:null,
	PhaserFeed:null,
	PhaserStereo:null,
	PhaserModFreq:null,
	LoFiGain:null,
	LoFiDrive:null,
	LoFiCurve:null,	
};
var NoteExclusiveFunc = {
	DeckAPlay:null,
	DeckBPlay:null,
	DeckAStop:null,
	DeckBStop:null,
	DeckAFx:null,
	DeckBFx:null,
	/*not implemented yet*/
	DeckACue:null,
	DeckBCue:null,
	DeckAPlayCue:null,
	DeckBPlayCue:null,
};
var EarlierValue = {
	DeckA:0,
	DeckB:0,
	DeckALastOption:null,
	DeckBLastOption:null,
}

/*
 * Setup MIDI List Ports Etc,
 */
function onMIDIStarted( midi ) {
	//MESSAGE :D
	var SuccessMessage = "<p>MIDI support is enabled!</p>";
	SuccessMessage += "<p>How to get started:</p>";
	SuccessMessage += "<ul><li>Select your desired MIDI port from the selection list.</li><li>BEFORE! clicking the learn button on desired function.<br/>Make sure the right control value is active in the control window.</li><li>Click Learn and Make some noise ;)</li></ul>";
	$("#MIDICheckMessage").html(SuccessMessage);
  var preferredIndex = -1;

  midiAccess = midi;
  
  selectMIDI=document.getElementById("midiIn");
  var list=midiAccess.inputs();

  // clear the MIDI input select
  selectMIDI.options.length = 0;

  for (var i=0; (i<list.length)&&(preferredIndex==-1); i++) {
    var str=list[i].name.toString();
    if ((str.indexOf("Keyboard") != -1)||(str.indexOf("keyboard") != -1)||(str.indexOf("KEYBOARD") != -1))
      preferredIndex=i;
  }
  if (preferredIndex==-1)
    preferredIndex=0;

  if (list.length) {
    for (var i=0; i<list.length; i++) {
      selectMIDI.options[i]=new Option(list[i].name,list[i].fingerprint,i==preferredIndex,i==preferredIndex);
    }
    midiIn = list[preferredIndex];
    midiIn.onmidimessage = midiMessageReceived;

    selectMIDI.onchange = selectMIDIIn;
  }
}
//builds the list.
function selectMIDIIn( ev ) {
  midiIn = midiAccess.inputs()[selectMIDI.selectedIndex];
  midiIn.onmidimessage = midiMessageReceived;
}
/*function changeMIDIPort() {
  var list = midiAccess.inputs();;
  midiIn = list[ selectMIDI.selectedIndex ];
  midiIn.onmidimessage = midiMessageReceived;
}
*/
function onMIDISystemError( msg ) {
	//NEEDS TO BE ALOT SLICKER. Show the user etc.
	var ErrorMessage = "<p>Couldn't setup MIDI correctly!</p>";
	ErrorMessage += "<p>Possible issues are following:</p>";
	ErrorMessage += "<ul><li>Jazz-soft plugin is not avaliable.</li><li>Java plugins are not enabled</li><li>Zombie apocalypse in the neighborhood</li></ul>";
	$("#MIDICheckMessage").html(ErrorMessage);
  console.log( "Error encountered:" + msg );
}


//RECEIVED FUNCTION
function midiMessageReceived( ev ) {
  var cmd = ev.data[0] >> 4;
  var channel = ev.data[0] & 0xf;
  var noteNumber = ev.data[1];
  var velocity = ev.data[2];
  if ( cmd==8 || ((cmd==9)&&(velocity==0)) ) { // with MIDI, note on with velocity zero is the same as note off
    // note off
  } else if (cmd == 9) {
    // note on
    CheckIFActiveNote(noteNumber);
    MIDIControlWindow("note", noteNumber);
  } else if (cmd == 11) {
	//CC
	CheckIFActiveCC(noteNumber,velocity);
	MIDIControlWindow("CC", noteNumber);
  } else if (cmd == 14) {
    // pitch wheel (NOT USED IN THIS EXAMPLE)
    //pitchWheel( ((velocity * 128.0 + noteNumber)-8192)/8192.0 );
  }
}

//This will do for now.
function CheckIFActiveNote(note)
{
	for(obj in NoteExclusiveFunc)
	{
		if(NoteExclusiveFunc[obj] === note)
		{
			//NOW i need to know what this is and if its something specific and then trigger an event for the specific note. still need to build the click handle for setting my var objects.
			HandleNoteFunc(obj);
			
		}
	}
}

function CheckIFActiveCC(note,value)
{
	for(obj in CCexclusiveFunc)
	{
		if(CCexclusiveFunc[obj] === note)
		{
			HandleCCFunc(obj,value);
		}
		
	}
}
function HandleNoteFunc(val)
{
	//This wasnt to hard! :D
	switch(val){
		case "DeckAPlay":
			PressedPlay(true,SourceDeckA.mediaElement);
			break;
		case "DeckBPlay":
			PressedPlay(false,SourceDeckB.mediaElement);
			break;
		case "DeckAStop":
			PressedStop(SourceDeckA.mediaElement);
			break;
		case "DeckBStop":
			PressedStop(SourceDeckB.mediaElement);
			break;
		case "DeckAFx":
			$('#Fx1').trigger('click');
			break;
		case "DeckBFx":
			$('#Fx2').trigger('click');
			break;
	/*not implemented yet*/
		case "DeckACue":
			break;
		case "DeckBCue":
			break;
		case "DeckAPlayCue":
			break;
		case "DeckBPlayCue":
			break;
	}
}
function HandleCCFunc(val, number)
{
	var NormalizedValue = number/127;
	
	switch(val){
		case "DeckAVolume":
			VisualizeVolumeFader(true,$("#sliderA"),NormalizedValue)
			break;
		case "DeckBVolume":
			VisualizeVolumeFader(false,$("#sliderB"),NormalizedValue)
			break;
		case "DeckAEqHigh":
			VisualizeEqFader(true,2,$("#Eq_A_H"),NormalizedValue)
			break;
		case "DeckAEqMid":
			VisualizeEqFader(true,1,$("#Eq_A_M"),NormalizedValue)
			break;
		case "DeckAEqLow":
			VisualizeEqFader(true,0,$("#Eq_A_L"),NormalizedValue)
			break;
		case "DeckBEqHigh":
			VisualizeEqFader(false,2,$("#Eq_B_H"),NormalizedValue)
			break;
		case "DeckBEqMid":
			VisualizeEqFader(false,1,$("#Eq_B_M"),NormalizedValue)
			break;
		case "DeckBEqLow":
			VisualizeEqFader(false,0,$("#Eq_B_L"),NormalizedValue)
			break;
		case "CrossFader":
			VisualizeCrossFader(true,$("#sliderC"),NormalizedValue)
			break;
		case "DeckATurnTable":
			VisualizeTurnTable(true,$("#jockA"),NormalizedValue)
			break;
		case "DeckBTurnTable":
			VisualizeTurnTable(false,$("#jockB"),NormalizedValue)
			break;
		//EFFECTCASES OH BOY THIS IS GOING TO LOOK TERRIBLE.
		case "ReverbHighCut":
			VisualizeReverb(0,$("#ReverbKnob1"),NormalizedValue)
			break;
		case "ReverbLowCut":
			VisualizeReverb(1,$("#ReverbKnob2"),NormalizedValue)
			break;
		case "ReverbDry":
			VisualizeReverb(2,$("#ReverbKnob3"),NormalizedValue)
			break;
		case "ReverbWet":
			VisualizeReverb(3,$("#ReverbKnob4"),NormalizedValue)
			break;
		case "ReverbWet":
			VisualizeReverb(3,$("#ReverbKnob4"),NormalizedValue)
			break;
		case "ReverbWet":
			VisualizeReverb(3,$("#ReverbKnob4"),NormalizedValue)
			break;
		case "DelayFeed":
			VisualizeDelay(0,$("#DelayKnob1"),NormalizedValue)
			break;
		case "DelayTime":
			VisualizeDelay(1,$("#DelayKnob2"),NormalizedValue)
			break;
		case "DelayDry":
			VisualizeDelay(2,$("#DelayKnob3"),NormalizedValue)
			break;
		case "DelayWet":
			VisualizeDelay(3,$("#DelayKnob4"),NormalizedValue)
			break;
		case "DelayCutoff":
			VisualizeDelay(4,$("#DelayKnob5"),NormalizedValue)
			break;
		case "ChorusRate":
			VisualizeChorus(0,$("#ChorusKnob1"),NormalizedValue)
			break;
		case "ChorusTime":
			VisualizeChorus(1,$("#ChorusKnob2"),NormalizedValue)
			break;
		case "ChorusFeed":
			VisualizeChorus(2,$("#ChorusKnob3"),NormalizedValue)
			break;
		case "PhaserRate":
			VisualizePhaser(0,$("#PhaserKnob1"),NormalizedValue)
			break;
		case "PhaserDepth":
			VisualizePhaser(1,$("#PhaserKnob2"),NormalizedValue)
			break;
		case "PhaserFeed":
			VisualizePhaser(2,$("#PhaserKnob3"),NormalizedValue)
			break;
		case "PhaserStereo":
			VisualizePhaser(3,$("#PhaserKnob4"),NormalizedValue)
			break;
		case "PhaserModFreq":
			VisualizePhaser(4,$("#PhaserKnob5"),NormalizedValue)
			break;
		case "LoFiGain":
			VisualizeLoFi(0,$("#LoFiKnob1"),NormalizedValue)
			break;
		case "LoFiDrive":
			VisualizeLoFi(1,$("#LoFiKnob2"),NormalizedValue)
			break;
		case "LoFiCurve":
			VisualizeLoFi(2,$("#LoFiKnob3"),NormalizedValue)
			break;
	}
}
function VisualizeVolumeFader(deck,slider,value)
{
	value = value * 180; 
	value = 180 - value;
	slider.css("top", value);
	SetupVolume(deck);
}
function VisualizeEqFader(deck,type,Eq,value)
{
	value = value*80;
	value = parseInt(value - 40);
	Eq.val(value).trigger('change');
	if(deck)
	{
		EqTrackA[type].gain = value;
	}
	else
	{
		EqTrackB[type].gain = value;
	}	
}
function VisualizeCrossFader(deck,slider,value)
{
	value = value * 235;
	slider.css("left", value);
	SetupVolume(deck); 
}
function VisualizeTurnTable(v,jog,value)
{
	/*THIS NEEDS TO BE FIXED WHEN I KNOW HOW JOGWHEELS WORK FOR NOW THIS WILL DO.*/
	/*if(EarlierValue.DeckA < value)
	{
		 var TimeBeing = THE_SONG_OBJECT_OF_TRACKA.currentTime + 0.5;
         THE_SONG_OBJECT_OF_TRACKA.currentTime = TimeBeing; 
         EarlierValue.DeckALastOption = true;
	}
	else if(EarlierValue.DeckA > value)
	{
		 var TimeBeing = THE_SONG_OBJECT_OF_TRACKA.currentTime - 0.5;
         THE_SONG_OBJECT_OF_TRACKA.currentTime = TimeBeing;  
         EarlierValue.DeckALastOption = false; 
	}
	if(EarlierValue.DeckA == value && EarlierValue.DeckALastOption === true)
	{
		 var TimeBeing = THE_SONG_OBJECT_OF_TRACKA.currentTime + 0.5;
         THE_SONG_OBJECT_OF_TRACKA.currentTime = TimeBeing; 
	}
	else if(EarlierValue.DeckA == value && EarlierValue.DeckALastOption === false)
	{
		 var TimeBeing = THE_SONG_OBJECT_OF_TRACKA.currentTime - 0.5;
         THE_SONG_OBJECT_OF_TRACKA.currentTime = TimeBeing; 
	}
	*/
	if(v)
	{
	 	THE_SONG_OBJECT_OF_TRACKA.currentTime =  THE_SONG_OBJECT_OF_TRACKA.duration * value;
	}
	else
	{
		THE_SONG_OBJECT_OF_TRACKB.currentTime =  THE_SONG_OBJECT_OF_TRACKB.duration * value;
	}
	value = jog.val() + 1;
	//EarlierValue.DeckA = value;
	jog.val(value).trigger('change');
}
//EFFECTS VISUALIZERS
function VisualizeReverb(type,knob,value)
{
	switch(type)
	{
		case 0:
			value = parseInt((22030 * value) + 20);
			Reverb[0].highCut = value;
			Reverb[1].highCut = value;
			break;
		case 1:
		value = parseInt((22030 * value) + 20);
			Reverb[0].lowCut = value;
			Reverb[1].lowCut = value;
			break;
		case 2:
			Reverb[0].dryLevel = value;
			Reverb[1].dryLevel = value;
			value = parseInt(value * 100);
			
			break;
		case 3:
			value = value * 2;
			Reverb[0].wetLevel = value;
			Reverb[1].wetLevel = value;
			value = parseInt(value * 100);
			break;
	}
	knob.val(value).trigger('change');
}
function VisualizeDelay(type,knob,value)
{
	switch(type)
	{
		case 0:
			Delay[0].feedback = value;
			Delay[1].feedback = value;
			value = parseInt(value * 100);
			break;
		case 1:
		value = parseInt((2900 * value) + 100);
			Delay[0].delayTime = value;
			Delay[1].delayTime = value;
			break;
		case 2:
			Delay[0].DryLevel = value;
			Delay[1].DryLevel = value;
			value = parseInt(value * 100);
			
			break;
		case 3:
			Delay[0].WetLevel = value;
			Delay[1].WetLevel = value;
			value = parseInt(value * 100);
			break;
		case 4:
			value = parseInt((22030 * value) + 20);
			Delay[0].cutoff = value;
			Delay[1].cutoff = value;
			break;
	}
	knob.val(value).trigger('change');
}
function VisualizeChorus(type,knob,value)
{
	switch(type)
	{
		case 0:
			value = value * 10;
			Chorus[0].rate = value;
			Chorus[1].rate = value;
			value = parseInt(value * 10);
			break;
		case 1:
		value = parseInt((2990 * value) + 10);
			Chorus[0].delayTime = value;
			Chorus[1].delayTime = value;
			break;
		case 2:
			Delay[0].feedback = value;
			Delay[1].feedback = value;
			value = parseInt(value * 100);
			break;
		
	}
	knob.val(value).trigger('change');
}
function VisualizePhaser(type,knob,value)
{
	switch(type)
	{
		case 0:
			value = value * 10;
			Phaser[0].rate = value;
			Phaser[1].rate = value;
			value = parseInt(value * 10);
			break;
		case 1:
			Phaser[0].depth = value;
			Phaser[1].depth = value;
			value = parseInt(value * 100);
			break;
		case 2:
			Phaser[0].feedback = value;
			Phaser[1].feedback = value;
			value = parseInt(value * 100);
			break;
		case 3:
			value = parseInt(value * 180);
			Phaser[0].stereoPhase = value;
			Phaser[1].stereoPhase = value;
			break;
		case 4:
			value = parseInt((value * 1000) + 500);
			Phaser[0].baseModulationFrequency = value;
			Phaser[1].baseModulationFrequency = value;
			break;	
	}
	knob.val(value).trigger('change');
}
function VisualizeLoFi(type,knob,value)
{
	switch(type)
	{
		case 0:
			LoFi[0].outputGain = value;
			LoFi[1].outputGain = value;
			value = parseInt(value * 100);
			break;
		case 1:
			LoFi[0].drive = value;
			LoFi[1].drive = value;
			value = parseInt(value * 100);
			break;
		case 2:
			LoFi[0].curveAmount = value;
			LoFi[1].curveAmount = value;
			value = parseInt(value * 100);
			break;
		
	}

	knob.val(value).trigger('change');
}


//MIDI CONTROL WINDOW UPDATER,
function MIDIControlWindow(type,input)
{
		if(type === "CC")
		{
			$("#ControlValue").html("<span>CC</span>: <span>"+input+"</span>");
		}
		else if(type === "note")
		{
			$("#ControlValue").html("<span>Note</span>: <span>"+input+"</span>");
		}

}

//LEARNFUNCTION BLLLÄÄÄ

$(".LearnFunction").click(function(){
	var type;
	var parentObj = $(this).parent();
	var random = Math.floor((Math.random()*20000)+1);
	parentObj.id = random;
	var selectedChannel = $(parentObj).find(".MIDIPlace p").html();
	var selectedFunction = $(parentObj).find(".MIDIEventName p").html();
	var AssignedToObj = $(parentObj).find(".MIDIAssigned p");
	var MIDIC = $("#ControlValue span");

	switch(selectedFunction)
	{
		case "Volume Fader":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			if(selectedChannel === "Deck A")
			{
				CCexclusiveFunc.DeckAVolume = parseInt(MIDIC[1].innerText);
			}
			else{
				CCexclusiveFunc.DeckBVolume = parseInt(MIDIC[1].innerText);
			}
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "EQ High":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			if(selectedChannel === "Deck A")
			{
				CCexclusiveFunc.DeckAEqHigh = parseInt(MIDIC[1].innerText);
			}
			else{
				CCexclusiveFunc.DeckBEqHigh = parseInt(MIDIC[1].innerText);
			}
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "EQ Mid":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			if(selectedChannel === "Deck A")
			{
				CCexclusiveFunc.DeckAEqMid = parseInt(MIDIC[1].innerText);
			}
			else{
				CCexclusiveFunc.DeckBEqMid = parseInt(MIDIC[1].innerText);
			}
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "EQ Low":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			if(selectedChannel === "Deck A")
			{
				CCexclusiveFunc.DeckAEqLow = parseInt(MIDIC[1].innerText);
			}
			else{
				CCexclusiveFunc.DeckBEqLow = parseInt(MIDIC[1].innerText);
			}
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Play/Pause":
			if(MIDIC[0].innerText == "CC")
			{
				alert("Can't assign a CC value to a Note parm!")
				break;
			}
			if(selectedChannel === "Deck A")
			{
				NoteExclusiveFunc.DeckAPlay = parseInt(MIDIC[1].innerText);
			}
			else{
				NoteExclusiveFunc.DeckBPlay = parseInt(MIDIC[1].innerText);
			}
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Stop":
			if(MIDIC[0].innerText == "CC")
			{
				alert("Can't assign a CC value to a Note parm!")
				break;
			}
			if(selectedChannel === "Deck A")
			{
				NoteExclusiveFunc.DeckAStop = parseInt(MIDIC[1].innerText);
			}
			else{
				NoteExclusiveFunc.DeckBStop = parseInt(MIDIC[1].innerText);
			}
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Effect ON/OFF":
			if(MIDIC[0].innerText == "CC")
			{
				alert("Can't assign a CC value to a Note parm!")
				break;
			}
			if(selectedChannel === "Deck A")
			{
				NoteExclusiveFunc.DeckAFx = parseInt(MIDIC[1].innerText);
			}
			else{
				NoteExclusiveFunc.DeckBFx = parseInt(MIDIC[1].innerText);
			}
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Turntable":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			if(selectedChannel === "Deck A")
			{
				CCexclusiveFunc.DeckATurnTable = parseInt(MIDIC[1].innerText);
			}
			else{
				CCexclusiveFunc.DeckBTurnTable = parseInt(MIDIC[1].innerText);
			}
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Crossfader":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.CrossFader = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Reverb - High Cut":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.ReverbHighCut = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Reverb - Low Cut":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.ReverbLowCut = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Reverb - Dry Amount":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.ReverbDry = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Reverb - Wet Amount":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.ReverbWet = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Delay - Feedback":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.DelayFeed = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Delay - Delay time":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.DelayTime = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Delay - Cutoff":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.DelayCutoff = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Delay - Dry Amount":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.DelayDry = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Delay - Wet Amount":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.DelayWet = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Chorus - Rate":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.ChorusRate = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Chorus - Delay time":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.ChorusTime = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Chorus - Feedback":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.ChorusFeed = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Phaser - Rate":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.PhaserRate = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Phaser - Depth":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.PhaserDepth = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Phaser - Feedback":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.PhaserFeed = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Phaser - Stereo":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.PhaserStereo = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "Phaser - Mod Freq":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.PhaserModFreq = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "LoFi - Gain":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.LoFiGain = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "LoFi - Drive":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.LoFiDrive = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
		case "LoFi - Curve":
			if(MIDIC[0].innerText == "Note")
			{
				alert("Can't assign a Note value to a CC parm!")
				break;
			}
			CCexclusiveFunc.LoFiCurve = parseInt(MIDIC[1].innerText);
			
			AssignedToObj.html(MIDIC[0].innerText+": "+MIDIC[1].innerText);
			break;
	}
});



window.addEventListener('load', function() {
	
	navigator.requestMIDIAccess().then( onMIDIStarted, onMIDISystemError );   
 // navigator.requestMIDIAccess( onMIDIStarted, onMIDISystemError );

});