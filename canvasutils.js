class Button
{
    colorIdle = "#444444";
    colorHover = "#777777";
    colorPressed = "#999999";

    textColor = "#ffffff";

    offsetX = 0;
    offsetY = 0;

    color = this.colorIdle;

    textSize = 30;

    toggle = false;

    constructor(x, y, width, height, text)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
    }

    pressed(lmb)
    {
        if(this.toggle && !lmb)
        {
            this.toggle = false;
            return true;
        }
        return false;
    }

    draw(canvas)
    {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
        canvas.fillStyle = this.textColor;
        canvas.font = this.textSize + 'px sans-serif';
        canvas.textAlign = 'center';
        canvas.textBaseline = 'middle';
        canvas.fillText(this.text, this.x + this.offsetX + this.width / 2, this.y + this.offsetY + this.height / 2, this.width);
    }

    update(lmb, mouseX, mouseY)
    {
        this.color = this.colorIdle;
        if(mouseX > this.x && mouseY > this.y && mouseX < this.x + this.width && mouseY < this.y + this.height)
        {
            this.color = this.colorHover;
            if(lmb)
            {
                this.color = this.colorPressed;
                this.toggle = true;
            }
        }

        if(!lmb)
        {
            this.toggle = false;
        }
    }
}

class Slider
{
    colorIdle = "#444444";
    colorHover = "#777777";
    colorPressed = "#999999";

    colorSlider = "#222222";

    colorCurrent = this.colorIdle;

    isMoving = false;

    constructor(x, y, length, thickness, boxWidth, boxHeight, position)
    {
        this.x = x;
        this.y = y;
        this.length = length;
        this.thickness = thickness;
        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
        this.position = position;
    }

    draw(canvas)
    {
        canvas.fillStyle = this.colorSlider;
        canvas.fillRect(this.x, this.y - this.thickness / 2, this.length, this.thickness / 2);
        canvas.fillStyle = this.colorCurrent;
        canvas.fillRect(this.x - this.boxWidth / 2 + this.position * this.length, this.y - this.boxHeight / 2, this.boxWidth, this.boxHeight);
    }

    getPosition()
    {
        return this.position;
    }

    update(lmb, mouseX, mouseY)
    {
        this.colorCurrent = this.colorIdle;
        if(mouseX > this.x - this.boxWidth / 2 + this.position * this.length && mouseY > this.y - this.boxHeight / 2 && mouseX < this.x + this.boxWidth / 2 + this.position * this.length && mouseY < this.y + this.boxHeight / 2)
        {
            this.colorCurrent = this.colorHover;
            if(lmb)
            {
                this.isMoving = true;
            }
        }

        if(this.isMoving)
        {
            this.colorCurrent = this.colorPressed;
            this.position = (mouseX - this.x) / this.length;
        }
        
        if(!lmb)
        {
            this.isMoving = false;
        }

        if(this.position < 0) this.position = 0;
        if(this.position > 1) this.position = 1;
    }
}

function fillRoundedRect(canvas, x, y, width, height, color, radius)
{
    canvas.fillStyle = color;

    canvas.beginPath();
    canvas.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
    canvas.fill();

    canvas.beginPath();
    canvas.arc(x + width - radius, y + radius, radius, 0, Math.PI * 2, false);
    canvas.fill();

    canvas.beginPath();
    canvas.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 2, false);
    canvas.fill();

    canvas.beginPath();
    canvas.arc(x + radius, y + height - radius, radius, 0, Math.PI * 2, false);
    canvas.fill();

    canvas.fillRect(x, y + radius, width, height - radius * 2);
    canvas.fillRect(x + radius, y, width - radius * 2, height);
}