var comp,//composition
    mainLayer,//Selected Layer
    currentStyle,//Index of the current Style
    layerEnd,//end point of the clip to import
    assetsFolder,//Folder containing CRT items
    defaultAV,//default Blank layer
    list = [],
    listName = [],
    done = 0,//Shows a popup message (html/js) when done
    circle,
    rectangle,
    rectangle2,
    disp_map;
//var file = "C:/Program Files (x86)/Common Files/Adobe/CEP/extensions/CRTemulator-AE/CRTGRID";
//Test
app.beginUndoGroup("Test");
    

app.endUndoGroup();
//Test END

//MAIN PAGE
function selectedLayer() {
    if (app.project.activeItem == null){
        return "";
    
    }else{//After Validating, running Every functions.
        comp = app.project.activeItem;
        return comp.selectedLayers[0].name.toString();
    }
    
}
//EXT Functions
function applyClick(dir,id){

    if (app.project.activeItem == null){
        //alert("Please, select a composition.");
        return "Please, select a composition.";
    }
    comp = app.project.activeItem;
        //Change here for alarm
    if (comp.selectedLayers.length < 1){
        //alert("Please, select a layer in a composition.");
        return "Please, select a layer in a composition.";
    }else if (comp.selectedLayers.length > 1){
        //alert("Please, select only 1 layer in your composition.");
        return "Please, select only 1 layer in your composition.";
    }else{//After Validating, running Every functions.

    list.splice(0,list.length);

    //Set files Directory
    var a = dir;
        a+= "/CRTGRID";
        var str = a.substring(1);

        var thisFile = new File(str);
        var folder = new Folder(thisFile);

    //Import files & Apply Effects 
        //comp.name = "RollBack8 - Composition"; // ???
        mainLayer = comp.selectedLayers[0];
        app.beginUndoGroup("Emulator");//Apply effect
            setDefaultValues(); 
            importGrid(folder);
            setFolderValues();
            createTempSolid();
            layerLength = mainLayer.outPoint;
            currentStyle = id;
            switch (id) {
                case "1":
                    applyStyle1(mainLayer);
                break;
                case "2":
                    applyStyle2(mainLayer);
                break;
                case "3":
                    applyStyle3(mainLayer);
                break;
                case "4":
                    applyStyle4(mainLayer);
                break;
                case "5":
                    applyStyle5(mainLayer);
                break;
                case "6":
                    applyStyle6(mainLayer);
                break;
                case "7":
                    applyStyle7(mainLayer);
                break;
                case "8":
                    applyStyle8(mainLayer);
                break;
                case "9":
                    applyStyle9(mainLayer);
                break;
                case "10":
                    applyStyle10(mainLayer);
                break;
                case "11":
                    applyStyle11(mainLayer);
                break;
                case "12":
                    applyStyle12(mainLayer);
                break;
                default:
                return "Please, Select a Style.";
                
            }
        app.endUndoGroup();
        return "ok";
    }

    
}

