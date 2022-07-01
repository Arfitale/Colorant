import GeneratorColor from './modules/generatorColor.js';
import { updateDimension } from './modules/ui.js';

// DEFAULT SETTINGS
let barCount = 5;

// DOM
const generateBtn = document.querySelector('.btn-generate');
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
		const barHTML = `<div class="color-bar" data-isLock="false" draggable="true">
        <div class="color-bg"></div>
        <div class="color-body">
            <div class="color-tools">
                <div class="btn tippy tippy btn-md btn-color btn-remove" role="button">
                    <i class="ri-delete-bin-7-line"></i>
                </div>
                <div class="btn tippy tippy btn-md btn-color btn-drag" role="button">
                    <i class="ri-drag-move-line"></i>
                </div>
                <div class="btn tippy tippy btn-md btn-color btn-copy" role="button">
                    <i class="ri-clipboard-line"></i>
                </div>
                <div class="btn tippy tippy btn-md btn-color btn-lock" role="button">
                    <i class="ri-lock-unlock-line"></i>
                </div>
            </div>
            <div class="color-info">
                <div class="color-code"></div>
                <div class="color-name"></div>
            </div>
        </div>
    </div>`;
		colorScheme.innerHTML += barHTML;
	}
}

// APP WHEN READY LOADED
document.addEventListener('DOMContentLoaded', (event) => {
	_init();
});

// BTN GENERATOR
generateBtn.addEventListener('click', (event) => {
	GeneratorColor.defaultGenerate();
});
