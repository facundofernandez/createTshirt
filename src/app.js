'use strict';

import './sass/main.scss'

let reader = new FileReader();
let file = document.querySelector('input[type=file]');

let texto = document.querySelector('#text');
let size = document.querySelector('#size');
let alignL = document.querySelector('#alignL');
let alignR = document.querySelector('#alignR');
let alignC = document.querySelector('#alignC');
let alignJ = document.querySelector('#alignJ');
let underline = document.querySelector('#underline');
let bold = document.querySelector('#bold');
let stage = createStage();
let remeras = document.createElement('div');
remeras.classList.add('remeras');
let back = document.createElement('div');
let front = document.createElement('div');
let layerFront = new Konva.Layer({ visible: true });
let layerBack = new Konva.Layer({ visible: false });
let layer = layerFront;
let selected = null;
let colors = document.querySelector('.colors');
let tshirtColors = document.querySelector('.tshirtColors');
let current = document.querySelector(".current");
let list = document.querySelector(".list");
let arrayTshirtColors = ['White', 'Silver', 'Gray', 'Black', 'Red', 'Maroon', 'Yellow', 'Olive', 'Lime', 'Green', 'Aqua', 'Blue', 'Navy', 'Purple'];
let arrayTextColors = ['White', 'Silver', 'Gray', 'Black', 'Red', 'Maroon', 'Yellow', 'Olive', 'Lime', 'Green', 'Aqua', 'Blue', 'Navy', 'Fuchsia', 'Purple'];

back.innerHTML = "<div class='image'></div>";
front.innerHTML = "<div class='image'></div>";

back.classList.add('back');
front.classList.add('front');

remeras.appendChild(front);
remeras.appendChild(back);

[back, front].map((elem) => {
    elem.addEventListener('click', (e) => {

        if (e.target.classList.contains('front')) {
            layerBack.visible(false);
            layerFront.visible(true);
            layer = layerFront;

        } else {
            layerFront.visible(false);
            layerBack.visible(true);
            layer = layerBack;
        }
        layerBack.draw();
        layerFront.draw();
        layer.draw();
    });
});

document.querySelector('#container').appendChild(remeras);

actualizarEstadoDeControles();

arrayTextColors.map((color) => {
    let item = document.createElement('div');
    item.style.background = color;
    //item.innerHTML = color;

    item.addEventListener('click', () => {
        if (selected) {
            let text = selected.find("Text")[0];
            text.fill(color);
            layer.draw();
        }
    });

    colors.appendChild(item);
});

arrayTshirtColors.map((color) => {
    let item = document.createElement('div');
    item.style.background = color;

    item.addEventListener('click', () => {

        let rgb = getRgb(color);
        layerBack.visible(true);
        layerBack.find('Image')[0].cache();
        layerBack.find('Image')[0].filters([Konva.Filters.RGB]);
        layerBack.find('Image')[0].blue(rgb.blue);
        layerBack.find('Image')[0].green(rgb.green);
        layerBack.find('Image')[0].red(rgb.red);

        layerBack.draw();
        layerBack.find('Image')[0].moveToBottom();
        layerBack.draw();
        document.querySelector('.back .image').style.backgroundImage = `url(${layerBack.toDataURL({ width: '450', height: '450', quality: 1 })})`;

        layerBack.visible(false);

        layerFront.visible(true);
        layerFront.find('Image')[0].cache();
        layerFront.find('Image')[0].filters([Konva.Filters.RGB]);
        layerFront.find('Image')[0].blue(rgb.blue);
        layerFront.find('Image')[0].green(rgb.green);
        layerFront.find('Image')[0].red(rgb.red);

        layerFront.draw();
        layerFront.find('Image')[0].moveToBottom();
        layerFront.draw();
        document.querySelector('.front .image').style.backgroundImage = `url(${layerFront.toDataURL({ width: '450', height: '450', quality: 1 })})`;

        layerFront.visible(false);



        layer.visible(true)

    });

    tshirtColors.appendChild(item);
});

