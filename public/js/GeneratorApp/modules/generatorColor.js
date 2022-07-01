import { colors, colorName } from '../../../../data/color/colors.js';
import { updateColor } from './ui.js';

class GeneratorColor {
	defaultGenerate() {
		const COLOR_BAR = document.querySelectorAll('.color-field .color-bar');
		const COLOR_SCHEME = document.querySelector('.color-scheme');

		COLOR_BAR.forEach((bar) => {
			let isLock = bar.getAttribute('data-isLock');
			isLock = isLock === 'true' ? true : false;

			if (!isLock) {
				const [colorName, colorCode] = this.getRandomColor();

				// Set every color bars
				updateColor(bar, `#${colorCode}`, colorName);
			}
		});

		COLOR_SCHEME.setAttribute('id', '');
	}

	// get random color
	getRandomColor() {
		const randomColorName =
			colorName[Math.round(Math.random() * colorName.length)];
		const colorCode = colors[randomColorName];

		return [randomColorName, colorCode];
	}
}

export default new GeneratorColor();
