import GeneratorColor from './generator.js';
import { ui } from './UI.js';
import App from './app.js';

const COLOR_FIELD = document.querySelector('.color-field');
const COLOR_SCHEME = COLOR_FIELD.querySelector('.color-scheme');
const UI = document.querySelector('.ui');
const overlay = document.querySelector('.overlay');

class events {
	constructor() {
		this.desktopDimensionX = 1360;
		this.mobileDimensionX = 768;
		this.dragEvent = {
			posInit: 0,
			currentMousePos: 0,
			beforeMousePos: 0,
			mouseDirection: null,
			flagPos: null,
			collisionList: [],
			collisionIndex: null,
			collider: null,
			elements: [],
		};
	}

	// Account show modal handler
	accountShow_handler() {
		const accountSettings = document.querySelector('.account-settings-ctr');

		accountSettings.classList.toggle('show');
		overlay.classList.toggle('active');
		overlay.classList.toggle('account');
	}

	menuBtn_handler() {
		const navBar = document.querySelector('.nav-main');
		const closeBtn = document.querySelector('.btn-close-nav');
		const menuBtn = document.querySelector('.btn-menu-mobile');

		navBar.classList.toggle('show');
		closeBtn.classList.toggle('active');
		menuBtn.classList.toggle('invisible');
	}

	showLoginModal() {
		const showLoginModal = document.querySelector('.ui .login-modal');

		showLoginModal.classList.toggle('d-block');
	}

	unsaveBtn_handler(saveBtn) {
		saveBtn.classList.remove('saved');
	}

	savePalleteBtn_handler(currentPallete) {
		const savePalleteModal = document.querySelector('.ui .save-pallete-modal');

		// Determine pallete to save
		const palleteToSave = savePalleteModal.querySelector('.pallete-to-saved');
		palleteToSave.innerHTML = '';
		for (let x = 0; x < currentPallete.length; x++) {
			const bar = document.createElement('li');
			bar.classList.add('bar');
			bar.style.backgroundColor = `#${currentPallete[x]}`;

			palleteToSave.appendChild(bar);
		}

		savePalleteModal.classList.toggle('d-flex');
		overlay.classList.toggle('active');
	}

	bookmarkBtn_handler() {
		const bookmarkUI = document.querySelector('.ui .bookmark');
		const noPallete = document.querySelector('.ui .no-pallete');
		const palleteLib = document.querySelector('.ui .pallete-library');
		const { colorLibrary } = App.getUser();

		if (bookmarkUI.classList.contains('show')) {
			palleteLib.innerHTML = '';
		} else {
			if (colorLibrary) {
				palleteLib.classList.add('d-flex');
				noPallete.classList.add('d-none');

				for (let x = 0; x < colorLibrary.length; x++) {
					const {
						id,
						palleteName: name,
						pallete: colors,
						palleteDescription: desc,
						colorNames,
					} = colorLibrary[x];

					const newPallete = document.createElement('div');
					const palleteName = document.createElement('div');
					const palleteInterface = document.createElement('div');
					const palleteBar = document.createElement('div');
					const palleteTools = document.createElement('ul');

					newPallete.classList.add('pallete-item');
					palleteInterface.classList.add('pallete-interface');
					palleteBar.classList.add('pallete-bar');
					palleteName.classList.add('pallete-name');
					palleteTools.classList.add('pallete-tools');

					newPallete.setAttribute('id', id);

					palleteName.textContent = name;

					for (let y = 0; y < colors.length; y++) {
						const bar = document.createElement('div');
						const colorCode = `#${colors[y]}`;
						const colorName = colorNames[y];

						bar.setAttribute('color-code', colorCode);
						bar.setAttribute('color-name', colorName);
						bar.classList.add('bar');
						bar.style.backgroundColor = colorCode;
						palleteBar.append(bar);
					}

					palleteTools.innerHTML += `
                    <li>
                        <button class="btn btn-pallete-show btn-color btn-icon btn-ui" data-tippy-content="pallete option">
                            <i class="ri-refresh-line"></i>
                        </button>
                    </li>
                    <li>
                        <button class="btn btn-pallete-delete btn-color btn-icon btn-ui" data-tippy-content="pallete option">
                        <i class="ri-delete-bin-2-line"></i>
                        </button>
                    </li>`;
					palleteInterface.append(palleteBar);
					palleteInterface.append(palleteTools);

					newPallete.appendChild(palleteName);
					newPallete.appendChild(palleteInterface);
					palleteLib.appendChild(newPallete);
				}
			} else {
				palleteLib.classList.add('d-none');
				noPallete.classList.add('d-block');
				noPallete.innerHTML = `<div>No pallete saved</div>`;
			}
		}
		bookmarkUI.classList.toggle('show');

		overlay.classList.toggle('active');
		overlay.classList.toggle('bookmark');
	}

