document.addEventListener('DOMContentLoaded', function() {
    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', updateImage, false);
    var sortButton = document.getElementById('submitButton');
    sortButton.addEventListener('click', callSort, false);
    var testButton = document.getElementById('testButton');
    testButton.addEventListener('click', sortTest, false);
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

function drawToScreen(array) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = image.width;
    canvas.height = image.height;

    blocks.forEach(function(e) {
        ctx.drawImage(image, e.startPos[0], e.startPos[1], e.size[0], e.size[1],
            e.destPos[0], e.destPos[1], e.size[0], e.size[1]);
    });
}

function scrambleImage(image) {
    const n = 256;

    // container of objects to sort, each with a source x and y,
    // a destination x and y, and a key to define their sorted position
    blocks = [];
    var startPositions = [];

    var blockHeight = image.height /16;
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
    drawToScreen(blocks);
}

function scrambleBlocks(possibleStarts) {
    shuffle(blocks);
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

function callSort(e) {
    var element = document.getElementById("sortSelect");
    var sortString = element.options[element.selectedIndex].value;

    switch (sortString) {
      case "bubbleSort":
        bubbleSort();
        break;
      case "quickSort":
        blocks = quickSort(blocks);
        drawToScreen(blocks);
        break;
      case "insertionSort":
        insertionSort(blocks);
        break;
      default:
        break;
    }
}

function bubbleSort() {
    let timeout = 50;
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks.length - i - 1; j++) {
            if (blocks[j].id > blocks[j+1].id) {
                let tempId = blocks[j+1].id;
                blocks[j+1].id = blocks[j].id;
                blocks[j].id = tempId;
                setTimeout(swapBlocks, timeout, j);
            } else {
                setTimeout(function() {
                    drawToScreen(blocks);
                }, timeout);
            }
        }
    }
}

function swapBlocks(j) {
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
    drawToScreen(blocks);
}

function sortTest() {
    var testArray = [];
    for (let i = 0; i < 100; i++) {
        testArray.push(i);
    }
    shuffle(testArray);
    testArray = insertionSort(testArray);
}

function quickSort(array) {
    if (array.length <= 1)
        return array;

    var pivot = {
        id: array[0].id,
        startPos: array[0].startPos,
        size: array[0].size,
        destPos: array[0].destPos
    };
    var greater = [];
    var less = [];


    for (let i = 0; i < array.length; i++) {
        if (array[i].id > pivot.id) {
            greater.push({
              id: array[i].id,
              startPos: array[i].startPos,
              size: array[i].size,
              destPos: array[i].destPos
            });
        } else if (array[i].id < pivot.id) {
            less.push({
              id: array[i].id,
              startPos: array[i].startPos,
              size: array[i].size,
              destPos: array[i].destPos
            });
        }
    }
    for (let i = 0; i < less.length; i++) {
        less[i].destPos = array[i].destPos;
    }
    pivot.destPos = array[less.length].destPos;
    for (let i = less.length + 1; i < less.length + greater.length + 1; i++) {
        greater[i - less.length - 1].destPos = array[i].destPos;
    }

    greater = quickSort(greater);
    less = quickSort(less);
    less.push(pivot);

    setTimeout(function() {
        drawToScreen(greater);
        drawToScreen(less);
    }, 50);

    return less.concat(greater);
}

function insertionSort(array) {
    for (let i = 0; i < array.length; i++) {
        let current = {
            id: array[i].id,
            startPos: array[i].startPos,
            size: array[i].size,
            destPos: array[i].destPos
        }
        let j = i;
        while (j > 0 && current.id < array[j - 1].id) {
            array[j].id = array[j - 1].id;
            setTimeout(swapBlocks, 50, j - 1);
            j--;
        }
        array[j].id = current.id;
    }

}
