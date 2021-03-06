YUI.add('color-harmony', function (Y, NAME) {

/**
Color Harmony provides methods useful for color combination discovery.

@module color
@submodule color-harmony
@class Harmony
@namespace Color
@since 3.6.1
*/
var HSL = 'hsl',
    RGB = 'rgb',

    SPLIT_OFFSET = 30,
    ANALOGOUS_OFFSET = 10,
    TRIAD_OFFSET = 360/3,
    TETRAD_OFFSET = 360/6,
    SQUARE_OFFSET = 360/4 ,

    DEF_COUNT = 5,
    DEF_OFFSET = 10,

    Color = Y.Color,

    Harmony = {

        // Color Groups
        /**
        Returns an Array of two colors. The first color in the Array
          will be the color passed in. The second will be the
          complementary color of the color provided
        @public
        @method getComplementary
        @param {String} str
        @param {String} [to]
        @returns {Array}
        **/
        getComplementary: function(str, to) {
            var c = Harmony._start(str),
                c1 = c.concat();

            to = to || Color.findType(str);

            c1 = Harmony.getOffset(c1, {h: 180});

            return [
                    Harmony._finish(c, to),
                    Harmony._finish(c1, to)
                ];
        },

        /**
        Returns an Array of three colors. The first color in the Array
          will be the color passed in. The second two will be split
          complementary colors.
        @public
        @method getSplit
        @param {String} str
        @param {Number} [offset]
        @param {String} [to]
        @returns {String}
        **/
        getSplit: function(str, offset, to) {
            var c = Harmony._start(str),
                c1,
                c2;

            offset = offset || SPLIT_OFFSET;

            to = to || Color.findType(str);

            c = Harmony.getOffset(c, {h: 180});

            c1 = c.concat();
            c1 = Harmony.getOffset(c1, {h: offset});

            c2 = c.concat();
            c2 = Harmony.getOffset(c2, {h: -offset});

            // set base color back to original value
            c = Harmony.getOffset(c, {h: 180});

            return [
                Harmony._finish(c, to),
                Harmony._finish(c1, to),
                Harmony._finish(c2, to)
            ];
        },

        /**
        Returns an Array of five colors. The first color in the Array
          will be the color passed in. The remaining four will be
          analogous colors two in either direction from the initially
          provided color.
        @public
        @method getAnalogous
        @param {String} str
        @param {Number} [offset]
        @param {String} [to]
        @returns {String}
        **/
        getAnalogous: function(str, offset, to) {
            var c = Harmony._start(str),
                c1,
                c2,
                c3,
                c4;

            offset = offset || ANALOGOUS_OFFSET;
            to = to || Color.findType(str);

            c1 = c.concat();
            c1 = Harmony.getOffset(c1, {h: offset});

            c2 = c1.concat();
            c2 = Harmony.getOffset(c2, {h: offset});

            c3 = c.concat();
            c3 = Harmony.getOffset(c3, {h: -offset});

            c4 = c3.concat();
            c4 = Harmony.getOffset(c4, {h: -offset});

            return [
                Harmony._finish(c, to),
                Harmony._finish(c1, to),
                Harmony._finish(c2, to),
                Harmony._finish(c3, to),
                Harmony._finish(c4, to)
            ];
        },

        /**
        Returns an Array of three colors. The first color in the Array
          will be the color passed in. The second two will be equidistant
          from the start color and each other.
        @public
        @method getTriad
        @param {String} str
        @param {String} [to]
        @returns {String}
        **/
        getTriad: function(str, to) {
            var c = Harmony._start(str),
                c1,
                c2;

            to = to || Color.findType(str);

            c1 = c.concat();
            c1 = Harmony.getOffset(c1, {h: TRIAD_OFFSET});

            c2 = c1.concat();
            c2 = Harmony.getOffset(c2, {h: TRIAD_OFFSET});

            return [
                Harmony._finish(c, to),
                Harmony._finish(c1, to),
                Harmony._finish(c2, to)
            ];
        },

        /**
        Returns an Array of four colors. The first color in the Array
          will be the color passed in. The remaining three colors are
          equidistant offsets from the starting color and each other.
        @public
        @method getTetrad
        @param {String} str
        @param {Number} [offset]
        @param {String} [to]
        @returns {String}
        **/
        getTetrad: function(str, offset, to) {
            var c = Harmony._start(str),
                c1,
                c2,
                c3;

            offset = offset || TETRAD_OFFSET;
            to = to || Color.findType(str);

            c1 = c.concat();
            c1 = Harmony.getOffset(c1, {h: offset});

            c2 = c.concat();
            c2 = Harmony.getOffset(c2, {h: 180});

            c3 = c2.concat();
            c3 = Harmony.getOffset(c3, {h: offset});

            return [
                Harmony._finish(c, to),
                Harmony._finish(c1, to),
                Harmony._finish(c2, to),
                Harmony._finish(c3, to)
            ];
        },

        /**
        Returns an Array of four colors. The first color in the Array
          will be the color passed in. The remaining three colors are
          equidistant offsets from the starting color and each other.
        @public
        @method getSquare
        @param {String} str
        @param {String} [to]
        @returns {String}
        **/
        getSquare: function(str, to) {
            var c = Harmony._start(str),
                c1,
                c2,
                c3;

            to = to || Color.findType(str);

            c1 = c.concat();
            c1 = Harmony.getOffset(c1, {h: SQUARE_OFFSET});

            c2 = c1.concat();
            c2 = Harmony.getOffset(c2, {h: SQUARE_OFFSET});

            c3 = c2.concat();
            c3 = Harmony.getOffset(c3, {h: SQUARE_OFFSET});

            return [
                Harmony._finish(c, to),
                Harmony._finish(c1, to),
                Harmony._finish(c2, to),
                Harmony._finish(c3, to)
            ];
        },

        /**
        Calculates lightness offsets resulting in a monochromatic Array
          of values.
        @public
        @method getMonochrome
        @param {String} str
        @param {Number} [count]
        @param {String} [to]
        @returns {String}
        **/
        getMonochrome: function(str, count, to) {
            var c = Harmony._start(str),
                colors = [],
                i = 0,
                l,
                step,
                _c = c.concat();

            count = count || DEF_COUNT;
            to = to || Color.findType(str);


            if (count < 2) {
                Y.log('Invalid value: count must be greater than 1.', 'error', 'Y.Color.getMonochrome');
                return str;
            }

            step = 100 / (count - 1);

            for (; i <= 100; i += step) {
                _c[2] = Math.max(Math.min(i, 100), 0);
                colors.push(_c.concat());
            }

            l = colors.length;

            for (i=0; i<l; i++) {
                colors[i] = Harmony._finish(colors[i], to);
            }

            return colors;
        },

        /**
        Creates an Array of similar colors. Returned Array is prepended
           with the color provided followed a number of colors decided
           by count
        @public
        @method getSimilar
        @param {String} str
        @param {Number} [offset]
        @param {Number} [count]
        @param {String} [to]
        @returns {String}
        **/
        getSimilar: function(str, offset, count, to) {
            var c = Harmony._start(str),
                colors = [c],
                slOffset,
                i = 0,
                l,
                o,
                _c = c.concat();

            to = to || Color.findType(str);
            count = count || DEF_COUNT;
            offset = offset || DEF_OFFSET;
            slOffset = (offset > 100) ? 100 : offset;

            for (; i < count; i++) {
                o = {
                    h: ( Math.random() * (offset * 2)) - offset,
                    s: ( Math.random() * (slOffset * 2)),
                    l: ( Math.random() * (slOffset * 2))
                };
                _c = Harmony.getOffset(_c, o);
                colors.push(_c.concat());
            }

            l = colors.length;

            for (i=0; i<l; i++) {
                colors[i] = Harmony._finish(colors[i], to);
            }

            return colors;
        },

        /**
        Adjusts the provided color by the offset(s) given. You may
          adjust hue, saturation, and/or luminance in one step.
        @public
        @method getOffset
        @param {String} str
        @param {Object} adjust
          @param {Number} [adjust.h]
          @param {Number} [adjust.s]
          @param {Number} [adjust.l]
        @param {String} [to]
        @returns {String}
        **/
        getOffset: function(str, adjust, to) {
            var started = Y.Lang.isArray(str),
                hsla,
                type;

            if (!started) {
                hsla = Harmony._start(str);
                type = Color.findType(str);
            } else {
                hsla = str;
                type = 'hsl';
            }

            to = to || type;

            if (adjust.h) {
                hsla[0] = ((+hsla[0]) + adjust.h) % 360;
            }

            if (adjust.s) {
                hsla[1] = Math.max(Math.min((+hsla[1]) + adjust.s, 100), 0);
            }

            if (adjust.l) {
                hsla[2] = Math.max(Math.min((+hsla[2]) + adjust.l, 100), 0);
            }

            if (!started) {
                return Harmony._finish(hsla, to);
            }

            return hsla;
        },

        /**
        Returns 0 - 1 percentage of brightness from `0` (black) being the
          darkest to `1` (white) being the brightest.
        @public
        @method getBrightness
        @param {String} str
        @returns {Number}
        **/
        getBrightness: function(str) {
            var c = Color.toArray(Color._convertTo(str, RGB)),
                r = c[0],
                g = c[1],
                b = c[2],
                weights = Y.Color._brightnessWeights;


            return (Math.sqrt(
                (r * r * weights.r) +
                (g * g * weights.g) +
                (b * b * weights.b)
            ) / 255);
        },

        /**
        Returns a new color value with adjusted luminance so that the
          brightness of the return color matches the perceived brightness
          of the `match` color provided.
        @public
        @method getSimilarBrightness
        @param {String} str
        @param {String} match
        @param {String} [to]
        @returns {String}
        **/
        getSimilarBrightness: function(str, match, to){
            var c = Color.toArray(Color._convertTo(str, HSL)),
                b = Harmony.getBrightness(match);

            to = to || Color.findType(str);

            if (to === 'keyword') {
                to = 'hex';
            }

            c[2] = Harmony._searchLuminanceForBrightness(c, b, 0, 100);

            str = Color.fromArray(c, Y.Color.TYPES.HSLA);

            return Color._convertTo(str, to);
        },

        //--------------------
        // PRIVATE
        //--------------------
        /**
        Converts the provided color from additive to subtractive returning
          an Array of HSLA values
        @private
        @method _start
        @param {String} str
        @returns {Array}
        */
        _start: function(str) {
            var hsla = Color.toArray(Color._convertTo(str, HSL));
            hsla[0] = Harmony._toSubtractive(hsla[0]);

            return hsla;
        },

        /**
        Converts the provided HSLA values from subtractive to additive
          returning a converted color string
        @private
        @method _finish
        @param {Array} hsla
        @param {String} [to]
        @returns {String}
        */
        _finish: function(hsla, to) {
            hsla[0] = Harmony._toAdditive(hsla[0]);
            hsla = 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';

            if (to === 'keyword') {
                to = 'hex';
            }

            return Color._convertTo(hsla, to);
        },

        /**
        Adjusts the hue degree from subtractive to additive
        @private
        @method _toAdditive
        @param {Number} hue
        @return {Number} Converted additive hue
        */
        _toAdditive: function(hue) {
            hue = Y.Color._constrainHue(hue);

            if (hue <= 180) {
                hue /= 1.5;
            } else if (hue < 240) {
                hue = 120 + (hue - 180) * 2;
            }

            return Y.Color._constrainHue(hue, 10);
        },

        /**
        Adjusts the hue degree from additive to subtractive
        @private
        @method _toSubtractive
        @param {Number} hue
        @return {Number} Converted subtractive hue
        */
        _toSubtractive: function(hue) {
            hue = Y.Color._constrainHue(hue);

            if (hue <= 120) {
                hue *= 1.5;
            } else if (hue < 240) {
                hue = 180 + (hue - 120) / 2;
            }

            return Y.Color._constrainHue(hue, 10);
        },

        /**
        Contrain the hue to a value between 0 and 360 for calculations
            and real color wheel value space. Provide a precision value
            to round return value to a decimal place
        @private
        @method _constrainHue
        @param {Number} hue
        @param {Number} [precision]
        @returns {Number} Constrained hue value
        **/
        _constrainHue: function(hue, precision) {
            while (hue < 0) {
                hue += 360;
            }
            hue %= 360;

            if (precision) {
                hue = Math.round(hue * precision) / precision;
            }

            return hue;
        },

        /**
        Brightness weight factors for perceived brightness calculations

        "standard" values are listed as R: 0.241, G: 0.691, B: 0.068
        These values were changed based on grey scale comparison of hsl
          to new hsl where brightness is said to be within plus or minus 0.01.
        @private
        @property _brightnessWeights
        */
        _brightnessWeights: {
            r: 0.221,
            g: 0.711,
            b: 0.068
        },

        /**
        Calculates the luminance as a mid range between the min and max
          to match the brightness level provided
        @private
        @method _searchLuminanceForBrightness
        @param {Array} color HSLA values
        @param {Number} brightness Brightness to be matched
        @param {Number} min Minimum range for luminance
        @param {Number} max Maximum range for luminance
        @returns {Number} Found luminance to achieve requested brightness
        **/
        _searchLuminanceForBrightness: function(color, brightness, min, max) {
            var luminance = (max + min) / 2,
                b;

            color[2] = luminance;
            b = Harmony.getBrightness(Color.fromArray(color, Y.Color.TYPES.HSL));

            if (b + 0.01 > brightness && b - 0.01 < brightness) {
                return luminance;
            } else if (b > brightness) {
                return Harmony._searchLuminanceForBrightness(color, brightness, min, luminance);
            } else {
                return Harmony._searchLuminanceForBrightness(color, brightness, luminance, max);
            }
        }
    };

Y.Color = Y.mix(Y.Color, Harmony);


}, '@VERSION@', {"requires": ["color-hsl"]});
