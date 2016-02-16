// ################################################################################################
// TODO LIST
// 1) restart button
// 2) Redo getPath fn to use tree.get_path
// 3) Changes .txt download to a beautiful pdf
// 4) Different Icons for different types of notes
// 5) Dashboard for user stats / homepage
// 6) Settings panel -> how many successes unitl mark? custom user set icons? etc
// 7) Retry Failed leafs
// 8) move by date dropdown to buttons
// 9) better alerts with timeouts
// ################################################################################################

var canSave = false;
var allLeafs = [];
var nodeLeafs = [];
var size = 1;
var isRandom = true;
var tree; //DO NOT MODIFY
var day = 86400000;//millseconds in a day
var currentNode;

function getTree(){
  return {
    "tree": $('#tree').jstree(true),
    "selected": $('#tree').jstree(true).get_node($('#tree').jstree(true).get_selected())
  }
};

function toggleContainers(){
  $('#mainTree').toggleClass("hidden");
  $('#mainIterate').toggleClass("hidden");
  $('#iterateNav').toggleClass("hidden");
};

// returns current node from iteration page
function getNode(){
  if(currentNode){
    return $('#tree').jstree(true).get_node(currentNode.id);
  }else {
    return null;
  }
};

function convertDate(d){
  return Math.round(d.getTime()/86400000);
};

function flatten(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i = 0, l = cur.length; i < l; i++)
                 recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + "." + p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
};

window.onkeyup = function(e) {
  if($('#successBtn').prop('disabled') == false && $('#mainIterate').hasClass('hidden') == false){
     var key = e.keyCode ? e.keyCode : e.which;

     if (key == 39) {
       failure();
     }else if (key == 37) {
       success();
     }else if (key == 38) {
       showAnswer();
     }
   }
}

// function closeAlert(selector, delay) {
//    var alert = $(selector);
//    window.setTimeout(function() { alert.alert('close') }, delay);
// }