[alignC, alignJ, alignL, alignR, underline, bold].map((elem) => {
    elem.addEventListener("click", () => {
        if (selected) {
            if (
                elem === alignC ||
                elem === alignJ ||
                elem === alignL ||
                elem === alignR
            ) {
                [alignC, alignJ, alignL, alignR].map((item) => item.classList.remove('active'));
            }
            elem.classList.toggle('active');
            let active = elem.classList.contains('active');
            let text = selected.find("Text")[0];
            switch (elem.id) {
                case "alignL": {
                    text.align('left');
                    break;
                }
                case "alignR": {
                    text.align('right');
                    break;
                }
                case "alignC": {
                    text.align('center');
                    break;
                }
                case "alignJ": {
                    text.align('justify');
                    break;
                }
                case "bold": {
                    text.fontStyle(active ? 'bold' : '');
                    break;
                }
                case "underline": {
                    text.textDecoration(active ? 'underline' : '');
                    break;
                }
            }

            layer.draw();
        }
    })
});

layerBack.scale({ x: .5, y: .5 });
layerFront.scale({ x: .5, y: .5 });
layerBack.draw();
layerFront.draw();

stage.add(layerBack, layerFront);

stage.on('click', function (e) {

    ocultarControl('fonts');
    actualizarEstadoDeControles();
    if (
        !e.target.parent || (
            !e.target.parent.hasName("text") &&
            !e.target.parent.hasName("img")
        )

    ) {
        selected = null;
        actualizarEstadoDeControles();
        return;
    }

    selected = e.target.parent;
    actualizarEstadoDeControles();
    switch (e.target.parent.getName()) {
        case "text": {
            document.querySelector('.fonts').classList.toggle('hide');
            console.log(selected.find('Text')[0].getText())
            document.querySelector('#text').value = selected.find('Text')[0].getText();

            break;
        }
        case "img": {

            break;
        }
    }

})


createImage('dist/img/remera-front.png', {
    x: 200 - (250 / 2),
    y: 170 - (250 / 2),
    name: "remera",
    cwidth: 750,
    draggable: false,
    layer: layerFront
});
createImage('dist/img/remera-back.png', {
    x: 200 - (250 / 2),
    y: 170 - (250 / 2),
    name: "remera",
    cwidth: 750,
    layer: layerBack,
    draggable: false
});


document.querySelector('#newText').addEventListener('click', createText);
document.querySelector('#delete').addEventListener('click', deleteItem);

document.querySelector('#layerUp').addEventListener('click', () => {
    if (selected) {
        console.log(selected)
        selected.moveUp();
        layer.draw();
    } else {
        console.log("seleccione un elemento");
    }
});

document.querySelector('#layerDown').addEventListener('click', () => {
    if (selected) {
        selected.moveDown();
        layer.draw();
    } else {
        console.log("seleccione un elemento");
    }
});

reader.addEventListener("load", function () {

    createImage(reader.result, {
        x: 0,
        y: 0,
        name: 'img',
        transformer: true,
        draggable: true,
        hover: true
    });


}, false);
file.addEventListener('change', () => {
    if (file.files[0]) {
        reader.readAsDataURL(file.files[0]);

    }
});

document.getElementById('save').addEventListener('click', function () {
    layer.scale({ x: 2.7, y: 2.7 });
    layer.draw();

    let dataURL = stage.toDataURL({ width: '2400', height: '2400', quality: 1 });
    downloadURI(dataURL, 'stage.png', () => {
        layer.scale({ x: 0.5, y: 0.5 });
        layer.draw();
    });

}, false);

size.addEventListener('input', function (e) {

    if (selected) {
        selected.find('Text')[0].fontSize(e.target.value)
        layer.draw();
    }
});

texto.addEventListener('input', function (e) {
    if (selected) {
        let text = selected.find('Text')[0];
        let w = text.getWidth();
        let h = text.getHeight();

        stage.find('Transformer')[0].setWidth(w + 20);
        stage.find('Transformer')[0].forceUpdate();

        selected.find('Rect')[0].setWidth(w + 20);
        selected.find('Rect')[0].setHeight(h + 20);
        text.text(e.target.value);
        layer.draw();
    }
});

current.addEventListener("click", e => {
    if (list.classList.contains("open")) {
        list.classList.remove("open");
    } else {
        list.classList.add("open");
    }
});

[...document.querySelectorAll('.list > div')].map((item) => {
    item.addEventListener('click', () => {
        let text = selected.find('Text')[0];
        let itemStyle = window.getComputedStyle(item);

        current.innerHTML = item.innerHTML;
        current.style.fontFamily = itemStyle.getPropertyValue('font-family');
        list.classList.remove('open');

        text.fontFamily(itemStyle.getPropertyValue('font-family'));
        layer.draw();
        text = selected.find('Text')[0];
        let w = text.getWidth();
        let h = text.getHeight();
        stage.find('Transformer')[0].setWidth(w + 20);
        stage.find('Transformer')[0].forceUpdate();

        selected.find('Rect')[0].setWidth(w + 20);
        selected.find('Rect')[0].setHeight(h + 20);

        layer.draw();
    });

})

