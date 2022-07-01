import { ntc } from './ntc.js';
import tinycolor from './tinyColor.js';

// UI SETTINGS
const mobileDimensionX = 768;
const lightColorMode = '#eeeeee';
const darkColorMode = '#101010';

// UPDATE DIMENSION WHEN RESIZE
export function updateDimension() {
	const colorScheme = document.querySelector('.color-scheme');
	const bars = colorScheme.querySelectorAll('.color-bar');

	// determine bar width by dividing color scheme width with bars length
	const width = 100 / bars.length;

	// set bar width
	bars.forEach((bar, index) => {
		let position = width * index;

		if (window.innerWidth > mobileDimensionX) {
			bar.style.width = `${width}%`;
			bar.style.height = `100%`;
			bar.style.left = `${position}%`;
			bar.style.top = `0`;
		} else if (window.innerWidth <= mobileDimensionX) {
			bar.style.width = `100%`;
			bar.style.height = `${width}%`;
			bar.style.left = `0`;
			bar.style.top = `${position}%`;
		}
	});
}

// UPDATING COLOR BAR WHEN GENERATING NEW COLOR
export function updateColor(colorBar, colorCode, colorName = '') {
	const isLight = tinycolor(colorCode).isLight();
	colorName ? colorName : ntc.name(colorCode)[1];

	contrastUI(colorBar, isLight);
	updateColorBar(colorBar, colorCode, colorName);
}

function updateColorBar(colorBar, colorCode, colorName) {
	const colorBg = colorBar.querySelector('.color-bg');
	colorBg.style.backgroundColor = colorCode;
	colorBar.querySelector('.color-code').innerHTML = colorCode.replace('#', '');
	colorBar.querySelector('.color-name').innerHTML = colorName;
}

function contrastUI(colorBar, isLight) {
	const btn = colorBar.querySelectorAll(`.btn`);
	const colorName = colorBar.querySelector(`.color-name`);
	const colorCode = colorBar.querySelector(`.color-code`);

	if (isLight) {
		btn.forEach((el) => (el.style.color = darkColorMode));
		colorCode.style.color = darkColorMode;
		colorName.style.color = darkColorMode;
	} else {
		btn.forEach((el) => (el.style.color = lightColorMode));
		colorCode.style.color = lightColorMode;
		colorName.style.color = lightColorMode;
	}
}
