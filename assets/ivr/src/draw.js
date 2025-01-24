
var id = document.getElementById("drawflow");
const editor = new Drawflow(id);
editor.reroute = true;
editor.reroute_fix_curvature = true;
editor.force_first_input = false;

/*
editor.createCurvature = function(start_pos_x, start_pos_y, end_pos_x, end_pos_y, curvature_value, type) {
  var center_x = ((end_pos_x - start_pos_x)/2)+start_pos_x;
  return ' M ' + start_pos_x + ' ' + start_pos_y + ' L '+ center_x +' ' +  start_pos_y  + ' L ' + center_x + ' ' +  end_pos_y  + ' L ' + end_pos_x + ' ' + end_pos_y;
}*/




fetch('assets/ivr/src/ivr.json')
  .then(response => response.json())
  .then(dataToImport => {
    // Usar el JSON cargado
    editor.start();
    editor.import(dataToImport);
  })
  .catch(error => {
    console.error('Error al cargar el JSON:', error);
  });



/*
var welcome = `
<div>
  <div class="title-box">👏 Welcome!!</div>
  <div class="box">
    <p>Simple flow library <b>demo</b>
    <a href="https://github.com/jerosoler/Drawflow" target="_blank">Drawflow</a> by <b>Jero Soler</b></p><br>

    <p>Multiple input / outputs<br>
       Data sync nodes<br>
       Import / export<br>
       Modules support<br>
       Simple use<br>
       Type: Fixed or Edit<br>
       Events: view console<br>
       Pure Javascript<br>
    </p>
    <br>
    <p><b><u>Shortkeys:</u></b></p>
    <p>🎹 <b>Delete</b> for remove selected<br>
    💠 Mouse Left Click == Move<br>
    ❌ Mouse Right == Delete Option<br>
    🔍 Ctrl + Wheel == Zoom<br>
    📱 Mobile support<br>
    ...</p>
  </div>
</div>
`;
*/


//editor.addNode(name, "typenode": false,  inputs, outputs, posx, posy, class, data, html);
/*editor.addNode('welcome', 0, 0, 50, 50, 'welcome', {}, welcome );
editor.addModule('Other');
*/

// Events!
editor.on('nodeCreated', function (id) {
  console.log("Node created " + id);
})

editor.on('nodeRemoved', function (id) {
  console.log("Node removed " + id);
})

editor.on('nodeSelected', function (id) {
  console.log("Node selected " + id);
})

editor.on('moduleCreated', function (name) {
  console.log("Module Created " + name);
})

editor.on('moduleChanged', function (name) {
  console.log("Module Changed " + name);
})

editor.on('connectionCreated', function (connection) {
  console.log('Connection created');
  console.log(connection);
})

editor.on('connectionRemoved', function (connection) {
  console.log('Connection removed');
  console.log(connection);
})
/*
editor.on('mouseMove', function(position) {
  console.log('Position mouse x:' + position.x + ' y:'+ position.y);
})
*/
editor.on('nodeMoved', function (id) {
  console.log("Node moved " + id);
})

editor.on('zoom', function (zoom) {
  console.log('Zoom level ' + zoom);
})

editor.on('translate', function (position) {
  console.log('Translate x:' + position.x + ' y:' + position.y);
})

editor.on('addReroute', function (id) {
  console.log("Reroute added " + id);
})

editor.on('removeReroute', function (id) {
  console.log("Reroute removed " + id);
})
/* DRAG EVENT */

/* Mouse and Touch Actions */

var elements = document.getElementsByClassName('drag-drawflow');
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('touchend', drop, false);
  elements[i].addEventListener('touchmove', positionMobile, false);
  elements[i].addEventListener('touchstart', drag, false);
}

var mobile_item_selec = '';
var mobile_last_move = null;
function positionMobile(ev) {
  mobile_last_move = ev;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  if (ev.type === "touchstart") {
    mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
  } else {
    ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
  }
}

