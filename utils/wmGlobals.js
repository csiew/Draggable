class wmGlobals {
    constructor() {
        this.colors = new Object();
        this.sizes = new Object();
        this.values = new Object();

        // Colors
        this.colors['DARK_BORDER'] = wmElements.getStylePropValue('--BORDER-DARK');
        this.colors['LIGHT_BORDER'] = wmElements.getStylePropValue('--BORDER-LIGHT');
        this.colors['WINDOW_HEADER_BG_COLOR_FOCUSED'] = wmElements.getStylePropValue('--HEADER-BG-COLOR-FOCUSED');
        this.colors['WINDOW_HEADER_BG_COLOR_UNFOCUSED'] = wmElements.getStylePropValue('--HEADER-BG-COLOR-UNFOCUSED');

        // Sizes
        this.sizes['BODY_FONT_SIZE'] = wmElements.getStylePropValue('--BODY-FONT-SIZE');
        this.sizes['DEFAULT_WIDTH'] = wmElements.getStylePropValue('--WINDOW-MIN-WIDTH');
        this.sizes['DEFAULT_HEIGHT'] = wmElements.getStylePropValue('--WINDOW-MIN-HEIGHT');

        // Values
        this.values['LEVEL_FOCUSED'] = 100;
        this.values['LEVEL_UNFOCUSED'] = 5;
    }

    DARK_BORDER() { return this.colors['DARK_BORDER'] };
    LIGHT_BORDER() { return this.colors['LIGHT_BORDER'] };
    WINDOW_HEADER_BG_COLOR_FOCUSED() { return this.colors['WINDOW_HEADER_BG_COLOR_FOCUSED'] };
    WINDOW_HEADER_BG_COLOR_UNFOCUSED() { return this.colors['WINDOW_HEADER_BG_COLOR_UNFOCUSED'] };

    BODY_FONT_SIZE() { return this.sizes['BODY_FONT_SIZE'] };
    DEFAULT_WIDTH() { return this.sizes['DEFAULT_WIDTH'] };
    DEFAULT_HEIGHT() { return this.sizes['DEFAULT_HEIGHT'] };

    LEVEL_FOCUSED() { return this.values['LEVEL_FOCUSED'] };
    LEVEL_UNFOCUSED() { return this.values['LEVEL_UNFOCUSED'] };
}