document.addEventListener('DOMContentLoaded', function() {
    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', updateImage, false);
})

function updateImage(input) {
    var reader = new FileReader();
    // var canvas = document.getElementById('imageCanvas');
    // var ctx = canvas.getContext('2d');
    reader.onload = function(event) {
        var image = new Image();
        // image.onload = function() {
        //     canvas.width = image.width;
        //     canvas.height = image.height;
        //     ctx.drawImage(image, image.width / 2, 0, image.width / 2, image.height,
        //       0, 0, image.width / 2, image.height);
        //     ctx.drawImage(image, 0, 0, image.width / 2, image.height,
        //       image.width / 2, 0, image.width / 2, image.height);
        // }
        image.onload = scrambleImage;
        image.src = event.target.result;
    }
    reader.readAsDataURL(input.target.files[0])
}

function scrambleImage(image) {
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');

    const n = 8;

    // container of objects to sort, each with a source x and y,
    // a destination x and y, and a key to define their sorted position
    var blocks = [];

    var blockHeight = image.height / n;
    var blockWidth = image.width / n;
    var startX = 0, startY = 0;
    for (int i = 0; i < n; i++) {
        blocks.push({
            id: i,
            startPos: [startX, startY],
            destPos: [0, 0]
        });
    }
}
