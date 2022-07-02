import GeneratorColor from './modules/generatorColor.js';
import Events from './modules/generatorEvents.js';
import { updateDimension } from './modules/ui.js';
import { Bar } from './components/components.js';

// DEFAULT STATE
let barCount = 5;

// DEFAULT SETTING
const barMax = 8;

// DOM
const generateBtn = document.querySelector('.btn-generate');
const addBtn = document.querySelector('.btn-add');
const colorScheme = document.querySelector('.color-scheme');

// INITIALIZATION
function _init() {
	// set color bar
	setBar();
	updateDimension();
	GeneratorColor.defaultGenerate();
}

function setBar() {
	for (let x = 0; x < barCount; x++) {
		colorScheme.appendChild(Bar());
	}
}

// APP WHEN READY LOADED
document.addEventListener('DOMContentLoaded', (event) => {
	_init();
});

window.addEventListener('keydown', (event) => {
	// spacebar button
	if (event.code === 'Space') {
		GeneratorColor.defaultGenerate();
	}
});

// BTN GENERATOR
generateBtn.addEventListener('click', (event) => {
	GeneratorColor.defaultGenerate();
});

// ADD BTN
addBtn.addEventListener('click', (event) => {
	if (barCount < barMax) {
		Events.addBtnHandler(barCount);
		barCount++;
	}
});

colorScheme.addEventListener('click', (event) => {
	const target = event.target;
	const bar = event.target.parentElement.parentElement.parentElement;

	if (target.getAttribute('data-btn-function') === 'lockColor') {
		Events.lockColorHandler(bar, target);
	}

	if (target.getAttribute('data-btn-function') === 'copyColor') {
		Events.copyBtnhandler(bar);
	}
});
