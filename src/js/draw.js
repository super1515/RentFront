function getOffset(o) {
    let x = 0,
        y = 0;
    while(o){
        x += o.offsetLeft;
        y += o.offsetTop;
        o = o.offsetParent;
    }
    return [x, y];
}

function getScrollTop() {
    return Math.max(
        document.documentElement.scrollTop,
        document.body.scrollTop,
        0
    );
}

function getScrollLeft() {
    return Math.max(
        document.documentElement.scrollLeft,
        document.body.scrollLeft,
        0
    );
}

function MapAreaDraw() {
    this.styles = {
        point : {
            width: 4,
            fill: 'rgba(0,139,191,1)'
        },
        line : {
            width: 1,
            fill: 'rgba(0, 34, 255, 1)',
            stroke: 'rgba(0,172,239,1)'
        }
    };

    this.nodes = {};
    this.points = [];
    this.areas = [];

    this.addPointBoundHandler = this.addPointHandler.bind(this);
}

MapAreaDraw.prototype.render = function (nodes) {
    this.nodes = nodes;

    this.getCanvas();
    this.renderClearAllButton();
    this.renderAddButtons();
};

MapAreaDraw.prototype.renderClearAllButton = function () {
    this.nodes.clearAllButton = document.createElement('input');
    this.nodes.clearAllButton.type = 'button';
    this.nodes.clearAllButton.className = 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800';
    this.nodes.clearAllButton.value = 'Очистить всё';
    this.nodes.clearAllButton.addEventListener('click', this.clearAllHandler.bind(this));
    this.nodes.buttons.appendChild(this.nodes.clearAllButton);
};

MapAreaDraw.prototype.clearAllHandler = function () {
    console.log(this.areas)
    this.points = [];
    this.areas = [];
    this.clear();
    this.clearCanvas();
};

MapAreaDraw.prototype.clear = function () {
    this.nodes.container.classList.remove('draw');
    this.nodes.inner.removeEventListener('mousedown', this.addPointBoundHandler);
    this.clearInfo();
    this.removeAddButtons();
    this.removeSaveButton();
    this.renderAddButtons();
};

MapAreaDraw.prototype.renderAddButtons = function () {
    this.nodes.addPolyButton = document.createElement('input');
    this.nodes.addPolyButton.type = 'button';
    this.nodes.addPolyButton.className = 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800';
    this.nodes.addPolyButton.value = 'Добавить полигон';
    this.nodes.addPolyButton.addEventListener('click', this.addPolyHandler.bind(this));
    this.nodes.buttons.appendChild(this.nodes.addPolyButton);
    //this.nodes.addRectButton = document.createElement('input');
    //this.nodes.addRectButton.type = 'button';
    //this.nodes.addRectButton.value = 'Add Rect Area';
    //this.nodes.addRectButton.addEventListener('click', this.addRectHandler.bind(this));
    //this.nodes.buttons.appendChild(this.nodes.addRectButton);
};

MapAreaDraw.prototype.removeAddButtons = function () {
    this.nodes.addPolyButton.remove();
    //this.nodes.addRectButton.remove();
};

MapAreaDraw.prototype.addPolyHandler = function () {
    this._areaType = 'poly';
    this.nodes.container.classList.add('draw');
    this.nodes.inner.addEventListener('mousedown', this.addPointBoundHandler);
    this.removeAddButtons();
    this.renderSaveButton();
};

MapAreaDraw.prototype.addRectHandler = function () {
    this._areaType = 'rect';
    this.nodes.container.classList.add('draw');
    this.nodes.inner.addEventListener('mousedown', this.addPointBoundHandler);
    this.removeAddButtons();
    this.renderSaveButton();
};

MapAreaDraw.prototype.renderSaveButton = function () {
    this.nodes.saveButton = document.createElement('input');
    this.nodes.saveButton.type = 'button';
    this.nodes.saveButton.className = 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800';
    this.nodes.saveButton.value = 'Сохранить';
    this.nodes.saveButton.addEventListener('click', this.saveHandler.bind(this));
    this.nodes.buttons.appendChild(this.nodes.saveButton);
};

MapAreaDraw.prototype.removeSaveButton = function () {
    this.nodes.saveButton.remove();
};

MapAreaDraw.prototype.saveHandler = function () {
    let _points;
    if (this._areaType === 'rect' && this.points.length === 2) {
        let _normalize = this.normalizeRectPoints(this.points);
        _points = [
            {x: _normalize.x1, y: _normalize.y1},
            {x: _normalize.x2, y: _normalize.y2}
        ];
    } else {
        _points = [].slice.call(this.points);
    }

    this.areas.push({
        'type' : this._areaType,
        'points' : _points
    });
    this.points = [];
    this.clear();
    this.renderInfo();
};

