function Input(options) {
    options = (options instanceof Object) ? options : {};
    var cb = (options.cb instanceof Object) ? options.cb : {};


    var setFunction = (cb.setFunction instanceof Function) ? cb.setFunction : function () { };
    var setColor = (cb.setColor instanceof Function) ? cb.setColor : function () { };
    var setWidth = (cb.setWidth instanceof Function) ? cb.setWidth : function () { };

    var input = document.getElementById('f');
    var inputColor = document.getElementById('color');
    var inputWidth = document.getElementById('width');

    input.addEventListener('keyup', function () {
        try {
            var F;
            eval(`F = function(x) {return  ${this.value}}`);
            setFunction(F);
        } catch (e) { }
    });

    inputColor.addEventListener('keyup', function () {
        setColor(this.value);
    });

    inputWidth.addEventListener('keyup', function () {
        setWidth(this.value);
    });
}
