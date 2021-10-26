dragMove_handler(event, dragBar) {
    const colorSchemeDimension = Math.floor(COLOR_SCHEME.getBoundingClientRect().width);
    const barDimension = Math.floor(dragBar.getBoundingClientRect().width);
    const posX = event.clientX;
    
    let moveX = this.dragEvent.posInit === posX ? 1 : posX - this.dragEvent.posInit;
    let collisionArray = this.dragEvent.collisionArray;
    let bars = [...hook(".color-bar", true, COLOR_SCHEME)];

    this.dragEvent.elements.length != 0 ? this.dragEvent.elements : this.dragEvent.elements = [...hook(".color-bar", true, COLOR_SCHEME)];
    this.dragEvent.posInit ? this.dragEvent.posInit : this.dragEvent.posInit = posX;
    this.dragEvent.flagPos ? this.dragEvent.flagPos : this.dragEvent.flagPos = this.dragEvent.posInit;

    // SET BAR POSITION WHILE MOVE
    dragBar.style.transform = `translateX(${moveX}px)`;

    // COLLISION HANDLER
    collisionArray.forEach((collision, index) => {
        if(index === 0) {
            if(posX > 0 && posX < collision) return this.dragEvent.collisionHappen = index;
        }
        
        else if(index === collisionArray.length - 1) {
            if(posX > collisionArray[index - 1] && posX < collision) return this.dragEvent.collisionHappen = index;
        }

        else {
            if(posX > collisionArray[index - 1] && posX < collision) return this.dragEvent.collisionHappen = index;
        }
    });

    if(this.dragEvent.collisionBefore === null) {
        this.dragEvent.collisionBefore = this.dragEvent.collisionHappen;
    }

    // SET POS FOR COLLISION TARGET
    if(this.dragEvent.collisionHappen != undefined) {
        let elementCollision = this.dragEvent.elements[this.dragEvent.collisionHappen];

        if(elementCollision === dragBar) {
            return;
        }

        if(this.dragEvent.flagPos > posX) {
            if(this.dragEvent.collisionHappen < this.dragEvent.collisionBefore) {
                elementCollision.style.transform = `translateX(${barDimension}px)`;
                
                this.dragEvent.elements = arrayShift(this.dragEvent.elements, this.dragEvent.elements[this.dragEvent.collisionHappen], this.dragEvent.elements[this.dragEvent.collisionBefore]);
                
                this.dragEvent.collisionBefore = this.dragEvent.collisionHappen;

            } else if(this.dragEvent.collisionHappen > this.dragEvent.collisionBefore) {
                elementCollision.style.transform = `translateX(0px)`;
                
                this.dragEvent.elements = arrayShift(this.dragEvent.elements,  this.dragEvent.elements[this.dragEvent.collisionBefore], this.dragEvent.elements[this.dragEvent.collisionHappen]);
                
                this.dragEvent.collisionBefore = this.dragEvent.collisionHappen;
            }
        } else {
            if(this.dragEvent.collisionHappen < this.dragEvent.collisionBefore) {
                elementCollision.style.transform = `translateX(0px)`;
                
                this.dragEvent.elements = arrayShift(this.dragEvent.elements, this.dragEvent.elements[this.dragEvent.collisionHappen], this.dragEvent.elements[this.dragEvent.collisionBefore]);
                
                this.dragEvent.collisionBefore = this.dragEvent.collisionHappen;
            } else if(this.dragEvent.collisionHappen > this.dragEvent.collisionBefore) {
                elementCollision.style.transform = `translateX(-${barDimension}px)`;
                
                this.dragEvent.elements = arrayShift(this.dragEvent.elements,  this.dragEvent.elements[this.dragEvent.collisionBefore], this.dragEvent.elements[this.dragEvent.collisionHappen]);
                
                this.dragEvent.collisionBefore = this.dragEvent.collisionHappen;
            }
        }

    }

}