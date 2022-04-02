class Palette {

    constructor(colorsNr) {
        // vars
        this.colorsNr = colorsNr;
        this.colors = [];
        this.library = new Library(this);
        // selectors
        this.paletteContainer = document.querySelector('.palette-colors-container');
        this.generateBtn = document.querySelector('.generate-btn');
        this.saveBtn = document.querySelector('.save-btn');
        this.libraryBtn = document.querySelector('.library-btn');
        this.popupCloseBtns = document.querySelectorAll('.popup-close');
        this.popupOverlays = document.querySelectorAll('.popup-overlay');
        this.savePopup = document.querySelector('.popup.save');
        this.libraryPopup = document.querySelector('.popup.library');
        // eventlisteners
        this.generateBtn.addEventListener('click', () => { this.updateAllColors() });
        this.saveBtn.addEventListener('click', () => { this.openSavePopup() });
        this.libraryBtn.addEventListener('click', () => { this.openLibraryPopup() });
        this.getClosePopupsEvents();
        // functions
        this.paletteInit();
        this.getSavePaletteEvent();
    }

    paletteInit() {
        for(let i = 0; i < this.colorsNr; i++) {
            let color = new Color(this, i);
            this.colors.push(color);
            color.show();
            color.getSelectors();
            color.preventColorReset();
            color.getAdjustWindowEvents();
            color.getCopyEvent();
            color.getAdjustColorEvents();
            color.getLockUnlockEvent();
        }
        this.updateAllColors();
    }

    updateAllColors(updateColors = null) {
        this.colors.forEach( (color, i) => {
            let updateColor;
            if (updateColors === null) {
                updateColor = chroma.random();
            } else {
                updateColor = updateColors[i];
            }
            color.updateColor(updateColor);
        });
    }

    openSavePopup() {
        this.savePopup.classList.add('active');
    }

    openLibraryPopup() {
        this.libraryPopup.classList.add('active');
        this.library.rebuildLibrary(this.libraryPopup.querySelector('.popup-content'));
    }

    getClosePopupsEvents() {
        this.popupCloseBtns.forEach(closeBtn => {
            closeBtn.addEventListener('click', e => { 
                const popup = e.target.parentElement.parentElement.parentElement;
                popup.classList.remove('active');
            }); 
        });
        this.popupOverlays.forEach(popupOverlay => {
            popupOverlay.addEventListener('click', e => { 
                const popup = e.target.parentElement;
                popup.classList.remove('active');
            }); 
        });
    }

    getSavePaletteEvent() {
        const popupNameInput = this.savePopup.querySelector('.popup-name-input');
        const popupSaveBtn = this.savePopup.querySelector('.popup-save-btn');
        popupSaveBtn.addEventListener('click', () => {
            // close popup
            const popup = popupSaveBtn.parentElement.parentElement.parentElement.parentElement;
            popup.classList.remove('active');
            // save palette
            this.library.savePalette(popupNameInput.value);
            // show success message
            (new Animation).info('primary', `New palette "${popupNameInput.value}" has been saved succesfully!`);
            // reset field
            popupNameInput.value = '';
        });
    }

}