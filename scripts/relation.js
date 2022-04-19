class RelationToM
{
    selected = false;
    modeModifier = 1;

    centerX = 0;
    centerY = 0;
    
    junction = 0.5;

    constructor(memberA, memberB)
    {
        this.memberA = memberA;
        this.memberB = memberB;

        this.type = 0;
    }

    draw(canvas, isSelected)
    {
        this.mode = 0;

        if(this.memberA.x != this.memberB.x && this.memberA.y != this.memberB.y)
        {
            this.mode = this.modeModifier % 2 + 1;
        }

        this.centerX = (this.memberA.x + this.memberB.x) / 2;
        this.centerY = (this.memberA.y + this.memberB.y) / 2;

        switch(this.mode)
        {
            //Straight line.
            case 0:
                if(isSelected) line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberB.x + 50, this.memberB.y + 75, "green", 35);
                line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberB.x + 50, this.memberB.y + 75, "black", 25);
                break;
            //Segmented line - vertical junction.
            case 1:
                this.centerX = (this.memberB.x - this.memberA.x) * this.junction + this.memberA.x;
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
                this.centerY = (this.memberB.y - this.memberA.y) * this.junction + this.memberA.y;
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
                || this.isHoveringJunction(mouseX, mouseY)
                || pointOnHorizontal(x, y, minX + (maxX - minX) * this.junction + 50, maxX, minHorizontalIsA ? this.memberB.y + 75 : this.memberA.y + 75, 12.5);
                break;
            case 2: //Segmented line - horizontal junction.
                return pointOnVertical(x, y, minY + 150, minY + (maxY - minY) * this.junction + 75, minVerticalIsA ? this.memberA.x + 50 : this.memberB.x + 50, 12.5)
                || this.isHoveringJunction(mouseX, mouseY)
                || pointOnVertical(x, y, minY + (maxY - minY) * this.junction + 75, maxY, minVerticalIsA ? this.memberB.x + 50 : this.memberA.x + 50, 12.5);
                break;
        }
        return false;
    }

    isHoveringJunction(mouseX, mouseY)
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
            case 0:
                return false;
                break;
            case 1:
                return minHorizontalIsA ? pointOnVertical(x, y, minY + 75, maxY + 75, minX + (maxX - minX) * this.junction + 50, 12.5) : pointOnVertical(x, y, minY + 75, maxY + 75, minX + (maxX - minX) * (1 - this.junction) + 50, 12.5);
                break;
            case 2:
                return minVerticalIsA ? pointOnHorizontal(x, y, minX + 50, maxX + 50, minY + (maxY - minY) * this.junction + 75, 12.5) : pointOnHorizontal(x, y, minX + 50, maxX + 50, minY + (maxY - minY) * (1 - this.junction) + 75, 12.5);
                break;
        }

        return false;
    }

    update()
    {

    }
}

class RelationToR
{
    selected = false;
    modeModifier = 1;

    centerX = 0;
    centerY = 0;
    
    junction = 0.5;

    constructor(memberA, relation)
    {
        this.memberA = memberA;
        this.relation = relation;

        this.type = 1;
    }

