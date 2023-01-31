window.addEventListener('DOMContentLoaded', init);
const opts = ['*', '/', '+', '-', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '.']; //all keys
const spec = ['*', '/', '+', '-']; //special function keys
function init() {
  document.title = "Calculator Project";
  console.log('ready');
  let dec = false;
  let eva = false;
  const container = document.createElement('div');
  container.classList.add('container');
  container.style.maxWidth = '600px';
  container.style.margin = 'auto';
  document.body.appendChild(container);
  const output = document.createElement('input');
  output.setAttribute('type', 'text');
  output.classList.add('output');
  output.style.width = '100%';
  output.style.lineHeight = '50px';
  output.style.fontSize = '3em';
  output.style.textAlign = 'right';
  container.appendChild(output);
  const main = document.createElement('div');
  main.classList.add('main');
  main.style.width = '100%';
  container.appendChild(main);
  opts.forEach(function (val) {
    //console.log(val);
    btnMaker(val, addOutput);
  })
  btnMaker('=', evalOutput);
  btnMaker('C', clrOutput);

  function cOutput(v) {
    output.style.border = v + ' 1px solid';
    output.style.color = v;
  }

  function evalOutput() {
    cOutput('black');
    console.log('=');
    if (output.value === "") {
      cOutput('red');
    }
    else if (eva) {
      cOutput('red');
    }
    else {
      output.value = eval(output.value);
    }
    dec = output.value.includes('.');
  }

  function clrOutput() {
    cOutput('black');
    output.value = "";
  }

  function btnMaker(txt, myFunction) {
    let btn = document.createElement('button');
    btn.setAttribute('type', 'buttom');
    btn.style.width = '23%';
    btn.style.lineHeight = '50px';
    btn.style.margin = '1%';
    btn.style.fontSize = '2em';
    btn.val = txt;
    btn.textContent = txt;
    btn.addEventListener('click', myFunction);
    main.appendChild(btn);
  }

  function addOutput(e) {
    console.log(dec);
    cOutput('black');
    //console.log(e.target.val);
    let char = e.target.val;
    if (char == '.') {
      if (dec) {
        char = '';
        cOutput('red');
      }
      else {
        dec = true;
      }
    }
    eva = spec.includes(char);
    if (eva) {
      dec = false;
    }
    output.value += char;
  }
}
