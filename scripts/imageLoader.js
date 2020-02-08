document.addEventListener('DOMContentLoaded', function() {
    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', updateImage, false);
    var sortButton = document.getElementById('submitButton');
    sortButton.addEventListener('click', callSort, false);
    var rescrambleButton = document.getElementById('rescrambleButton');
    rescrambleButton.addEventListener('click', function(){scrambleImage(image)}, false);
})
const n = 256;
var image;
var blocks;
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var opCount;

function updateImage(input) {
    var reader = new FileReader();
    reader.onload = function(event) {
        image = new Image();
        image.src = event.target.result;
        image.onload = setTimeout(scrambleImage, 500, image);
    }
    reader.readAsDataURL(input.target.files[0])
}

function drawToScreen(array) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = image.width;
    canvas.height = image.height;

    array.forEach(function(e) {
        ctx.drawImage(image, e.startPos[0], e.startPos[1], e.size[0], e.size[1],
            e.destPos[0], e.destPos[1], e.size[0], e.size[1]);
    });
}

function scrambleImage(image) {
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
    opCount = 0;
    updateBestWorst(sortString);

    switch (sortString) {
      case "bubbleSort":
        bubbleSort();
        break;
      case "quickSort":
        blocks = quickSort(blocks);
        drawToScreen(blocks);
        break;
      case "insertionSort":
        insertionSort();
        break;
      case "selectionSort":
        selectionSort();
        break;
      default:
        break;
    }
    updateOpCount();
}

function updateBestWorst(sortString) {
    let bestCase = document.getElementById("bestCase");
    let worstCase = document.getElementById("worstCase");

    switch (sortString) {
      case "bubbleSort":
        bestCase.innerHTML = "O(1): 1";
        worstCase.innerHTML = `O(n2): ${n * n}`;
        break;
      case "quickSort":
        bestCase.innerHTML = `O(n log n): ${Math.round(n * Math.log(n))}`;
        worstCase.innerHTML = `O(n2): ${n * n}`;
        break;
      case "insertionSort":
        bestCase.innerHTML = "O(1): 1";
        worstCase.innerHTML = `O(n2): ${n * n}`;
        break;
      case "selectionSort":
        bestCase.innerHTML = `O(n): ${n}`;
        worstCase.innerHTML = `O(n): ${n}`;
        break;
      default:
        break;
    }
}

function updateOpCount() {
    document.getElementById("opCount").innerHTML = opCount;
}

// find minimum element in array and put it in its correct position
function selectionSort() {
    var minimum = 0;
    for (let i = 0; i < blocks.length; i++) {
        minimum = i;
        for (let j = i; j < blocks.length; j++) {
            // if that block is the one we're looking for
            if (blocks[j].id < blocks[minimum].id) {
                minimum = j;
            }
        }
        swapBlocks(i, minimum);
        opCount++;
    }
}

function swapBlocks(firstPos, secondPos) {
    let temp = {
        id: blocks[secondPos].id,
        startPos: blocks[secondPos].startPos,
        size: blocks[secondPos].size,
        destPos: blocks[secondPos].destPos
    };
    temp.destPos = blocks[firstPos].destPos;
    blocks[firstPos].destPos = blocks[secondPos].destPos;
    blocks[secondPos].destPos = temp.destPos;
    blocks[secondPos] = blocks[firstPos];
    blocks[firstPos] = temp;
    drawToScreen(blocks);
}

function bubbleSort() {
    let timeout = 50;
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks.length - i - 1; j++) {
            if (blocks[j].id > blocks[j+1].id) {
                let tempId = blocks[j+1].id;
                blocks[j+1].id = blocks[j].id;
                blocks[j].id = tempId;
                opCount++;
                setTimeout(swapBlocks, timeout, j, j+1);
            } else {
                setTimeout(function() {
                    drawToScreen(blocks);
                }, timeout);
            }
        }
    }
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

    // separate array by pivot
    for (let i = 1; i < array.length; i++) {
        if (array[i].id > pivot.id) {
            greater.push({
              id: array[i].id,
              startPos: array[i].startPos,
              size: array[i].size,
              destPos: array[i].destPos
            });
            opCount++;
        } else if (array[i].id < pivot.id) {
            less.push({
              id: array[i].id,
              startPos: array[i].startPos,
              size: array[i].size,
              destPos: array[i].destPos
            });
            opCount++;
        }
    }
    // make sure items in less appear at start
    for (let j = 0; j < less.length; j++) {
        less[j].destPos = array[j].destPos;
    }
    pivot.destPos = array[less.length].destPos;
    for (let k = less.length + 1; k < less.length + greater.length + 1; k++) {
        greater[k - less.length - 1].destPos = array[k].destPos;
    }

    less.push(pivot);
    greater = quickSort(greater);
    less = quickSort(less);

    return less.concat(greater);
}

function insertionSort() {
    for (let i = 0; i < blocks.length; i++) {
        let current = {
            id: blocks[i].id,
            startPos: blocks[i].startPos,
            size: blocks[i].size,
            destPos: blocks[i].destPos
        }
        let j = i;
        while (j > 0 && current.id < blocks[j - 1].id) {
            blocks[j].id = blocks[j - 1].id;
            opCount++;
            setTimeout(swapBlocks, 50, j - 1, j);
            j--;
        }
        blocks[j].id = current.id;
    }
}
