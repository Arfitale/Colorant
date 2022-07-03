const colorScheme = document.querySelector('.color-scheme');

class Dragdrop {
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

	dragStartHandler(target) {
		const bar = target.parentElement.parentElement.parentElement;
		const btns = bar.querySelectorAll('.tools .btn:not(.btn-drag)');

		// style bar
		bar.style.zIndex = '99';
		bar.classList.add('dragged', 'transition-none');

		// style btn
		target.style.transform = 'scale(1.1)';
		btns.forEach((btn) => btn.classList.add('invisible'));

		// set collision pos
		colorScheme.querySelectorAll('.color-bar').forEach((bar, index) => {
			let collisionPos = Math.round(
				bar.getBoundingClientRect().width * (index + 1)
			);
			this.dragEvent.collisionList.push(collisionPos);
		});
	}

	dragMoveHandler(event, dragBar) {
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
		elements = [...colorScheme.querySelectorAll('.color-bar')];
		collider = collider || elements.indexOf(dragBar);

		let moveX = posInit === posX ? 1 : posX - posInit;
		let bars = [...colorScheme.querySelectorAll('.color-bar')];
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

	dragEndHandler(target) {
		const bar = target.parentElement.parentElement.parentElement;
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
				colorScheme.insertBefore(
					bar,
					elements[collisionIndex].nextElementSibling
				);
			} else {
				colorScheme.insertBefore(bar, elements[collisionIndex]);
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
				colorScheme.insertBefore(bar, elements[collisionIndex]);
			} else {
				colorScheme.insertBefore(
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
}

export default new Dragdrop();
