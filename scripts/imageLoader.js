document.addEventListener('DOMContentLoaded', function() {
    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', updateImage, false);
    var sortButton = document.getElementById('submitButton');
    sortButton.addEventListener('click', bubbleSort, false);
})

var image;
var blocks;
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');

function updateImage(input) {
    var reader = new FileReader();
    reader.onload = function(event) {
        image = new Image();
        image.src = event.target.result;
        image.onload = scrambleImage(image);
    }
    reader.readAsDataURL(input.target.files[0])
}

function drawToScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = image.width;
    canvas.height = image.height;

    blocks.forEach(function(e) {
        ctx.drawImage(image, e.startPos[0], e.startPos[1], e.size[0], e.size[1],
            e.destPos[0], e.destPos[1], e.size[0], e.size[1]);
    })
}

function scrambleImage(image) {
    const n = 256;

    // container of objects to sort, each with a source x and y,
    // a destination x and y, and a key to define their sorted position
    blocks = [];
    var startPositions = [];

    var blockHeight = image.height / 16;
    var blockWidth = image.width / 16;
    var startX = 0, startY = 0;
    for (var i = 0; i < n; i++) {
        blocks.push({
            id: i,
            startPos: [startX, startY],
            size: [blockWidth, blockHeight],
            destPos: [0, 0]
        });
        startPositions.push([startX, startY]);
        startX += blockWidth;
        // start new row when necessary
        if (startX >= image.width) {
            startY += blockHeight;
            startX = 0;
        }
    }
    blocks = scrambleBlocks(startPositions);
    drawToScreen();
}

function scrambleBlocks(possibleStarts) {
    shuffle(possibleStarts);
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].destPos = possibleStarts[i];
    }
    return blocks;
}

function shuffle() {
    for (let i = blocks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }
    return blocks;
}

function bubbleSort(e) {
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks.length - i - 1; j++) {
            if (blocks[j].id > blocks[j+1].id) {
                //window.requestAnimationFrame(function() {
                drawToScreen();
                let temp = {
                    id: blocks[j+1].id,
                    startPos: blocks[j+1].startPos,
                    size: blocks[j+1].size,
                    destPos: blocks[j+1].destPos
                };
                temp.destPos = blocks[j].destPos;
                blocks[j].destPos = blocks[j+1].destPos;
                blocks[j+1].destPos = temp.destPos;
                blocks[j+1] = blocks[j];
                blocks[j] = temp;
                //});
            }
        }
    }
}
