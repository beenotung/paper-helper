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

let button = create_and_add_element('button');
{
  button.textContent = 'reset';
  button.onclick = ()=> {
    localStorage.removeItem('input');
    window.location.reload();
  };
}
let input = add_text_field();
let output = create_and_add_element('div');

let blacklist = [
  'This content downloaded from'
  , 'All use subject to http'
  , 'AMERICAN SPEECH 71.1 (1996)'
  , '17 JULY 2015 • VOL 349 ISSUE 6245'
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
const group_number = (xs, num)=> {
  let res = [];
  let re = [];
  xs.forEach(x=> {
    re.push(x);
    if (xs.length >= num) {
      res.push(re);
      re = []
    }
  })
};
const group_ = (xs, op)=> {
  let type = typeof op;
  return eval('group_' + type)(xs, op);
};
const group = (xs, op)=>xs.length == 0 ? [] : group_(xs, op);

const get_or_init = <K,V>(map:Map<K,V>, key:K, init?:V)=> {
  if (map.has(key))
    return map.get(key);
  else {
    map.set(key, init);
    return init;
  }
};

const sort = (xs_, f:(a, b)=>number):any[]=> {
  let xs = Array.from(xs_);
  // console.debug('sort', xs.length);
  if (xs.length < 2)
    return xs;
  let p = 0;//Math.round(Math.random() * xs.length);
  let v = xs[p];
  let compare_result = xs.map(x=>[x, f(x, v)]);
  let left = compare_result.filter(x=>x[1] == -1).map(x=>x[0]);
  let center = compare_result.filter(x=>x[1] == 0).map(x=>x[0]);
  let right = compare_result.filter(x=>x[1] == 1).map(x=>x[0]);
  // console.debug('left', left.length, 'center', center.length, 'right', right.length);
  return sort(left, f).concat(center).concat(sort(right, f));
};

const loop = (n, f)=> {
  for (let i = 0; i < n; i++)f(i)
};

function update() {

  localStorage.setItem('input', input.value);
  const word_count = new Map();
  let lines = input.value.split('\n');
  let lastline = '  ';
  let paras = [];
  lines
    .filter(line=>!blacklist.some(x=>line.indexOf(x) != -1))
    .forEach(line=> {
      // line.split(' ')
      //   .filter(x=>x)
      //   .forEach(x=> {
      //     let c = get_or_init(word_count, x, 0);
      //     word_count.set(x, c + 1);
      //   });
      {
        let c = get_or_init(word_count, line, 0);
        word_count.set(line, c + 1);
      }
      // console.debug('word_count', word_count);
      // console.debug(line);
      lastline += ' ' + line;
      if (['.', '?'].indexOf(lastChar(line)) != -1) {
        paras.push(lastline);
        lastline = '  ';
      }
    });
  let rank = sort(word_count /*Array.from(word_count).filter(xs=>xs[0].length > 5)*/, (a, b)=> {
    let res = a[1] == b[1] ? 0 : a[1] > b[1] ? -1 : 1;
    // console.debug(a[1], b[1], res);
    return res;
  }).filter(x=>x[1] > 1);
  rank.forEach(x=>console.debug(x));
  // loop(10, x=>console.debug(rank[x]));
  output.innerHTML = '';


  paras.forEach(para=> {
    let p = create_and_add_element('p');
    p.style.marginTop = '2vh';
    p.style.marginBottom = '8vh';
    const add = (string, color = 'black')=> {
      let e = create_and_add_element('span', p);
      e.innerText = string;
      e.style.color = color;
      // e.style.fontFamily='sans-serif'
      e.style.fontFamily = 'monospace';
    };
    let sentenses = para.split('.').map(x=>x + '.');
    sentenses = sentenses.map(x=> {
      if (x.indexOf('- ') != -1) {
        // console.debug('- detected', x);
        return x.replace('- ', '');
      } else {
        return x;
      }
    });
    add(head(sentenses), 'red');
    tail(sentenses).forEach(sentense=>add(sentense));
  });
}

input.onchange = update;
input.onkeydown = update;

async function init() {
  try {
    localStorage.setItem('input', await fetch('text.txt').then(x=>x.text()))
  } catch (e) {
    console.error('failed to get text.txt');
  }
  input.value = localStorage.getItem('input');
  update();
}

init();

// printline("end");










