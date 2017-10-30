# Canvas Animation Library

## ImageAnimation class

### Definition
Create object using function constructor:
```
    new ImageAnimation(context: CanvasContext2d, image: Image, options: Object)
```
Parameters:
* context: a canvas 2d context,
* image: an image to animate,
* options: an object with image initial data: { x, y, width, height, isScalable } - all required!
    - x: x position for left-top image corner
    - y: y position for left-top image corner
    - width: image width
    - height: image width
    - isScalable: if true image position and size are based on window width (1920px)

<hr>

### Functions
#### .move(options: Object, time: Number)

##### Parameters:
* options: an object with available image transform options
* time: time in milliseconds

```javascript
    var imgAnim = new ImageAnimation(ctx, image, { x: 100, y: 100, width: 150, height: 90, isScalable: true });
    imgAnim.move({ x: 200, ease: 'ease-in-out-3' }, 1000)
```
##### Available options:
* x: move image by x position [pixels]
* y: move image by y position [pixels]
* deg: rotate image around center [degrees]
* scale: scale image 
* ease (ease-in-\*, ease-out-\*, ease-in-out-\*)  * - power (1-4)


<hr>

### Example
```html
<html>
    <head>
        <title>Canvas Animation Library</title>
    </head>
    <body>
        <img id="test-image-1" src="img/1.png" style="display: none">
        <canvas id="canvas-animation"></canvas>

        <script src="canvas_animation.js"></script>
        <script src="script.js"></script>
    </body>
</html>
```

```javascript
var canvas = document.getElementById('canvas-animation');
var ctx = canvas.getContext('2d');

var image1 = document.getElementById('test-image-1');
var imgAnim1 = new ImageAnimation(ctx, image1, {
    x: 100, y: 50, width: 128, height: 128, isScalable: true
})

var animation = function() {
    imgAnim1.draw();
    requestAnimationFrame(animation);
}
animation();

imgAnim1.move({ x: -50, y: -25, ease: 'ease-in-out-3' }, 500)
```