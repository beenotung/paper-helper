import construct = Reflect.construct;
/**
 * Created by beenotung on 8/6/16.
 */
// printline("start");

function create_and_add_element(tagname:string, target = document.body):HTMLElement {
  let e = document.createElement(tagname);
  target.appendChild(e);
  return e;
}

function add_text_field():HTMLInputElement {
  let e = create_and_add_element('textarea');
  // e.setAttribute('type', 'textarea');
  e.style.width = '100%';
  e.style.height = '10vh';
  return <HTMLInputElement>e;
}

let input = add_text_field();
let output = create_and_add_element('div');

let blacklist = [
  'This content downloaded from'
  , 'All use subject to http://about'
];

function process(input:string):string {
  // printline('processing', input);
  let paragraphs = input.split('\n');
  let topic_sentenses = paragraphs
    .map(paragraph=> {
        let sentenses = paragraph.split('.')
          .filter(x=>!blacklist.some(b=>x.indexOf(b) != -1));
        return sentenses[0];
      }
    );
  return topic_sentenses.join('\n\n');
}

function lastChar(s:string) {
  return s[s.length - 1]
}

const throw_error = (cons, msg)=> {
  throw new cons(msg)
};

const tail = xs=>xs.length == 0 ? [] : xs.slice(1);
const head = xs=>xs.length == 0 ? throw_error(ReferenceError, 'array is empty') : xs[0];

function update() {
  localStorage.setItem('input', input.value);
  let lines = input.value.split('\n');
  let lastline = '  ';
  let paras = [];
  lines
    .filter(line=>!blacklist.some(x=>line.indexOf(x) != -1))
    .forEach(line=> {
      // console.debug(line);
      lastline += ' ' + line;
      if (lastChar(line) == '.') {
        paras.push(lastline);
        lastline = '  ';
      }
    });
  output.innerHTML = '';


  paras.forEach(para=> {
    let p = create_and_add_element('p');
    const add = (string, color = 'black')=> {
      let e = create_and_add_element('span', p);
      e.innerText = string;
      e.style.color = color;
      e.style.fontFamily='sans-serif'
    };
    let sentenses = para.split('.');
    add(head(sentenses), 'red');
    tail(sentenses).forEach(sentense=>add(sentense));
  });
}

input.onchange = update;
input.onkeydown = update;

input.value = localStorage.getItem('input');
update();

// printline("end");