function deleteFiles(){
    app.beginUndoGroup("Removing Layers");
    var elem;
        //remove from layers by altering 
        for(var k = 0; k < list.length; k++){
            elem = list[k];
            if (elem == null) elem = findInComp(listName[k]);
            elem.remove();
        }

        //Remove Folder
        //for(var i = 1; i < app.project.numItems+1 ; i++){
        //    if (app.project.item(i).name == "CRT-Assets"){
        //        app.project.item(i).remove();
        //        break;
        //    }
        //}
        
        //defaultAV.remove();

        list.splice(0,list.length);
        listName.splice(0,listName.length);

    app.endUndoGroup();
}
function verifyGrids(){
    var list = [];
    for(i = 1; i < comp.numLayers ; i++){
        if(comp.layer(i).name == "CRT_LINE" || comp.layer(i).name == "CRT_LINE 2" ||
        comp.layer(i).name == "CRT_CIRCLE" ){
            list.push(comp.layer(i).name);
        }
    }
    if (list.length == 1) list.push("none");
    return list;
}
function hasMonitor(){
    for(i = 1; i < comp.numLayers ; i++){
        if(comp.layer(i).name == "Monitor" ){
            return true;
        }
    }
    return false;
}
function precompile(){

    var newlist = [];
    for (var i = 0; i < list.length; i++) {
        var item = list[i].index;
        list[i].name = "[EZCO] "+ list[i].name;
        newlist.push(item);
    }
    newlist.push(mainLayer.index);
    comp.layers.precompose(newlist,"CRT Effect",true);
    list.splice(0,list.length);
    done = 1;
}
function isDone(){
    if (done == 0)
        return 0;
    else{
        done = 0;
        return 1;
    }
}
//EDITS
function modifyEffect(layername,effect,property,value) {

    for(i = 1; i < comp.numLayers ; i++){
        if(comp.layer(i).name == layername){
            comp.layer(i).property("ADBE Effect Parade")
            .property(effect).property(property).setValue(value);
        }
    } 
}
function changeNoise(value){
    for(i = 1; i < comp.numLayers ; i++){
        if(comp.layer(i).name == "CRT Effects"){
            var effect = comp.layer(i);
            //Item to change
            effect.property("ADBE Effect Parade").property("VISINF Grain Implant").property("VISINF Grain Implant-0008").setValue(value/10);
        }
    } 
}
function toggleMonitor(bool){

    for(i = 1; i < comp.numLayers ; i++){
    
      if(comp.layer(i).name == "Monitor" || comp.layer(i).name == "Lens Distortions" ){
          if (bool == "true"){
              comp.layer(i).enabled = true;
          }else
          if (bool == "false"){
              comp.layer(i).enabled = false;
          }
          //return;
      }
    }
    
}
function toggleGlitch(bool){
    
    for(i = 1; i < comp.numLayers ; i++){
    
      if(comp.layer(i).name == "Glitches"){
          if (bool == "true"){
              comp.layer(i).enabled = true;
          }else
          if (bool == "false"){
              comp.layer(i).enabled = false;
          }
          return;
      }
    }
}
function toggleGrid(value,bool){
    var _name = "";
    
    switch (value) {
      case "Rectangle":
          _name = "CRT_LINE";
      break;
      case "Rectangle 2":
          _name = "CRT_LINE 2";
      break;
      case "Circle":
          _name = "CRT_CIRCLE";
      break;
    }
    for(i = 1; i < comp.numLayers ; i++){
      if(comp.layer(i).name == _name){
    
          if (bool == "true"){
              comp.layer(i).enabled = false;
          }else
          if (bool == "false"){
              comp.layer(i).enabled = true;
          }
    
      }
    } 
    
}
/*
function changeVibrance(value){
    for(i = 1; i < comp.numLayers ; i++){
        if(comp.layer(i).name == "CRT Effects"){
            var effect = comp.layer(i);
            //Item to change
            effect.property("ADBE Effect Parade").property("ADBE Vibrance").property(2).setValue(value);
        }
    } 
}
function changeFocus(value){
    for(i = 1; i < comp.numLayers ; i++){
        if(comp.layer(i).name == "CRT Effects"){
            var effect = comp.layer(i);
            //Item to change
            effect.property("ADBE Effect Parade").property("ADBE Unsharp Mask2").property(1).setValue(value);
        }
    } 
}
function changeGlow(value){
    for(i = 1; i < comp.numLayers ; i++){
        if(comp.layer(i).name == "CRT Glow"){
            var effect = comp.layer(i);
            //Item to change
            effect.property("ADBE Effect Parade").property("ADBE Glo2").property(4).setValue(value/10);
        }
    } 
}
function changeColor(value){
    for(i = 1; i < comp.numLayers ; i++){
        if(comp.layer(i).name == "CC 2"){
            var effect = comp.layer(i);
            //Item to change
            effect.property("ADBE Effect Parade").property("ADBE HUE SATURATION").property(7).setValue(value);
        }
    } 
}
function toggleMonitor(bool){

    for(i = 1; i < comp.numLayers ; i++){

        if(comp.layer(i).name == "Monitor" || comp.layer(i).name == "Lens Distortions" ){
            if (bool == "true"){
                comp.layer(i).enabled = true;
            }else
            if (bool == "false"){
                comp.layer(i).enabled = false;
            }
            //return;
        }
    }

}
function toggleGlitch(bool){

    for(i = 1; i < comp.numLayers ; i++){

        if(comp.layer(i).name == "Glitches"){
            if (bool == "true"){
                comp.layer(i).enabled = true;
            }else
            if (bool == "false"){
                comp.layer(i).enabled = false;
            }
            return;
        }
    }

}
function toggleGrid(value,bool){
    var _name = "";
    //alert(value+"  "+bool);
    switch (value) {
        case "Rectangle":
            _name = "CRT_LINE";
        break;
        case "Rectangle 2":
            _name = "CRT_LINE 2";
        break;
        case "Circle":
            _name = "CRT_CIRCLE";
        break;
    }
    for(i = 1; i < comp.numLayers ; i++){
        if(comp.layer(i).name == _name){

            if (bool == "true"){
                comp.layer(i).enabled = false;
            }else
            if (bool == "false"){
                comp.layer(i).enabled = true;
            }

        }
    } 
}
*/
//Default Functions
function importGrid(location){
    var existed = createFolder();
    if (!existed){
        var thisFile = new File(location);
        var folder = new Folder(thisFile);
        var files = folder.getFiles();
         
        for(var i = 0; i < files.length; i++){   
            //check if import is required
            var footageFile = getFileByName(files[i].name);
            if (footageFile == null)  {
                footageFile = app.project.importFile(new ImportOptions(files[i])); //Import to project
                footageFile.parentFolder = assetsFolder;
            }
        }
    }
}
function setDefaultValues(){
    comp = app.project.activeItem;
      mainLayer = comp.selectedLayers[0];
    layerStart = 0;//change to mainLayer.inPoint
    layerEnd = 1; //change to mainLayer.outPoint
} 
function posToWidth(val){
    return ((comp.width/1920) * val);
}
function posToHeight(val){
    return ((comp.height/1080) * val);
}
function returnStyle(){
    return currentStyle;
}
//STYLES
function applyStyle1(){//Done ?
    
  //Exposure-----------------------------------------------------------------------------
  addExposure();
  
    
    //Displacement Map-----------------------------------------------------------------------------
    var layerDisplacementMap = comp.layers.add(defaultAV);
        applyDefaultParam(layerDisplacementMap,"Displacement Map",BlendingMode.LIGHTEN,null, true, false);
        layerDisplacementMap.property("Scale").setValue([170,100]);
        layerDisplacementMap.opacity.setValue(50);
        layerDisplacementMap.opacity.expression = "wiggle(1,100)";
        layerDisplacementMap("Anchor Point").setValue([0,comp.height/2]);
        layerDisplacementMap.property("Position").setValueAtTime(0,[0, comp.height/2]);
        layerDisplacementMap.property("Position").setValueAtTime(0.2,[comp.width*1.5, comp.height/2]);
        layerDisplacementMap.property("Position").expression = "loopOut()";
        
        var map = layerDisplacementMap.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
            map.property(2).setValue(1);
            map.property(3).setValue(35);
            map.property(3).expression = "wiggle(2,45)";
            map.property(4).setValue(2);
            map.property(5).setValue(0);
            map.property(6).setValue(2);
            map.property(7).setValue(1);
            
        //MASK COMPONENTS
        var maskShape = new Shape();
            var gap = 32;
            var top = -gap, left = -gap, right = posToWidth(212), bottom = comp.height+gap;
            ver = [[right, top],[left, top],[left, bottom],[right, bottom]];
            maskShape.vertices = ver;
        var mask = layerDisplacementMap.Masks.addProperty("Mask");
           mask.property("ADBE Mask Shape").setValue(maskShape);
            mask.property(2).setValue([30,30]);    
        
        list.push(layerDisplacementMap);
        
    //Wave Warp-----------------------------------------------------------------------------
    var layerWaveWarp = comp.layers.add(defaultAV);
        applyDefaultParam(layerWaveWarp,"Wave Warp",null,null, true, false);    
        layerWaveWarp.property("Scale").setValue([100,100]);
        layerWaveWarp.opacity.setValue(100);
        
        var warp = layerWaveWarp.property("ADBE Effect Parade").addProperty("ADBE Wave Warp");
            warp.property(1).setValue(2);
            warp.property(2).setValue(1);
            warp.property(3).setValue(52);
            warp.property(4).setValue(0);
            warp.property(5).setValue(10);
            warp.property(8).setValue(1);
            
        list.push(layerWaveWarp);
    
    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();
        
     //CRT_LINE-----------------------------------------------------------------------------
     var layerLine = comp.layers.add(rectangle);
        applyDefaultParam(layerLine,"CRT_LINE 2",BlendingMode.DARKEN,null,false,true);
        
        layerLine.property("Scale").setValue([250,422]);
        
        var level = layerLine.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(3).setValue(0.35294118523598);
            level.property(4).setValue(0.85490196943283);
            level.property(5).setValue(1.29956030845642);
        
    list.push(layerLine);
            
     //CRT_LINE 2-----------------------------------------------------------------------------
     var layerLine2 = comp.layers.add(rectangle);
        applyDefaultParam(layerLine2,"CRT_LINE",BlendingMode.OVERLAY,null,false,true);
        
        layerLine2.property("Scale").setValue([250,425]);
        
        var level = layerLine2.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(3).setValue(0.43137255311012);
            level.property(4).setValue(0.85490196943283);
            level.property(5).setValue(0.77610397338867);

        var map = layerLine2.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
            map.property(2).setValue(4);
            map.property(3).setValue(7);
            map.property(3).expression = "wiggle(10,25,1,10)";
            map.property(4).setValue(11);//?
            map.property(5).setValue(80);
            
    list.push(layerLine2);
    
    //Posterize Time-----------------------------------------------------------------------------
    var layerPosterizeTime = addPosterize(5,50,[100,100],BlendingMode.LIGHTEN);

        list.push(layerPosterizeTime);
        
    //CC-----------------------------------------------------------------------------
    var layerCC = comp.layers.add(defaultAV);
        applyDefaultParam(layerCC,"CC",null,null, true, false);    
        
        var hue = layerCC.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION");
            hue.property(4).setValue(-50);
            
        var blur = layerCC.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(3);
            blur.property(2).setValue(1);
            blur.property(3).setValue(1);
            blur.property(4).setValue(1);
            
        var mask = layerCC.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            mask.property(1).setValue(200);
            mask.property(2).setValue(3);
            
        var level = layerCC.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(3).setValue(0.17647059261799);
            level.property(4).setValue(0.4705882370472);
            level.property(5).setValue(1.34103691577911);
        
        list.push(layerCC);
    
        
    addGeneralEffects(list);
    addMonitor(list);
    addParent(list);
    
    //Late Changes-----------------------------------------------------------------------------
    layerDisplacementMap.property("ADBE Effect Parade").property("ADBE Displacement Map").property(1).setValue(layerLine2.index );
    
}
function applyStyle2(){//Done

  //Exposure-----------------------------------------------------------------------------
  addExposure();
  
    //Glow-----------------------------------------------------------------------------
    var layerGlow = comp.layers.add(defaultAV);
        applyDefaultParam(layerGlow,"Glow",null,null,true,false); 
       layerGlow.opacity.setValue(65);
    
    var glow = layerGlow.property("ADBE Effect Parade").addProperty("ADBE Glo2");
        glow.property(2).setValue(178.5);
        glow.property(3).setValue(280);
        glow.property(4).setValue(1.5);
        glow.property(4).expression = "wiggle(22,0.6)";
        glow.property(6).setValue(6);
        glow.property(7).setValue(2);
        glow.property(8).setValue(3);
        
    list.push(layerGlow);
    
    //Flicker black-----------------------------------------------------------------------------
    var layerBlack = comp.layers.addShape();
        applyDefaultParam(layerBlack,"Black Flicker",null,null,false,false);
        var pos = layerBlack.property("Transform").property("ADBE Position").dimensionsSeparated = true;
        layerBlack.property("Transform").property("ADBE Position_0").setValue(posToWidth(1024));//x
        layerBlack.property("Transform").property("ADBE Position_1").setValue(posToHeight(458));//y
        layerBlack.property("Transform").property("ADBE Position_1").expression = "wiggle(100,65)";
        layerBlack.property("Opacity").setValue(25);
        layerBlack.property("Opacity").expression = "wiggle(50,10)";
        layerBlack.property("Scale").setValue([110,100]);
     
     //MASK COMPONENTS
     var maskShape = new Shape();
     var gap = 128;
        var top = posToHeight(-884),left = posToWidth(-932),right = posToWidth(815), bottom = posToHeight(270);
        ver = [[right, top],[left, top],[left, bottom],[right, bottom]];
        maskShape.vertices = ver;
    var mask = layerBlack.Masks.addProperty("Mask");
        mask.property("ADBE Mask Shape").setValue(maskShape);
        mask.property(2).setValue([363,363]);
    
    //SHAPE COMPONENTS
        var content = layerBlack.property("Contents");
            var shape = content.addProperty("ADBE Vector Group");
                shape.name = "Rectangle"
                var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
                    rect.property(2).setValue([comp.width,comp.height]);
                    rect.property(4).setValue(0);
                var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                    fill.property(4).setValue([0.04259645424637,0.04943989024443,0.07895220588235,1]);       
                
        list.push(layerBlack);
        
    //Wave warp  DEBUG-----------------------------------------------------------------------------
    var layerWave = comp.layers.add(defaultAV);
        applyDefaultParam(layerWave,"Wave Warp",BlendingMode.LIGHTEN,null,true,false); 
        layerWave.property("Scale").setValue([177,100]);
        
    layerWave.property("Anchor Point").setValue([comp.height/2, comp.height/2]);
    layerWave.property("Position").expression = "loopOut()";
        layerWave.property("Position").setValueAtTime(0,[posToWidth(1073), posToHeight(535)]);//square
            layerWave.property("Position").setInterpolationTypeAtKey(1,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD); 
        layerWave.property("Position").setValueAtTime(0.04,[posToWidth(909), posToHeight(535)]);//square
            layerWave.property("Position").setInterpolationTypeAtKey(1,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD); 
        layerWave.property("Position").setValueAtTime(0.12,[posToWidth(1127), posToHeight(535)]);//square
            layerWave.property("Position").setInterpolationTypeAtKey(1,KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD); 
    
    layerWave.property("Opacity").expression = "loopOut()";
        layerWave.property("Opacity").setValueAtTime(0,50);
        layerWave.property("Opacity").setValueAtTime(0.08,25);
        layerWave.property("Opacity").setValueAtTime(0.16,65);
        layerWave.property("Opacity").setValueAtTime(0.24,3);
        
     var wave = layerWave.property("ADBE Effect Parade").addProperty("ADBE Wave Warp");
        wave.property(1).setValue(6);
        wave.property(2).setValue(360);
        wave.property(3).setValue(9);
        wave.property(4).setValue(0);
        wave.property(5).setValue(4);
        wave.property(7).setValue(150);
        wave.property(8).setValue(1);  
        
    var maskShape = new Shape();
        var gap = 32;
        var top = posToHeight(-216), left = posToWidth(415), right = posToWidth(700), bottom = comp.height+gap;
        ver = [[right, top],[left, top],[left, bottom],[right, bottom]];
        maskShape.vertices = ver;
    var mask2 = layerWave.Masks.addProperty("Mask");
       mask2.property("ADBE Mask Shape").setValue(maskShape);
        mask2.property(2).setValue([203,203]);
        
    list.push(layerWave);     
    
    //Flicker distortions-----------------------------------------------------------------------------
    var layerDistortions = comp.layers.add(defaultAV);
        applyDefaultParam(layerDistortions,"Flicker Distortions",BlendingMode.LIGHTEN,null,true,false); 
        
   var wave2 = layerDistortions.property("ADBE Effect Parade").addProperty("ADBE Wave Warp");
        wave2.property(1).setValue(4);
        wave2.property(2).setValue(7);
        wave2.property(3).setValue(1500);
        wave2.property(4).setValue(0);
        wave2.property(5).setValue(10);
        wave2.property(8).setValue(1);
        
    list.push(layerDistortions);   

    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();

    //CRT_LINE-----------------------------------------------------------------------------
    var layerRectangle = comp.layers.add(rectangle);
        applyDefaultParam(layerRectangle,"CRT_LINE",BlendingMode.DARKEN,null,false,false);
        
        layerRectangle.property("Scale").setValue([200,400]);
        layerRectangle.enabled = false;

        var level2 = layerRectangle.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level2.property(1).setValue(1);
            level2.property(3).setValue(0.17647059261799);
            level2.property(4).setValue(1);
            level2.property(5).setValue(0.36499682068825);
            level2.property(6).setValue(0.04313725605607);
            level2.property(7).setValue(1);

        list.push(layerRectangle);
   
    //CRT_CIRCLE-----------------------------------------------------------------------------
    var layerCircle = comp.layers.add(circle);
        applyDefaultParam(layerCircle,"CRT_CIRCLE",BlendingMode.DARKEN,null,false,false);
        
        layerCircle.property("Scale").setValue([50,50]);
        
        var tile = layerCircle.property("ADBE Effect Parade").addProperty("ADBE Tile");
            tile.property(2).setValue(100);
            tile.property(3).setValue(100);
            tile.property(4).setValue(posToWidth(150));
            tile.property(5).setValue(posToHeight(150));
            tile.property(6).setValue(1);
            tile.property(8).setValue(1);
        
        var blur = layerCircle.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(1);           
            blur.property(2).setValue(1);           
            
        var level = layerCircle.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(3).setValue(0);
            level.property(4).setValue(0.529411765);
            level.property(5).setValue(2.08746290206909);
            level.property(6).setValue(0.180392157);
            level.property(7).setValue(1);
        var sharp = layerCircle.property("ADBE Effect Parade").addProperty("ADBE Sharpen");
            sharp.property("ADBE Sharpen-0001").setValue(25); 
        
        list.push(layerCircle);
        
    //Posterize TIME-----------------------------------------------------------------------------
    var layerPosterize = addPosterize(5,50,[100,100],BlendingMode.LIGHTEN);
        
        list.push(layerPosterize);
               
    //CC-----------------------------------------------------------------------------
    var layerCC = comp.layers.add(defaultAV);
        applyDefaultParam(layerCC,"CC",null,null,true,false);
  
    var hue = layerCC.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION");
        hue.property(4).setValue(-39);
    var blur = layerCC.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
        blur.property(1).setValue(3);
        blur.property(2).setValue(1);
        blur.property(4).setValue(1);
    var mask = layerCC.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
        mask.property(1).setValue(100);
        mask.property(2).setValue(3);
    var level = layerCC.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
        level.property(3).setValue(0.1294117718935);
        level.property(4).setValue(0.39215686917305);
        level.property(5).setValue(0.62449085712433);
    
    list.push(layerCC);       
        
    //create Parent/ Global Scale-----------------------------------------------------------------------------
    addGeneralEffects(list);
    addMonitor(list);
    addParent(list);

}
function applyStyle3(){//Done 2RECTANGLE

  //Exposure-----------------------------------------------------------------------------
  addExposure();
  
    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();
    
     //CTR LINE 1-----------------------------------------------------------------------------
    
    var layerLine = comp.layers.add(rectangle);
        applyDefaultParam(layerLine,"CRT_LINE 2",BlendingMode.DARKEN,null,false,false);
        layerLine.opacity.setValue(95);
        layerLine.property("Scale").setValue([310,525]);
       
        var level = layerLine.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(1).setValue(1);
            level.property(3).setValue(0.52156865596771);
            level.property(4).setValue(0.85490196943283);
            level.property(5).setValue(0.77610397338867);
            level.property(6).setValue(0);
            level.property(7).setValue(1);

        list.push(layerLine);
        
    //CTR LINE 2-----------------------------------------------------------------------------
    
    var layerLine2 = comp.layers.add(rectangle);
        applyDefaultParam(layerLine2,"CRT_LINE",BlendingMode.DARKEN,null,false,false);
        layerLine2.property("Scale").setValue([315,530]);
        
        var level2 = layerLine2.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level2.property(1).setValue(1);
            level2.property(3).setValue(0.43137255311012);
            level2.property(4).setValue(0.85490196943283);
            level2.property(5).setValue(0.77610397338867);
            level2.property(6).setValue(0);
            level2.property(7).setValue(1);
            
        list.push(layerLine2);
    
    //WAVE WARP / GLITCH SCREEN -----------------------------------------------------------------------------
    var layerWave = comp.layers.add(defaultAV);
        applyDefaultParam(layerWave,"Glitch Screen",BlendingMode.LIGHTEN, TrackMatteType.ALPHA ,true,false);
        
        layerWave.property("Opacity").setValueAtTime(0,100);
        layerWave.property("Opacity").setValueAtTime(0.24,0);
        layerWave.property("Opacity").setValueAtTime(0.72,48);
        layerWave.property("Opacity").setValueAtTime(1.16,1);
        layerWave.property("Opacity").setValueAtTime(1.64,100);
        layerWave.property("Opacity").setValueAtTime(2.28,0);
        layerWave.property("Opacity").expression = "loopOut()";
    
    var wave = layerWave.property("ADBE Effect Parade").addProperty("ADBE Wave Warp");
        wave.property(1).setValue(2);
        wave.property(2).setValue(86 );
        wave.property(2).expression = "wiggle(2,25)";
        wave.property(3).setValue(6);
        wave.property(4).setValue(0);
        wave.property(5).setValue(4);
        wave.property(7).setValue(150);
        wave.property(8).setValue(1);
        
        list.push(layerWave);
    
    //MASK-----------------------------------------------------------------------------
    var layerMask = comp.layers.addShape();
        applyDefaultParam(layerMask,"Mask",null,null,false,false); 
        layerMask.property("Scale").setValue([184,58]);
        layerMask.enabled = false;
        
        layerMask.property("Opacity").setValueAtTime(-0.44,0);
            layerMask.property("Opacity").setInterpolationTypeAtKey(1,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD); 
        layerMask.property("Opacity").setValueAtTime(-0.2,50);
            layerMask.property("Opacity").setInterpolationTypeAtKey(2,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        layerMask.property("Opacity").setValueAtTime(0.12,0);
            layerMask.property("Opacity").setInterpolationTypeAtKey(3,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        layerMask.property("Opacity").setValueAtTime(0.64,50);
            layerMask.property("Opacity").setInterpolationTypeAtKey(4,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        layerMask.property("Opacity").setValueAtTime(1,0);
            layerMask.property("Opacity").setInterpolationTypeAtKey(5,KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);
        layerMask.property("Opacity").expression = "loopOut()";
        
        layerMask.property("Position").setValueAtTime(-0.04,[comp.width/2, posToHeight(1123)]);
        layerMask.property("Position").setValueAtTime(0.08,[comp.width/2, posToHeight(-190)]);
        layerMask.property("Position").expression = "loopOut()";
        
        var boxBlur = layerMask.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            boxBlur.property(1).setValue(10);
            
    //SHAPE COMPONENTS
        var content = layerMask.property("Contents");
            var shape = content.addProperty("ADBE Vector Group");
                shape.name = "Rectangle 1";
            var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rect.property(2).setValue([comp.width,comp.height]);
                rect.property(4).setValue(20);
            var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fill.property(4).setValue([0.15735294117647,0.13089363247741,0.13089363247741,1]); 
                
        list.push(layerMask);
    
    //MOTION FLICKER-----------------------------------------------------------------------------
    var layerMotion = addMotionFlicker(50);
            
        var tile = layerMotion.property("ADBE Effect Parade").addProperty("ADBE Tile");
            tile.property(4).setValue(posToWidth(120));
            tile.property(5).setValue(posToHeight(120));
            tile.property(6).setValue(1);
            tile.property(8).setValue(1);
        
        list.push(layerMotion);
    
    //POSTERIZE TIME-----------------------------------------------------------------------------
    var layerPosterize = addPosterize(5,50,[355,200],BlendingMode.LIGHTEN);
        
        list.push(layerPosterize);
    
    //CC-----------------------------------------------------------------------------
    var layerCC = comp.layers.add(defaultAV);
            applyDefaultParam(layerCC,"CC",null,null,true,false);  

        var boxBlur = layerCC.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            boxBlur.property(1).setValue(3);
            boxBlur.property(2).setValue(1);
            boxBlur.property(4).setValue(1);        
        var unsharpMask = layerCC.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            unsharpMask.property(1).setValue(120);
            unsharpMask.property(2).setValue(20);
        var levelCC = layerCC.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            levelCC.property(3).setValue(0.07843137532473);
            levelCC.property(4).setValue(0.29803922772408);
            levelCC.property(5).setValue(1.51096189022064);
            levelCC.property(6).setValue(0);
            levelCC.property(7).setValue(1);
    
    list.push(layerCC);
    
    //CHANNEL BLUR-----------------------------------------------------------------------------
    var layerBlur = comp.layers.add(defaultAV);
        applyDefaultParam(layerBlur,"Channel Blur",BlendingMode.ADD,null,true,false);
        layerBlur.opacity.setValue(50);
            
        var channelBlur = layerBlur.property("ADBE Effect Parade").addProperty("ADBE Channel Blur");
            channelBlur.property(1).setValue(5);
            channelBlur.property(2).setValue(35);
            channelBlur.property(3).setValue(56);
    
    list.push(layerBlur);
    
    //FLICKER-----------------------------------------------------------------------------
        var layerFlicker = comp.layers.add(defaultAV);
        applyDefaultParam(layerFlicker,"Flicker",null,null, true, false);

        layerFlicker.property("ADBE Effect Parade").addProperty("ADBE Exposure2");
            layerFlicker.property("ADBE Effect Parade").property(1).property(3).expression = "wiggle(22,1)";

    list.push(layerFlicker);
    
    //Global Scale-----------------------------------------------------------------------------
    addGeneralEffects(list);
    addParent(list);

}
function applyStyle4(){//Done 2RECTANGLE

  //Exposure-----------------------------------------------------------------------------
  addExposure();
  
    //GLITCH SCREEN-----------------------------------------------------------------------------
    var glitchScreen = comp.layers.add(defaultAV);
        applyDefaultParam(glitchScreen,"Glitch Screen",BlendingMode.LIGHTEN,TrackMatteType.ALPHA, true, false);
        
        glitchScreen.property("Opacity").setValueAtTime(0,100);
        glitchScreen.property("Opacity").setValueAtTime(0.24,0);
        glitchScreen.property("Opacity").setValueAtTime(0.72,48);
        glitchScreen.property("Opacity").setValueAtTime(1.16,1);
        glitchScreen.property("Opacity").setValueAtTime(1.64,100);
        glitchScreen.property("Opacity").setValueAtTime(2.28,0);
        glitchScreen.property("Opacity").expression = "loopOut()";
        
        var wave = glitchScreen.property("ADBE Effect Parade").addProperty("ADBE Wave Warp");
            wave.property(1).setValue(2);
            wave.property(2).setValue(86);
            wave.property(2).expression = "wiggle(2,25)";
            wave.property(3).setValue(6);
            wave.property(4).setValue(0);
            wave.property(5).setValue(4);
            wave.property(7).setValue(150);
            wave.property(8).setValue(1);
         
        list.push(glitchScreen);
        
    //MASK-----------------------------------------------------------------------------
    var mask = comp.layers.addShape();
        applyDefaultParam(mask,"Mask",null,null, false, false);
        //mask.property("Scale").setValue([184,58]);
        
        mask.enabled = false;

        mask.property("Position").setValueAtTime(-0.04,[ comp.width/2 , posToHeight(1123) ]);
        mask.property("Position").setValueAtTime(0.08, [ comp.width/2 , posToHeight(-190) ]);
        mask.property("Position").expression =  "loopOut()";
        
        mask.property("Opacity").setValueAtTime(-0.44,0);
            mask.property("Opacity").setInterpolationTypeAtKey(1,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        mask.property("Opacity").setValueAtTime(-0.2,50);
            mask.property("Opacity").setInterpolationTypeAtKey(2,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        mask.property("Opacity").setValueAtTime(0.12,0);
            mask.property("Opacity").setInterpolationTypeAtKey(3,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        mask.property("Opacity").setValueAtTime(0.64,50);
            mask.property("Opacity").setInterpolationTypeAtKey(4,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        mask.property("Opacity").setValueAtTime(1,0);
            mask.property("Opacity").setInterpolationTypeAtKey(5,KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);
        mask.property("Opacity").expression = "loopOut()";
        
        var blur = mask.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(10);
            blur.property(2).setValue(3);
            
        //SHAPE COMPONENTS---
        var content = mask.property("Contents");
            var shape = content.addProperty("ADBE Vector Group");
                shape.name = "Rectangle";
                var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rect.property(2).setValue([comp.width,comp.height*0.58]);
                rect.property(4).setValue(20);
            var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fill.property(4).setValue([0.15735294117647,0.13089363247741,0.13089363247741,1]); 
        
        list.push(mask);   
        
    //LIGHT FLICKER-----------------------------------------------------------------------------
    var lightFlicker = comp.layers.addShape();
        applyDefaultParam(lightFlicker,"Light Flicker",BlendingMode.ADD,null, false, false);
        lightFlicker.opacity.setValue(50);
        //lightFlicker.property("Scale").setValue([186,63]);
        
        lightFlicker.property("Position").setValueAtTime(-0.04,[ comp.width/2 , posToHeight(1123) ]);
        lightFlicker.property("Position").setValueAtTime(0.08, [ comp.width/2 , posToHeight(-190) ]);
        lightFlicker.property("Position").expression =  "loopOut()";
        
        var blur = lightFlicker.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(3);
            blur.property(2).setValue(1);
        
        //SHAPE COMPONENTS---
        var content = lightFlicker.property("Contents");
            var shape = content.addProperty("ADBE Vector Group");
                shape.name = "Rectangle";
            var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rect.property(2).setValue([comp.width,comp.height*0.63]);
                rect.property(4).setValue(20);
            var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fill.property(4).setValue([0.11084558823529,0.11084558823529,0.11084558823529,1]); 
        
        list.push(lightFlicker);  
        
    //MOTION FLICKER-----------------------------------------------------------------------------
    var motionFlicker = addMotionFlicker(50);

        var geometry = motionFlicker.property("ADBE Effect Parade").property("ADBE Geometry2");
            geometry.property("Position").setInterpolationTypeAtKey(1,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD); 
            geometry.property("Position").setInterpolationTypeAtKey(2,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
            geometry.property("Position").setInterpolationTypeAtKey(3,KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);

         
        list.push(motionFlicker);   
        
    //CC-----------------------------------------------------------------------------
    var CC = comp.layers.add(defaultAV);
        applyDefaultParam(CC,"CC",null,null, true, false);
        
        var blur = CC.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(6);
            blur.property(2).setValue(1);
            blur.property(4).setValue(1);
       
       var mask = CC.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            mask.property(1).setValue(75);
            mask.property(2).setValue(10);

        var level3 = CC.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level3.property(1).setValue(1);
            level3.property(3).setValue(0.14117647707462);
            level3.property(4).setValue(0.61568629741669);
            level3.property(5).setValue(1.45943164825439);
        
        list.push(CC);

    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();
            
    //CRT GRID RECTANGLE (img)-----------------------------------------------------------------------------
        var layerLine = comp.layers.add(rectangle);
        applyDefaultParam(layerLine,"CRT_LINE 2",BlendingMode.COLOR_DODGE,null,false,false);

        layerLine.property("Scale").setValue([300,600]);
       
        var level = layerLine.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(1).setValue(1);
            level.property(3).setValue(0.48627451062202);
            level.property(4).setValue(1);
            level.property(5).setValue(0.4187131524086);
            level.property(7).setValue(0.52941179275513);

        list.push(layerLine);
        
    //CRT GRID RECTANGLE 2 (img)-----------------------------------------------------------------------------
        var layerLine2 = comp.layers.add(rectangle);
        applyDefaultParam(layerLine2,"CRT_LINE",BlendingMode.LIGHTER_COLOR,null,false,false);
        layerLine2.opacity.setValue(30); 
        layerLine2.opacity.expression="wiggle(10,10)";
        
        layerLine2.property("Scale").setValue([300,600]);
        
        var level2 = layerLine2.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level2.property(1).setValue(1);
            level2.property(3).setValue(0.80000001192093);
            level2.property(4).setValue(1);
            level2.property(5).setValue(0.50250035524368);

        list.push(layerLine2);
        
    //POSTERIZE TIME-----------------------------------------------------------------------------
    var posterizeTime = addPosterize(10,50,[100,100],BlendingMode.ADD);   
        
        list.push(posterizeTime);    
        
    //CC2-----------------------------------------------------------------------------
    var CC2 = comp.layers.add(defaultAV);
        applyDefaultParam(CC2,"CC 2",null,null, true, false);
        
        var level = CC2.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(1).setValue(1);
            level.property(5).setValue(0.45519462227821);
            level.property(6).setValue(0.10980392247438);
            
        var mixer = CC2.property("ADBE Effect Parade").addProperty("ADBE CHANNEL MIXER");
            mixer.property(3).setValue(-21);

    
        list.push(CC2);       
        
    //Global Scale-----------------------------------------------------------------------------
    addGeneralEffects(list);
    addMonitor(list);
    addParent(list);
   
}
function applyStyle5(){//??? done
    
  //Exposure-----------------------------------------------------------------------------
  addExposure();
  
    //Motion Flicker (not like the others)-----------------------------------------------------------------------------
    var  layerMotionFlicker = comp.layers.add(defaultAV);
        applyDefaultParam(layerMotionFlicker,"Motion Flicker",null,null, true, false);   
        layerMotionFlicker.property("Scale").setValue([177,100]);//?????
        
    var boxBlur = layerMotionFlicker.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");    
            boxBlur.property(1).setValue(2);
            boxBlur.property(1).expression = "wiggle (14,2,1,1)";
            boxBlur.property(2).setValue(1);
            boxBlur.property(4).setValue(1);
    var map = layerMotionFlicker.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");   
            map.property(2).setValue(7);
            map.property(3).setValue(2);
            map.property(4).setValue(5);
            map.property(5).setValue(0);
            map.property(5).expression = "wiggle(30,5)";
    list.push(layerMotionFlicker);

    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();
    
    //CRT_LINE-----------------------------------------------------------------------------
    var layerRectangle = comp.layers.add(rectangle);
        applyDefaultParam(layerRectangle,"CRT_LINE",BlendingMode.DARKEN,null,false,true);
        
        layerRectangle.property("Scale").setValue([250,420]);
        layerRectangle.enabled = false;
        
        var level2 = layerRectangle.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level2.property(1).setValue(1);
            level2.property(3).setValue(0.27843138575554);
            level2.property(5).setValue(0.54499608278275);
            level2.property(7).setValue(0.84705883264542);

        list.push(layerRectangle);
        
    //CRT_CIRCLE-----------------------------------------------------------------------------
    var layerCircle = comp.layers.add(circle);
        applyDefaultParam(layerCircle,"CRT_CIRCLE",BlendingMode.DARKEN,null,false,true);
        
        layerCircle.property("Scale").setValue([50,50]);
        
        var level = layerCircle.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(5).setValue(1.4397646188736);
            level.property(6).setValue(0.11372549086809);

        var sharp = layerCircle.property("ADBE Effect Parade").addProperty("ADBE Sharpen");
            sharp.property("ADBE Sharpen-0001").setValue(25); 
        list.push(layerCircle);
            
    //CC-----------------------------------------------------------------------------
    var  layerCC = comp.layers.add(defaultAV);
        applyDefaultParam(layerCC,"CC",null,null, true, false);  
    
        var blur = layerCC.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(4);
            blur.property(2).setValue(1);
            blur.property(4).setValue(1);
        var mask = layerCC.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            mask.property(1).setValue(80);
            mask.property(2).setValue(4.4);
        var level = layerCC.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(1).setValue(1);
            level.property(4).setValue(0.45098039507866);
            level.property(5).setValue(2.29391360282898);
            level.property(6).setValue(-0.43921568989754);
        var mixer = layerCC.property("ADBE Effect Parade").addProperty("ADBE CHANNEL MIXER");
            mixer.property(2).setValue(41);
            mixer.property(3).setValue(-44);
    
    list.push(layerCC);
    
    //Glow-----------------------------------------------------------------------------
    var layerGlow = comp.layers.add(defaultAV);
        applyDefaultParam(layerGlow,"Glow",null,null, true, false);    
        layerGlow.property("Scale").setValue([177,100]);
         
    var glow = layerGlow.property("ADBE Effect Parade").addProperty("ADBE Glo2");
        glow.property(2).setValue(235.6);
        glow.property(3).setValue(186);
        glow.property(4).setValue(0.6);
        glow.property(4).expression = "wiggle(22.8,1)"
        
    list.push(layerGlow);
    
    //Global Scale-----------------------------------------------------------------------------
    addGeneralEffects(list);
    addParent(list);
   
}
function applyStyle6(){//Done

  //Exposure-----------------------------------------------------------------------------
  addExposure();
  
    //Flick-----------------------------------------------------------------------------IS A SHAPE
    var layerFlick = addFlick();
            
        list.push(layerFlick);
    
    //Mosaic-----------------------------------------------------------------------------
    var layerMosaic = comp.layers.add(defaultAV);
        applyDefaultParam(layerMosaic,"Mosaic",null,null, true, false);    
        layerMosaic.property("Scale").setValue([177,100]);
        layerMosaic.opacity.setValue(74);
         
        var mosaic = layerMosaic.property("ADBE Effect Parade").addProperty("ADBE Mosaic");
            mosaic.property(1).setValue(400);
            mosaic.property(2).setValue(300);
            mosaic.property(3).setValue(1);
        
    list.push(layerMosaic);
    
    //Motion Distortion----------------------------------------------------------------------------- 
    var layerMotionDistortion = comp.layers.add(defaultAV);
        applyDefaultParam(layerMotionDistortion,"Motion Distortion",null,null, true, false);    
        layerMotionDistortion.property("Scale").setValue([177,100]);
        
        var map = layerMotionDistortion.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
            map.property(2).setValue(5);
            map.property(3).setValue(5);
            map.property(4).setValue(5);
            map.property(5).setValue(2);
            map.property(5).expression = "wiggle(120,5)";
            map.property(6).setValue(2);
         
    list.push(layerMotionDistortion);

    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();
    
    //CRT_LINE-----------------------------------------------------------------------------
    var layerRectangle = comp.layers.add(rectangle);
        applyDefaultParam(layerRectangle,"CRT_LINE",BlendingMode.DARKEN,null,false,false);
        
        layerRectangle.property("Scale").setValue([250,420]);
        
        var level = layerRectangle.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(1).setValue(1);
            level.property(3).setValue(0.43137255311012);
            level.property(4).setValue(0.85490196943283);
            level.property(5).setValue(0.77610397338867);
            
        //var hue = layerRectangle.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION");
        var hue = layerRectangle.property("ADBE Effect Parade").addProperty("ADBE Color Balance (HLS)");
            
            hue.property(1).setValueAtTime(0,0);
            hue.property(1).setValueAtTime(2,1800);
            hue.property(2).setValueAtTime(0,0);
            hue.property(2).setValueAtTime(2,2);

    list.push(layerRectangle);
    
    //Motion Flicker-----------------------------------------------------------------------------
    var motionFlicker = addMotionFlicker(50);

    list.push(motionFlicker);
    
    //CC-----------------------------------------------------------------------------
    var  layerCC = comp.layers.add(defaultAV);
        applyDefaultParam(layerCC,"CC",null,null, true, false);  
        layerCC.property("Scale").setValue([177,100]);

        var hue = layerCC.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION");
            hue.property(3).setValue(398);
            hue.property(4).setValue(-100);
            hue.property(5).setValue(-9);
        
        var blur = layerCC.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(1.5);
            blur.property(2).setValue(1);
            blur.property(4).setValue(1);
            
        var mask = layerCC.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            mask.property(1).setValue(100);
            mask.property(2).setValue(10);
        
        var level = layerCC.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(4).setValue(0.35686275362968);
            level.property(5).setValue(0.44057258963585);
            level.property(7).setValue(0.87058824300766);
            
    
    list.push(layerCC);
    //Channel Blur-----------------------------------------------------------------------------
    var layerChannelBlur = comp.layers.add(defaultAV);
        applyDefaultParam(layerChannelBlur,"Channel Blur",null,null, true, false);    
        layerChannelBlur.property("Scale").setValue([177,100]);
        
    var level = layerChannelBlur.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");//RGB
        //RGB
        level.property(5).setValue(0.22616910934448);
        //GREEN
        level.property(1).setValue(3);
        level.property(4).setValue(0.93333333730698);
        level.property(5).setValue(0.45187425613403);
        level.property(6).setValue(0.73333334922791);
        // BLUE
        level.property(1).setValue(4);
        level.property(5).setValue(0.51);
    var channelBlur = layerChannelBlur.property("ADBE Effect Parade").addProperty("ADBE Channel Blur");     
         channelBlur.property(3).setValue(34);
        
    list.push(layerChannelBlur);
    
    //Posterize Time-----------------------------------------------------------------------------
    var layerPosterize = addPosterize(7,50,[177,100],BlendingMode.LIGHTEN);   
        applyDefaultParam(layerPosterize,"Posterize Time",BlendingMode.LIGHTEN,null, true, false);    
        layerPosterize.property("Scale").setValue([177,100]);
        layerPosterize.opacity.setValue(50);
        
        var posterize = layerPosterize.property("ADBE Effect Parade").addProperty("ADBE Posterize Time");
            posterize.property(1).setValue(7);
        
    list.push(layerPosterize);
    
    //Global Scale-----------------------------------------------------------------------------
    addGeneralEffects(list);
    addMonitor(list);
    addParent(list);

    //Late Changes-----------------------------------------------------------------------------
    map.property(1).setValue(layerRectangle.index);

}
function applyStyle7(){//Done
    
  //Exposure-----------------------------------------------------------------------------
  addExposure();
  
    //Flick-----------------------------------------------------------------------------IS A SHAPE
    var layerFlick = addFlick();
        
    list.push(layerFlick);
    
    //Mosaic-----------------------------------------------------------------------------
    var layerMosaic = comp.layers.add(defaultAV);
        applyDefaultParam(layerMosaic,"Mosaic",null,null, true, false);    
        layerMosaic.opacity.setValue(74);
         
        var mosaic = layerMosaic.property("ADBE Effect Parade").addProperty("ADBE Mosaic");
            mosaic.property(1).setValue(400);
            mosaic.property(2).setValue(300);
            mosaic.property(3).setValue(1);
        
    list.push(layerMosaic);
    
    //Motion Distortion----------------------------------------------------------------------------- 
    var layerMotionDistortion = comp.layers.add(defaultAV);
        applyDefaultParam(layerMotionDistortion,"Motion Distortion",null,null, true, false);    
        
        var map = layerMotionDistortion.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
            map.property(2).setValue(5);
            map.property(3).setValue(5);
            map.property(4).setValue(5);
            map.property(5).setValue(2);
            map.property(5).expression = "wiggle(120,5)";
            map.property(6).setValue(2);
         
    list.push(layerMotionDistortion);

    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();
    
    //CRT_LINE-----------------------------------------------------------------------------
    var layerRectangle = comp.layers.add(rectangle);
        applyDefaultParam(layerRectangle,"CRT_LINE",BlendingMode.DARKER_COLOR,null,false,false);
        
        layerRectangle.property("Scale").setValue([250,420]);
        
        var level = layerRectangle.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(1).setValue(1);
            level.property(3).setValue(0.43137255311012);
            level.property(4).setValue(0.85490196943283);
            level.property(5).setValue(0.77610397338867);

    list.push(layerRectangle);
    
    //Motion Flicker-----------------------------------------------------------------------------
    var motionFlicker = addMotionFlicker(50);
                
    list.push(motionFlicker);
    
    //CC-----------------------------------------------------------------------------
    var  layerCC = comp.layers.add(defaultAV);
        applyDefaultParam(layerCC,"CC",null,null, true, false);  
        var hue = layerCC.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION");
            hue.property(3).setValue(347);
            hue.property(4).setValue(-100);
            hue.property(5).setValue(-9);
        
        var blur = layerCC.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(2.5);
            blur.property(2).setValue(1);
            blur.property(4).setValue(1);
            
        var mask = layerCC.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            mask.property(1).setValue(150);
            mask.property(2).setValue(7);
        
        var level = layerCC.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(4).setValue(0.35686275362968);
            level.property(5).setValue(0.44057258963585);
            level.property(7).setValue(0.87058824300766);
            
    
    list.push(layerCC);
    //Channel Blur-----------------------------------------------------------------------------
    var layerChannelBlur = comp.layers.add(defaultAV);
        applyDefaultParam(layerChannelBlur,"Channel Blur",null,null, true, false);    
        
    var level = layerChannelBlur.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");//RGB
        //RGB
        level.property(5).setValue(0.22616910934448);
        //GREEN
        level.property(1).setValue(3);
        level.property(4).setValue(0.93333333730698);
        level.property(5).setValue(0.45187425613403);
        level.property(6).setValue(0.73333334922791);
        // BLUE
        level.property(1).setValue(4);
        level.property(5).setValue(0.51);
        
    var channelBlur = layerChannelBlur.property("ADBE Effect Parade").addProperty("ADBE Channel Blur");     
         channelBlur.property(3).setValue(34);
         
    var channelMix = layerChannelBlur.property("ADBE Effect Parade").addProperty("ADBE CHANNEL MIXER");     
        channelMix.property(2).setValue(36);
        channelMix.property(3).setValue(-21);
        channelMix.property(9).setValue(101);
        channelMix.property(11).setValue(174);
        
    list.push(layerChannelBlur);
    
    //Posterize Time-----------------------------------------------------------------------------
    var layerPosterize = addPosterize(13,50,[100,100],BlendingMode.LIGHTEN);
        
    list.push(layerPosterize);
   
    //Global Scale-----------------------------------------------------------------------------
    addGeneralEffects(list);
    addMonitor(list);
    addParent(list);
          
    //Late Changes-----------------------------------------------------------------------------
    map.property(1).setValue(layerRectangle.index);
        

}
function applyStyle8(){//Done

  //Exposure-----------------------------------------------------------------------------
  addExposure();
  

    //FLICK-----------------------------------------------------------------------------IS A SHAPE
    var layerFlick = addFlick();
            
        list.push(layerFlick);
        
    //Displacement Map-----------------------------------------------------------------------------
    var displacementMap = comp.layers.add(defaultAV);
        applyDefaultParam(displacementMap,"Displacement Map",BlendingMode.HUE,null, true, false);
        
        displacementMap.property("Opacity").setValueAtTime(0,0);
            displacementMap.property("Opacity").setInterpolationTypeAtKey(1,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);    
        displacementMap.property("Opacity").setValueAtTime(0.12,50);
            displacementMap.property("Opacity").setInterpolationTypeAtKey(2,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        displacementMap.property("Opacity").setValueAtTime(0.32,80);
            displacementMap.property("Opacity").setInterpolationTypeAtKey(3,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        displacementMap.property("Opacity").setValueAtTime(0.44,20);
            displacementMap.property("Opacity").setInterpolationTypeAtKey(4,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        displacementMap.property("Opacity").setValueAtTime(0.63,0);
            displacementMap.property("Opacity").setInterpolationTypeAtKey(5,KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);
        displacementMap.property("Opacity").setValueAtTime(0.76,5);
            displacementMap.property("Opacity").setInterpolationTypeAtKey(6,KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);
        displacementMap.property("Opacity").setValueAtTime(1.12,2);
            displacementMap.property("Opacity").setInterpolationTypeAtKey(7,KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);
                displacementMap.property("Opacity").expression = "loopOut()";
            
        var tile = displacementMap.property("ADBE Effect Parade").addProperty("ADBE Tile");
            tile.property(2).setValue(100);
            tile.property(3).setValue(100);
            tile.property(4).setValue(posToWidth(150));
            tile.property(5).setValue(posToHeight(150));
            tile.property(6).setValue(1);
            tile.property(8).setValue(1);
            
        var map = displacementMap.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
            map.property(2).setValue(11);
            map.property(3).setValue(0);
            map.property(4).setValue(5);
            map.property(5).setValue(137);
            map.property(6).setValue(1);
        
        list.push(displacementMap);
        
    //Wave Warp-----------------------------------------------------------------------------
    var WaveWarp = comp.layers.add(defaultAV);
        applyDefaultParam(WaveWarp,"Wave Warp",null,null, true, false);    

        var warp = WaveWarp.property("ADBE Effect Parade").addProperty("ADBE Wave Warp");
            warp.property(1).setValue(1);
            warp.property(2).setValue(1);
            warp.property(3).setValue(305.7);
            warp.property(4).setValue(90);
            warp.property(5).setValue(10);
            warp.property(6).setValue(3);
            warp.property(8).setValue(1);
        
        list.push(WaveWarp);      
        
    //Distortions-----------------------------------------------------------------------------
    var layerDistortions = comp.layers.add(defaultAV);
        applyDefaultParam(layerDistortions,"Distortions",BlendingMode.LIGHTEN,TrackMatteType.ALPHA, true, false);
        layerDistortions.property("Scale").setValue([177,100]);
        layerDistortions.property("Anchor Point").setValue([comp.height/2, comp.height/2]);

        
        layerDistortions.property("Opacity").setValueAtTime(0,50);
        layerDistortions.property("Opacity").setValueAtTime(0.08,10);
        layerDistortions.property("Opacity").setValueAtTime(0.16,65);
        layerDistortions.property("Opacity").setValueAtTime(0.23,3);
            layerDistortions.property("Opacity").expression = "loopOut()";
            
        var wave = layerDistortions.property("ADBE Effect Parade").addProperty("ADBE Wave Warp");
            wave.property(1).setValue(6);
            wave.property(2).setValue(240);
            wave.property(3).setValue(6);
            wave.property(4).setValue(0);
            wave.property(5).setValue(4);
            wave.property(7).setValue(150);
            wave.property(8).setValue(1);
    
    //SHAPE COMPONENT
    var maskShape = new Shape();
        var gap = 64;
        var top = posToHeight(640), left = -gap, right = comp.width+gap, bottom = comp.height+gap;
        ver = [[right, top],[left, top],[left, bottom],[right, bottom]];
        maskShape.vertices = ver;
    var mask2 = layerDistortions.Masks.addProperty("Mask");
       mask2.property("ADBE Mask Shape").setValue(maskShape);
        mask2.property(2).setValue([203,203]);
        
        list.push(layerDistortions );       
        
    //Mask-----------------------------------------------------------------------------
    var layerMask = comp.layers.addShape();
        applyDefaultParam(layerMask,"Mask",null,null, false, false);  
        layerMask.enabled = false;
        
        
        layerMask.property("Opacity").setValueAtTime(0,0);
            layerMask.property("Opacity").setInterpolationTypeAtKey(1,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);    
        layerMask.property("Opacity").setValueAtTime(0.28,20);
            layerMask.property("Opacity").setInterpolationTypeAtKey(2,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        layerMask.property("Opacity").setValueAtTime(0.76,80);
            layerMask.property("Opacity").setInterpolationTypeAtKey(3,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        layerMask.property("Opacity").setValueAtTime(1.64,0);
            layerMask.property("Opacity").setInterpolationTypeAtKey(4,KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.HOLD);
        layerMask.property("Opacity").setValueAtTime(3,10);
            layerMask.property("Opacity").setInterpolationTypeAtKey(5,KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);   
   
    
    //SHAPE COMPONENT
    var content = layerMask.property("Contents");
        var shape = content.addProperty("ADBE Vector Group");
            shape.name = "Rectangle";
        var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
            rect.property(2).setValue([comp.width,comp.height]);
        var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
            fill.property(4).setValue([0,0,0,1]);
            
        list.push(layerMask);     
        
    //Glow-----------------------------------------------------------------------------
    var layerGlow = comp.layers.add(defaultAV);
        applyDefaultParam(layerGlow,"Glow",null,null, true, false); 
        
        layerGlow.opacity.setValueAtTime(0,50);
        layerGlow.opacity.setValueAtTime(0.08,25);
        layerGlow.opacity.setValueAtTime(0.16,65);
        layerGlow.opacity.setValueAtTime(0.24,3);
            layerGlow.opacity.expression = "loopOut()";
        
        var glow = layerGlow.property("ADBE Effect Parade").addProperty("ADBE Glo2");
            glow.property(2).setValue(216.75);
            glow.property(3).setValue(73);
            glow.property(6).setValue(1);
            glow.property(7).setValue(2);
            glow.property(8).setValue(3);
            glow.property(12).setValue([0.87513875961304, 0.90818345546722, 0.96876531839371, 1]);
            glow.property(13).setValue([0.09233371913433, 0.3329510986805, 0.61960786581039, 1]);
            
        list.push(layerGlow);    
        
    //CC-----------------------------------------------------------------------------
    var layerCC = comp.layers.add(defaultAV);
        applyDefaultParam(layerCC,"CC",null,null, true, false);    
            layerCC.expression = "loopOut()";
            
        var blur = layerCC.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(5);
            blur.property(2).setValue(1);
            blur.property(4).setValue(1);
        var mask = layerCC.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            mask.property(1).setValue(108);
            mask.property(2).setValue(3);
        var level = layerCC.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(3).setValue(0.13333334028721);
            level.property(4).setValue(0.59607845544815);
            level.property(5).setValue(0.95190572738647);
            
        list.push(layerCC);

    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();
            
    //CRT_LINE-----------------------------------------------------------------------------
    var layerRectangle = comp.layers.add(rectangle);
        applyDefaultParam(layerRectangle,"CRT_LINE 2",BlendingMode.OVERLAY,null,false,false);
        
        layerRectangle.property("Scale").setValue([150,150]);
        /*
        var repe = layerRectangle.property("ADBE Effect Parade").addProperty("CC RepeTile");
            repe.property(1).setValue(1000);
            repe.property(2).setValue(1000);
            repe.property(3).setValue(1000);
            repe.property(4).setValue(1000);
         */
        var displacement = layerRectangle.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
            displacement.property(2).setValue(7);
            displacement.property(3).setValue(10);
            displacement.property(4).setValue(5);
            displacement.property(5).setValue(2);
                displacement.property(5).expression = "wiggle(45,5,10,1)";
            displacement.property(6).setValue(1);
        
    list.push(layerRectangle);
    
    //CRT_LINE2-----------------------------------------------------------------------------
    var layerRectangle2 = comp.layers.add(rectangle);
        applyDefaultParam(layerRectangle2,"CRT_LINE",BlendingMode.SUBTRACT,null,false,false);
        
        layerRectangle2.property("Scale").setValue([250,250]);
        /*
        var repe = layerRectangle2.property("ADBE Effect Parade").addProperty("CC RepeTile");
            repe.property(1).setValue(1000);
            repe.property(2).setValue(1000);
            repe.property(3).setValue(1000);
            repe.property(4).setValue(1000);
        */
            
        var level = layerRectangle2.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(3).setValue(0.40784314274788);
            level.property(5).setValue(0.42223301529884);
            level.property(7).setValue(0.75294119119644);
            
    list.push(layerRectangle2);
    
    //Posterize Time-----------------------------------------------------------------------------
    var layerPosterize = addPosterize(10,50,[100,100],BlendingMode.ADD);   
        
    list.push(layerPosterize);
    
    //Global Scale-----------------------------------------------------------------------------
    addGeneralEffects(list);
    addMonitor(list);
    addParent(list);
    
}
function applyStyle9(){//Done ?
 
  //Exposure-----------------------------------------------------------------------------
    addExposure();
     
    //Black Flicker-----------------------------------------------------------------------------
    var layerBlackFlicker = comp.layers.addShape();
        applyDefaultParam(layerBlackFlicker,"Black Flicker",null,null, false, false);    
        layerBlackFlicker.opacity.setValueAtTime(0,0);
        layerBlackFlicker.opacity.setValueAtTime(0.24,50);
        layerBlackFlicker.opacity.expression = "loopOut()";
        //layerBlackFlicker.property("Scale").setValue([180,53]);
        layerBlackFlicker.property("Position").setValueAtTime(-0.28,[comp.width/2, posToHeight(1123)]);
        layerBlackFlicker.property("Position").setValueAtTime(-0.16,[comp.width/2, posToHeight(-190)]);
            layerBlackFlicker.property("Position").expression = "loopOut()";
    
    var blur = layerBlackFlicker.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
        blur.property(1).setValue(10);
        blur.property(2).setValue(3);
    
    //SHAPE COMPONENT
    var content = layerBlackFlicker.property("Contents");
            var shape = content.addProperty("ADBE Vector Group");
                shape.name = "Rectangle";
                var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rect.property(2).setValue([comp.width,comp.height*0.53]);
                rect.property(4).setValue(20);
            var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fill.property(4).setValue([0,0,0,1]);
            
            list.push(layerBlackFlicker);
    //Wave Warp-----------------------------------------------------------------------------
    var layerWaveWarp = comp.layers.add(defaultAV);
        applyDefaultParam(layerWaveWarp,"Wave Warp",null,null, true, false);    
        //layerWaveWarp.property("Scale").setValue([177,100]);
        
        var wave = layerWaveWarp.property("ADBE Effect Parade").addProperty("ADBE Wave Warp");
            wave.property(1).setValue(2);
            wave.property(2).setValue(2);
            wave.property(3).setValue(50);
            wave.property(4).setValue(0);
            wave.property(5).setValue(10);
            wave.property(6).setValue(3);
            wave.property(8).setValue(1);
        
        list.push(layerWaveWarp);
    //Ball-----------------------------------------------------------------------------
    var layerBall = comp.layers.add(defaultAV);
        applyDefaultParam(layerBall,"Ball",null,null, true, false);    
        //layerBall.property("Scale").setValue([177,100]);
        
        var ball = layerBall.property("ADBE Effect Parade").addProperty("CC Ball Action");
            ball.property(2).setValue(4);
            ball.property(6).setValue(1);
            ball.property(7).setValue(90);
        
        var mosaic = layerBall.property("ADBE Effect Parade").addProperty("ADBE Mosaic");
            mosaic.property(1).setValue(600);
            mosaic.property(2).setValue(600);
            mosaic.property(3).setValue(1);
        
        list.push(layerBall);
        
    //Wave Warp 2-----------------------------------------------------------------------------
    var layerWaveWarp2 = comp.layers.add(defaultAV);
        applyDefaultParam(layerWaveWarp2,"Wave Warp 2",BlendingMode.LIGHTEN,TrackMatteType.ALPHA, true, false);    
        layerWaveWarp2.property("Anchor Point").setValue([comp.height/2,comp.height/2])
        layerWaveWarp2.property("Scale").setValue([177,100]);
        layerWaveWarp2.opacity.setValueAtTime(0,50);
        layerWaveWarp2.opacity.setValueAtTime(0.08,25);
        layerWaveWarp2.opacity.setValueAtTime(0.16,65);
        layerWaveWarp2.opacity.setValueAtTime(0.24,3);
        layerWaveWarp2.opacity.expression = "loopOut()";
        
        var wave = layerWaveWarp2.property("ADBE Effect Parade").addProperty("ADBE Wave Warp");
            wave.property(1).setValue(6);
            wave.property(2).setValue(240);
            wave.property(2).expression = "wiggle(3,100)";
            wave.property(3).setValue(6);
            wave.property(4).setValue(0);
            wave.property(5).setValue(4);
            wave.property(7).setValue(150);
            wave.property(8).setValue(1);
            

        var maskShape = new Shape();
            var gap = 32;
            var top = -gap, left = posToWidth(415), right = posToWidth(700), bottom = comp.height+gap;
            ver = [[right, top],[left, top],[left, bottom],[right, bottom]];
            maskShape.vertices = ver;
        var mask = layerWaveWarp2.Masks.addProperty("Mask");
           mask.property("ADBE Mask Shape").setValue(maskShape);
            mask.property(2).setValue([comp.height/3,203]);    
        
        list.push(layerWaveWarp2);
    
    //Mask-----------------------------------------------------------------------------
    var layerMask = comp.layers.addShape();
        applyDefaultParam(layerMask,"Mask",null,null, false, false); 
        layerMask.opacity.setValueAtTime(0,0);
        layerMask.opacity.setValueAtTime(0.84,50);
        layerMask.opacity.setValueAtTime(1.36,5);
        layerMask.opacity.expression = "loopOut()";
        layerMask.enabled = false;
        
        layerMask.property("Position").setValueAtTime(0,[comp.width/2, posToHeight(1123)]);
        layerMask.property("Position").setValueAtTime(0.32,[comp.width/2, posToHeight(-190)]);
        layerMask.property("Position").expression = "loopOut()";
        
    var blur = layerMask.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
        blur.property(1).setValue(10);
        blur.property(2).setValue(3);
    
    //SHAPE COMPONENT
    var content = layerMask.property("Contents");
            var shape = content.addProperty("ADBE Vector Group");
                shape.name = "Rectangle";
                var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rect.property(2).setValue([comp.width ,comp.height/4]);
                rect.property(4).setValue(20);
            var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fill.property(4).setValue([0,0,0,1]);
            
        list.push(layerMask);

    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();
        
    //CRT_CIRCLE-----------------------------------------------------------------------------
    var layerCircle = comp.layers.add(circle);
        applyDefaultParam(layerCircle,"CRT_CIRCLE",BlendingMode.COLOR_DODGE,null,false,true);
        
        layerCircle.property("Scale").setValue([34,30]);

        var repe = layerCircle.property("ADBE Effect Parade").addProperty("CC RepeTile");
        repe.property(1).setValue(comp.width/2);
        repe.property(2).setValue(comp.width/2);
        repe.property(3).setValue( (comp.height/3)*2 );
        repe.property(4).setValue( (comp.height/3)*2 );
        repe.property(5).setValue(1);

        list.push(layerCircle);
        
    //Posterize Time-----------------------------------------------------------------------------
    var layerPosterize = addPosterize(5,50,[100,100],BlendingMode.LIGHTEN);   

        list.push(layerPosterize);
    
    //Global Scale-----------------------------------------------------------------------------
    addGeneralEffects(list);
    addParent(list);

}
function applyStyle10(){//Done ?

  //Exposure-----------------------------------------------------------------------------
  addExposure();
      
    //CC 2-----------------------------------------------------------------------------
    var layerCC2 = comp.layers.add(defaultAV);
        applyDefaultParam(layerCC2,"CC 2",null,null, true, false);    

        var blur = layerCC2.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(1);
            blur.property(2).setValue(1);
            blur.property(3).setValue(1);
            blur.property(4).setValue(1);
        var mask = layerCC2.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            mask.property(1).setValue(150);
            mask.property(2).setValue(3);
            mask.property(3).setValue(0);
        var level = layerCC2.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(1).setValue(1);
            level.property(3).setValue(0.14117647707462);
            level.property(4).setValue(0.52156865596771);
            level.property(5).setValue(1.16146337985992);
            level.property(7).setValue(0.87450981140137);
        var hue = layerCC2.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION"); //VERIFY
            hue.property(6).setValue(1);
            hue.property(7).setValue(230);
            hue.property(8).setValue(94);
        //var hue = layerCC2.property("ADBE Effect Parade").addProperty("ADBE Color Balance (HLS)");
           // hue.property(1).setValue(230);
           // hue.property(3).setValue(94);
        
        list.push(layerCC2);
    
    //Glow-----------------------------------------------------------------------------
    var layerGlow = comp.layers.add(defaultAV);
        applyDefaultParam(layerGlow,"Glow",null,null, true, false);   
            layerGlow.opacity.setValueAtTime(0,50);
            layerGlow.opacity.setValueAtTime(0.08,25);
            layerGlow.opacity.setValueAtTime(0.16,65);
            layerGlow.opacity.setValueAtTime(0.24,3);
            layerGlow.opacity.expression = "loopOut()";

        var glow = layerGlow.property("ADBE Effect Parade").addProperty("ADBE Glo2");
                glow.property(2).setValue(204);
                glow.property(3).setValue(73);
                glow.property(4).setValue(2);
                glow.property(5).setValue(2);
                glow.property(6).setValue(1);
                glow.property(7).setValue(2);
                glow.property(12).setValue([0.36656668782234,0.56383377313614,0.92549020051956]);
                glow.property(13).setValue([0.20399181544781,0.09233371913433,0.61960786581039]);
       
        list.push(layerGlow);

    //Distortion-----------------------------------------------------------------------------
    var layerDistortions = comp.layers.add(defaultAV);
        applyDefaultParam(layerDistortions,"Distortions",BlendingMode.LINEAR_DODGE,null, true, false);    

        var map = layerDistortions.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
                map.property(2).setValue(7);
                map.property(3).setValue(0);
                map.property(4).setValue(6);
                map.property(5).setValue(3);
                
        var wave = layerDistortions.property("ADBE Effect Parade").addProperty("ADBE Wave Warp");
                wave.property(1).setValue(8);
                wave.property(2).setValue(2);
                wave.property(3).setValue(579.6);
                wave.property(4).setValue(0);
                wave.property(5).setValue(5);
                wave.property(8).setValue(1);
        
        list.push(layerDistortions);
    
    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();
        
    //CRT_LINE-----------------------------------------------------------------------------
    var layerLINE = comp.layers.add(rectangle);
        applyDefaultParam(layerLINE,"CRT_LINE 2",BlendingMode.OVERLAY,null,false,false);
        
        layerLINE.property("Scale").setValue([251,425]);
        //layerLINE.property("Scale").expression = "wiggle(35,25,2,5)";
        
        var level = layerLINE.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(1).setValue(1);
            level.property(3).setValue(0.43137255311012);
            level.property(4).setValue(0.85490196943283);
            level.property(5).setValue(0.77610397338867);

        var map = layerLINE.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
            map.property(2).setValue(4);
            map.property(3).setValue(7);
            map.property(3).expression = "wiggle(10,25,1,10)";
            map.property(4).setValue(11);
            map.property(5).setValue(80);
            map.property(6).setValue(1);
            
        list.push(layerLINE);
     
    //CRT_LINE 2-----------------------------------------------------------------------------
    var layerLINE2 = comp.layers.add(rectangle);
        applyDefaultParam(layerLINE2,"CRT_LINE",BlendingMode.DARKEN,null,false,false);
        
        layerLINE2.property("Scale").setValue([250,422]);
        //layerLINE2.property("Scale").expression = "wiggle(35,25,2,5)";
        
        var level = layerLINE2.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(1).setValue(1);
            level.property(3).setValue(0.43137255311012);
            level.property(4).setValue(0.85490196943283);
            level.property(5).setValue(0.77610397338867);

        list.push(layerLINE2);
    
    //Position Flicker-----------------------------------------------------------------------------
    var layerPositionFlicker = comp.layers.add(defaultAV);
        applyDefaultParam(layerPositionFlicker,"Position Flicker",null,null, true, false);    

        var map = layerPositionFlicker.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
            map.property(2).setValue(7);
            map.property(3).setValue(0);
            map.property(4).setValue(5);
            map.property(5).setValue(2);
            map.property(5).expression = "wiggle(45,5,10,1)";
        
        list.push(layerPositionFlicker);
    
    //Posterize Time-----------------------------------------------------------------------------
    var layerPosterize = addPosterize(10,50,[100,100],BlendingMode.LIGHTEN);
        
        list.push(layerPosterize);

    //CC-----------------------------------------------------------------------------
    var layerCC = comp.layers.add(defaultAV);
        applyDefaultParam(layerCC,"CC",null,null, true, false);    

        var blur = layerCC.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(1.5);
            blur.property(2).setValue(1);
            blur.property(4).setValue(1);
        
        var mask = layerCC.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            mask.property(1).setValue(150);
            mask.property(2).setValue(6);

        
        list.push(layerCC);

    //Channel Blur-----------------------------------------------------------------------------
    var layerChannelBlur = comp.layers.add(defaultAV);
        applyDefaultParam(layerChannelBlur,"Channel Blur",BlendingMode.ADD,null, true, false);    
        layerChannelBlur.opacity.setValue(50);
        
        var blur = layerChannelBlur.property("ADBE Effect Parade").addProperty("ADBE Channel Blur");
            blur.property(1).setValue(5);
            blur.property(2).setValue(35);
            blur.property(3).setValue(56);
        
        list.push(layerChannelBlur);
    
    //Global Scale-----------------------------------------------------------------------------
    addGeneralEffects(list);
    addMonitor(list);
    addParent(list);


    //Late Changes-----------------------------------------------------------------------------
    
    layerLINE.property("ADBE Effect Parade").property("ADBE Displacement Map").property(1).setValue(layerLINE.index);
    layerPositionFlicker.property("ADBE Effect Parade").property("ADBE Displacement Map").property(1).setValue(layerLINE2.index);
    

}
function applyStyle11(){//Done ?

  //Exposure-----------------------------------------------------------------------------
  addExposure();
      
    //Black Flicker-----------------------------------------------------------------------------
    var layerBlackFlicker = comp.layers.addShape();
        applyDefaultParam(layerBlackFlicker,"Black Flicker",null,null, false, false);    
        //layerBlackFlicker.property("Scale").setValue([184,58]);
        layerBlackFlicker.opacity.setValueAtTime(0,0);
        layerBlackFlicker.opacity.setValueAtTime(0.2,50);
        layerBlackFlicker.opacity.expression = "loopOut()";
        layerBlackFlicker.property("Position").setValueAtTime(-0.28 , [comp.width/2, posToHeight(1123)]);
        layerBlackFlicker.property("Position").setValueAtTime(-0.16 , [comp.width/2, posToHeight(-190) ]);
        layerBlackFlicker.property("Position").expression = "loopOut()";
        
    var blur = layerBlackFlicker.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(8); 
            blur.property(2).setValue(3); 
    
    //SHAPE COMPONENT
    var content = layerBlackFlicker.property("Contents");
            var shape = content.addProperty("ADBE Vector Group");
                shape.name = "Rectangle";
                var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rect.property(2).setValue([comp.width,comp.height*0.58]);
                rect.property(4).setValue(20);
            var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fill.property(4).setValue([0.15735294117647,0.13089363247741,0.13089363247741,1]);

        list.push(layerBlackFlicker);
    
    //Glow-----------------------------------------------------------------------------
    var layerGlow = comp.layers.add(defaultAV);
        applyDefaultParam(layerGlow,"Glow",null,null, true, false);    
        layerGlow.property("Scale").setValue([100,100]);
        layerGlow.opacity.setValueAtTime(0,50);
        layerGlow.opacity.setValueAtTime(0.08,25);
        layerGlow.opacity.setValueAtTime(0.16,65);
        layerGlow.opacity.setValueAtTime(0.24,3);
        layerGlow.opacity.expression = "loopOut()";
        
        var glow = layerGlow.property("ADBE Effect Parade").addProperty("ADBE Glo2");
            glow.property(2).setValue(204); 
            glow.property(3).setValue(45); 
            glow.property(4).setValue(4.88); 
            glow.property(6).setValue(1); 
            glow.property(7).setValue(2); 
            glow.property(12).setValue([0.77436804771423,0.82436400651932,0.91602331399918,1]); 
            glow.property(13).setValue([0.11409547924995,0.10374162346125,0.15263479948044,1]); 
            
        list.push(layerGlow);   
    
    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();
     
     //CRT_LINE-----------------------------------------------------------------------------
     var layerLine = comp.layers.add(rectangle2);
        applyDefaultParam(layerLine,"CRT_LINE",BlendingMode.OVERLAY,null,false,false);
        layerLine.property("Scale").setValue([35,35]);
        layerLine.enabled = false;

        var level = layerLine.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(1).setValue(1);
            level.property(7).setValue(0.08627451211214);
            
        var tile = layerLine.property("ADBE Effect Parade").addProperty("CC RepeTile");
            tile.property(1).setValue(comp.width); 
            tile.property(2).setValue(comp.width); 
            tile.property(3).setValue(comp.height); 
            tile.property(4).setValue(comp.height); 
            tile.property(5).setValue(1); 
            
        list.push(layerLine);
    
    //CRT_CIRCLE-----------------------------------------------------------------------------
     var layerCircle = comp.layers.add(circle);
        applyDefaultParam(layerCircle,"CRT_CIRCLE",BlendingMode.OVERLAY,null,false,false);
        
        layerCircle.property("Scale").setValue([52,52]);
        
        var level = layerCircle.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(6).setValue(0.27058824896812);

        var tile = layerCircle.property("ADBE Effect Parade").addProperty("ADBE Tile");
            tile.property(4).setValue(posToWidth(100));
            tile.property(5).setValue(posToHeight(100));

        list.push(layerCircle);
        
    //Motion Flicker-----------------------------------------------------------------------------
    var layerMotionFlicker = addMotionFlicker(100);
        
        list.push(layerMotionFlicker);
    
    //Posterize Time-----------------------------------------------------------------------------
    var layerPosterizeTime = addPosterize(5,80,[100,100],BlendingMode.LIGHTEN);

        list.push(layerPosterizeTime);
           
    //CC-----------------------------------------------------------------------------
    var layerCC = comp.layers.add(defaultAV);
        applyDefaultParam(layerCC,"CC",null,null, true, false);    
        
        var blur = layerCC.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(4);
            blur.property(2).setValue(1);
            blur.property(4).setValue(1);
            
        var mask = layerCC.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            mask.property(1).setValue(200);     
            mask.property(2).setValue(3);     
            
        var level = layerCC.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(3).setValue(0.11372549086809);
            level.property(4).setValue(0.58039218187332);
            level.property(5).setValue(0.62803119421005);
        
        list.push(layerCC);

    //Global Scale-----------------------------------------------------------------------------
    addGeneralEffects(list);
    addMonitor(list);
    addParent(list);
}
function applyStyle12(){//Done?

  //Exposure-----------------------------------------------------------------------------
  addExposure();

    //Light Flicker-----------------------------------------------------------------------------
    var layerLightFlicker = comp.layers.addShape();
        applyDefaultParam(layerLightFlicker,"Light Flicker",BlendingMode.ADD,null,false,true);
        //layerLightFlicker.property("Scale").setValue([184,9]);
        layerLightFlicker.opacity.setValue(22);

        layerLightFlicker.property("Position").expression = "loopOut()";
        layerLightFlicker.property("Position").setValueAtTime(0,[comp.width/2,posToHeight(1123)]);
        layerLightFlicker.property("Position").setValueAtTime(0.166,[comp.width/2,posToHeight(-190)]);

        var blur = layerLightFlicker.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(41);
            blur.property(2).setValue(3);
        
        var content = layerLightFlicker.property("Contents");
            var rect = content.addProperty("ADBE Vector Shape - Rect");
                rect.property(2).setValue([comp.width,comp.height*0.09]);
                rect.property(4).setValue(20);
            var fill = content.addProperty("ADBE Vector Graphic - Fill");
                fill.property(4).setValue([1,1,1,1]);
            
            //SHAPE COMPONENTS
        
        list.push(layerLightFlicker);
      
    //GLOW_01-----------------------------------------------------------------------------
    var layerGlow = comp.layers.add(defaultAV);
        applyDefaultParam(layerGlow,"Glow",null,null,true,false);
        
        layerGlow.opacity.setValue(66);

        var glow = layerGlow.property("ADBE Effect Parade").addProperty("ADBE Glo2");
            glow.property(2).setValue(204);
            glow.property(3).setValue(105);
            glow.property(4).expression = "wiggle(22,0.8)";
            glow.property(7).setValue(2);
            
        list.push(layerGlow);
        
    //Motion Flicker-----------------------------------------------------------------------------
    var layerMotionFlicker = comp.layers.add(defaultAV);
        applyDefaultParam(layerMotionFlicker,"Motion Flicker",BlendingMode.LIGHTEN,null,true,false);
        
        var blur = layerMotionFlicker.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).expression = "wiggle(7,1)";
            blur.property(2).setValue(1);
            blur.property(4).setValue(1);
        var map = layerMotionFlicker.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
            map.property(2).setValue(1);
            map.property(3).setValue(0);
            map.property(4).setValue(5);
            map.property(5).expression = "wiggle(45,5,10,1)";
         
         list.push(layerMotionFlicker);
    
    //Glitch Effect-----------------------------------------------------------------------------
    addGlitch();
    //CRT_LINE-----------------------------------------------------------------------------
    var layerRectangle = comp.layers.add(rectangle);
        applyDefaultParam(layerRectangle,"CRT_LINE",BlendingMode.DARKEN,null,false,true);
        
        layerRectangle.property("Scale").setValue([280,473]);
        layerRectangle.enabled = false;

        var level2 = layerRectangle.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level2.property(3).setValue(0.2784313725490196);
            level2.property(4).setValue(1);
            level2.property(5).setValue(0.54);
            level2.property(6).setValue(0);
            level2.property(7).setValue(0.7254901960784314);

        var sharp2 = layerRectangle.property("ADBE Effect Parade").addProperty("ADBE Sharpen");
            sharp2.property("ADBE Sharpen-0001").setValue(25); 
        
        list.push(layerRectangle);
       
    //CRT_CIRCLE-----------------------------------------------------------------------------
    var layerCircle = comp.layers.add(circle);
        applyDefaultParam(layerCircle,"CRT_CIRCLE",BlendingMode.DARKEN,null,false,true);
        
        layerCircle.property("Scale").setValue([50,50]);
        
        var hue = layerCircle.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION");
            hue.property(4).setValue(-33);           
        var level = layerCircle.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            level.property(3).setValue(0);
            level.property(4).setValue(1);
            level.property(5).setValue(1.44);
            level.property(6).setValue(0.11372549086809);
            level.property(7).setValue(1);
        var sharp = layerCircle.property("ADBE Effect Parade").addProperty("ADBE Sharpen");
            sharp.property("ADBE Sharpen-0001").setValue(25); 
        
        list.push(layerCircle);
    
    //Posterize TIME-----------------------------------------------------------------------------

    var layerPosterize = addPosterize(5,50,[100,100],BlendingMode.LIGHTEN);
        list.push(layerPosterize);
       
    //CC-----------------------------------------------------------------------------
    var layerCC = comp.layers.add(defaultAV);
        applyDefaultParam(layerCC,"CC",null,null,true,false);  

        var blur = layerCC.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(2);
            blur.property(2).setValue(1);
            blur.property(4).setValue(1);        
        var mask = layerCC.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            mask.property(1).setValue(45);
            mask.property(2).setValue(3);
        var levelCC = layerCC.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
            levelCC.property(3).setValue(0.07450980693102);
            levelCC.property(4).setValue(0.60784316062927);
            levelCC.property(5).setValue(1.21000003814697 );
            levelCC.property(6).setValue(0);
            levelCC.property(7).setValue(1);
        var sharp = layerCC.property("ADBE Effect Parade").addProperty("ADBE Sharpen");//TO MODIFY
            sharp.property(1).setValue(25);

        list.push(layerCC);
     
    //Lens-----------------------------------------------------------------------------
    var layerLens = comp.layers.add(defaultAV);
        applyDefaultParam(layerLens,"Lens",BlendingMode.ADD,null,true,false);   
        
        var lens = layerLens.property("ADBE Effect Parade").addProperty("CC Lens");
            lens.property(2).setValue(295);
            lens.property(3).setValue(-30);
            
        var pin = layerLens.property("ADBE Effect Parade").addProperty("CC Power Pin");//CHANGE HEIGHT
        var gap = 16;
        var width = comp.width+gap;
        var height = comp.height+gap;
            pin.property(1).setValue([-gap,-gap]);
            pin.property(2).setValue([width,-gap]);
            pin.property(3).setValue([-gap,height]);
            pin.property(4).setValue([width,height]);
        
        list.push(layerLens);
    
    //Glow_2-----------------------------------------------------------------------------
    var layerGlow2 = comp.layers.add(defaultAV);
        applyDefaultParam(layerGlow2,"Glow 2",null,null,true,false);
        
        var glow = layerGlow2.property("ADBE Effect Parade").addProperty("ADBE Glo2");
            glow.property(2).setValue(224.4);
            glow.property(3).setValue(440);
            glow.property(4).setValue(0.6);
            
        list.push(layerGlow2);
    
    //Flicker-----------------------------------------------------------------------------
    var layerFlicker = comp.layers.add(defaultAV);
        applyDefaultParam(layerFlicker,"Flicker",null,null, true, false);

        layerFlicker.property("ADBE Effect Parade").addProperty("ADBE Exposure2");
            layerFlicker.property("ADBE Effect Parade").property(1).property("ADBE Exposure2-0003").expression = "wiggle(22,0.8)";
        list.push(layerFlicker);
    
    //create Parent/ Global Scale-----------------------------------------------------------------------------
    
    addGeneralEffects(list);
    addParent(list);
    
}


//Add
function addPosterize(value,opacity,scale,blending){

    var posterizeTime = comp.layers.add(defaultAV);
    applyDefaultParam(posterizeTime,"Posterize Time",blending,null, true, false);

    if (opacity != 100) posterizeTime.opacity.setValue(opacity);
    if (scale != [100,100]) posterizeTime.property("Scale").setValue(scale);

     var posterize = posterizeTime.property("ADBE Effect Parade").addProperty("ADBE Posterize Time");
        posterize.property(1).setValue(value);

        return posterizeTime;
}
function addMotionFlicker(opacity){
    var motionFlicker = comp.layers.add(defaultAV);
        applyDefaultParam(motionFlicker,"Motion Flicker",null,null, true, false);
        motionFlicker.opacity.setValue(opacity);
        
        var geometry = motionFlicker.property("ADBE Effect Parade").addProperty("ADBE Geometry2");            
        geometry.property("Position").setValueAtTime(0,   [ comp.width/2 , posToHeight(540) ]);
        geometry.property("Position").setValueAtTime(0.08,[ comp.width/2 , posToHeight(535) ]);
        geometry.property("Position").setValueAtTime(0.16,[ comp.width/2 , posToHeight(550) ]);
        geometry.property("Position").expression =  "loopOut()";

    return motionFlicker;
} 
function addFlick(){
    var layerFlick = comp.layers.addShape();

        applyDefaultParam(layerFlick,"Flicker",null,null, false, false);  
        //layerFlick.property("Scale").setValue([185,85]);
        
        layerFlick.property("Opacity").setValueAtTime(0,0);
        layerFlick.property("Opacity").setValueAtTime(0.48,20);
        layerFlick.property("Opacity").setValueAtTime(1.36,5);
        layerFlick.property("Opacity").expression = "loopOut()";
        
        layerFlick.property("Position").setValueAtTime(-0.08,[comp.width/2, posToHeight(1123)]);
        layerFlick.property("Position").setValueAtTime( 0.08,[comp.width/2, posToHeight(-190)]);
        layerFlick.property("Position").expression = "loopOut()";
        
        var blur = layerFlick.property("ADBE Effect Parade").addProperty("ADBE Box Blur2");
            blur.property(1).setValue(220);
            blur.property(2).setValue(3);
            blur.property(3).setValue(3);
            
        //SHAPE COMPONENT
        var content = layerFlick.property("Contents");
            var shape = content.addProperty("ADBE Vector Group");
                shape.name = "Rectangle";
                var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rect.property(2).setValue([comp.width,comp.height*0.85]);
                rect.property(4).setValue(20);
            var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
            fill.property(4).setValue([1,1,1,1]);
            
            var shape = content.addProperty("ADBE Vector Group");
                    shape.name = "Rectangle 2";
                    shape.property("ADBE Vector Transform Group").property(2).setValue([-8.1,-2905.6]);
                    var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
                    rect.property(2).setValue([comp.width,comp.height*0.85]);
                    rect.property(4).setValue(20);
                var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fill.property(4).setValue([1,1,1,1]);
            /*    
            var shape = content.addProperty("ADBE Vector Group");
                    shape.name = "Rectangle 3";
                    shape.property("ADBE Vector Transform Group").property(2).setValue([-8.1,-1365.8]);
                    var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
                    rect.property(2).setValue([comp.height,comp.height]);
                    rect.property(4).setValue(20);
                var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fill.property(4).setValue([1,1,1,1]);
            */
    return layerFlick;
}
function addGlitch(){
    var glitch = comp.layers.add(defaultAV);
    applyDefaultParam(glitch,"Glitches",null,null, true, false);    
    glitch.enabled = false;


    var map = glitch.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
        map.property(2).setValue(5);
        map.property(3).setValue(comp.width/3);
        map.property(4).setValue(7);
        map.property(5).setValue(0);
        map.property(6).setValue(2);
    var wave = glitch.property("ADBE Effect Parade").addProperty("ADBE Wave Warp");
        wave.property(1).setValue(8);
        wave.property(2).setValue(5);
        wave.property(3).setValue(3);
        wave.property(4).setValue(0);
        wave.property(5).setValue(0.1);
        wave.property(6).setValue(2);
        wave.property(7).setValue(360);


    list.push(glitch);

    //video
    var footage = comp.layers.add(disp_map);
        applyDefaultParam(footage,"CRT Mask",null,null,false,false);
        //footage.property("Scale").setValue([100,100]);
        footage.enabled = false;

        footage.timeRemapEnabled = true;
        footage.timeRemap.expression = "loopOut('Cycle')";
    
    list.push(footage);
    
    glitch.property("ADBE Effect Parade").property("ADBE Displacement Map").property(1).setValue(footage.index);

}
function addExposure(){
    var ExposureFix = comp.layers.add(defaultAV);
    applyDefaultParam(ExposureFix,"CRT ExposureFIX",null,null, true, false);
    
    var brightEffect = ExposureFix.property("ADBE Effect Parade").addProperty("ADBE Brightness & Contrast 2");
  
    list.push(ExposureFix);
  }
function addGeneralEffects(list){
    
    //
    var effects = comp.layers.add(defaultAV);
    applyDefaultParam(effects,"CRT Effects",null,null, true, false);

        
        var sharpEffect = effects.property("ADBE Effect Parade").addProperty("ADBE Unsharp Mask2");
            sharpEffect.property(1).setValue(0);
            sharpEffect.property(2).setValue(4);
            sharpEffect.property(2).setValue(0.17254901960784);
        
        var vibranceEffect = effects.property("ADBE Effect Parade").addProperty("ADBE Vibrance");
            vibranceEffect.property(2).setValue(32);
        
        var noiseEffect = effects.property("ADBE Effect Parade").addProperty("VISINF Grain Implant");
            noiseEffect.property("VISINF Grain Implant-0021").setValue(3);
            noiseEffect.property("VISINF Grain Implant-0008").setValue(1);

        list.push(effects);

    var glow = comp.layers.add(defaultAV);
        applyDefaultParam(glow,"CRT Glow",null,null, true, false);

        var glowEffect = glow.property("ADBE Effect Parade").addProperty("ADBE Glo2");
            glowEffect.property(2).setValue(168.3);
            glowEffect.property(3).setValue(188);
            glowEffect.property(4).setValue(0);//
            glowEffect.property(6).setValue(6);

        list.push(glow);
}
function addMonitor(list){
        //Monitor-----------------------------------------------------------------------------IS A SHAPE
        var gap = 16;
        var width = comp.width+gap;
        var height = comp.height+gap;

        var layerMonitor = comp.layers.addShape();
        layerMonitor.enabled = false;

        applyDefaultParam(layerMonitor,"Monitor",BlendingMode.STENCIL_ALPHA ,null, false, false);    
        //SHAPE COMPONENT
        var content = layerMonitor.property("Contents");
            var shape = content.addProperty("ADBE Vector Group");
                shape.name = "Rectangle";
                var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rect.property(2).setValue([comp.width,comp.height]);
                rect.property(4).setValue(20);
            var stroke = shape.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
                stroke.property(5).setValue(4);
            var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fill.property(4).setValue([0.11084558823529,0.11084558823529,0.11084558823529,1]);
            
   list.push(layerMonitor);
    
    //Lens Distortions-----------------------------------------------------------------------------
    var layerDistortions = comp.layers.add(defaultAV);
    layerDistortions.enabled = false;
        applyDefaultParam(layerDistortions,"Lens Distortions",null,null, true, false);    
        
        var lens = layerDistortions.property("ADBE Effect Parade").addProperty("CC Lens");
            lens.property(2).setValue(324);
            lens.property(3).setValue(-47);
        var powerPin = layerDistortions.property("ADBE Effect Parade").addProperty("CC Power Pin"); //ADJUST WITH RESOLUTION
            powerPin.property(1).setValue([-gap,-gap]);
            powerPin.property(2).setValue([width,-gap]);
            powerPin.property(3).setValue([-gap,height]);
            powerPin.property(4).setValue([width,height]);
            
    list.push(layerDistortions);
}
function addParent(list){
    //Create Global Layer
    var layerGlobal = comp.layers.add(defaultAV);
        applyDefaultParam(layerGlobal,"Global Scale",null,null, true, false);
        layerGlobal.enabled = false;
        
        layerGlobal.property("Scale").expression = "[thisComp.width/1920,thisComp.height/1080]*100";
            layerGlobal.property("Position").expression = "[0,0,0]";
    list.push(layerGlobal);
    
    //General Changes
    for(var i = 0; i < list.length ; i++){
        var item = list[i];
        item.label = 10;
        if (item.name != mainLayer) item.inPoint = mainLayer.inPoint;
        if (item.name != mainLayer) item.outPoint = mainLayer.outPoint;
        if (item.name != layerGlobal.name) item.parent = layerGlobal;

        listName.push(item.name);
    }
}

//Tools
function isVisible(str){
    for(i = 1; i < comp.numLayers ; i++){

        if(comp.layer(i).name == str){
            return comp.layer(i).enabled;
        }
    } 
}
function applyDefaultParam(layer,name,blend,trackMatte,adjustmentLayer,Transparency){
        if (name != null) layer.name = name;
        if (blend != null) layer.blendingMode = blend;
        if (trackMatte != null) layer.trackMatteType = trackMatte;
        if (adjustmentLayer != null) layer.adjustmentLayer = adjustmentLayer;
        if (Transparency != false) layer.preserveTransparency = Transparency;
}
function createTempSolid(){//EDIT
    //Create default AVlayer
    
        defaultAV = findInProject("DefaultAV");
        
        if (defaultAV == null) {
            //if does not exists, Create it
            var tempSolid = comp.layers.addSolid([1,1,1], "DefaultAV", comp.width, comp.height, 1,layerEnd);
            defaultAV = tempSolid.source;
            tempSolid.remove();
        }
        


}
function setFolderValues(){
    //alert(assetsFolder[1].name);
    for (var i = 1; i < assetsFolder.numItems+1; i++) {
        var element = assetsFolder.items[i];
        switch(element.name){
            case "crt_rectangle.png":
                rectangle = element;
            break;
            case "crt_rectangle_4k.png":
                rectangle2 = element;
            break;
            case "crt_circle.jpg":
                circle = element;
            break;
            case "DISP_MAP.mp4":
                disp_map = element;
            break;
        }
        
    }
}
//FROM RB8
function createFolder(){
   
    assetsFolder = findInProject("CRT-Assets");

    if (assetsFolder == null) {
		assetsFolder = app.project.items.addFolder("CRT-Assets");
        return false;
	}    
    return true;
}
//UTILITIES
function getFileByName(fileName) {
    var myProject = app.project;
    for (var i = 1; i <= myProject.numItems; i++) {
        if ((myProject.item(i) instanceof FolderItem) && myProject.item(i).name == fileName){
            result = folderName;

            return folderName;
            
        } 
    return null;
    }
}
function findProjectItem(searchFolder, recursion, userData) {
	var folderItem;
	for (var i = 1, il = searchFolder.items.length; i <= il; i++) {
		folderItem = searchFolder.items[i];
			if (propertiesMatch(folderItem, userData))
				return folderItem;
			else if (recursion === true && folderItem instanceof FolderItem && folderItem.numItems > 0) {
				var item = findProjectItem(folderItem, recursion, userData);
				if (item !== null) return item;
			}
		}
	return null;
}

function propertiesMatch(projectItem, userData) {
	if (typeof userData === "undefined") return true;

	for (var propertyName in userData) {
		if (!userData.hasOwnProperty(propertyName)) continue;

		if (typeof userData[propertyName] !== typeof projectItem[propertyName])
			return false;

		if (isArray(userData[propertyName]) && isArray(projectItem[propertyName])) {
			if (userData[propertyName].toString() !== projectItem[propertyName].toString()) {
				return false;
			}
		} else if (typeof userData[propertyName] === "object" && typeof projectItem[propertyName] === "object") {
			if (!propertiesMatch(projectItem[propertyName], userData[propertyName])) {
				return false;
			}
		} else if (projectItem[propertyName] !== userData[propertyName]) {
			return false;
		}
	}
	return true;
}
function isArray(object) {
	return Object.prototype.toString.apply(object) === "[object Array]";
}
function findInProject(str){

    for (var i = 1; i < app.project.numItems+1; i++) {
        var element = app.project.items[i];
        
        if (element.name == str) {
            return element;
        }
    }
    return null;
}

function findInComp(str){
    
    for (var i = 1; i < comp.numLayers+1; i++) {
        var element = comp.layer(i);
        alert(element.name);
        if (element.name == str) {
            return element;
        }
    }
    return null;
}