function drop(ev) {
  if (ev.type === "touchend") {
    var parentdrawflow = document.elementFromPoint(mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
    if (parentdrawflow != null) {
      addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
    }
    mobile_item_selec = '';
  } else {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("node");
    addNodeToDrawFlow(data, ev.clientX, ev.clientY);
  }

}

function addNodeToDrawFlow(name, pos_x, pos_y) {
  if (editor.editor_mode === 'fixed') {
    return false;
  }
  pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
  pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));


  switch (name) {
    case 'start':
      var start = `
        <div>
            <div class="title-box">Start Call</div>
            <div class="box">
                <p>Welcome to the service. Please press 1 for Sales or 2 for Support.</p>
            </div>
        </div>
        `;
      editor.addNode('start', 0, 1, pos_x, pos_y, 'start', {}, start);
      break;

    case 'DTMF':
      var dtmf = `
        <div>
            <div class="title-box"><i class="fas fa-keyboard"></i> DTMF Input</div>
            <div class="box">
                <p>Press 1 for Sales, Press 2 for Support, or Press 3 for Information</p>
                <input type="text" df-dtmf placeholder="Enter DTMF input">
            </div>
        </div>
        `;
      editor.addNode('DTMF', 1, 4, pos_x, pos_y, 'DTMF', { "dtmf": '' }, dtmf);
      break;

    case 'queue':
      var queueNode = `
          <div>
              <div class="title-box">Queue</div>
              <div class="box">
                  <p>Waiting in queue. You will be connected shortly.</p>
              </div>
          </div>
          `;
      editor.addNode('queue', 2, 2, pos_x, pos_y, 'queue', {}, queueNode);
      break;

    case 'sales_option':
      var sales = `
        <div>
            <div class="title-box">Sales Department</div>
            <div class="box">
                <p>Connecting to the Sales team...</p>
            </div>
        </div>
        `;
      editor.addNode('sales_option', 1, 1, pos_x, pos_y, 'sales_option', {}, sales);
      break;

    case 'support_option':
      var support = `
        <div>
            <div class="title-box">Support Department</div>
            <div class="box">
                <p>Connecting to Support...</p>
            </div>
        </div>
        `;
      editor.addNode('support_option', 1, 2, pos_x, pos_y, 'support_option', {}, support);
      break;

    case 'timeout_no_input':
      var timeout = `
        <div>
            <div class="title-box">Timeout</div>
            <div class="box">
                <p>No input received. Redirecting to the main menu...</p>
            </div>
        </div>
        `;
      editor.addNode('timeout_no_input', 2, 0, pos_x, pos_y, 'timeout_no_input', {}, timeout);
      break;

    case 'repeat_input':
      var repeat = `
        <div>
            <div class="title-box">Repeat Input</div>
            <div class="box">
                <p>Invalid input. Please try again.</p>
            </div>
        </div>
        `;
      editor.addNode('repeat_input', 1, 3, pos_x, pos_y, 'repeat_input', {}, repeat);
      break;

    case 'main_menu':
      var menu = `
        <div>
            <div class="title-box">Main Menu</div>
            <div class="box">
                <p>Press 1 for Sales, Press 2 for Support, Press 3 for Information</p>
            </div>
        </div>
        `;
      editor.addNode('main_menu', 0, 1, pos_x, pos_y, 'main_menu', {}, menu);
      break;

    case 'end_call':
      var end = `
        <div>
            <div class="title-box">End Call</div>
            <div class="box">
                <p>Thank you for calling. Goodbye!</p>
            </div>
        </div>
        `;
      editor.addNode('end_call', 3, 0, pos_x, pos_y, 'end_call', {}, end);
      break;

    case 'log':
      var log = `
        <div>
            <div class="title-box"><i class="fas fa-file-signature"></i> Save Log File</div>
            <div class="box">
                <p>Save this interaction log</p>
            </div>
        </div>
        `;
      editor.addNode('log', 2, 1, pos_x, pos_y, 'log', {}, log);
      break;

    default:
      console.log('Node not defined');
  }
}

var transform = '';
function showpopup(e) {
  e.target.closest(".drawflow-node").style.zIndex = "9999";
  e.target.children[0].style.display = "block";
  //document.getElementById("modalfix").style.display = "block";

  //e.target.children[0].style.transform = 'translate('+translate.x+'px, '+translate.y+'px)';
  transform = editor.precanvas.style.transform;
  editor.precanvas.style.transform = '';
  editor.precanvas.style.left = editor.canvas_x + 'px';
  editor.precanvas.style.top = editor.canvas_y + 'px';
  console.log(transform);

  //e.target.children[0].style.top  =  -editor.canvas_y - editor.container.offsetTop +'px';
  //e.target.children[0].style.left  =  -editor.canvas_x  - editor.container.offsetLeft +'px';
  editor.editor_mode = "fixed";

}

function closemodal(e) {
  e.target.closest(".drawflow-node").style.zIndex = "2";
  e.target.parentElement.parentElement.style.display = "none";
  //document.getElementById("modalfix").style.display = "none";
  editor.precanvas.style.transform = transform;
  editor.precanvas.style.left = '0px';
  editor.precanvas.style.top = '0px';
  editor.editor_mode = "edit";
}

function changeModule(event) {
  var all = document.querySelectorAll(".menu ul li");
  for (var i = 0; i < all.length; i++) {
    all[i].classList.remove('selected');
  }
  event.target.classList.add('selected');
}

function changeMode(option) {

  //console.log(lock.id);
  if (option == 'lock') {
    lock.style.display = 'none';
    unlock.style.display = 'block';
  } else {
    lock.style.display = 'block';
    unlock.style.display = 'none';
  }

}
