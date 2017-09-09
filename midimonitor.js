const mSize=256+14;

	window.onload = function()
	{
		var data=Array(mSize);
		var i,j;
		var midi_num=0;
		var log=null;

		if (!log) log = document.getElementById("log");
		for(i=0; i<mSize; i++) data[i]=0;

	/* -------------------- MIDI -------------------- */
		var m=null;
		var inputs=null;
		var outputs=null;

		navigator.requestMIDIAccess().then( success, failure );

		function success(midiAccess)
		{
			m=midiAccess;

			if (typeof m.inputs === "function") {
				inputs=m.inputs();
				outputs=m.outputs();
			} else {
				var inputIterator = m.inputs.values();
				inputs = [];
				for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
					inputs.push(o.value)
				}

				var outputIterator = m.outputs.values();
				outputs = [];
				for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
					outputs.push(o.value)
				}
			}

			log.innerText = "MIDI ready!";
			log.innerText +="\n";
			log.innerText +="input_device=";
			log.innerText += inputs.length;
			log.innerText +="\n";
			log.innerText +="output_device=";
			log.innerText += outputs.length;
			log.innerText +="\n";

			for(var i=0; i<inputs.length; i++){
				inputs[i].onmidimessage = handleMIDIMessage;
			}
		}

		function failure(error)
		{
			alert( "Failed MIDI!" + msg );
		}

		function handleMIDIMessage( event ) {

			if( event.data[0] ==0xFE ) return;

			if( event.data.length>1) {

				midi_num++; if(midi_num>=mSize) midi_num=mSize;

				for(var i=0; i<mSize-event.data.length; i++){
					data[mSize-1-i] = data[mSize-1-i-event.data.length];
				}

				for(i=0; i<event.data.length; i++) data[i]=event.data[i];
				write_data(data, event.data.length);
			}
		}

	/* -------------------- WRITE DATA -------------------- */

		function zero_str(n, d) {
			var m;
			m = n.toString(16);
			m= m.toUpperCase() ;
			while (m.length < d) {
   		     	m = "0" + m;
    		}
    		return m;
		}

		function write_data(data, n){
			var i,j;
			var str="";
		
			for(i=0,j=0; i<n; i++,j++){ 
				str += "<font color='#fefe9D'>";
				str += "<B>";
				str += zero_str(data[i],2);
				str += "</B>";
				str += "</font>";
				str +=" ";
			}

			for(i=n; i<mSize; i++,j++){ 
				if( data[i]&0x80 ){
					str += "<font color='RED'>";
					str += zero_str(data[i],2);
					str += "</font>";
				} else {
					str += zero_str(data[i],2);
				}
//				if((j%16)==14) { j=0; str+=""; }
//				else str +=" ";
				str +=" ";
			}
			log.style.fontWeight = "normal";
			log.innerHTML  = str;
		}
	};
