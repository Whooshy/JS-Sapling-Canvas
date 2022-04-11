class Member
{
    offsetX = -1;
    offsetY = -1;
    defaultWidth = 100;
    defaultHeight = 150;
    defaultCornerRad = 20;
    isMoving = false;
    selected = false;

    constructor(name, x, y)
    {
        this.name = name;
        this.x = x;
        this.y = y;
    }

    draw(canvas)
    {
        if(this.selected)
        {
            fillRoundedRect(c, this.x - BorderOffset, this.y - BorderOffset,  this.defaultWidth + (BorderOffset * 2), this.defaultHeight + (BorderOffset * 2), "green", this.defaultCornerRad + BorderOffset);
        }
        fillRoundedRect(canvas, this.x, this.y,this.defaultWidth, this.defaultHeight, "black", this.defaultCornerRad);
    }

    isHovering(mouseX, mouseY)
    {
        if(mouseX > (this.x - cameraX) * scale && mouseX < (this.x + this.defaultWidth - cameraX) * scale && mouseY > (this.y - cameraY) * scale && mouseY < (this.y + this.defaultHeight - cameraY) * scale)
        {
            return true;
        }
        return false
    }

    update()
    {
        if(this.isMoving)
        {
            if(this.offsetX == -1 && this.offsetY == -1)
            {
                this.offsetX = mouseX / scale + cameraX - this.x;
                this.offsetY = mouseY / scale + cameraY - this.y;
            }
            if(gridAligning)
            {
                this.x = Math.floor((mouseX / scale + cameraX - this.offsetX) / gridSize) * gridSize;
                this.y = Math.floor((mouseY / scale + cameraY - this.offsetY) / gridSize) * gridSize;
            }
            else
            {
                this.x = mouseX / scale + cameraX - this.offsetX;
                this.y = mouseY / scale + cameraY - this.offsetY;
            }
        }
        else
        {
            this.offsetX = -1;
            this.offsetY = -1;
        }
    }

    collides(x,y)
    {
        //collision detection for memeber boxes
        return false;
    }
}