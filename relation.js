class Relation
{
    selected = false;
    modeModifier = 0;
    
    junction = 0.5;

    constructor(memberA, memberB)
    {
        this.memberA = memberA;
        this.memberB = memberB;
    }

    draw(canvas, isSelected)
    {
        this.mode = 0;

        if(this.memberA.x != this.memberB.x && this.memberA.y != this.memberB.y)
        {
            this.mode = this.modeModifier % 2 + 1;
        }

        switch(this.mode)
        {
            //Straight line.
            case 0:
                if(isSelected) line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberB.x + 50, this.memberB.y + 75, "green", 35);
                line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberB.x + 50, this.memberB.y + 75, "black", 25);
                break;
            //Segmented line - vertical junction.
            case 1:
                var distX = (this.memberB.x - this.memberA.x) * this.junction;
                if(isSelected)
                {
                    line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberA.x + distX + 50, this.memberA.y + 75, "green", 35);
                    line(canvas, this.memberA.x + distX + 50, this.memberA.y + 75, this.memberA.x + distX + 50, this.memberB.y + 75, "green", 35);
                    line(canvas, this.memberA.x + distX + 50, this.memberB.y + 75, this.memberB.x + 50, this.memberB.y + 75, "green", 35);
                }
                line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberA.x + distX + 50, this.memberA.y + 75, "black", 25);
                line(canvas, this.memberA.x + distX + 50, this.memberA.y + 75, this.memberA.x + distX + 50, this.memberB.y + 75, "black", 25);
                line(canvas, this.memberA.x + distX + 50, this.memberB.y + 75, this.memberB.x + 50, this.memberB.y + 75, "black", 25);
                break;
            //Segmented line - horizontal junction.
            case 2:
                var distY = (this.memberB.y - this.memberA.y) * this.junction;
                if(isSelected)
                {
                    line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberA.x + 50, this.memberA.y + 75 + distY, "green", 35);
                    line(canvas, this.memberA.x + 50, this.memberA.y + 75 + distY, this.memberB.x + 50, this.memberA.y + 75 + distY, "green", 35);
                    line(canvas, this.memberB.x + 50, this.memberA.y + 75 + distY, this.memberB.x + 50, this.memberB.y + 75, "green", 35);
                }
                line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberA.x + 50, this.memberA.y + 75 + distY, "black", 25);
                line(canvas, this.memberA.x + 50, this.memberA.y + 75 + distY, this.memberB.x + 50, this.memberA.y + 75 + distY, "black", 25);
                line(canvas, this.memberB.x + 50, this.memberA.y + 75 + distY, this.memberB.x + 50, this.memberB.y + 75, "black", 25);
                break;
        }
    }

    isHovering(mouseX, mouseY)
    {
        var x = (mouseX / scale) + cameraX;
        var y = (mouseY / scale) + cameraY;

        var minX = Math.min(this.memberA.x, this.memberB.x);
        var maxX = Math.max(this.memberA.x, this.memberB.x);
        var minY = Math.min(this.memberA.y, this.memberB.y);
        var maxY = Math.max(this.memberA.y, this.memberB.y);

        var minHorizontalIsA = minX == this.memberA.x;
        var minVerticalIsA = minY == this.memberA.y;

        switch(this.mode)
        {
            case 0: //Straight line.
                //Vertical
                if(this.memberA.x == this.memberB.x)
                    return pointOnVertical(x, y, minY + 150, maxY, this.memberA.x + 50, 12.5);
                //Horizontal
                else return pointOnHorizontal(x, y, minX + 100, maxX, this.memberA.y + 75, 12.5);
                break;
            case 1: //Segmented line - vertical junction.
                return pointOnHorizontal(x, y, minX + 100, minX + (maxX - minX) * this.junction + 50, minHorizontalIsA ? this.memberA.y + 75 : this.memberB.y + 75, 12.5)
                || pointOnVertical(x, y, minY + 75, maxY + 75, minX + (maxX - minX) * this.junction + 50, 12.5)
                || pointOnHorizontal(x, y, minX + (maxX - minX) * this.junction + 50, maxX, minHorizontalIsA ? this.memberB.y + 75 : this.memberA.y + 75, 12.5);
                break;
            case 2:
                return pointOnVertical(x, y, minY + 150, minY + (maxY - minY) * this.junction + 75, minVerticalIsA ? this.memberA.x + 50 : this.memberB.x + 50, 12.5)
                || pointOnHorizontal(x, y, minX + 50, maxX + 50, minY + (maxY - minY) * this.junction + 75, 12.5)
                || pointOnVertical(x, y, minY + (maxY - minY) * this.junction + 75, maxY, minVerticalIsA ? this.memberB.x + 50 : this.memberA.x + 50, 12.5);
                break;
        }
        return false;
    }

    update()
    {

    }
}