class LibraryPalette {

    /**
     * Constructor
     * 
     * @param {string} name Name of the saved palette
     * @param {array} colors Array of Hex colors | eg. [#ffffff, #000000]
     * @param {Library} library Library to which this LibraryPalette is attached | Default: {}
     */
    constructor(name, colors, library) 
    {
        this.name = name;
        this.colors = colors;
        this.library = library;
        this.loadBtn;
        this.deleteBtn;
        this.container;
        this.appendContainer;
    }

    /**
     * Save selectors in the object
     */
    getSelectors() {
        this.loadBtn = this.container.querySelector('.library-palette-colors-container');
        this.deleteBtn = this.container.querySelector('.library-palette-button.delete');
    }
    
    /**
     * Load Event Listeners
     */
    getEvents() {
        this.loadBtn.addEventListener('click', () => {
            this.load();
        });
        this.deleteBtn.addEventListener('click', () => {
            this.delete();
        });
    }

    /**
     * Generate the HTML code of the saved palette (to display inside the library popup)
     * (Create all needed nodes elements and append them to the parent container provided as a parameter)
     * 
     * @param {Node} appendContainer The Node container the HTML code must be appended to
     */
    show(appendContainer) {
        this.appendContainer = appendContainer;
        // create a palette
        let paletteContainer = document.createElement('div');
        this.container = paletteContainer; // save to object
        paletteContainer.classList.add('library-palette');
        // inside the palette
        let paletteName = document.createElement('p');
        paletteName.classList.add('library-palette-name');
        paletteName.innerText = this.name;
        paletteContainer.appendChild(paletteName);
        let paletteColorsContainer = document.createElement('div');
        paletteColorsContainer.classList.add('library-palette-colors-container');
        this.colors.forEach((color) => {
            let paletteColor = document.createElement('div');
            paletteColor.classList.add('library-palette-color');
            paletteColor.style.backgroundColor = color;
            paletteColorsContainer.appendChild(paletteColor);
        });
        paletteContainer.appendChild(paletteColorsContainer);
        let paletteDeleteBtn = document.createElement('button');
        paletteDeleteBtn.classList.add('library-palette-button');
        paletteDeleteBtn.classList.add('delete');
        paletteDeleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        paletteContainer.appendChild(paletteDeleteBtn);
        // append all
        appendContainer.appendChild(paletteContainer);
        // get selectors & eventListeners
        this.getSelectors();
        this.getEvents();
    }

    /**
     * Delete the saved palette from the library 
     * (from both local storage and from library popup)
     */
    delete() {
        // get palettes from local storage
        let localPalettes = JSON.parse(window.localStorage.getItem('color-palettes'));
        if(!localPalettes) localPalettes = [];
        // splice from array
        localPalettes.forEach((localPalette, i) => {
            if (localPalette.name == this.name) {
                // remove from local storage
                localPalettes.splice(localPalettes.indexOf(localPalette), 1);
                // remove from Library.savedPalettess
                let filteredArray = this.library.savedPalettes.filter( (savedPalette, index) => {
                    return index != i;  
                });
                this.library.savedPalettes = filteredArray;
            }
        });
        // send back to local storage
        window.localStorage.setItem('color-palettes', JSON.stringify(localPalettes));
        // remove item visualy from library popup
        this.container.remove();
        // remove local storage item if library is empty
        if(this.library.savedPalettes.length == 0) {
            window.localStorage.removeItem('color-palettes');
            this.library.rebuildLibrary(this.appendContainer);
        }
    }

    load() {
        // translate colors into chroma colors
        let chromaColors = [];
        this.colors.forEach(color => chromaColors.push(chroma(color)));
        // update all color columns
        this.library.palette.updateAllColors(chromaColors);
        // close popup
        this.library.palette.libraryPopup.classList.remove('active');
    }

}