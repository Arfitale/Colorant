export const Bar = () => {
	const out = document.createElement('div');
	out.className = 'color-bar';
	out.setAttribute('data-isLock', 'false');
	out.setAttribute('draggable', 'true');
	out.innerHTML = `
    <div class="color-bg"></div>
    <div class="color-body">
        <div class="color-tools">
            <div class="btn tippy tippy btn-md btn-color btn-remove" role="button" data-btn-function='removeColor'>
                <i class="ri-delete-bin-7-line"></i>
            </div>
            <div class="btn tippy tippy btn-md btn-color btn-drag" role="button" data-btn-function='dragColor'>
                <i class="ri-drag-move-line"></i>
            </div>
            <div class="btn tippy tippy btn-md btn-color btn-copy" role="button" data-btn-function='copyColor'>
                <i class="ri-clipboard-line"></i>
            </div>
            <div class="btn tippy tippy btn-md btn-color btn-lock" role="button" data-btn-function='lockColor'>
                <i class="ri-lock-unlock-line"></i>
            </div>
        </div>
        <div class="color-info">
            <div class="color-code"></div>
            <div class="color-name"></div>
        </div>
    </div>`;
	return out;
};
