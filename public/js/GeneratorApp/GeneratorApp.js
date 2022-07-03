import GeneratorColor from './modules/generatorColor.js';
import Events from './modules/generatorEvents.js';
import { updateDimension } from './modules/ui.js';
import { Bar } from './components/components.js';
import Dragdrop from './modules/dragdrop.js';

// DEFAULT STATE
let barCount = 5;

// DEFAULT SETTING
const barMax = 8;
const barMin = 2;

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

// KEY EVENT
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
		barCount += 1;
	}

	// check if barCount is higher than barMin
	if (barCount > barMin) {
		colorScheme
			.querySelectorAll('.btn-remove')
			.forEach((btn) => (btn.style.display = 'flex'));
	}
});

// COLOR BAR EVENT
colorScheme.addEventListener('click', (event) => {
	const target = event.target;
	const bar = event.target.parentElement.parentElement.parentElement;

	// LOCK BTN
	if (target.getAttribute('data-btn-function') === 'lockColor') {
		Events.lockColorHandler(bar, target);
	}

	// COPY BTN
	if (target.getAttribute('data-btn-function') === 'copyColor') {
		Events.copyBtnHandler(bar);
	}

	// REMOVE BTN
	if (target.getAttribute('data-btn-function') === 'removeColor') {
		if (barCount > barMin) {
			Events.removeBtnHandler(bar);
			barCount -= 1;
		}

		// check if barCount is less or equal barMin
		if (barCount === barMin) {
			colorScheme
				.querySelectorAll('.btn-remove')
				.forEach((btn) => (btn.style.display = 'none'));
		}
	}
});

// DRAGDROP COLOR BAR
window.addEventListener('dragstart', (event) => {
	const target = event.target;
	if (target.classList.contains('btn-drag')) {
		Dragdrop.dragStartHandler(target);
	}
});
window.addEventListener('dragover', (event) => {
	const dragBar = colorScheme.querySelector('.color-bar.dragged');
	if (dragBar) Dragdrop.dragMoveHandler(event, dragBar);
});

window.addEventListener('dragend', (event) => {
	const target = event.target;
	if (target.classList.contains('btn-drag')) {
		const bar = target.parentElement.parentElement.parentElement;
		Dragdrop.dragEndHandler(target);
	}
});
