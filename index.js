// EASE FUNCTIONS
var easeInOut = function(x, amp) {
    return Math.pow(x, amp) / (Math.pow(x, amp) + Math.pow((1 - x), amp));
}
var easeIn = function(x, amp) {
    return Math.pow(x, amp);
}
var easeOut = function(x, amp) {
    return x * (2-x);
}

// ======================================================================================================
// ===== IMAGE ANIMATION ================================================================================
// ======================================================================================================

ImageAnimation = function(context, image, options) {
    console.log(options)
    this.context = context;
    this.image = image;
    this.x = options.x;
    this.y = options.y;
    this.startX = options.x;
    this.startY = options.y;

    this.deg = 0;
    this.startDeg = 0;

    this.width = options.width;
    this.height = options.height;
    this.startWidth = options.width;
    this.startHeight = options.height;

    this.isScalable = options.isScalable;

    this.startTime = Date.now();
    this.time = Date.now();
    this.isAnimating = false;

    this.timer = undefined;

    this.ratio = 0;
}

ImageAnimation.prototype.draw = function(path) {
    if (path === undefined) {
        if (this.isScalable === true) this.ratio = this.context.canvas.width/1920;
        else this.ratio = 1;
        
        
        this.context.save();
        this.context.translate((this.x + this.width/2) * this.ratio, (this.y + this.height/2) * this.ratio);
        this.context.rotate(this.deg * Math.PI / 180)
        this.context.drawImage(this.image, -this.width/2 * this.ratio, -this.height/2 * this.ratio, this.width * this.ratio, this.height * this.ratio);
        this.context.restore();
    }
    else {
        // draw clip with patch and then image
        // this.context.save()
        // ctx.beginPath();
        // ctx.closePath();
        // ctx.clip();
        // this.context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        // this.context.restore();
    }

}

ImageAnimation.prototype.move = function(options, time) {
    if (this.isAnimating === false) {

        this.isAnimating = true;
        this.startTime = Date.now();

        this.startX = this.x;
        this.startY = this.y;
        this.startDeg = this.deg;

        this.startWidth = this.width;
        this.startHeight = this.height;

        var changer = function() {
            var progress = (Date.now() - this.startTime) / time;
            var position = 0;
            if (options.ease === 'ease-in') position = easeIn(progress, 2);
            else if (options.ease === 'ease-out') position = easeOut(progress);
            else if (options.ease === 'ease-in-out') position = easeInOut(progress, 2.6);
            else position = progress;
            
            if (progress < 1) {
                if (options.deg !== undefined) this.deg = this.startDeg + options.deg * position;

                if (options.scale !== undefined) {
                    this.width = this.startWidth + this.startWidth * (options.scale - 1) * position;
                    this.height = this.startHeight + this.startHeight * (options.scale - 1) * position;
                    
                    if (options.x !== undefined && options.y !== undefined) {
                        this.x = this.startX - this.startWidth * (options.scale - 1) * position / 2 + options.x * position;
                        this.y = this.startY - this.startHeight * (options.scale - 1) * position / 2 + options.y * position;
                    }
                    else if (options.x !== undefined && options.y === undefined) {
                        this.x = this.startX - this.startWidth * (options.scale - 1) * position / 2 + options.x * position;
                        this.y = this.startY - this.startHeight * (options.scale - 1) * position / 2;
                    }
                    else if (options.x === undefined && options.y !== undefined) {
                        this.x = this.startX - this.startWidth * (options.scale - 1) * position / 2;
                        this.y = this.startY - this.startHeight * (options.scale - 1) * position / 2 + options.y * position;
                    }
                    else if (options.x === undefined && options.y === undefined) {
                        this.x = this.startX - this.startWidth * (options.scale - 1) * position / 2;
                        this.y = this.startY - this.startHeight * (options.scale - 1) * position / 2;
                    }
                }
                else {
                    if (options.x !== undefined && options.scale === undefined) this.x = this.startX + options.x * position;
                    if (options.y !== undefined && options.scale === undefined) this.y = this.startY + options.y * position;
                }

                this.timer = setTimeout(changer.bind(this), 5)
            }
            else {
                this.isAnimating = false;
            }
        }
        this.timer = setTimeout(changer.bind(this), 5)
    }
}

ImageAnimation.prototype.stop = function() {
    clearTimeout(this.timer);
    this.isAnimating = false;
}


// ======================================================================================================
// ===== OVERLAY ANIMATION ==============================================================================
// ======================================================================================================


function OverlayAnimation() {

}
