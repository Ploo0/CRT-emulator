(function () {//MAIN FUNCTION
	'use strict';

	var cs = new CSInterface();
	var gridSize = 2;
	var autoPreview = false;
	var alrt = document.getElementById('alert');
	let gradient = "linear-gradient( rgba(0,0,0, 0) 0%,rgb(5, 5, 5) 100% ), "

//img array
	var grid = document.getElementById("grid");
	var img = [];
	for(let i = 0; i < grid.childNodes.length; i ++){
		let child = grid.childNodes[i];
		if (child.nodeName == "LABEL"){
			for(let j = 0; j < child.childNodes.length; j ++){	
				let childChild = child.childNodes[j];
				if (childChild.nodeName == "DIV") {
					img.push(childChild);
					//default
					childChild.style.backgroundImage = gradient+"url(thumbnails/JPG/"+childChild.id+".JPG)";
					//mouse over
					childChild.onmouseover = function(){
						if (!autoPreview)
							this.style.backgroundImage = gradient+"url(thumbnails/GIF/"+this.id+".gif)";
					}
					//mouse out
					childChild.onmouseout = function(){
						if (!autoPreview)
							this.style.backgroundImage = gradient+"url(thumbnails/JPG/"+this.id+".JPG)";
					}
				}
			}
		}
	}
	
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

//Remove Loading
	document.addEventListener('DOMContentLoaded',function(){
			let loading = document.getElementById("loadingScreen");
			loading.addEventListener('animationend', function() {
				loading.remove();
			});
			loading.style.animation="fadeOut .5s .5s linear";

			cs.evalScript('isDone()', function(res) {
				//Verify if the process was completed before
				if (res == 1){
					popup("Thank you for using CRT-Emulator !");
				}
			});
	});

	document.getElementById('logo').addEventListener('click', function() {
		cs.openURLInDefaultBrowser("https://fredpelle.tv/");
	});

	document.getElementById('switch').onclick = function(){
		autoPreview = this.checked;
		if(autoPreview){//checked
			img.forEach(element => {
				element.style.backgroundImage = this.style.backgroundImage = gradient+"url(thumbnails/GIF/"+element.id+".gif)";
			});
		}else{
			img.forEach(element => {
				element.style.backgroundImage = this.style.backgroundImage = gradient+"url(thumbnails/JPG/"+element.id+".JPG)";
			});
		}
	}

//Zoom in and out in the grid
	document.getElementById('minus').addEventListener('click', function() {
		gridSize ++;
		changeZoom(gridSize);
	});

	document.getElementById('zoom').addEventListener('click', function() {
		gridSize --;
		changeZoom(gridSize);
	});

//Display the name of the selected layer 
	setInterval(function(){ //Update Layer Name
	
		cs.evalScript('selectedLayer()', function(res) {
			//Draw Layer Name
			if (res == ""){res = "Select a Layer"}
			document.getElementById('layerName').innerHTML = res;
		});
		
	}, 500);//run this thing every half second

	
//Apply the currently selected effect
	document.getElementById('addButton').addEventListener('click', function() {
		//Get selected Value
		var index = getSelected();
		
		//Get file Location
		var loc = window.location.pathname;
		var dir = loc.substring(0, loc.lastIndexOf('/'));
		
		cs.evalScript('applyClick("'+dir+'","'+index+'")', function(res) {
			//After Importing
			switch (res) {
				case "ok":
					window.location.href = "settings.html";
				break;

				default:	
					popup( res.toString() );
				break;
			}
		});
		
	});

	alrt.addEventListener('animationend', function() {
		alrt.classList.toggle("anim--fade");
	});

	function getSelected(){
		var ele = document.getElementsByName('effect');
		for (let i = 0; i < ele.length; i++) {
			if (ele[i].checked)
				return i+1;
		}
	}

	function changeZoom(index){
		let size = "";

		switch(index){

			case 0:
				gridSize = 1;
			break;

			case 1:
				size = "54vw";
			break;
			
			case 2:
				size = "27vw";
			break;

			case 3:
				size = "18vw";
			break;
			
			case 4:
				gridSize = 3;
			break;

		}

		if(size != ""){
			grid.style.gridTemplateColumns = "repeat("+index+",1fr)";
			for (let i = 0; i < document.querySelector("#grid").children.length; i++) {
				var item = document.querySelector("#grid").children[i];
				item.style.height = size;
			}
		}

	}

	function popup(msg){

		alrt.innerText = msg;
		alrt.classList.toggle("anim--fade");
	}
//Media Queries
	function resize(x) {
		if (x.matches) { // If media query matches
		 	//document.body.style.backgroundColor = "yellow";
			changeZoom(1);
		} else {//if normal
			changeZoom(gridSize);
		}
	}

	var x = window.matchMedia("(max-width: 294px)");
	resize(x); // Call listener function at run time
	x.addListener(resize); // Attach listener function on state changes

}());
