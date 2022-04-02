class Color {

    constructor(Palette, index) {
        this.colorIndex = index;
        this.Palette = Palette;
        this.color = chroma.random();
        this.tempColor;
        this.locked = false;
    }

    getSelectors() {
        this.container = document.querySelectorAll('.color-column')[this.colorIndex];
        this.title = this.container.querySelector('.color-title');
        this.actionsContainer = this.container.querySelector('.actions-container');
        this.adjustWindow = this.container.querySelector('.adjust-window');
        this.adjustBtn = this.container.querySelector('.adjust');
        this.closeBtn = this.container.querySelector('.adjust-window-close');
        this.lockBtn = this.container.querySelector('.lock');
        this.copiedTooltip = this.container.querySelector('.color-tooltip');
        this.sliderHue = this.container.querySelector('.hue');
        this.sliderBright = this.container.querySelector('.brightness');
        this.sliderSat = this.container.querySelector('.saturation');
    }

    getAdjustWindowEvents() {
        this.adjustBtn.addEventListener('click', () => {
            if(!this.locked) {
                this.adjustWindow.classList.toggle('active');
            } else {
                (new Animation).tooltip(this.container, "Locked!", null, '20px');
            }
        });
        this.closeBtn.addEventListener('click', () => {
            this.adjustWindow.classList.remove('active');
        });
    }

    getCopyEvent() {
        this.title.addEventListener('click', (e) => { 
            this.copyColor(e);
        });
    }
    
    getLockUnlockEvent() {
        let innerHTMLBefore = this.lockBtn.innerHTML;
        this.lockBtn.addEventListener('click', () => {
            let btn = this.lockBtn;
            btn.classList.toggle('active');
            if(!this.locked) { // if is not locked
                this.locked = true;
                btn.innerHTML = '<i class="fas fa-lock"></i>';
                this.closeAdjustWindow();
            } else {
                this.locked = false;
                btn.innerHTML = innerHTMLBefore;
            }
        }); 
    }

    getAdjustColorEvents() {
        // 'input' event
        this.sliderHue.addEventListener('input', e => this.adjustColorDuringSlide(e));
        this.sliderBright.addEventListener('input',e => this.adjustColorDuringSlide(e));
        this.sliderSat.addEventListener('input', e => this.adjustColorDuringSlide(e));
        // 'change' event
        this.sliderHue.addEventListener('change', e => this.adjustColorUpdate(e));
        this.sliderBright.addEventListener('change',e => this.adjustColorUpdate(e));
        this.sliderSat.addEventListener('change', e => this.adjustColorUpdate(e));
    }

    /**
     * Generate the HTML code of this Color column (to be displayed in the Palette)
     * (Create all needed nodes elements and append them to the parent container provided as a parameter)
     */
    show() {
        // create column container
        let colorContainer = document.createElement('div');
        colorContainer.classList.add('color-column');
        colorContainer.style.position = 'relative';
        // create title
        let colorTitle = document.createElement('h3');
        colorTitle.classList.add('color-title');
        // create actions container
        let actionsContainer = document.createElement('div');
        actionsContainer.classList.add('actions-container');
        // create lock btn
        let lockBtn = document.createElement('div');
        lockBtn.classList.add('color-action');
        lockBtn.classList.add('lock');
        lockBtn.innerHTML = '<i class="fas fa-lock-open"></i>';
        // create adjustments btn
        let adjustBtn = document.createElement('div');
        adjustBtn.classList.add('color-action');
        adjustBtn.classList.add('adjust');
        adjustBtn.innerHTML = '<i class="fas fa-sliders-h"></i>';
        // create adjustments window
        let adjustWindow = document.createElement('div');
        adjustWindow.classList.add('adjust-window');
            // close btn
            let adjustWindowClose = document.createElement('div');
            adjustWindowClose.classList.add('adjust-window-close');
            adjustWindowClose.innerHTML = '<i class="fas fa-times"></i>';
            // slider inputs
            ['hue', 'brightness', 'saturation'].forEach((sliderName) => {
                let sliderContainer = document.createElement('div');
                sliderContainer.classList.add('slider-container');
                let sliderTitle = document.createElement('p');
                sliderTitle.innerText = sliderName.charAt(0).toUpperCase() + sliderName.slice(1);
                let slider = document.createElement('input');
                slider.setAttribute('type', 'range');
                slider.classList.add(sliderName);
                // append all
                sliderContainer.appendChild(sliderTitle);
                sliderContainer.appendChild(slider);
                adjustWindow.appendChild(sliderContainer);
            });
        // append all
        actionsContainer.appendChild(lockBtn);
        actionsContainer.appendChild(adjustBtn);
        colorContainer.appendChild(colorTitle); 
        colorContainer.appendChild(actionsContainer);
        adjustWindow.appendChild(adjustWindowClose);
        colorContainer.appendChild(adjustWindow);
        this.Palette.paletteContainer.appendChild(colorContainer);
    }

    /**
     * Update Color column's background, title and text contrast
     * 
     * @param {*} chromaColor The color to update to, in a chroma-js format 
     */
    updateColor(chromaColor) {
        this.tempColor = null;
        this.closeAdjustWindow();
        if(!this.locked) { // if is not locked
            this.color = chromaColor;
            let color = this.getTempColor();
            this.container.style.backgroundColor = color;
            this.title.innerText = color;
            this.updateTextContrast();
            this.colorizeSliders();
        }
    }

    /**
     * @returns {object} Chroma color
     */
    getTempColor() {
        return this.tempColor ?? this.color;
    }

    /**
     * Prevent color from reseting if sat or brightness are on 0% or 100%
     */
    preventColorReset() {
        this.sliderBright.min = 1;
        this.sliderBright.max = 99;
        this.sliderSat.min = 1;
    }

    updateTextContrast() {
        if(chroma(this.getTempColor()).luminance() < 0.5) {
            this.title.style.color = 'white';
            this.actionsContainer.style.color = 'white';
        } else {
            this.title.style.color = 'black';
            this.actionsContainer.style.color = 'black';
        }
    }

    /**
     * Allow to copy the H2 hex color code of the Color column
     * @param {Event} e The 'click' event
     * @event 'click' On this.title
     */
    copyColor(e) {
        let colorToCopy = e.target.innerText;
        // copy trick for non-ssl environement
        let ghostTextarea = document.createElement('textarea');
        ghostTextarea.value = colorToCopy; 
        ghostTextarea.style.position = "absolute";
        this.container.appendChild(ghostTextarea);
        ghostTextarea.focus();
        ghostTextarea.select();
        document.execCommand('copy');
        ghostTextarea.remove();
        // show confirmation
        (new Animation).tooltip(this.container, 'Copied!', '70px');
    }

    // ADJUST WINDOW

    /**
     * Close the adjustments window, containing color sliders
     * @event 'click' On this.closeBtn
     */
    closeAdjustWindow() {
        if(this.adjustWindow.classList.contains('active')) {
            this.adjustWindow.classList.remove('active');
        }
    }

    /**
     * Update the color of the Color column's title (H2), its background and the sliders bg. 
     * And update the text + icons contrast if needed (dark or light) 
     * @event 'change' On range inputs (sliders)
     */
    adjustColorUpdate() {
        this.title.innerText = this.tempColor.hex();
        this.updateTextContrast();
        this.colorizeSliders();
    }

    /**
     * Update the color of the Color column's background 
     * And update the text + icons contrast if needed (dark or light)
     * @event 'input' On range inputs (sliders)
     */
    adjustColorDuringSlide(e) {
        let tempColor = this.getTempColor();
        let slider = e.target.classList[0];
        let hueBg = chroma(tempColor).get('hsl.h');
        let brightBg = chroma(tempColor).get('hsl.l');
        let satBg = chroma(tempColor).get('hsl.s');
        // prevent from resetting color
        // apply color to Color bg
        switch (slider) {
            case 'hue': 
                tempColor = chroma.hsl(e.target.value, satBg, brightBg);
                this.container.style.backgroundColor = tempColor;
                break;
            case 'brightness': 
                tempColor = chroma.hsl(hueBg, satBg, e.target.value/100);
                this.container.style.backgroundColor = tempColor;
                break;
            case 'saturation': 
                tempColor = chroma.hsl(hueBg, e.target.value/100, brightBg);
                this.container.style.backgroundColor = tempColor;
                break;
            default: 
                break;
        }
        this.tempColor = tempColor;
        this.color = tempColor;
    }

    /**
     * Update the color of the color sliders backgrounds
     * @event 'change' On range inputs (sliders)
     */
    colorizeSliders() {
        // hue
        let color = this.getTempColor();
        let currentHue = Math.floor(color.hsl()[0]);
        let hGrad = chroma.scale(['red', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'red']);
        this.sliderHue.style.background = `linear-gradient(to right, ${hGrad(0)}, ${hGrad(0.167)}, ${hGrad(0.333)}, ${hGrad(0.5)}, ${hGrad(0.667)}, ${hGrad(0.8333333)}, ${hGrad(1)})`;
        this.sliderHue.style.backgroundColor = color.hex();
        this.sliderHue.setAttribute('max', 360);
        this.sliderHue.setAttribute('value', currentHue);
        // brightness
        let currentBright = Math.floor(color.hsl()[2]*100);
        let bMin = 'black';
        let bMid = color.set('hsl.l', currentBright/100);
        let bMax = 'white';
        let bGrad = chroma.scale([bMin, bMid, bMax]);
        this.sliderBright.style.background = `linear-gradient(to right, ${bGrad(0)}, ${bGrad(0.5)}, ${bGrad(1)})`;
        this.sliderBright.setAttribute('value', currentBright);
        // stauration
        let currentSat = Math.floor(color.hsl()[1]*100);
        let sMin = color.set('hsl.s', 0);
        let sMid = color.set('hsl.s', currentSat/100);
        let sMax = color.set('hsl.s', 1);
        let sGrad = chroma.scale([sMin, sMid, sMax]);
        this.sliderSat.style.background = `linear-gradient(to right, ${sGrad(0)}, ${sGrad(1)})`;
        this.sliderSat.setAttribute('value', currentSat);
    }

}