function downloadURI(uri, name, callback) {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    callback();
}

function drawImage(params) {
    let group = new Konva.Group({ 
        x: 0, y: 0, draggable: params.draggable, name: params.name 
    });

    let img = new Konva.Image(params);
    let ratio = img.getHeight() / img.getWidth();

    if (!params.cwidth) params.cwidth = 100;

    img.setWidth(params.cwidth);
    img.setHeight(params.cwidth * ratio);

    var boundingBox = img.getClientRect({ relativeTo: group });

    var box = new Konva.Rect({
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
        stroke: 'red',
        name: params.name,
        strokeWidth: 1,
        strokeEnabled: false
    });

    group.on('click', (e) => {
        if (e.target.parent.attrs.name !== 'remera') {
            selected = e.target.parent;
        }
    })

    if (params.hover) {

        group.on('mouseover', (e) => {

            e.target.setStroke('blue');
            e.target.strokeEnabled(true);
            document.body.style.cursor = 'pointer';
            if (params.layer) {
                params.layer.draw();
            } else {
                layer.draw()
            }
        })

        group.on('mouseout', (e) => {

            e.target.setStroke('red');
            e.target.strokeEnabled(false);

            document.body.style.cursor = 'default';
            if (params.layer) {
                params.layer.draw();
            } else {
                layer.draw()
            }
        })

    }

    group.add(img);
    group.add(box);

    if (params.transformer) {
        stage.on('click', function (e) {

            if (e.target.hasName("remera") || e.target.hasName("stage")) {
                stage.find('Transformer').destroy();
                if (params.layer) {
                    params.layer.draw();
                } else {
                    layer.draw()
                }
                return;
            }

            // do nothing if clicked NOT on our rectangles
            if (!e.target.hasName(params.name)) {
                return;
            }
            // remove old transformers
            // TODO: we can skip it if current rect is already selected
            stage.find('Transformer').destroy();

            // create new transformer
            let tr = new Konva.Transformer();
            //group.add(tr)
            layer.add(tr);

            tr.attachTo(e.target.parent);

            if (params.layer) {
                params.layer.draw();
            } else {
                layer.draw()
            }
        })
    }

    if (params.layer) {
        params.layer.add(group);
        params.layer.draw();
    } else {
        layer.add(group);
        layer.draw()
    }


    return img;

}

function createImage(url, params) {
    return new Promise((resolve, reject) => {
        let imageObj = new Image();
        params.image = imageObj;
        imageObj.onload = () => resolve(drawImage(params));
        imageObj.src = url;
    })
}

function createText() {

    // Creo un grupo
    let group = new Konva.Group({ x: 0, y: 0, draggable: true, name: "text" });

    // Creo el texto
    let textNode = new Konva.Text({
        text: 'Some text here',
        x: 50,
        y: 50,
        fontSize: 30,
        fontFamily: 'Calibri'
    });

    var boundingBox = textNode.getClientRect({ relativeTo: group });

    // Creo contorno
    var box = new Konva.Rect({
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
        stroke: 'red',
        strokeWidth: 2,
        strokeEnabled: false
    });

    // Asigno Eventos
    group.on('mouseover', (e) => {
        box.strokeEnabled(true);
        document.body.style.cursor = 'pointer';

        if (stage.find('Transformer').length) {
            box.strokeEnabled(false);

        }

        layer.draw();
    })

    group.on('mouseout', (e) => {
        box.strokeEnabled(false);

        document.body.style.cursor = 'default';
        layer.draw()
    })

    textNode.on('fontSizeChange', function (evt) {

        var boundingBox = textNode.getClientRect({ relativeTo: group });

        stage.find('Transformer')[0].setWidth(boundingBox.width);
        stage.find('Transformer')[0].setHeight(boundingBox.height);
        stage.find('Transformer')[0].forceUpdate();

        group.find('Rect')[0].setWidth(boundingBox.width);
        group.find('Rect')[0].setHeight(boundingBox.height);
        layer.draw();



    });

    group.on('click', (e) => {

        if (stage.find('Transformer').length) {
            box.strokeEnabled(false);
        }

        layer.draw();
    })

    group.add(textNode);
    group.add(box);
    layer.add(group);
    //layer.draw();
    group.moveToTop();

    layer.draw();

}

