// EASE FUNCTIONS
var easeInOut = function(x, amp) {
    return Math.pow(x, amp) / (Math.pow(x, amp) + Math.pow((1 - x), amp));
}
var easeIn = function(x, amp) {
    return Math.pow(x, amp);
}
var easeOut = function(x, amp) {
    return 1 + Math.pow(-1, amp + 1) * Math.pow(x - 1, amp)
}

// ======================================================================================================
// ===== IMAGE ANIMATION ================================================================================
// ======================================================================================================

ImageAnimation = function(context, image, options) {
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
    if (this.isScalable === true) this.ratio = this.context.canvas.width/1920;
    else this.ratio = 1;

    if (path === undefined) { 
        this.context.save();
        this.context.translate((this.x + this.width/2) * this.ratio, (this.y + this.height/2) * this.ratio);
        this.context.rotate(this.deg * Math.PI / 180)
        this.context.drawImage(this.image, -this.width/2 * this.ratio, -this.height/2 * this.ratio, this.width * this.ratio, this.height * this.ratio);
        this.context.restore();
    }
    else {
        var isPathGood = function(path) {
            if (path instanceof Array) {
                for (var i = 0; i < path.length; i++) {
                    if (!(path[i] instanceof Array) || path[i].length !== 2) {
                        console.error('Invalid path');
                        return false;
                    }
                }
            }
            return true;
        }

        this.context.save();
        this.context.translate((this.x + this.width/2) * this.ratio, (this.y + this.height/2) * this.ratio);
        this.context.rotate(this.deg * Math.PI / 180);

        if (isPathGood(path)) {
            this.context.beginPath();
            this.context.moveTo(path[0][0] * this.ratio, path[0][1] * this.ratio);
            for (var i = 1; i < path.length; i++) {
                this.context.lineTo(path[i][0] * this.ratio, path[i][1] * this.ratio);
            }
            this.context.closePath();
            this.context.clip();
        }
        
        this.context.drawImage(this.image, -this.width/2 * this.ratio, -this.height/2 * this.ratio, this.width * this.ratio, this.height * this.ratio);
        this.context.restore();
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
            if (options.ease === 'ease-in-1') position = easeIn(progress, 2);
            if (options.ease === 'ease-in-2') position = easeIn(progress, 3);
            if (options.ease === 'ease-in-3') position = easeIn(progress, 4);
            if (options.ease === 'ease-in-4') position = easeIn(progress, 5);
            else if (options.ease === 'ease-out-1') position = easeOut(progress, 2);
            else if (options.ease === 'ease-out-2') position = easeOut(progress, 3);
            else if (options.ease === 'ease-out-3') position = easeOut(progress, 4);
            else if (options.ease === 'ease-out-4') position = easeOut(progress, 5);
            else if (options.ease === 'ease-in-out-1') position = easeInOut(progress, 1.5);
            else if (options.ease === 'ease-in-out-2') position = easeInOut(progress, 2);
            else if (options.ease === 'ease-in-out-3') position = easeInOut(progress, 2.75);
            else if (options.ease === 'ease-in-out-4') position = easeInOut(progress, 4);
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
                    if (options.x !== undefined) this.x = this.startX + options.x * position;
                    if (options.y !== undefined) this.y = this.startY + options.y * position;
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


function OverlayAnimation(canvas, context) {
    this.canvas = canvas
    this.context = context;
}

OverlayAnimation.prototype.slideToXCenterThenToYBorders = function(options) {
    // options { time: Number[ms], colors: Object, middlePosition: Number[0-1] }
    this.colors = {
        intro1: options.colors.color1,
        intro2: options.colors.color2
    }
    this.time = options.time;
    this.middlePosition = options.middlePosition;
    this.introProgressP1 = 0;
    this.introProgressP2 = 0;
    this.introP1StartTime = Date.now();
    this.introP2StartTime = null;

    var updateCanvasSize = function() {
        this.canvas.setAttribute('width', window.innerWidth);            
        this.canvas.setAttribute('height',  window.innerHeight);
    },

    var introP1 = function() {
        this.introProgressP1 = (Date.now() - this.introP1StartTime) / this.time * 0.45;
        if (this.introProgressP1 <= 1) {
            var position = easeInOut(that.introProgressP1, that.introAmp);
    
            ctx.clearRect(0, 0, that.DOM.canvas.width, that.DOM.canvas.height);
            ctx.fillStyle = that.colors.intro1;
            ctx.fillRect(0, 0, Math.ceil(that.DOM.canvas.width * that.middlePosition * position), that.DOM.canvas.height);
            ctx.fillStyle = that.colors.intro2;
            ctx.fillRect(that.DOM.canvas.width - that.DOM.canvas.width * (1 - that.middlePosition) * position, 0, Math.ceil(that.DOM.canvas.width * (1 - that.middlePosition) * position), that.DOM.canvas.height);
        
            rAF(introP1);
        }
        else if (that.introProgressP1 > 1 && that.introProgressP1 <= (that.introP1Length + that.introP1P2Delay) / that.introP1Length) {
            that.introProgressP1 = (Date.now() - that.introP1StartTime) / that.introP1Length;
            rAF(introP1);
        }
        else {
            // that.DOM.expandWorkspace.classList.remove('hidden');
            that.introP2StartTime = Date.now();
            rAF(introP2);
        }
    }
    var introP2 = function() {
        that.introProgressP2 = (Date.now() - that.introP2StartTime) / that.introP2Length;
        if (that.introProgressP2 <= 1) { 
            var position = easeInOut(that.introProgressP2, that.introAmp);

            ctx.clearRect(0, 0, that.DOM.canvas.width, that.DOM.canvas.height);
            ctx.fillStyle = that.colors.intro1;                              
            ctx.fillRect(0, 0, Math.ceil(that.DOM.canvas.width * that.middlePosition), that.DOM.canvas.height - that.DOM.canvas.height * position);
            ctx.fillStyle = that.colors.intro2;
            ctx.fillRect(that.DOM.canvas.width * that.middlePosition, that.DOM.canvas.height * position, Math.ceil(that.DOM.canvas.width * (1 - that.middlePosition)), that.DOM.canvas.height - that.DOM.canvas.height * position);
            
            rAF(introP2);
        }
        else {
                // that.DOM.canvas.classList.add('hidden');
                // that.startExpand();
        }
    }
    rAF(introP1);






}
