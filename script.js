const columns = [
    [
      { class: '', id: 'clear', value: 'clear', text: 'CE' },
      { class: ['dig'], value: '7', text: '7' },
      { class: ['dig'], value: '4', text: '4' },
      { class: ['dig'], id: '', value: '1', text: '1' },
      { class: ['dig'], value: '0', text: '0' },
    ],
    [
      { class: ['dig'], value: '√', text: '√' },
      { class: ['dig'], value: '8', text: '8' },
      { class: ['dig'], value: '5', text: '5' },
      { class: ['dig'], id: '', value: '2', text: '2' },
      { class: ['dig'], value: '.', text: ',' },
    ],
    [
      { class: ['dig'], value: '%', text: '%' },
      { class: ['dig'], value: '9', text: '9' },
      { class: ['dig'], value: '6', text: '6' },
      { class: ['dig'], id: '', value: '3', text: '3' },
      { class: '', id: 'resultbtn', value: '=', text: '=' },
    ],
    [
      { class: ['dig'], value: '÷', text: '÷' },
      { class: ['dig'], value: 'x', text: 'x' },
      { class: ['dig'], value: '-', text: '-' },
      { class: ['dig', 'sum'], value: '+', text: '+' },
    ],
  ];
  const buttonsElement = document.querySelector('div.buttons');
  
  columns.forEach((column) => {
  
    const col = document.createElement('div');
    col.classList.add('col');
  
    column.forEach((item) => {
      const button = document.createElement('button');
      button.classList.add('btn');
  
      button.dataset.value = item.value;
      if (item.class) {
        button.classList.add(...item.class);
      }
      if (item.id) {
        button.id = item.id;
      }
      button.innerText = item.text;
  
      col.appendChild(button);
    });
  
    buttonsElement.appendChild(col);
  });

  const buttons = document.querySelectorAll('[data-box]');
const boxes = document.querySelectorAll('.box');

const changeClass = {
  to_right: 'reverse_right',
  to_left: 'reverse_left',
};

let lastAnimation = null, clicked = false;

function randomAnimation() {
  const animations = ['to_right', 'to_left', 'to_left', 'to_right'];
  const randomValue = Math.floor(Math.random() * animations.length);
  
  return animations[randomValue];
}

buttons.forEach((button) => {
  button.addEventListener('click', showBox);
});

document.addEventListener('keydown', (event) => {
  const { key } = event;
  if (key!=='c' & key!=='h' & key!=='b') {
    return;
  }
  const button = document.querySelector(`button[data-key=${key}]`);
  if (key === 'c' && clicked === true) {
    const c = document.querySelector('.'+lastAnimation+' header .close');
    if (c) {
      return c.click();
    }
  }
  if (button) {
    return button.click();
  }
});

boxes.forEach((box) => {
  const closeButton = box.querySelector('.close');
  closeButton.addEventListener('click', () => {
    box.classList.add(changeClass[lastAnimation]);
    box.style.zIndex = -1;
    box.style.transform = 'scale(0)';
    clicked = false;
    return box.classList.remove(box.classList[1]);
  })
});

function showBox(event) {
  if (clicked) {
    return;
  }
  const { box } = event.target.dataset;
  const boxElement = document.getElementById(box);
  
  const animation = randomAnimation();

  boxElement.style.zIndex = 9;
  boxElement.style.transform = 'scale(1.16)';
  lastAnimation = animation;
  
  boxElement.classList.toggle(animation);
  clicked = true;
  return boxElement.classList.remove(boxElement.classList[1]);
}

