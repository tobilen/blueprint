/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyCodes = {
    8: "backspace",
    9: "tab",
    13: "enter",
    20: "capslock",
    27: "esc",
    32: "space",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    45: "ins",
    46: "del",
    // number keys
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    // alphabet
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    // punctuation
    106: "*",
    107: "+",
    109: "-",
    110: ".",
    111: "/",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
};
exports.Modifiers = {
    16: "shift",
    17: "ctrl",
    18: "alt",
    91: "meta",
    93: "meta",
    224: "meta",
};
exports.ModifierBitMasks = {
    alt: 1,
    ctrl: 2,
    meta: 4,
    shift: 8,
};
exports.Aliases = {
    cmd: "meta",
    command: "meta",
    escape: "esc",
    minus: "-",
    mod: isMac() ? "meta" : "ctrl",
    option: "alt",
    plus: "+",
    return: "enter",
    win: "meta",
};
// alph sorting is unintuitive here
// tslint:disable object-literal-sort-keys
exports.ShiftKeys = {
    "~": "`",
    "!": "1",
    "@": "2",
    "#": "3",
    $: "4",
    "%": "5",
    "^": "6",
    "&": "7",
    "*": "8",
    "(": "9",
    ")": "0",
    _: "-",
    "+": "=",
    "{": "[",
    "}": "]",
    "|": "\\",
    ":": ";",
    '"': "'",
    "<": ",",
    ">": ".",
    "?": "/",
};
// tslint:enable object-literal-sort-keys
// Function keys
for (var i = 1; i <= 12; ++i) {
    exports.KeyCodes[111 + i] = "f" + i;
}
// Numpad
for (var i = 0; i <= 9; ++i) {
    exports.KeyCodes[96 + i] = "num" + i.toString();
}
function comboMatches(a, b) {
    return a.modifiers === b.modifiers && a.key === b.key;
}
exports.comboMatches = comboMatches;
/**
 * Converts a key combo string into a key combo object. Key combos include
 * zero or more modifier keys, such as `shift` or `alt`, and exactly one
 * action key, such as `A`, `enter`, or `left`.
 *
 * For action keys that require a shift, e.g. `@` or `|`, we inlude the
 * necessary `shift` modifier and automatically convert the action key to the
 * unshifted version. For example, `@` is equivalent to `shift+2`.
 */
exports.parseKeyCombo = function (combo) {
    var pieces = combo
        .replace(/\s/g, "")
        .toLowerCase()
        .split("+");
    var modifiers = 0;
    var key = null;
    for (var _i = 0, pieces_1 = pieces; _i < pieces_1.length; _i++) {
        var piece = pieces_1[_i];
        if (piece === "") {
            throw new Error("Failed to parse key combo \"" + combo + "\".\n                Valid key combos look like \"cmd + plus\", \"shift+p\", or \"!\"");
        }
        if (exports.Aliases[piece] != null) {
            piece = exports.Aliases[piece];
        }
        if (exports.ModifierBitMasks[piece] != null) {
            modifiers += exports.ModifierBitMasks[piece];
        }
        else if (exports.ShiftKeys[piece] != null) {
            // tslint:disable-next-line no-string-literal
            modifiers += exports.ModifierBitMasks["shift"];
            key = exports.ShiftKeys[piece];
        }
        else {
            key = piece.toLowerCase();
        }
    }
    return { modifiers: modifiers, key: key };
};
/**
 * PhantomJS's webkit totally messes up keyboard events, so we have do this
 * fancy little dance with the event data to determine which key was pressed
 * for unit tests.
 */
var normalizeKeyCode = function (e) {
    return e.which === 0 && e.key != null ? e.key.charCodeAt(0) : e.which;
};
/**
 * Converts a keyboard event into a valid combo prop string
 */
exports.getKeyComboString = function (e) {
    var keys = [];
    // modifiers first
    if (e.ctrlKey) {
        keys.push("ctrl");
    }
    if (e.altKey) {
        keys.push("alt");
    }
    if (e.shiftKey) {
        keys.push("shift");
    }
    if (e.metaKey) {
        keys.push("meta");
    }
    var which = normalizeKeyCode(e);
    if (exports.Modifiers[which] != null) {
        // no action key
    }
    else if (exports.KeyCodes[which] != null) {
        keys.push(exports.KeyCodes[which]);
    }
    else {
        keys.push(String.fromCharCode(which).toLowerCase());
    }
    // join keys with plusses
    return keys.join(" + ");
};
/**
 * Determines the key combo object from the given keyboard event. Again, a key
 * combo includes zero or more modifiers (represented by a bitmask) and one
 * action key, which we determine from the `e.which` property of the keyboard
 * event.
 */
exports.getKeyCombo = function (e) {
    var key = null;
    var which = normalizeKeyCode(e);
    if (exports.Modifiers[which] != null) {
        // keep key null
    }
    else if (exports.KeyCodes[which] != null) {
        key = exports.KeyCodes[which];
    }
    else {
        key = String.fromCharCode(which).toLowerCase();
    }
    var modifiers = 0;
    // tslint:disable no-string-literal
    if (e.altKey) {
        modifiers += exports.ModifierBitMasks["alt"];
    }
    if (e.ctrlKey) {
        modifiers += exports.ModifierBitMasks["ctrl"];
    }
    if (e.metaKey) {
        modifiers += exports.ModifierBitMasks["meta"];
    }
    if (e.shiftKey) {
        modifiers += exports.ModifierBitMasks["shift"];
    }
    // tslint:enable
    return { modifiers: modifiers, key: key };
};
/**
 * Splits a key combo string into its constituent key values and looks up
 * aliases, such as `return` -> `enter`.
 *
 * Unlike the parseKeyCombo method, this method does NOT convert shifted
 * action keys. So `"@"` will NOT be converted to `["shift", "2"]`).
 */
exports.normalizeKeyCombo = function (combo, platformOverride) {
    var keys = combo.replace(/\s/g, "").split("+");
    return keys.map(function (key) {
        var keyName = exports.Aliases[key] != null ? exports.Aliases[key] : key;
        return keyName === "meta" ? (isMac(platformOverride) ? "cmd" : "ctrl") : keyName;
    });
};
/* tslint:enable:no-string-literal */
function isMac(platformOverride) {
    var platform = platformOverride != null ? platformOverride : typeof navigator !== "undefined" ? navigator.platform : undefined;
    return platform == null ? false : /Mac|iPod|iPhone|iPad/.test(platform);
}

//# sourceMappingURL=hotkeyParser.js.map