	addBtn_handler(len) {
		const [colorName, colorCode] = GeneratorColor.getRandomColor();
		const bar = document.createElement('div');

		bar.className = 'color-bar add-anim';
		bar.innerHTML = `<div class="color-bg"></div>
        <div class="color-body">
            <div class="color-tools">
                <div class="btn btn-md btn-color btn-remove" role="button" data-tippy-content="remove color">
                    <i class="ri-delete-bin-7-line"></i>
                </div>
                <div class="btn btn-md btn-color btn-drag" role="button" data-tippy-content="move color" draggable="true">
                    <i class="ri-drag-move-line"></i>
                </div>
                <div class="btn btn-md btn-color btn-copy" role="button" data-tippy-content="copy color code">
                    <i class="ri-clipboard-line"></i>
                </div>
                <div class="btn btn-md btn-color btn-lock" role="button" data-tippy-content="lock color">
                    <i class="ri-lock-unlock-line"></i>
                </div>
            </div>
            <div class="color-info">
                <div class="color-code"></div>
                <div class="color-name"></div>
            </div>`;

		if (len === 2) {
			COLOR_SCHEME.querySelectorAll('.btn-remove').forEach(
				(btn) => (btn.style.display = 'block')
			);
		}

		COLOR_SCHEME.appendChild(bar);
		ui.updateColor(bar, `#${colorCode}`, colorName);

		bar.addEventListener('animationend', (event) => {
			bar.classList.remove('add-anim');
		});
	}

	// copy btn
	copyBtn_handler(bar) {
		const code = bar.querySelector('.color-code').innerText;
		return window.navigator.clipboard.writeText(code);
	}

	// lock btn
	lockBtn_handler(bar, isLock) {
		let icon;
		isLock = isLock === 'true' ? true : false;
		const lockBtn = bar.querySelector('.btn-lock');

		if (isLock) {
			icon = `<i class="ri-lock-unlock-line"></i>`;
			lockBtn.classList.remove('lock');
		} else {
			icon = `<i class="ri-lock-line"></i>`;
			lockBtn.classList.add('lock');
		}

		bar.setAttribute('data-isLock', `${!isLock}`);
		lockBtn.innerHTML = icon;
		return;
	}

	// remove btn
	removeBtn_handler(bar, len) {
		if (len >= 3) {
			bar.remove();
		}
		if (len <= 3) {
			COLOR_SCHEME.querySelectorAll('.btn-remove').forEach(
				(btn) => (btn.style.display = 'none')
			);
		}
	}

	showPallete(target) {
		const bars =
			target.parentElement.parentElement.previousElementSibling.querySelectorAll(
				'.bar'
			);
		const id =
			target.parentElement.parentElement.parentElement.parentElement.getAttribute(
				'id'
			);
		const pallete = [];

		for (let x = 0; x < bars.length; x++) {
			const colorData = {
				colorCode: bars[x].getAttribute('color-code'),
				colorName: bars[x].getAttribute('color-name'),
			};
			pallete.push(colorData);
		}

		// set color scheme to this pallete
		COLOR_SCHEME.innerHTML = '';
		COLOR_SCHEME.setAttribute('id', id);

		for (let x = 0; x < pallete.length; x++) {
			const bar = document.createElement('div');
			const colorCode = pallete[x].colorCode;
			const colorName = pallete[x].colorName;

			bar.className = 'color-bar';
			bar.innerHTML = `<div class="color-bg"></div>
                <div class="color-body">
                    <div class="color-tools">
                        <div class="btn btn-md btn-color btn-remove" role="button" data-tippy-content="remove color">
                            <i class="ri-delete-bin-7-line"></i>
                        </div>
                        <div class="btn btn-md btn-color btn-drag" role="button" data-tippy-content="move color" draggable="true">
                            <i class="ri-drag-move-line"></i>
                        </div>
                        <div class="btn btn-md btn-color btn-copy" role="button" data-tippy-content="copy color code">
                            <i class="ri-clipboard-line"></i>
                        </div>
                        <div class="btn btn-md btn-color btn-lock" role="button" data-tippy-content="lock color">
                            <i class="ri-lock-unlock-line"></i>
                        </div>
                    </div>
                    <div class="color-info">
                        <div class="color-code"></div>
                        <div class="color-name"></div>
                    </div>`;

			COLOR_SCHEME.appendChild(bar);
			ui.updateColor(bar, colorCode, colorName);
		}

		// remove overlay and bookmark state
		this.bookmarkBtn_handler();
		overlay.classList.remove('active');
		overlay.classList.remove('bookmark');
	}

