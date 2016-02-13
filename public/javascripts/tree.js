$(document).ready(function(){
  $("#json_render").width($("#mainTree").width());
  var obj = null;
  // if (localStorage.getItem("data")){
  //   obj = JSON.parse(localStorage.getItem("data"));
  // }else {
    obj = getData();
  // }
  if(typeof(Storage) !== "undefined") {
    canSave = true;
  } else {
      canSave = false;
      alert('Sorry! No Web Storage support..');
  }
  $('#modalForNote').modal({ show: false});
  $('#modalForSuccess').modal({ show: false});
  $('#modalForDownload').modal({ show: false});

  $('#tree').jstree({
    'core' : {
      'check_callback' : true,
      'data' : obj,
    },
    "search" : {
      "case_insensitive" : true
    },
    "plugins": ["contextmenu", "dnd", "search", "wholerow"],
    "contextmenu" : {
      "items": customMenu
    }
  });

  $("#search-input").keyup(function() {
      var searchString = $(this).val();
      $('#tree').jstree('search', searchString);
  });

});

function customMenu(node) {
    // The default set of all items
    //RYANTODO make leafs different icon, same with def's and formulas -> call it a type category - in create?
    var mark = "";
    if (getTree().selected.data.marked == false){
        mark = "Mark";
    }
    else {
        mark = "Unmark";
    }
    var items = {
        addItem: {
          label: "Add Item",
          action: function () {
            var newNode = getTree().tree.create_node(getTree().selected.id, "new node");
            var today = new Date();
            getTree().tree.get_node(newNode).data = { "create_date": convertDate(today), "marked": false, "success": 0, "failure": 0, "audio_path": null, "note": null, "other": null };
            getTree().tree.set_icon(getTree().tree.get_node(newNode), '../images/folder.png');
          }
        },
        renameItem: { // The "rename" menu item
            label: "Rename",
            action: function () {
              getTree().tree.edit(node);
            }
        },
        deleteItem: { // The "delete" menu item
            label: "Delete",
            action: function () {
              getTree().tree.delete_node([node]);
            }
        },
        markItem: { // mark all children RYANTODO
            label: mark,
            action: function () {
                if(getTree().selected.data.marked == true){
                    getTree().selected.data.marked = false;
                    getTree().tree.set_icon(node, '../images/folder.png');
                    nestedMark(getTree().selected, false, '../images/folder.png');
                }
                else {
                    getTree().selected.data.marked = true;
                    getTree().tree.set_icon(node, '../images/red-x.png');
                    nestedMark(getTree().selected, true, '../images/red-x.png');
                }
            }
        },
        iterateItem: {
          label: "Iterate",
          action: function (){
            iterateOnNode(getTree().selected);
          }
        },
        noteItem: {
          label: "Note",
          action: function (){
            $('#modalNote').val("");
            $('#modalNoteTitle').text(getTree().selected.text + " ~Note");
            if(getTree().selected.data.note != null){
              $('#modalNote').val(getTree().selected.data.note);
            }
            else if(getTree().selected.data.note == null){
              $('#modalNote').val("");
            }
            $('#modalForNote').modal('show');
          }
        },
        downloadItem: {
          label: "Download",
          action: function() {
            $('#modalDownloadTitle').text(getTree().selected.text + " Download");
            $('#downloadName').text(getTree().selected.text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + ".txt");
            $('#modalForDownload').modal('show');
          }
        }
    };

    if ($(node).hasClass("folder")) {
        // Delete the "delete" menu item
        delete items.deleteItem;
    }

    return items;
};

function save(){
  var data = JSON.stringify(getTree().tree.get_json('#', { 'flat': true }));
  var d = getTree().tree.get_json('#', { 'flat': true });
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/data",
    data: { value: data },
    success: function(r) {
       console.log(r);
    }
  });
};

function createFile(){
  tree = $("#tree").jstree(true).get_json('#', { 'flat': true });
  var e = getTree().selected;
  var tempNode = new Node();
  tempNode.create(e.id, e.text, [], e.note);
  var m = buildChildren(tempNode);

  var j = flatten(m);
  var str = '';
  $.each(j, function(key, value){
    if((key.indexOf('text') > -1 || key.indexOf('note') > -1) && (value != null || value != [])){
      str += value;
      str += '\n';
    }
  });

  makeTextFile(str, $('#downloadName').text());
};

function makeTextFile(text, name){
  var link = document.getElementById('downloadlink');
  var data = new Blob([text], {type: 'text/plain'});
  link.href = URL.createObjectURL(data);
  link.download = name;
};

function addNote() {
  getTree().selected.data.note = $('#modalNote').val();
};

function nestedMark(node, mark, icon){
  var t = getTree().tree.get_json('#', { 'flat': true });
   for(var i in t){
    if(t[i].parent == node.id){
      getTree().tree.get_node(t[i].id).data.marked = mark;
      getTree().tree.set_icon(getTree().tree.get_node(t[i].id), icon);
      if(!isLeaf(t[i].id)){
        nestedMark(t[i], mark, icon);
      }
    }
   }
};