function handleHistoric(newValue) {
    const historic = document.querySelector('#historic main');
    let savedHistoric = null;
    if (!newValue)
      savedHistoric = JSON.parse(localStorage.getItem('historic'));
    else
      savedHistoric = [newValue];
    
    if (!savedHistoric)
      savedHistoric = [];
  
    const buttons = [
      {class: 'd', text: '🗑'},
      // {class: 's', text: '✔'},
    ];
  
    savedHistoric.forEach((Item, index) => {
      const item = document.createElement('div');
      item.classList.add('item');
      item.dataset.index = Item + '_' + index;
      const p = document.createElement('p');
      p.innerText = Item;
      const span = document.createElement('span');
      const right = document.createElement('div');
      right.classList.add('right');
  
      buttons.forEach((button) => {
        const btn = document.createElement('button');
        btn.dataset.divIndex = Item + '_' + index;
        btn.addEventListener('click', deleteItem);
        const strong = document.createElement('strong');
        strong.classList.add(button.class);
        strong.innerText = button.text;
        btn.appendChild(strong);
        span.appendChild(btn);
      });
      
      right.appendChild(span);
      item.appendChild(p);
      item.appendChild(right);
      if (newValue)
        return historic.prepend(item);
  
      historic.appendChild(item);
    });
  }
  
  function deleteItem(event) {
    const { divIndex } = event.path[1].dataset;
    const element = document.querySelector(`[data-index='${divIndex}']`);
    const historic = getSavedHistoric();
    const separated = divIndex.split('_');
    const newHistoric = historic.filter((value) => value !== separated[0]);
    localStorage.setItem('historic', JSON.stringify(newHistoric));
    element.remove();
  }
  function deleteAll() {
    localStorage.clear();
    const items = document.querySelectorAll('.item');
    items.forEach((item) => {
      item.remove();
    });
  }

  const zoom = document.querySelector('.zoom');
const previewElement = document.querySelector('.preview');
const imageElement = document.querySelector('.preview .image');
const changeImage = document.getElementById('change_image');
const animatedElement = document.getElementById('animated');
const noImage = document.getElementById('noimage');
const inputType = document.getElementById('type');
const colorInput = document.getElementById('color');
const calculator = document.querySelector('.calculator-container');

let image = {};

colorInput.addEventListener('change', (event) => {
  const {value:color} = event.target;
  if (!color) {
    return;
  }
  setConfig('color', color);
  return loadConfig();
});

inputType.addEventListener('change', (event) => {
  changeImage.classList.toggle('h', !event.target.checked);
  if (event.target.checked) {
    cancelPreview();
  }
  colorInput.classList.toggle('h', event.target.checked);
  setConfig('color', event.target.checked?'#000000':null);
  setConfig('has_background_image', !event.target.checked);
  loadConfig();
});

function preview(event) {
  if (event.files[0].size > 1048576*5) {
    event.value = "";
    return alert('A imagem selecionada é muito grande, escolha outra');
  }
  document.getElementById('confirm').style.display = 'block';
  const reader = new FileReader();
  reader.onload = function (e) {
    image = {
      source: e.target.result,
      name: event.files[0].name,
      size: event.files[0].size,
      type: event.files[0].type,
      created_at: new Date().getTime(),
    };

    let size = image.size/Math.pow(1024, 2);
    const ext = parseInt(size)<1?'KB':'MB';
    size = ext==='KB'?`${size.toFixed(3)}`.substring(2, size.length):size.toFixed(2);
    image.size =  size + ' ' + ext;

    imageElement.src = image.source;
    updateImageProperties(image);
    previewElement.classList.add('visible');
  }

  reader.readAsDataURL(event.files[0]);
}

function loadConfig() {
  createElementsProperty();
  const config = JSON.parse(localStorage.getItem('config'));
  if (config) {
    //animated
    animatedElement.checked = config.has_animated;
    animation(animatedElement);

    //color
    inputType.checked = config.color!==null?true:false;
    calculator.style.background = config.color?config.color:'';
    changeImage.classList[config.has_background_image?'add':'remove']('h');
    colorInput.classList[config.has_background_image?'remove':'add']('h');
    colorInput.value = config.color!==null?config.color:'#000000';

    //image
    noImage.checked = !config.has_background_image;
    background(noImage, config.has_background_image);
  }

  if (config!==null && (config.color!==null || config.has_background_image===false)) {
    return;
  }

  const image = JSON.parse(localStorage.getItem('image'));
  if (!image)
    return;
  updateImageProperties(image);
  zoom.src = image.source;
  zoom.style.opacity = 1;
  document.getElementById('confirm').style.display = 'none';
  previewElement.classList.add('visible');
  imageElement.src = image.source;
}

function confirmPreview(event) {
  zoom.src = image.source;
  zoom.style.opacity = 1;
  event.style.display = 'none';

  return localStorage.setItem('image', JSON.stringify(image));
}
function cancelPreview() {
  zoom.src = '';
  document.getElementById('confirm').style.display = 'block';
  localStorage.removeItem('image');
  updateImageProperties();
  changeImage.value = '';
  zoom.style.opacity = 0;
  imageElement.src = '';
  previewElement.classList.remove('visible');
}

