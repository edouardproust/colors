class Library {

    /**
     * Constructor
     * @param {Palette} palette Palette to which this Library is attached
     */
    constructor(palette)
    {
        this.palette = palette;
        this.savedPalettes = [];
        this.savedPalettesHTML = [];
        this.getPalettesFromLocalStorage();
    }

    /**
     * Get palettes previously saved in local storage 
     * (or set property as empty array if local storage is empty)
     */
    getPalettesFromLocalStorage() {
        let stdObjects = JSON.parse(window.localStorage.getItem('color-palettes'));
        if(stdObjects) {
            this.savedPalettes = [];
            stdObjects.forEach(stdObject => {
                let newLibPal = new LibraryPalette(stdObject.name, stdObject.colors, this);
                this.savedPalettes.push(newLibPal);
            });
        }
        if (!this.savedPalettes) {
            this.savedPalettes = [];
        }
    }
    
    /**
     * Rebuild library only if a new save has been done
     * @param {HTMLElement} appendContainer 
     */
    rebuildLibrary(appendContainer) {
        appendContainer.innerHTML = '';
        let noItems;
        if(this.savedPalettes.length == 0) {
            noItems = document.createElement('div');
            noItems.classList.add('library-no-items');
            noItems.innerHTML = "No palettes saved yet.<br>Use the \"Save\" button to add a palette to your library.";
            appendContainer.appendChild(noItems);
        } else {
            this.savedPalettes.forEach( libraryPalette => libraryPalette.show(appendContainer) );
        }
    }    
    
    /**
     * Add a palette to the library and save it to browser's local storage
     * @param {LibraryPalette} paletteToSave 
     */
    savePalette(paletteName) {
        // get hex colors {
        let hexColors = [];
        this.palette.colors.forEach(color => {
            hexColors.push(chroma(color.color).hex());
        });
        // push to library
        this.getPalettesFromLocalStorage();
        let libraryPalette = new LibraryPalette(paletteName, hexColors, this);
        this.savedPalettes.push(libraryPalette);
        // Push to local storage
        window.localStorage.setItem('color-palettes', JSON.stringify(this.savedPalettes, ['name', 'colors']));
    }
    
}