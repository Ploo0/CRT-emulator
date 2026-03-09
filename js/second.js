(function () {//MAIN FUNCTION
	'use strict';

	var cs = new CSInterface();

	var grid = document.getElementById('crtgrid');
		let gridtxt = document.getElementById('crttxt');
	var grid2 = document.getElementById('crtgrid2');
		let gridtxt2 = document.getElementById('crttxt2');
	var gridCheck = document.getElementById('crtcheck');
	var gridCheck2 = document.getElementById('crtcheck2');

	const root = document.querySelector(':root');
	

//Verify if it has a tv border
	cs.evalScript('hasMonitor()', function(res){
		if(res !== "true"){
			document.getElementById('tvBorder').remove();
		}
	});	

//Verify wich Style was selected
	cs.evalScript('returnStyle()', function(res){
		switch(res) {
			case "10":
				document.getElementById('colorSlider').style.display = "block";
			break;
		}
	});


//Display the correct Grids
	cs.evalScript('verifyGrids()', function(res){

		//Get result in array 
		let list = res.split(",");
		let gridList = [grid,grid2];
		let txtList = [gridtxt,gridtxt2];
		let index = 0;
		//make an array of the CRTGrid to cselect the easily
		let rec = "linear-gradient( rgba(0,0,0, 0) 0%,rgb(10, 10, 10) 100% ), url(CRTGRID/crt_rectangle_4k.png)";
		let cir = "linear-gradient( rgba(0,0,0, 0) 0%,rgb(10, 10, 10) 115% ), url(CRTGRID/crt_circle.jpg)";

		list.forEach(element => {
			
			switch (element) {
				case "CRT_LINE":
					txtList[index].textContent = "Rectangle";

					gridList[index].style.background = rec;
					//gridList[index].style.backgroundSize = "1500%";
					//gridList[index].style.imageRendering = "pixelated";
				break;
				case "CRT_LINE 2":
					txtList[index].textContent = "Rectangle 2";

					gridList[index].style.background = rec;
					//gridList[index].style.backgroundSize = "1500%";
					//gridList[index].style.imageRendering = "pixelated";
				break;
				case "CRT_CIRCLE":
					txtList[index].textContent = "Circle";
					gridList[index].style.background = cir;
				break;

				case "none":
					gridList[index].remove();
				break;
			}
			//Show as visible or not
			cs.evalScript('isVisible("'+element+'")', function(res) {
				if (res == "true"){
					if (index == 0) gridCheck.checked = true;
					else gridCheck2.checked = true;
				}else{
					if (index == 1) gridCheck.checked = false;
					else gridCheck2.checked = false;
				}
			});

			index++;
		});
		
	});

//Prevent Video Dragging
window.addEventListener("dragenter", function(e) {
    e.preventDefault();
    e.dataTransfer.effectAllowed = "none";
    e.dataTransfer.dropEffect = "none";
}, false);

window.addEventListener("dragover", function(e) {

    e.preventDefault();
    e.dataTransfer.effectAllowed = "none";
    e.dataTransfer.dropEffect = "none";

});

window.addEventListener("drop", function(e) {
    e.preventDefault();
    e.dataTransfer.effectAllowed = "none";
    e.dataTransfer.dropEffect = "none";
});


//When everything loaded, Remove Loading Screen
	document.addEventListener("DOMContentLoaded", function () {
		
		
		let loading = document.getElementById("loadingScreen");
		loading.addEventListener('animationend', function() {
			loading.remove();
		});
		loading.style.animation="fadeOut 1s 1.2s linear";

	});

	grid.addEventListener('click', function() {
		let checked = gridCheck.checked;
		cs.evalScript( 'toggleGrid("'+gridtxt.textContent+'","'+checked+'")', function() { 
			//Disable other if needed
			if (gridtxt.textContent == "Circle" && gridCheck2.checked){
				gridCheck2.checked = false;
				cs.evalScript( 'toggleGrid("'+gridtxt2.textContent+'","'+true+'")' );
			}
		});
		
	});

	grid2.addEventListener('click', function() {
		//if (gridtxt2.textContent != "Unavalible"){
			let checked = gridCheck2.checked;
			cs.evalScript( 'toggleGrid("'+gridtxt2.textContent+'","'+checked+'")', function() {
				//Disable other if needed
				if (gridtxt.textContent == "Circle" && gridCheck.checked){
					gridCheck.checked = false;
					cs.evalScript( 'toggleGrid("'+gridtxt.textContent+'","'+true+'")' );
				}
			});

	});

	document.getElementById('logo').addEventListener('click', function() {
		cs.openURLInDefaultBrowser("https://fredpelle.tv/");
	});

	document.getElementById('help').addEventListener('click', function() {
		
		//Get file Location
		var loc = window.location.pathname;
		var dir = loc.substring(0, loc.lastIndexOf('/'));
		var dir2 = "file://"+dir;
		cs.openURLInDefaultBrowser(dir2+"/guide.pdf");

		//popup("Opening Guide in an other page.")
	});

	document.getElementById('backButton').addEventListener('click',function() {
		cs.evalScript('deleteFiles()', function(res) {
			window.location.href = "index.html";
		});
	});

	document.getElementById('endButton').addEventListener('click',function() {
		cs.evalScript('precompile()', function(res) {});
		window.location.href = "index.html";
	});


//---------------------------------------------SLIDERS---------------------------------------------

	//sliderNoise
	let sliderNoise =[document.getElementById("range"), document.getElementById("slidervalue"), document.getElementById("progress")];
	let effectNoise =["CRT Effects", "VISINF Grain Implant", "VISINF Grain Implant-0008"];
	let sliderNoiseDefault = sliderNoise[0].value;

		slider(sliderNoise[0].value ,sliderNoise);
	sliderNoise[0].oninput = function() {
		slider(sliderNoise[0].value ,sliderNoise);
		changeEffect( sliderNoise[0].value/10, effectNoise);
	}
	document.getElementById("reset").onclick = function() {
		slider(sliderNoiseDefault ,sliderNoise); 
		changeEffect( sliderNoiseDefault, effectNoise);
	}
	
	//sliderVibra
	let sliderVibra =[document.getElementById("range2"), document.getElementById("slidervalue2"), document.getElementById("progress2")];
	let effectVibra =["CRT Effects", "ADBE Vibrance", "ADBE Vibrance-0002"];
	let sliderVibraDefault = sliderVibra[0].value;
	
		slider(sliderVibra[0].value ,sliderVibra);
	sliderVibra[0].oninput = function() {
		slider(sliderVibra[0].value ,sliderVibra);
		changeEffect( sliderVibra[0].value,effectVibra);
	}
	document.getElementById("reset2").onclick = function() {
		slider(sliderVibraDefault ,sliderVibra); 
		changeEffect( sliderVibraDefault,effectVibra);
	}
	
	//sliderFocus
	let sliderFocus =[document.getElementById("range3"), document.getElementById("slidervalue3"), document.getElementById("progress3")];
	let effectFocus =["CRT Effects", "ADBE Unsharp Mask2", "ADBE Unsharp Mask2-0001"];
	let sliderFocusDefault = sliderFocus[0].value;
	
		slider(sliderFocus[0].value ,sliderFocus);
	sliderFocus[0].oninput = function() {
		slider(sliderFocus[0].value ,sliderFocus);
		changeEffect( sliderFocus[0].value,effectFocus);
	}
	document.getElementById("reset3").onclick = function() {
		slider(sliderFocusDefault ,sliderFocus); 
		changeEffect( sliderFocusDefault,effectFocus);
	}
	
	//sliderGlow
	let sliderGlow  =[document.getElementById("range4"), document.getElementById("slidervalue4"), document.getElementById("progress4")];
	let effectGlow  =["CRT Glow", "ADBE Glo2", "ADBE Glo2-0004"];
	let sliderGlowDefault = sliderGlow[0].value;
	
		slider(sliderGlow[0].value ,sliderGlow);
	sliderGlow[0].oninput = function() {
		slider(sliderGlow[0].value ,sliderGlow);
		changeEffect( sliderGlow[0].value/10,effectGlow);
	}
	document.getElementById("reset4").onclick = function() {
		slider(sliderGlowDefault, sliderGlow); 
		changeEffect(sliderGlowDefault, effectGlow);
	}

	//sliderExposure
	let sliderExposure  =[document.getElementById("range5"), document.getElementById("slidervalue5"), document.getElementById("progress5")];
	let effectExposure  =["CRT ExposureFIX", "ADBE Brightness & Contrast 2", "ADBE Brightness & Contrast 2-0001"];
	let effectExposure2 =["CRT ExposureFIX", "ADBE Brightness & Contrast 2", "ADBE Brightness & Contrast 2-0002"];
	let sliderExposureDefault = sliderExposure[0].value;
	
		slider(sliderExposure[0].value ,sliderExposure);
	sliderExposure[0].oninput = function() {
		slider(sliderExposure[0].value ,sliderExposure);
		changeEffect( sliderExposure[0].value*1.5,effectExposure );
		changeEffect(-sliderExposure[0].value	 ,effectExposure2);
	}
	document.getElementById("reset5").onclick = function() {
		slider(sliderExposureDefault ,sliderExposure); 
		changeEffect(sliderExposureDefault, effectExposure );
		changeEffect(sliderExposureDefault, effectExposure2);
	}


	//sliderHue
	let sliderHue  =[document.getElementById("range6"), document.getElementById("slidervalue6"), document.getElementById("progress6")];
	let effectHue  =["CC 2", "ADBE HUE SATURATION", "ADBE HUE SATURATION-0008"];
	let sliderHueDefault = sliderHue[0].value;
		sliderHue[1].innerHTML = sliderHueDefault;
		root.style.setProperty("--hue", sliderHue[0].value);

	sliderHue[0].oninput = function() {
		root.style.setProperty("--hue", sliderHue[0].value);
		slider(sliderHue[0].value ,sliderHue);
		changeEffect(sliderHue[0].value,effectHue );
	}
	document.getElementById("reset6").onclick = function() {
		root.style.setProperty("--hue", sliderHue[0].value);
		slider(sliderHueDefault ,sliderHue);
		changeEffect(sliderHueDefault,effectHue );
	}

		


	function changeEffect(value,effectArray) {

		//slider(value ,sliderArray); 
	    cs.evalScript('modifyEffect("'+effectArray[0]+'","'
	                                  +effectArray[1]+'","'
	                                  +effectArray[2]+'","'
	                                  +value+'",)', function() {});
	}

	function slider(value, sliderArray){
	    // arg 0 = slider
	    // arg 1 = output
	    // arg 2 = progressbar
	    sliderArray[0].value = value;
	    sliderArray[1].innerHTML = value;
	    var cur = value - sliderArray[0].min;
	    var max = sliderArray[0].max - sliderArray[0].min;
	    sliderArray[2].style.width = ((cur / max) *100 +"%");
	}








//---------------------------------------------functions---------------------------------------------

function popup(msg){
	var alrt = document.getElementById('alert');
	if (alrt != null){
		alrt.innerText = msg;
		alrt.classList.toggle("anim--fade");
	}
}
//---------------------------------------------toggles---------------------------------------------

document.getElementById('tvToggle').addEventListener('click',function() {
	var check = document.getElementById('tvToggle').checked;
	cs.evalScript('toggleMonitor("'+check+'")', function(res) {});
});

document.getElementById('glitchToggle').addEventListener('click',function() {
	
	var check = document.getElementById('glitchToggle').checked;
	cs.evalScript('toggleGlitch("'+check+'")', function(res) {});
});

}());