function updateImageProperties(properties = {}) {
  const propertiesElement = document.querySelector('.properties');
  if (properties && !properties.source) {
    return propertiesElement.classList.remove('visible');
  }
  
  properties.created_at = new Date(properties.created_at);

  propertiesElement.classList.add('visible');
  const classList = ['name', 'size', 'type', 'created_at'];
  classList.forEach((cls) => {
    document.querySelector(`code.${cls}`).innerHTML = properties[cls];
  });
}

function createElementsProperty() {
  const verify = document.querySelector('code.created_at');
  if (verify) {
    return;
  }
  const properties = [
    [{ class: ['propertie'], text: 'Nome' }, { class: ['value', 'name'], text: '' }],
    [{ class: ['propertie'], text: 'Tamanho' }, { class: ['value', 'size'], text: '' }],
    [{ class: ['propertie'], text: 'Tipo' }, { class: ['value', 'type'], text: '' }],
    [{ class: ['propertie'], text: 'Em' }, { class: ['value', 'created_at'], text: '' }],
  ];
  const propertiesElement = document.getElementById('properties');

  properties.forEach((propertie) => {
    const row = document.createElement('div');
    row.classList.add('row');
    propertie.forEach((p) => {
      const codeElement = document.createElement('code');
      codeElement.classList.add(...p.class);
      codeElement.innerHTML = p.text;
      row.appendChild(codeElement);
    });
    propertiesElement.appendChild(row);
  });

}

function animation(event) {
  const elements = ['.zoom', '.container', 'body'];
  setConfig('has_animated', event.checked);
  elements.forEach((element) => {
    const fct = event.checked?'add':'remove';
    document.querySelector(element).classList[fct]('animated');
  });
}
function background(event, current = null) {
  setConfig('has_background_image', current!==null?current:!event.checked);
  zoom.style.opacity = event.checked?0:1;
  if (current===null && event.checked) {
    cancelPreview();
  }
}

function setConfig(key, value) {
  const saved = JSON.parse(localStorage.getItem('config'));
  if (saved) {
    saved[key] = value;
    return localStorage.setItem('config', JSON.stringify(saved));
  }
  const newConfig = {has_animated: false, has_background_image: true};
  newConfig[key] = value;

  localStorage.setItem('config', JSON.stringify(newConfig));
}

const inputElement = document.querySelector('#result');
const clearBtn = document.querySelector('#clear');
const resultBtn = document.querySelector('#resultbtn');

const alt = setTimeout(() => {
	alert("If you're on a computer, you can use the keyboard.");
	clearTimeout(alt);
}, 2000);

const digits = ['0','1','2','3','4','5','6','7','8','9','.','+','-','x','*','%','÷','='];
const operations = ['+', '-', 'x', '÷', '%', '.'], sqrt = {false: '√(', true: ')'};

const maximumSize = 50;
let inputValue = '', square = false, result = false, lastChar = undefined, valueToShow;

handleHistoric();
loadConfig();

function getSavedHistoric() {
	return JSON.parse(localStorage.getItem('historic'));
}
function saveHistoric(value) {
	const savedHistoric = getSavedHistoric();
	if (!savedHistoric)
		return localStorage.setItem('historic', JSON.stringify([value]));

	savedHistoric.unshift(value);
	return localStorage.setItem('historic', JSON.stringify(savedHistoric));
}

document.querySelectorAll('.dig').forEach(el => {
	el.addEventListener('click', (evt) => {
		writeValue(evt.target)
	})
})
clearBtn.addEventListener('click', clearDigits);
resultBtn.addEventListener('click', mainCalculate);

document.addEventListener('keydown', (e)=> {
	let key = String(e.key);
	if (key === 'Backspace') return clearDigits();
	if (key === '*') key = 'x';
	if (key === '/') key = '÷';
	if (key === 'Enter') key = '=';
	
	if(digits.indexOf(key) > -1) {
		const el = document.querySelector(`button[data-value='${key}']`);
		el.click();
		el.classList.add('focus');
		const an = el.addEventListener('animationend', () => {
			el.classList.remove('focus');
			el.removeEventListener('animationend', an);
		});
	}
})

function setTheDeleteButtonTextTo(t) {
	clearBtn.innerText = t;
}

