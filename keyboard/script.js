let Keyboard = function (clientOptions) {
    if (clientOptions && typeof clientOptions !== 'object') {
        console.error('Keybaord accept an object of supprted keybaord options.');
    }

    var keys = {
            'en': [
                ["`", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "x8"],
                ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
                ["x20", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "x13"],
                ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
                ["xlang", "x32"]
            ],
            'blr': [
                ["ё", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "x8"],
                ["й", "ц", "у", "к", "е", "н", "г", "ш", "ў", "з", "х", "'", "\\"],
                ["x20", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "x13"],
                ["я", "ч", "с", "м", "і", "т", "ь", "б", "ю", "."],
                ["xlang", "x32"]
            ]
        },
        supportedLanguages = Object.keys(keys), 
        rtlLanguages = [''],
        options = {
            lang: 'en',
            charsOnly: false,
            caps: false
        },
        elements = {
            container: null,
            keysContainer: null,
            keyboardInput: null,
            clientInput: null,
        },

        
        BACKSPACE = 'x8',
        CAPS_LOCK = 'x20',
        RETURN = 'x13',
        SPACE = 'x32',
        LANG = 'xlang',
        DONE = 'xdone';

    if (clientOptions.lang && supportedLanguages.indexOf(clientOptions.lang) === -1) {
        console.error(lang + ' language is not supported!');
    }
    
    Object.assign(options, clientOptions);

    var Keyboard = (function (selector) {

        if (!(this instanceof Keyboard)) {
            return new Keyboard(selector);
        }

        this.length = 0;

        if (typeof selector === 'string') {
            var self = this;
            var eles = document.querySelectorAll(selector);
            this.length = eles.length;
            eles.forEach(function (ele, i) {
                self[i] = ele;
            });
        }

        if (selector instanceof Node || selector === window) {
            this[0] = selector;
        }

        if (selector.constructor && selector.constructor.name === 'Array') {
            var arr = selector,
                i = arr.length - 1;
            while (i >= 0) {
                this[i] = arr[i];
                this.length++;
                i--;
            }
        }

        Keyboard.prototype.length = 0;

        Keyboard.prototype.addClass = function (classes) {
            var self = this;
            classes.split(' ').forEach(function (cls) {
                self[0].classList.add(cls);
            });
            return this;
        };

        Keyboard.prototype.removeClass = function (classes) {
            var self = this;
            classes.split(' ').forEach(function (cls) {
                self[0].classList.remove(cls);
            });
            return this;
        };

        Keyboard.prototype.toggle = function (cls) {
            return this[0].classList.toggle(cls);
        };

        Keyboard.prototype.contains = function (cls) {
            return this[0].classList.contains(cls);
        };

        Keyboard.prototype.appendTo = function (appendTo) {
            document.querySelector(appendTo).appendChild(this[0]);
            return this;
        };

        Keyboard.prototype.get = function (index) {
            return this[0];
        };

        Keyboard.prototype.setAttribute = function (name, val) {
            this[0].setAttribute(name, val);
            return this;
        };

        Keyboard.prototype.text = function (text) {
            this[0].textContent = text;
            return this;
        };

        Keyboard.prototype.on = function (event, handler) {
            this[0].addEventListener(event, handler);
            return this;
        };

        Keyboard.prototype.splice = Array.prototype.splice;
        Keyboard.prototype.each = Array.prototype.forEach;
    });

    Keyboard.create = function (tag) {
        var ele = document.createElement(tag);
        return Keyboard(ele);
    };

    function renderUI(renderOptions) {
        var charsOnly = renderOptions.charsOnly,
            capsLock = renderOptions.caps,
            container = elements.container = Keyboard
            .create('div')
            .addClass('keyboard keyboard--hidden')
            .appendTo('body')
            .get(0),
            keysContainer = elements.keysContainer = Keyboard
            .create('div')
            .addClass('keyboard__keys')
            .appendTo('.keyboard')
            .get(0),
            input = elements.keyboardInput = Keyboard
            .create('input')
            .addClass('keyboard__input')
            .get(0);

            input.autofocus = true;
            input.placeholder = 'Write here...';

        keysContainer.insertBefore(input, keysContainer.firstElementChild);
        Keyboard.create('br').appendTo('.keyboard__keys');

        operateOnKeys(options.lang, function (key) {

            if (isSpecialKey(key)) { 
                switch (key) {
                    case BACKSPACE:
                        var btn = Keyboard.create('button')
                            .addClass('keyboard__key keyboard__key--wide')
                            .setAttribute('type', 'button')
                            .get(0),
                            icon = Keyboard.create('i')
                            .addClass('icon material-icons')
                            .text('backspace')
                            .get(0);

                        btn.appendChild(icon);
                        keysContainer.appendChild(btn);

                        Keyboard(btn).on('click', function () {
                            elements.keyboardInput.value = elements.keyboardInput.value.slice(0, -1);
                            elements.clientInput.value = elements.clientInput.value.slice(0, -1);
                        });

                        break;
                    case CAPS_LOCK:
                        var btn = Keyboard.create('button')
                            .addClass('keyboard__key keyboard__key--wide keyboard__key--activatable')
                            .setAttribute('type', 'button')
                            .get(0),
                            icon = Keyboard.create('i')
                            .addClass('icon material-icons')
                            .text('keyboard_capslock')
                            .get(0);

                        btn.appendChild(icon);
                        keysContainer.appendChild(btn);

                        if (capsLock) {
                            Keyboard(btn).addClass('keyboard__key--active');
                            toggleCapsLock();
                        }

                        Keyboard(btn).on('click', function () {
                            options.caps = !options.caps;
                            this.classList.toggle('keyboard__key--active');
                            toggleCapsLock();
                        });

                        break;
                    case RETURN:
                        var btn = Keyboard.create('button')
                            .addClass('keyboard__key keyboard__key--wide')
                            .setAttribute('type', 'button')
                            .get(0),
                            icon = Keyboard.create('i')
                            .addClass('icon material-icons')
                            .text('keyboard_return')
                            .get(0);

                        btn.appendChild(icon);
                        keysContainer.appendChild(btn);
                        break;
                    case DONE:
                        var btn = Keyboard.create('button')
                            .addClass('keyboard__key keyboard__key--wide keyboard__key--dark')
                            .setAttribute('type', 'button')
                            .get(0),
                            icon = Keyboard.create('i')
                            .addClass('icon material-icons')
                            .text('check_circle')
                            .get(0);

                        btn.appendChild(icon);
                        keysContainer.appendChild(btn);

                        Keyboard(btn).on('click', done);
                        break;
                    case LANG:
                        var btn = Keyboard.create('button')
                            .addClass('keyboard__key keyboard__key--wide keyboard__key--dark keyboard__langauge__dropdown')
                            .setAttribute('type', 'button')
                            .get(0),
                            icon = Keyboard.create('i')
                            .addClass('icon material-icons')
                            .text('language')
                            .get(0);

                        btn.appendChild(icon);
                        keysContainer.appendChild(btn);

                        var list = Keyboard.create('ul')
                            .addClass('languages__list')
                            .get(0);

                        var items = [];
                        for (var i = 0; i < supportedLanguages.length; i++) {
                            var lang = supportedLanguages[i];
                            var li = Keyboard.create('li')
                                .addClass('language__item')
                                .setAttribute('data-lang', lang)
                                .text(lang)
                                .get(0);
                            list.appendChild(li);
                            items.push(li);
                        }

                        btn.appendChild(list);

                       
                        Keyboard(btn).on('click', function () {
                            Keyboard(list).toggle('show');
                        });

                        
                        Keyboard(items).each(function (item) {
                            Keyboard(item).on('click', function (e) {
                                e.stopPropagation();
                                changeLangauge(this.dataset.lang);
                                Keyboard(list).removeClass('show');
                            });
                        });
                        break;
                    case SPACE:
                        var btn = Keyboard.create('button')
                            .addClass('keyboard__key keyboard__key--extra-wide')
                            .setAttribute('type', 'button')
                            .get(0),
                            icon = Keyboard.create('i')
                            .addClass('icon material-icons')
                            .text('space_bar')
                            .get(0);

                        btn.appendChild(icon);
                        keysContainer.appendChild(btn);

                        Keyboard(btn).on('click', function () {
                            elements.keyboardInput.value += ' ';
                            elements.clientInput.value += ' ';
                        });
                        break;
                }
            } else {
                if (charsOnly === true && typeof key === 'number') {
                    return;
                }

                var btn = Keyboard.create('button')
                    .addClass('keyboard__key')
                    .setAttribute('type', 'button')
                    .text(key)
                    .get(0);

                keysContainer.appendChild(btn);

                Keyboard(btn).on('click', function () {
                    Keyboard(elements.keyboardInput)
                        .setAttribute('dir', rtlLanguages.indexOf(options.lang) !== -1 ? 'rtl' : 'ltr');
                    elements.keyboardInput.value += btn.textContent;
                    elements.clientInput.value += btn.textContent;
                });
            }

            var isBreakLine = arguments[arguments.length - 1];
            if (isBreakLine) {
                keysContainer.appendChild(document.createElement('br'));
            }
        });
    }

    function initKeyboardInput(properties) {
        elements.keyboardInput.placeholder = properties.placeholder;
        elements.keyboardInput.value = properties.value;
    }

    function operateOnKeys(lang, clb) {
        Keyboard(keys[lang]).each(function (rowKeys, rowIndex) {
            Keyboard(rowKeys).each(function (key, keyIndex) {
                var isBreakLine = keyIndex === rowKeys.length - 1;
                clb.apply(this, [key, rowIndex, keyIndex, isBreakLine]);
            });
        });
    }

    function toggleCapsLock() {
        Keyboard('button.keyboard__key').each(function (key) {
            if (key.childElementCount === 0) {
                if (options.caps === true) {
                    key.textContent = key.textContent.toUpperCase();
                } else {
                    key.textContent = key.textContent.toLowerCase();
                }
            }
        });
    }

    function done() {
        elements.clientInput.value = elements.keyboardInput.value;
        Keyboard(elements.container).addClass('keyboard--hidden');
    }

    function changeLangauge(lang) {
        if (supportedLanguages.indexOf(lang) === -1) return;

        var k = Keyboard('.keyboard__key:not(.keyboard__key--wide):not(.keyboard__key--extra-wide)'),
            i = 0;

        operateOnKeys(lang, function (key) {
            if (!isSpecialKey(key) && k[i]) {
                Keyboard(k[i]).text(key + "");
                i++;
            }
        });

        options.lang = lang;
    }

    function isSpecialKey(key) {
        return typeof key !== 'number' && key.match(/x\w+/) !== null;
    }

    function initEvents() {
        Keyboard('input:not(.keyboard__input), textarea').each(function (input) {
            Keyboard(input).on('focus', function (e) {
                var input = e.target;
                
                if (input.readOnly) return;
                
                Keyboard(elements.container).removeClass('keyboard--hidden');
                elements.clientInput = input;
                initKeyboardInput({
                    placeholder: input.placeholder,
                    value: input.value
                });
                Keyboard(input).on('input', function () {
                    elements.keyboardInput.value = this.value;
                });
            });
        });

        Keyboard(window).on('click', function (e) {
            if (!Keyboard(elements.container).contains('keyboard--hidden')) {
                if (e.target !== elements.keyboardInput &&
                    ['input', 'textarea'].indexOf(e.target.tagName.toLowerCase()) === -1 &&
                    e.target.closest('.keyboard') !== elements.container) {
                    Keyboard(elements.container).addClass('keyboard--hidden');
                    Keyboard('.languages__list').removeClass('show');
                    done();
                }
            }
        });

        Keyboard(elements.keyboardInput).on('input', function () {
            elements.clientInput.value = this.value;
        });
    }

    return {
        init: function () {
            
            renderUI({
                charsOnly: options.charsOnly,
                caps: options.caps
            });
            
            if (options.caps) {
                toggleCapsLock();
            }
            
            initEvents();
        }
    };
};

Keyboard({
  lang: 'en',
  charsOnly: false,
  caps: false
}).init();


