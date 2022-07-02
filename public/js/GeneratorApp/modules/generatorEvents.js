import GeneratorColor from './generatorColor.js';
import { Bar } from '../components/components.js';
import { updateColor, updateDimension } from './ui.js';

const colorScheme = document.querySelector('.color-scheme');

class GeneratorEvents {
	addBtnHandler(currentBarLength) {
		const [colorName, colorCode] = GeneratorColor.getRandomColor();
		const newBar = Bar();
		newBar.classList.add('add-anim');

		if (currentBarLength === 2) {
			colorScheme
				.querySelectorAll('.btn-remove')
				.forEach((btn) => (btn.style.display = 'block'));
		}

		colorScheme.appendChild(newBar);
		updateColor(newBar, `#${colorCode}`, colorName);

		newBar.addEventListener('animationend', (event) => {
			newBar.classList.remove('add-anim');
		});
		updateDimension();
	}

	lockColorHandler(bar, lockIcon) {
		const isLock = bar.getAttribute('data-isLock') === 'true' ? true : false;
		let newIcon = document.createElement('i');

		newIcon.className = isLock ? 'ri-lock-unlock-line' : 'ri-lock-line';
		lockIcon.classList.toggle('lock');

		bar.setAttribute('data-isLock', `${!isLock}`);
		lockIcon.innerHTML = '';
		lockIcon.appendChild(newIcon);
	}
	copyBtnhandler(bar) {
		const code = bar.querySelector('.color-code').innerText;
		window.navigator.clipboard.writeText(code);
	}
}

export default new GeneratorEvents();