	deletePalleteFromLibrary(target) {
		const palleteItems = document.querySelectorAll(
			'.pallete-library .pallete-item'
		);
		const currentPallete =
			target.parentElement.parentElement.parentElement.parentElement;
		const currentID = currentPallete.getAttribute('id');
		const saveBtn = document.querySelector(
			'.color-field .main-tools .btn-save-pallete'
		);

		let newColorLibrary = [];
		let { colorLibrary } = App.getUser();

		// DOM
		for (let x = 0; x < palleteItems.length; x++) {
			const id = palleteItems[x].getAttribute('id');

			if (id === currentID) {
				palleteItems[x].remove();
			}
		}

		saveBtn.classList.remove('saved');
		saveBtn.classList.remove('pallete-saved');

		// ls
		newColorLibrary = colorLibrary.filter((pallete) => pallete.id != currentID);
		App.updateUser('colorant_user', {
			...App.getUser(),
			colorLibrary: newColorLibrary,
		});
	}

	removeSavedPallete() {
		const currentID = COLOR_SCHEME.getAttribute('id');

		if (currentID) {
			let newColorLibrary = [];
			let { colorLibrary } = App.getUser();

			// ls
			newColorLibrary = colorLibrary.filter(
				(pallete) => pallete.id != currentID
			);
			App.updateUser('colorant_user', {
				...App.getUser(),
				colorLibrary: newColorLibrary,
			});
		}
	}

	dragStart_handler(bar, target) {
		const tools = bar.querySelector('.color-tools');
		const btns = tools.querySelectorAll('.btn:not(.btn-drag)');

		// style bar
		bar.style.zIndex = '99';
		bar.classList.add('dragged', 'transition-none');

		// style btn
		target.style.transform = 'scale(1.1)';
		btns.forEach((btn) => btn.classList.add('invisible'));

		// set collision pos
		COLOR_SCHEME.querySelectorAll('.color-bar').forEach((bar, index) => {
			let collisionPos = Math.round(
				bar.getBoundingClientRect().width * (index + 1)
			);
			this.dragEvent.collisionList.push(collisionPos);
		});
	}

	dragEnd_handler(bar, target) {
		const tools = bar.querySelector('.color-tools');
		const btns = tools.querySelectorAll('.btn:not(.btn-drag)');
		let {
			posInit,
			currentMousePos,
			beforeMousePos,
			mouseDirection,
			flagPos,
			collisionList,
			collisionIndex,
			collider,
			elements,
		} = this.dragEvent;
		let homePos = 100 / elements.length;

		// style bar
		bar.style.zIndex = '0';

		bar.classList.remove('dragged', 'transition-none');
		bar.style.transform = `translateX(0)`;

		// style btn
		target.style.transform = 'scale(1)';
		btns.forEach((btn) => btn.classList.remove('invisible'));

		// remove transition for while for every non dragged element to prevent bug transition
		elements.forEach((el) => {
			el.classList.add('transition-none');
			el.style.transform = `translateX(0)`;
		});

		// determine new position
		if (mouseDirection === 'right') {
			let newPos,
				barPos,
				isToRight = true;

			elements.forEach((el, index) => {
				// MOUSE DIRECTION STARTED FROM RIGHT
				if (index <= collisionIndex && index > collider) {
					newPos = homePos * (index - 1);

					el.style.left = `${newPos}%`;

					// MOUSE DIRECTION FROM LEFT DIRECTION THEN TO RIGHT
				} else if (index >= collisionIndex && index < collider) {
					newPos = homePos * (index + 1);
					isToRight = false;

					el.style.left = `${newPos}%`;
				}

				// set dragged bar position
				barPos = homePos * collisionIndex;
				bar.style.left = `${barPos}%`;
			});

			if (isToRight) {
				COLOR_SCHEME.insertBefore(
					bar,
					elements[collisionIndex].nextElementSibling
				);
			} else {
				COLOR_SCHEME.insertBefore(bar, elements[collisionIndex]);
			}
		} else {
			let newPos,
				barPos,
				isToLeft = true;

			elements.forEach((el, index) => {
				// MOUSE DIRECTION STARTED FROM LEFT
				if (index >= collisionIndex && index < collider) {
					newPos = homePos * (index + 1);
					el.style.left = `${newPos}%`;

					// MOUSE DIRECTION FROM RIGHT DIRECTION THEN TO LEFT
				} else if (index <= collisionIndex && index > collider) {
					isToLeft = false;
					newPos = homePos * (index - 1);
					el.style.left = `${newPos}%`;
				}
			});

			barPos = homePos * collisionIndex;
			bar.style.left = `${barPos}%`;

			if (isToLeft) {
				COLOR_SCHEME.insertBefore(bar, elements[collisionIndex]);
			} else {
				COLOR_SCHEME.insertBefore(
					bar,
					elements[collisionIndex].nextElementSibling
				);
			}
		}

		// set defalut every element bar
		elements.forEach((el) => {
			el.classList.remove('transition-none');
		});

		// set drag event to default
		this.dragEvent = {
			posInit: 0,
			currentMousePos: 0,
			beforeMousePos: 0,
			mouseDirection: null,
			flagPos: null,
			collisionList: [],
			collisionIndex: null,
			collider: null,
			elements: [],
		};
	}

