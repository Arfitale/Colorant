import tinycolor from './tinyColor.js';
import { ntc } from './ntc.js';

ntc.init();

const userInterface = document.querySelector('.ui');

class UI {
	constructor() {
		this.darkColorMode = '#101010';
		this.lightColorMode = '#eeeeee';
		this.desktopDimensionX = 1360;
		this.mobileDimensionX = 768;
		this.currentDevice = getCurrentDevice();
	}

	updateColor(colorBar, colorCode, colorName = '') {
		const isLight = tinycolor(colorCode).isLight();
		colorName ? colorName : ntc.name(colorCode)[1];

		this.contrastUI(colorBar, isLight);
		this.updateColorBar(colorBar, colorCode, colorName);
	}

	updateColorBar(colorBar, colorCode, colorName) {
		const colorBg = colorBar.querySelector('.color-bg');
		colorBg.style.backgroundColor = colorCode;
		colorBar.querySelector('.color-code').innerHTML = colorCode.replace(
			'#',
			''
		);
		colorBar.querySelector('.color-name').innerHTML = colorName;
	}

	contrastUI(colorBar, isLight) {
		const btn = colorBar.querySelectorAll(`.btn`);
		const colorName = colorBar.querySelector(`.color-name`);
		const colorCode = colorBar.querySelector(`.color-code`);

		if (isLight) {
			btn.forEach((el) => (el.style.color = this.darkColorMode));
			colorCode.style.color = this.darkColorMode;
			colorName.style.color = this.darkColorMode;
		} else {
			btn.forEach((el) => (el.style.color = this.lightColorMode));
			colorCode.style.color = this.lightColorMode;
			colorName.style.color = this.lightColorMode;
		}
	}

	showMessage(text, type, time = 3000) {
		const newMessage = document.createElement('div');
		newMessage.className = `message message-${type}`;

		const ui = document.querySelector('.ui');
		const messageUI = document.querySelector('.ui .messageUI');

		newMessage.textContent = text;

		messageUI.innerHTML = '';
		messageUI.appendChild(newMessage);

		// final animation and remove this message
		setTimeout(() => {
			newMessage.classList.add('message-disappear');
			newMessage.addEventListener('animationend', () => newMessage.remove());
		}, time);
	}

	toggleOverlay() {
		const overlay = document.querySelector('.overlay');
		overlay.classList.toggle('active');
	}

	updateDimension(bars = null) {
		const colorScheme = document.querySelector('.color-scheme');
		bars = bars || colorScheme.querySelectorAll('.color-bar');

		// determine bar width by dividing color scheme width with bars length
		const init = 100 / bars.length;

		// set bar width
		bars.forEach((bar, index) => {
			let position = init * index;

			if (window.innerWidth > this.mobileDimensionX) {
				bar.style.width = `${init}%`;
				bar.style.height = `100%`;
				bar.style.left = `${position}%`;
				bar.style.top = `0`;
			} else if (window.innerWidth <= this.mobileDimensionX) {
				bar.style.width = `100%`;
				bar.style.height = `${init}%`;
				bar.style.left = `0`;
				bar.style.top = `${position}%`;
			}
		});
	}
}

function getCurrentDevice() {
	const currentWidth = window.innerWidth;
	return currentWidth <= 768 ? 'mobile' : 'desktop';
}

export const ui = new UI();
