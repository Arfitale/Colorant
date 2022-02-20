class Tooltip {
    constructor() {
        this.tippy = window.tippy;
        this.instance = null;
        this.elements = null;
    }

    initialize(elements) {
        this.instance = this.tippy(elements, {
            delay: [500, 0]
        }); 
        this.elements = elements;
    }

    refresh() {
        this.instance = this.tippy(this.elements);
    }
}

export const tooltip = new Tooltip();