function removeChar(text, num) {
	text = text.substring(0, text.length-num);
	return text;
}

function clearDigits() {
	if (!result && inputValue !== 0) {
		if (inputValue.charAt(inputValue.length-1) === '(') {
			inputValue = removeChar(inputValue, 2);
			square = false;
			document.querySelector('button[data-value=√]').innerHTML = '√';
		}
		else {
			if (inputValue.charAt(inputValue.length-1) === ')') {
				document.querySelector('button[data-value=√]').innerHTML = ')';
				square = !square;
			}
			inputValue = removeChar(inputValue, 1);
		}
		if (inputValue.length <= 0) {

			inputValue = 0;
		}
		inputElement.value = inputValue;
		return;
	}
	result = square = false;
	setTheDeleteButtonTextTo('CE');
	document.querySelector('button[data-value=√]').innerHTML = '√';
	inputValue = '';
	inputElement.value = '0';
}

function writeValue(e) {
	let digit = e.dataset.value;
	if (inputValue.length >= maximumSize) return;
	if (result && (operations.indexOf(digit)===-1 || inputValue==='Error!'
	|| inputValue === '0' || inputValue.length >= maximumSize) && !e.t) {
		inputValue = '';
		clearDigits();
	}
	if (digit === '√' && lastChar === '√(') {
		return;
	}
	if (result && operations.indexOf(digit)>-1) {
		result = false;
		setTheDeleteButtonTextTo('CE');
	}
	
	if (operations.indexOf(digit) > -1 && digit !== '%') {
		if (digit === lastChar) return;
		else if (operations.indexOf(lastChar) > -1 && lastChar !== '%') inputValue = removeChar(inputValue, 1);
	}
	if (digit === '%' && lastChar === ')') return;
	
	if (digit === '√') {
		digit = sqrt[square];
		square = !square;
		document.querySelector('button[data-value=√]').innerHTML = square?')':'√';
	}
	if (digit !== ')') {
		const lastDigit = inputValue.length>0?inputValue.charAt(inputValue.length-1):'';
		if ((parseFloat(digit) && lastDigit === ')') || parseFloat(lastDigit) && digit==='√('
		|| lastDigit === ')' && digit==='√(') inputValue+='x';
	}
	lastChar = digit;
	if (inputValue === 0) inputValue = '';
	inputValue += digit;
	inputElement.value = inputValue.replace(/[.]/g, ',');
}

function separateNumbersAndOperations(values) {
	const separated = {numbers: '', operations: ''};
	if (operations.indexOf(values[0])>-1 && values[0]!='-') {
		values = values.substr(1, values.length-1);
	}
	inputValue = values;
	separated.numbers = values.split(/[+x÷-]/);
	separated.operations = values.split(/[^+x÷-]/);
	separated.operations = separated.operations.filter(i => i !== '');
	separated.numbers = separated.numbers.filter(i => i !== '');
	//se o primeiro digito for '-', retira o sinal das operações e coloca o sinal no primeiro número.
	if (values[0] === '-') {
		let n1 = undefined;
		separated.operations.splice(0, 1);
		separated.numbers.splice(0, 1);
		n1 = separated.numbers[0];
		separated.numbers[0] = '-'+n1;
	}

	return separated;
}

function separate(text) {
	if (operations.indexOf(lastChar)>-1 && lastChar !== '%') text = removeChar(text, 1);
	if (text.indexOf('%') > -1) {
		const forCalc = text.match(/\d{1,10}[%]/g);
		forCalc.forEach(p => {
			const number = p.replace('%', '');
			const calculate = getCalculationFunction('%');
			const percentage = 'p'+calculate(number);
			text = text.replace(p, percentage);
		});
	}
	if (text.indexOf('√') > -1) {
		const l1 = text.match(/[√][(]/g).length;
		const l2 = text.match(/[)]/g)?text.match(/[)]/g).length:0;
		if (l2 < l1) {
			inputValue = text += ')';
		}
		while (text.match(/[√]/)) {
			const inSquare = text.substring(text.indexOf('(')+1, text.indexOf(')'));
			const forRep = text.substring(text.indexOf('(')-1, text.indexOf(')')+1);
			const sepInSquare = separateNumbersAndOperations(inSquare);
			const res = basicCalculation(sepInSquare);
			const op = getCalculationFunction('√');
			let root = op(res);
			if (!root) {
				root = 'Error!'
			}
			text = text.replace(forRep, root);
		}
	}
	const error = text.match(/['E']/g);
	const separated = error?'Error!':separateNumbersAndOperations(text);
	return separated;
}