	dragMove_handler(event, dragBar) {
		const colorSchemeDimension = Math.floor(
			COLOR_SCHEME.getBoundingClientRect().width
		);
		const barDimension = Math.floor(dragBar.getBoundingClientRect().width);
		const posX = event.clientX;

		let {
			posInit,
			currentMousePos,
			beforeMousePos,
			mouseDirection,
			flagPos,
			collisionList,
			collisionIndex,
			collider,
			elements,
		} = this.dragEvent;
		posInit = posInit || posX;
		elements = [...COLOR_SCHEME.querySelectorAll('.color-bar')];
		collider = collider || elements.indexOf(dragBar);

		let moveX = posInit === posX ? 1 : posX - posInit;
		let bars = [...COLOR_SCHEME.querySelectorAll('.color-bar')];
		currentMousePos = event.clientX;

		// DETERMINE MOUSE DIRECTION
		if (currentMousePos != beforeMousePos) {
			mouseDirection = currentMousePos - beforeMousePos > 0 ? 'right' : 'left';
		}

		// SET BAR POSITION WHILE MOVE
		dragBar.style.transform = `translateX(${moveX}px)`;

		// COLLISION HANDLER
		collisionList.forEach((collision, index) => {
			if (index === 0) {
				if (posX > 0 && posX < collision) {
					return (collisionIndex = index);
				}
			} else if (index === collisionList.length - 1) {
				if (posX > collisionList[index - 1] && posX < collision) {
					return (collisionIndex = index);
				}
			} else {
				if (posX > collisionList[index - 1] && posX < collision)
					return (collisionIndex = index);
			}
		});

		if (collisionIndex != null) {
			// WHEN BAR SELECT IS ON END INDEX
			if (collider >= collisionIndex) {
				if (mouseDirection === 'left') {
					elements.forEach((el, index) => {
						if (index >= collisionIndex && index < collider && el != dragBar) {
							el.style.transform = `translateX(${barDimension}px)`;
						}
					});
				} else if (mouseDirection === 'right') {
					elements.forEach((el, index) => {
						if (index + 1 <= collisionIndex) {
							el.style.transform = `translateX(0px)`;
						}
					});
				}
			}

			// WHEN BAR SELECT IS ON FIRST INDEX
			if (collider <= collisionIndex) {
				if (mouseDirection === 'right') {
					elements.forEach((el, index) => {
						if (
							index >= collisionIndex &&
							index < collisionIndex + 1 &&
							el != dragBar
						) {
							el.style.transform = `translateX(-${barDimension}px)`;
						}
					});
				} else {
					elements.forEach((el, index) => {
						if (index - 1 >= collisionIndex) {
							el.style.transform = `translateX(0px)`;
						}
					});
				}
			}
		}

		this.dragEvent = {
			posInit,
			currentMousePos,
			beforeMousePos: currentMousePos,
			mouseDirection,
			flagPos,
			collisionList,
			collisionIndex,
			collider,
			elements,
		};
	}
}

export const eventHandler = new events();