    draw(canvas, isSelected)
    {
        this.mode = 0;

        if(this.memberA.x != this.relation.centerX && this.memberA.y != this.relation.centerY)
        {
            this.mode = this.modeModifier % 2 + 1;
        }

        this.centerX = (this.memberA.x + this.relation.centerX) / 2;
        this.centerY = (this.memberA.y + this.relation.centerY) / 2;

        switch(this.mode)
        {
            //Straight line.
            case 0:
                if(isSelected) line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.relation.centerX + 50, this.relation.centerY + 75, "green", 35);
                line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.relation.centerX + 50, this.relation.centerY + 75, "black", 25);
                break;
            //Segmented line - vertical junction.
            case 1:
                this.centerX = (this.relation.centerX - this.memberA.x) * this.junction + this.memberA.x;
                var distX = (this.relation.centerX - this.memberA.x) * this.junction;
                if(isSelected)
                {
                    line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberA.x + distX + 50, this.memberA.y + 75, "green", 35);
                    line(canvas, this.memberA.x + distX + 50, this.memberA.y + 75, this.memberA.x + distX + 50, this.relation.centerY + 75, "green", 35);
                    line(canvas, this.memberA.x + distX + 50, this.relation.centerY + 75, this.relation.centerX + 50, this.relation.centerY + 75, "green", 35);
                }
                line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberA.x + distX + 50, this.memberA.y + 75, "black", 25);
                line(canvas, this.memberA.x + distX + 50, this.memberA.y + 75, this.memberA.x + distX + 50, this.relation.centerY + 75, "black", 25);
                line(canvas, this.memberA.x + distX + 50, this.relation.centerY + 75, this.relation.centerX + 50, this.relation.centerY + 75, "black", 25);
                break;
            //Segmented line - horizontal junction.
            case 2:
                this.centerY = (this.relation.centerY - this.memberA.y) * this.junction + this.memberA.y;
                var distY = (this.relation.centerY - this.memberA.y) * this.junction;
                if(isSelected)
                {
                    line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberA.x + 50, this.memberA.y + 75 + distY, "green", 35);
                    line(canvas, this.memberA.x + 50, this.memberA.y + 75 + distY, this.relation.centerX + 50, this.memberA.y + 75 + distY, "green", 35);
                    line(canvas, this.relation.centerX + 50, this.memberA.y + 75 + distY, this.relation.centerX + 50, this.relation.centerY + 75, "green", 35);
                }
                line(canvas, this.memberA.x + 50, this.memberA.y + 75, this.memberA.x + 50, this.memberA.y + 75 + distY, "black", 25);
                line(canvas, this.memberA.x + 50, this.memberA.y + 75 + distY, this.relation.centerX + 50, this.memberA.y + 75 + distY, "black", 25);
                line(canvas, this.relation.centerX + 50, this.memberA.y + 75 + distY, this.relation.centerX + 50, this.relation.centerY + 75, "black", 25);
                break;
        }
    }

    isHovering(mouseX, mouseY)
    {
        var x = (mouseX / scale) + cameraX;
        var y = (mouseY / scale) + cameraY;

        var minX = Math.min(this.memberA.x, this.relation.centerX);
        var maxX = Math.max(this.memberA.x, this.relation.centerX);
        var minY = Math.min(this.memberA.y, this.relation.centerY);
        var maxY = Math.max(this.memberA.y, this.relation.centerY);

        var minHorizontalIsA = minX == this.memberA.x;
        var minVerticalIsA = minY == this.memberA.y;

        switch(this.mode)
        {
            case 0: //Straight line.
                //Vertical
                if(this.memberA.x == this.relation.centerX)
                    return pointOnVertical(x, y, minY + 150, maxY, this.memberA.x + 50, 12.5);
                //Horizontal
                else return pointOnHorizontal(x, y, minX + 100, maxX, this.memberA.y + 75, 12.5);
                break;
            case 1: //Segmented line - vertical junction.
                return pointOnHorizontal(x, y, minX + 100, minX + (maxX - minX) * this.junction + 50, minHorizontalIsA ? this.memberA.y + 75 : this.relation.centerY + 75, 12.5)
                || this.isHoveringJunction(mouseX, mouseY)
                || pointOnHorizontal(x, y, minX + (maxX - minX) * this.junction + 50, maxX, minHorizontalIsA ? this.relation.centerY + 75 : this.memberA.y + 75, 12.5);
                break;
            case 2: //Segmented line - horizontal junction.
                return pointOnVertical(x, y, minY + 150, minY + (maxY - minY) * this.junction + 75, minVerticalIsA ? this.memberA.x + 50 : this.relation.centerX + 50, 12.5)
                || this.isHoveringJunction(mouseX, mouseY)
                || pointOnVertical(x, y, minY + (maxY - minY) * this.junction + 75, maxY, minVerticalIsA ? this.relation.centerX + 50 : this.memberA.x + 50, 12.5);
                break;
        }
        return false;
    }

    isHoveringJunction(mouseX, mouseY)
    {
        var x = (mouseX / scale) + cameraX;
        var y = (mouseY / scale) + cameraY;

        var minX = Math.min(this.memberA.x, this.relation.centerX);
        var maxX = Math.max(this.memberA.x, this.relation.centerX);
        var minY = Math.min(this.memberA.y, this.relation.centerY);
        var maxY = Math.max(this.memberA.y, this.relation.centerY);

        var minHorizontalIsA = minX == this.memberA.x;
        var minVerticalIsA = minY == this.memberA.y;

        switch(this.mode)
        {
            case 0:
                return false;
                break;
            case 1:
                return minHorizontalIsA ? pointOnVertical(x, y, minY + 75, maxY + 75, minX + (maxX - minX) * this.junction + 50, 12.5) : pointOnVertical(x, y, minY + 75, maxY + 75, minX + (maxX - minX) * (1 - this.junction) + 50, 12.5);
                break;
            case 2:
                return minVerticalIsA ? pointOnHorizontal(x, y, minX + 50, maxX + 50, minY + (maxY - minY) * this.junction + 75, 12.5) : pointOnHorizontal(x, y, minX + 50, maxX + 50, minY + (maxY - minY) * (1 - this.junction) + 75, 12.5);
                break;
        }

        return false;
    }

    update()
    {

    }
}