function getCalculationFunction(operation) {
	function percentage(n1, n2) {
		if (String(n2).search('p') > -1 && String(n1).search('p') <= -1) {
			n2 = String(n2).replace('p', '');
			n1 = String(n1).replace('p', '');
			n2 = parseFloat(n1) * parseFloat(n2);
		}
		n2 = String(n2).replace('p', '');
		n1 = String(n1).replace('p', '');

		return { n1, n2 };
	}
	const calculation = {
		'+': (n1, n2) => {
			const { n1:v1, n2:v2 } = percentage(n1, n2);
			return parseFloat(v1) + parseFloat(v2);
		},
		'-': (n1, n2) => {
			const { n1:v1, n2:v2 } = percentage(n1, n2);
			return parseFloat(v1) - parseFloat(v2);
		},
		'x': (n1, n2) => {
			n1 = String(n1).replace('p', '');
			n2 = String(n2).replace('p', '');
			return parseFloat(n1) * parseFloat(n2);
		},
		'÷': (n1, n2) => {
			n1 = String(n1).replace('p', '');
			n2 = String(n2).replace('p', '');
			return parseFloat(n1) / parseFloat(n2);
		},
		'%': (n1) => { return (parseFloat(n1) / 100)},
		'√': (n1) => { return Math.sqrt(n1)},
	}

	return calculation[operation];
}

function basicCalculation(n) {
	let total = 0, firstC = false, final = false;
	if (n.operations.length <= 0)  {
		return n.numbers[0];
	}
	//--> cálculo na ordem correta
	function getOperationPositions(op) {
		const newArray = n.operations.map((value, index) => {
			if (value === op) {
				return index;
			}
		});
		return newArray.filter(v => v);
	}

	function operationsPriorities(array) {
		if (array.length <= 0 && final) {
			return;
		}
		if (array.length <= 0 && !final) {
			final = true;
			array = getOperationPositions('x');
		}
		array.map((position, index) => {
			const n1 = n.numbers[position];
			const n2 = n.numbers[position+1];
			const op = n.operations[position];
			const fct = getCalculationFunction(op);
			const result = fct(n1, n2);
			if (result) {
				n.numbers[position] = String(result);
				n.numbers.splice(position+1, 1);
				n.operations.splice(position, 1);
			}
			array.splice(index, 1);
			if (!array) {
				array = getOperationPositions('x');
				final = true;
				return operationsPriorities(getOperationPositions('x'));
			}
		});
	}
	const positions = getOperationPositions('÷');
	operationsPriorities(positions);

	for (let i = 0;i < n.operations.length;i++) {
		const fct = getCalculationFunction(n.operations[i]), n2 = n.numbers[i+1];
		if (n2) {
			total = fct(firstC?total:n.numbers[i], n2);
		}
		firstC = true;
	}
	return total;
}

function mainCalculate() {
	let verify = inputValue.match(/\d*[+x%÷-]+\d/g);
	if (!verify) {
		verify = inputValue.match(/[(](-|)+\d/g);
	}
	if (!verify) {
		verify = inputValue.match(/\d[%]/g);
	}
	if (!verify)
	return;
	valueToShow = inputValue;
	if (inputValue.match(/[(]/g) && inputValue.search(/[)]/g) <= -1) {
		valueToShow+=')';
	}
	let res, total = 0;

	res = separate(inputValue);

	if (res === 'Error!') {
		total = res;
	}
	else if (res.operations.length <= 0) {
		total = res.numbers[0];
	}
	else {
		total = basicCalculation(res);
	}
	if (!total && total !== 0) return

	result = true;
	if (String(total).search(/[.]/)>-1) { //número decimal muito longo
		if (String(total).length > 20) {
			total = String(total).substring(0, 16);
		}
	}

	total = {
		dataset: {
			value: String(total),
		},
		t: true,
	};
	setTheDeleteButtonTextTo('AC');
	const newHistoric = `${valueToShow.replace(/[.]/g, ',')}=${total.dataset.value}`;
	saveHistoric(newHistoric);
	handleHistoric(newHistoric);
	inputValue = '';
	writeValue(total);
}