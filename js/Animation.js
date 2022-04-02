class Animation {

    /**
     * Show a tooltip
     * 
     * @param {HTMLElement} parentDiv The html element to append Tooltip (must be set to "position: relative" )
     * @param {sttring} innerText Text to display in the tooltip
     * @param {null|string} top Choose either to define 'top' or 'bottom', not both. The unit must be precised | eg. '10px', '1.5rem' | Default: null
     * @param {null|string} bottom If you define a value for bottom, then you must leave 'top' value empty. The unit must be precised | eg. '10px', '1.5rem' | Default: null
     */
    tooltip(parentDiv, innerText, top = null, bottom = null) {
        let tooltip = document.createElement('div');
        tooltip.classList.add('color-tooltip');
        tooltip.innerText = innerText;
        if (top) {
            tooltip.style.top = top;
            tooltip.style.bottom = '';
        } else if (bottom) {
            tooltip.style.bottom = bottom;
        }
        parentDiv.appendChild(tooltip);
        tooltip.style.animation = "tooltip 1.5s ease-in-out";
        tooltip.addEventListener('animationend', () => {
            tooltip.style.animation = "";
            tooltip.remove();
        });
    }

    /**
     * Show a message at the bottom of the screen, with a ease-in-and-out effect
     * 
     * @param {string} messageColor 'primary', 'success', 'danger' | Default: 'primary'
     * @param {string} infoContent Content to display inside the info box
     */
    info(messageColor = 'primary', infoContent) {
        // main div
        const success = document.createElement('div');
        success.classList.add('popup-info');
        success.classList.add(messageColor);
        success.innerText = infoContent;
        document.querySelector('body').appendChild(success);
        // close btn
        const infoContainer = document.createElement('div');
        infoContainer.style.poisition = 'relative';
        const closeBtn = document.createElement('div');
        closeBtn.classList.add('info-close');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        infoContainer.appendChild(closeBtn);
        success.appendChild(infoContainer);
        // close events
        closeBtn.addEventListener('click', () => {
            this.fadeOut(success, '0.3s');
        });
        success.addEventListener('animationend', () => {
            success.remove();
        });
    }

    fadeOut(target, time) {
        target.style.animation = '';
        target.style.animation = `fade-out ${time} ease-in-out`;
        target.addEventListener('animationend', () => {
            target.remove();
        });
    }

}