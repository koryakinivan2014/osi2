



window.onload = function () {
    var a, b;
    setInterval(function () {
        a = document.getElementById("inputA").value - 0;
        b = document.getElementById("inputB").value - 0;
        console.log(a, b)
        render();
    }, 10)
    var canMove;

    var LOCAL = {
        BOTTOM: -10,
        LEFT: -10,
        WIDTH: 20,
        HEIGHT: 20
    };

    var graph = new Graph({
        LOCAL,
        width: 600,
        height: 600,
        cb: { wheel, mousemove, mousedown, mouseup }
    });

    var input = new Input({ cb: { setFunction, setColor, setWidth } });

    var func = [
        {
            F: function (x) {
                return x * x
            }

        }

    ];

    function setFunction(F) {
        if (func[0]) {
            func[0].F = F;

            console.log(calcIntegral(func[0].F, a, b))
        } else {
            func[0] = { F };
        }
        render();
    }

    function setColor(color) {
        if (func[0]) {
            func[0].color = color;
        } else {
            func[0] = { F: function () { return 0; }, color }
        }
        render();
    }

    function setWidth(width) {
        if (func[0]) {
            func[0].width = width;
        } else {
            func[0] = { F: function () { return 0; }, width }
        }
        render();
    }

    function wheel(event) {
        var D = 0.5;
        var d = 0.25;
        if (event.deltaY < 0) {
            if (LOCAL.WIDTH - D > 0 && LOCAL.HEIGHT - D > 0) {
                LOCAL.LEFT += d;
                LOCAL.BOTTOM += d;
                LOCAL.WIDTH -= D;
                LOCAL.HEIGHT -= D;
            }
        } else {
            LOCAL.LEFT -= d;
            LOCAL.BOTTOM -= d;
            LOCAL.WIDTH += D;
            LOCAL.HEIGHT += D;
        }
        render();
    }

    function mousemove(event) {
        if (canMove) {
            LOCAL.LEFT += graph.sX(event.movementX);
            LOCAL.BOTTOM += graph.sY(event.movementY);
            render();
        }
    }

    function mousedown() {
        canMove = true;
    }

    function mouseup() {
        canMove = false;
    }

    function printOXY() {
        //нарисовать координатную сетку
        graph.begin();
        //вертикальная правая
        for (i = 1; i < LOCAL.WIDTH + LOCAL.LEFT; i++) {
            graph.line(i, LOCAL.BOTTOM, i, LOCAL.HEIGHT + LOCAL.BOTTOM, '#AAA');
            graph.stroke();
        }
        //вертикальная левая
        for (i = -1; i > LOCAL.LEFT; i--) {
            graph.line(i, LOCAL.BOTTOM, i, LOCAL.BOTTOM + LOCAL.HEIGHT, '#AAA');
            graph.stroke();
        }

        // горизонтальная верх
        for (i = 1; i < LOCAL.WIDTH + LOCAL.BOTTOM; i++) {
            graph.line(LOCAL.LEFT + LOCAL.WIDTH, i, LOCAL.LEFT, i, '#AAA');
            graph.stroke();
        }

        //горизонтальная низ
        for (i = -1; i > LOCAL.BOTTOM; i--) {
            graph.line(LOCAL.LEFT + LOCAL.WIDTH, i, LOCAL.LEFT, i, '#AAA');
            graph.stroke();
        }


        //правая риска
        graph.begin();
        for (var i = 1; i < LOCAL.WIDTH + LOCAL.LEFT; i++) {
            graph.line(i, 0.1, i, -0.1);
            graph.stroke();
        }
        //вверх риска
        for (var i = 1; i < LOCAL.BOTTOM + LOCAL.WIDTH; i++) {
            graph.line(0.1, i, -0.1, i);
            graph.stroke();
        }
        //левая риска
        for (var i = -1; i > LOCAL.LEFT; i--) {
            graph.line(i, 0.1, i, -0.1);
            graph.stroke();
        }
        //нижняя риска
        for (var i = -1; i > LOCAL.BOTTOM; i--) {
            graph.line(0.1, i, -0.1, i);
            graph.stroke();
        }


        //стрелочки
        graph.begin();
        graph.line(LOCAL.WIDTH + LOCAL.LEFT, 0, LOCAL.WIDTH + LOCAL.LEFT - 0.5, 0.5);
        graph.line(LOCAL.WIDTH + LOCAL.LEFT, 0, LOCAL.WIDTH + LOCAL.LEFT - 0.5, -0.5);
        graph.textOut('X', LOCAL.WIDTH + LOCAL.LEFT - LOCAL.WIDTH / 20, 0);
        //верхняя стрелка
        graph.line(0, LOCAL.HEIGHT + LOCAL.BOTTOM, 0.5, LOCAL.HEIGHT + LOCAL.BOTTOM - 0.5);
        graph.line(0, LOCAL.HEIGHT + LOCAL.BOTTOM, -0.5, LOCAL.HEIGHT + LOCAL.BOTTOM - 0.5);
        graph.textOut('Y', 0, LOCAL.HEIGHT + LOCAL.BOTTOM - LOCAL.HEIGHT / 20);
        graph.stroke();



    }

    function printGraphic(F, color, width) {
        var x0 = LOCAL.LEFT;
        var dx = LOCAL.WIDTH / 1000;
        graph.begin();
        while (x0 < LOCAL.WIDTH + LOCAL.LEFT) {
            graph.line(x0, F(x0), x0 + dx, F(x0 + dx), color, width);
            x0 += dx;
        }
        //нарисовать оси X Y
        graph.line(LOCAL.LEFT, 0, LOCAL.WIDTH + LOCAL.LEFT, 0);
        graph.line(0, LOCAL.BOTTOM, 0, LOCAL.HEIGHT + LOCAL.BOTTOM);
        graph.textOut('0', -0.5, -0.5);
        graph.textOut('1', 1, 0.3);
        graph.textOut('1', 0.3, 1);
        graph.stroke();
    }

    function textOut() {
        var input = document.getElementById('f');
        graph.textOut(` f(x) =${input.value}`, 3, 2);
        graph.stroke();
    }

    function render() {
        //очистить экран 
        graph.clear();
        //нарисовать оси 
        printOXY();
        //нарисовать график функции 
        for (var i = 0; i < func.length; i++) {
            printIntegral(func[i].F, a, b);
            printGraphic(func[i].F, func[i].color, func[i].width);
            textOut();
        }

    }
    function calcIntegral(F, a, b) {
        let S = 0;
        var x = a;
        var dx = (b - a) / 1000;
        while (x < b) {
            // s = (a+b)/2*h 
            //h + dx 
            //a = F(x) 
            //b = F(x +dx) 
            S += (F(x) + F(x + dx)) / 2 * dx;
            x += dx;
        }
        return S;
    }
    function printIntegral(F, a, b) {
        const points = [{ x: a, y: 0 }];
        var x = a;
        var dx = (b - a) / 1000;
        while (x <= b) {
            points.push({ x, y: F(x) });
            x += dx;

        }
        points.push({ x: b, y: 0 });
        graph.polygon(points, 'yellow');

    }

    render();
}
