function Graph(options) {
    options = (options instanceof Object) ? options : {};

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    canvas.width = options.width || 600;
    canvas.height = options.height || 600;
    // про callback
    var cb = (options.cb instanceof Object) ? options.cb : {};
    var wheel = (cb.wheel instanceof Function) ? cb.wheel : function () { };
    var mousemove = (cb.mousemove instanceof Function) ? cb.mousemove : function () { };
    var mousedown = (cb.mousedown instanceof Function) ? cb.mousedown : function () { };
    var mouseup = (cb.mouseup instanceof Function) ? cb.mouseup : function () { };

    canvas.addEventListener('wheel', wheel);
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mouseup', mouseup);
    var LOCAL = options.LOCAL;

    function yS(y) {
        return canvas.height - canvas.height * (y - LOCAL.BOTTOM) / LOCAL.HEIGHT;
    }

    function xS(x) {
        return canvas.width * (x - LOCAL.LEFT) / LOCAL.WIDTH;
    }

    this.sX = function (x) {
        return -x * LOCAL.WIDTH / canvas.width;
    }
    this.sY = function (y) {
        return y * LOCAL.HEIGHT / canvas.height;
    }

    this.clear = function () {
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    this.line = function (x1, y1, x2, y2, color, width) {
        context.strokeStyle = color || 'black';
        context.lineWidth = width || 1;
        context.moveTo(xS(x1), yS(y1));
        context.lineTo(xS(x2), yS(y2));
    };

    this.begin = function () {
        context.beginPath();
    };

    this.stroke = function () {
        context.stroke();
    };

    this.textOut = function (text, x, y) {
        context.font = '20px Georgia';
        context.fillStyle = 'black';
        context.fillText(text, xS(x), yS(y));
    }

    this.polygon = function (points, color) {
        context.fillStyle = color || 'red';
        context.beginPath();
        context.moveTo(xS(points[0].x), yS(points[0].y));
        for (let i = 1; i < points.length; i++) {
            context.lineTo(xS(points[i].x), yS(points[i].y));

        }
        context.closePath();
        context.fill();
    };

}


