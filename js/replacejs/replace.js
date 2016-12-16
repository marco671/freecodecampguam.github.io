'use strict';

var ReplaceJs = function (config)
{
    this.duration = 2500;
    this.interval = 68;
    this.timeout = 1000;

    if (typeof config.element === 'undefined' || config.element === null)
    {
        console.warn('Please define a element that should be replaced.');
        return;
    }

    if (typeof config.words === 'undefined' || config.words === null)
    {
        console.warn('Please provide a list of words to replace.')
        return;
    }

    this.element = config.element;
    this.words = config.words;
    this.next = null;
    this.current = null;

    this.init();
};

ReplaceJs.prototype.init = function ()
{
    var counter = 0;
    var self = this;
    this.current = this.words[counter];

    setInterval(function ()
    {
        counter++;
        if (counter >= self.words.length)
        {
            counter = 0;
        }

        self.next = self.words[counter];

        self.element.innerText = self.current;
        setTimeout(function ()
        {
            self.replace();
        }, this.timeout);

        self.current = self.next;

    }, this.duration);

    return this;
};

ReplaceJs.prototype.replace = function ()
{
    if (typeof this.current === 'undefined' || typeof replacement !== 'undefined')
    {
        return;
    }

    var self = this;
    var count = 0;

    var replacement = setInterval(function ()
    {
        self.element.innerText = self.element.innerText.substring(0, self.element.innerText.length - count);

        if (count >= self.element.innerText.length)
        {
            clearInterval(replacement);
            self.element.innerText = '';

            self.write();
        }

        count++;
    }, this.interval);
};

ReplaceJs.prototype.write = function ()
{
    var self = this;
    var count = 0;

    var write = setInterval(function ()
    {
        if (count >= self.next.length)
        {
            clearInterval(write);
        }

        self.element.innerText = self.next.substring(0, count);

        count++;
    }, this.interval);
};

!function ()
{

    if (typeof exports !== 'undefined' && typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    {
        module.exports = ReplaceJs;
    }

    if (typeof window !== 'undefined')
    {
        window.replaceJs = function (config)
        {
            return new ReplaceJs(config);
        };
    }

}();