MapAreaDraw.prototype.addPointHandler = function (event) {
    event.preventDefault();

    if (
        (this._areaType === 'rect' || this._areaType === 'circle') &&
        this.points.length === 2
    ) {
        return ;
    }

    let offset = getOffset(this.nodes.inner),
        x = event.clientX + getScrollLeft() - offset[0],
        y = event.clientY + getScrollTop() - offset[1];
    this.points.push({x: x, y: y});

    this.draw();
};
function convertStringToPoints(inputString) {
    // Удаление лишних пробелов и разделение строки на числа
    const numbers = inputString.replace(/\s+/g, '').split(',').map(Number);

    // Проверка на четное количество чисел
    if (numbers.length % 2 !== 0) {
        throw new Error("Нечетное количество чисел в строке");
    }

    // Создание массива объектов
    const _points = [];
    for (let i = 0; i < numbers.length; i += 2) {
        _points.push({x: numbers[i], y: numbers[i + 1]});
    }

    return _points;
}
MapAreaDraw.prototype.draw = function () {
    const that = this;
    this.clearCanvas();
    this.areas.forEach(function (area) {
        that.drawPoints(area.points, area.type)
    });
    this.drawPoints(this.points, this._areaType);
};

MapAreaDraw.prototype.drawPoints = function (points, type) {
    const that = this;

    // Normalize points
    let _points;
    if (type === 'rect' && points.length === 2) {
        let _normalize = this.normalizeRectPoints(points);
        _points = [
            {x: _normalize.x1, y: _normalize.y1},
            {x: _normalize.x2, y: _normalize.y1},
            {x: _normalize.x2, y: _normalize.y2},
            {x: _normalize.x1, y: _normalize.y2}
        ];
    } else {
        _points = points;
    }

    // Draw lines
    this.context.fillStyle = this.styles.line.fill;
    this.context.lineWidth = this.styles.line.width;
    this.context.strokeStyle = this.styles.line.stroke;
    this.context.beginPath();
    _points.forEach(function (point, i) {
        if (i === 0) {
            that.context.moveTo(point.x, point.y);
        } else {
            that.context.lineTo(point.x, point.y);
        }
    });
    this.context.closePath();
    this.context.fill();
    this.context.stroke();

    // Draw points
    this.context.fillStyle = this.styles.point.fill;
    _points.forEach(function (point) {
        that.context.fillRect(
            point.x - (that.styles.point.width / 2),
            point.y - (that.styles.point.width / 2),
            that.styles.point.width,
            that.styles.point.width
        );
    });
};

MapAreaDraw.prototype.renderInfo = function () {
    const that = this;
    let node, results;

    node = document.createElement('div');
    node.innerText = '<map>';
    //this.nodes.info.appendChild(node);
    this.areas.forEach(function (area) {
        if (area.points.length > 0) {
            results = '<area shape="' + area.type + '" coords="';
            area.points.forEach(function (point, i) {
                if (i > 0) {
                    results += ',';
                }
                results += point.x + ',' + point.y;
            });
            results += '">';
            console.log(results)
            document.getElementById('imgmap').innerHTML +=results
            //node = document.createElement('div');
            //node.innerText = results;
            //that.nodes.info.appendChild(node);
        }
    });
    //node = document.createElement('div');
    //node.innerText = '</map>';
    //document.getElementById('imgmap').appendChild(node)
    //this.nodes.info.appendChild(node);
};

MapAreaDraw.prototype.clearInfo = function () {
    while (this.nodes.info.firstChild) {
        this.nodes.info.firstChild.remove();
    }
};

MapAreaDraw.prototype.getCanvas = function () {
    var img = document.getElementById('img-imgmap');
    var x,y, w,h;
    x = img.offsetLeft;
    y = img.offsetTop;
    w = img.clientWidth;
    h = img.clientHeight;
    var can = document.getElementById('canvas');
    this.nodes.canvas.width = w;
    this.nodes.canvas.height = h;
    this.context = this.nodes.canvas.getContext('2d');
};

MapAreaDraw.prototype.clearCanvas = function () {
    this.context.clearRect(0, 0, this.nodes.canvas.width, this.nodes.canvas.height);
    let mapElement = document.getElementById("imgmap");
    let areas = mapElement.getElementsByTagName("area");

    for (let i = 0; i < areas.length; i++) {
        if (areas[i].id && areas[i].id !== "") {
            console.log(areas[i])
            this.drawPoints(convertStringToPoints(areas[i].getAttribute("coords"), "poly"))
        }
    }

};

MapAreaDraw.prototype.normalizeRectPoints = function(points) {
    return {
        x1: Math.min(points[0].x, points[1].x),
        y1: Math.min(points[0].y, points[1].y),
        x2: Math.max(points[0].x, points[1].x),
        y2: Math.max(points[0].y, points[1].y)
    }
};
let isDone = false;
const Draw = new MapAreaDraw();
function myInit(){
    if(!isDone){
			Draw.render({
				'container': document.getElementById('container'),
				'inner': document.getElementById('inner'),
				'canvas': document.getElementById('canvas'),
				'buttons': document.getElementById('buttons'),
				'info': document.getElementById('info'),
			});
            isDone = true;
            const interval = setInterval(async function() {
                const canvas = document.getElementById('canvas');
            
                const img = document.getElementById('img-imgmap');
                canvas.width = img.width;
                canvas.height = img.height;
                if(canvas.height > 0){
                    clearInterval(interval)
                }
                console.log(canvas.height);
            }, 3000);
        }
        
}