stage.on('click', function (e) {

    if (e.target.hasName("remera") || e.target.hasName("stage") || e.target.hasName("text")) {
        stage.find('Transformer').destroy();
        layer.draw();
        return;
    }

    if (!e.target.parent.hasName("text")) return;

    stage.find('Transformer').destroy();

    let tr = new Konva.Transformer({
        borderStroke: 'red',
        borderDash: [3, 3],
        enabledAnchors: ['top-right', 'top-left', 'bottom-left', 'bottom-right']
    });

    //group.add(tr)
    layer.add(tr);
    console.log(e.target);
    tr.attachTo(e.target.parent);
    layer.draw();
})

function createStage() {
    return new Konva.Stage({
        container: 'container',
        width: 450,
        name: "stage",
        height: 450,
        //opacity: .7
    });
}

function deleteItem() {

    if (selected) {
        stage.find('Transformer').destroy();
        selected.remove();
        selected.destroy();
        selected = null;
        layer.draw();
    }
    ocultarControl('fonts');
    actualizarEstadoDeControles();
}

function ocultarControl(id) {
    switch (id) {
        case 'fonts': {
            document.querySelector('.fonts').classList.add('hide');
        }
    }
}

setInterval(() => {
    if (layer === layerFront) {
        document.querySelector('.front .image').style.backgroundImage = `url(${layerFront.toDataURL({ width: '450', height: '450', quality: 1 })})`;
    } else {
        document.querySelector('.back .image').style.backgroundImage = `url(${layerBack.toDataURL({ width: '450', height: '450', quality: 1 })})`;
    }


}, 1000);

function getRgb(color) {
    let rgb = {};
    switch (color) {
        case "White": {
            rgb.red = 255;
            rgb.green = 255;
            rgb.blue = 255;
            break;
        }
        case "Silver": {
            rgb.red = 192;
            rgb.green = 192;
            rgb.blue = 192;
            break;
        }
        case "Gray": {
            rgb.red = 128;
            rgb.green = 128;
            rgb.blue = 128;
            break;
        }
        case "Black": {
            rgb.red = 0;
            rgb.green = 0;
            rgb.blue = 0;
            break;
        }
        case "Red": {
            rgb.red = 255;
            rgb.green = 0;
            rgb.blue = 0;
            break;
        }
        case "Maroon": {
            rgb.red = 128;
            rgb.green = 0;
            rgb.blue = 0;
            break;
        }
        case "Lime": {
            rgb.red = 0;
            rgb.green = 255;
            rgb.blue = 0;
            break;
        }
        case "Olive": {
            rgb.red = 128;
            rgb.green = 128;
            rgb.blue = 0;
            break;
        }
        case "Green": {
            rgb.red = 0;
            rgb.green = 128;
            rgb.blue = 0;
            break;
        }
        case "Aqua": {
            rgb.red = 0;
            rgb.green = 255;
            rgb.blue = 255;
            break;
        }
        case "Blue": {
            rgb.red = 0;
            rgb.green = 0;
            rgb.blue = 255;
            break;
        }
        case "Yellow": {
            rgb.red = 255;
            rgb.green = 255;
            rgb.blue = 0;
            break;
        }
        case "Navy": {
            rgb.red = 0;
            rgb.green = 0;
            rgb.blue = 128;
            break;
        }
        case "Fuchsia": {
            rgb.red = 255;
            rgb.green = 0;
            rgb.blue = 255;
            break;
        }
        case "Purple": {
            rgb.red = 128;
            rgb.green = 0;
            rgb.blue = 128;
            break;
        }
    }
    return rgb;
}

function actualizarEstadoDeControles() {
    let btnDelete = document.querySelector('#delete');
    let btnLayerUp = document.querySelector('#layerUp');
    let btnLayerDown = document.querySelector('#layerDown');
    console.log("actualizarEstadoDeControles", selected)
    if (selected) {
        btnDelete.removeAttribute("disabled");
        btnLayerUp.removeAttribute("disabled");
        btnLayerDown.removeAttribute("disabled");
    } else {
        btnDelete.setAttribute("disabled", true);
        btnLayerUp.setAttribute("disabled", true);
        btnLayerDown.setAttribute("disabled", true);
    }
}