/**
 * @author Anthony Dry
 */
function LOAD_TrackA(obj)
			{
				SC.get(obj.StreamUrl, function(track){
					 
					  
					  var ctx = waveform1.context;
	
					  var gradient = ctx.createLinearGradient(0, 0, 0, waveform1.height);
						gradient.addColorStop(0.0, "#f60");
						gradient.addColorStop(0.5, "#ff1b00");
						gradient.addColorStop(1.0, "#f60");
						waveform1.innerColor = gradient;
					  	waveform1.dataFromSoundCloudTrack(track);
					  	var streamOptions = waveform1.optionsForSyncedStream();
					  	var BPM = document.getElementById("BPMTrackA");
					  	var title = document.getElementById("t1");
					  	title.innerHTML = obj.Title;
					  	BPM.innerHTML = "BPM: " + obj.BPM;
					    AddToAudioBuff(true,track.stream_url+'?client_id='+MY_CLIENTID, VOLYM_REFERENCE_TRACK_A);
				});
			}
			
			function LOAD_TrackB(obj)
			{
				SC.get(obj.StreamUrl, function(track){
					 
					  
					  var ctx = waveform1.context;
	
					  var gradient = ctx.createLinearGradient(0, 0, 0, waveform2.height);
						gradient.addColorStop(0.0, "#f60");
						gradient.addColorStop(0.5, "#ff1b00");
						gradient.addColorStop(1.0, "#f60");
						waveform2.innerColor = gradient;
					  	waveform2.dataFromSoundCloudTrack(track);
					  	var streamOptions = waveform1.optionsForSyncedStream();
					  	var BPM = document.getElementById("BPMTrackB");
					  	var title = document.getElementById("t2");
					  	title.innerHTML = obj.Title;
					  	BPM.innerHTML = "BPM: " + obj.BPM;
					    AddToAudioBuff(false,track.stream_url+'?client_id='+MY_CLIENTID, VOLYM_REFERENCE_TRACK_B);
				});
			}
			function LoadASong(OnPlayer, Songurl){
				var builtString = 'http://api.soundcloud.com/resolve.json?url='+Songurl+'&client_id='+MY_CLIENTID;

				$.get(builtString, function (result) {
					//TODO: CREATE A NEW OBJECT FROM THE USABLE VALUES. IF ITS NESSASACRY.
					
					var SoundObject = new CreateNewSoundObject(result.stream_url,result.bpm,result.duration,result.title);
					if(!OnPlayer)
					{
						LOAD_TrackB(SoundObject);
					}
					else{
						LOAD_TrackA(SoundObject);
					}
				});
			}
			function LoadASongSeach(OnPlayer, sObj)
			{
				var SoundObject = new CreateNewSoundObject(sObj.stream_url,sObj.bpm,sObj.duration,sObj.title);
					if(!OnPlayer)
					{
						LOAD_TrackB(SoundObject);
					}
					else{
						LOAD_TrackA(SoundObject);
					}
			}
