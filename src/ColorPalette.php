<?php

class ColorPalette
{
    public function __construct(int $numberOfColors)
    {
?>
        <div class="palette-container">
            <div class="palette-colors-container"></div>
            <div class="buttons-container">
                <button class="generate-btn"><i class="fas fa-sync-alt"></i>Generate</button>
                <button class="save-btn"><i class="fas fa-save"></i>Save</button>
                <button class="library-btn"><i class="fas fa-book"></i>Library</button>
            </div>
        </div>
        <?php foreach (['save', 'library'] as $popupName) : ?>
            <div class="popup <?= $popupName ?>">
                <div class="popup-overlay">
                    <div class="popup-container <?= $popupName ?>">
                        <div class="popup-close"><i class="fas fa-times"></i></div>
                        <div class="popup-header">
                            <h2 class="popup-title"><?= ucFirst($popupName) ?></h2>
                            <?php if ($popupName === 'library') : ?>
                                <div class="popup-subtitle">Click on a pattern to load it. Click on the cross icon to delete it.</div>
                            <?php endif ?>
                        </div>
                        <div class="popup-content <?= $popupName ?>">
                            <?php if ($popupName === 'save') : ?>
                                <input type="text" class="popup-name-input" placeholder="Choose a name for your palette"></input>
                                <button class="popup-save-btn">Save</button>
                            <?php endif ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach ?>
        <script>
            <?php
            require APP_DIR . 'js/Palette.js';
            require APP_DIR . 'js/Color.js';
            require APP_DIR . 'js/Library.js';
            require APP_DIR . 'js/LibraryPalette.js';
            require APP_DIR . 'js/Animation.js';
            require APP_DIR . 'lib/js/chroma.min.js'
            ?>
            new Palette(<?= $numberOfColors ?>);
        </script>
<?php
    }
}
