document.addEventListener('DOMContentLoaded', function() {
    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', updateImage, false);
})

function updateImage(input) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var image = new Image();
        image.src = event.target.result;
        image.onload = scrambleImage(image);
    }
    reader.readAsDataURL(input.target.files[0])
}

function drawToScreen(image, blocks) {
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');
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
    var blocks = [];
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
    blocks = scrambleBlocks(blocks, startPositions);
    drawToScreen(image, blocks);
}

function scrambleBlocks(blocks, possibleStarts) {
    shuffle(possibleStarts);
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].destPos = possibleStarts[i];
    }
    return blocks;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
