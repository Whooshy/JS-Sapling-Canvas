const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

var lmb = false;
var rmb = false;

var lmbClicked = false;
var rmbClicked = false;

var inputMode = 0;
var selectedTextField = -1;

var mouseX, mouseY;

var cameraX = 0;
var cameraY = 0;

var scale = 1;
var scalelevel = 0;

var memberSelected = -1;
var relationSelected = -1;

var gridSize = 50;

var moveUp = false;
var moveLeft = false;
var moveDown = false;
var moveRight = false;

var gridAligning = true;

class Member
{
    offsetX = -1;
    offsetY = -1;
    
    isMoving = false;

    constructor(name, x, y)
    {
        this.name = name;
        this.x = x;
        this.y = y;
    }

    draw(canvas)
    {
        fillRoundedRect(canvas, this.x, this.y, 100, 150, '#202020', 20);
    }

    isHovering(mouseX, mouseY)
    {
        if(mouseX > (this.x - cameraX) * scale && mouseX < (this.x + 100 - cameraX) * scale && mouseY > (this.y - cameraY) * scale && mouseY < (this.y + 150 - cameraY) * scale)
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
}

const members = [];

const sliders = [];
const text_fields = [];

sliders.push(new Slider(innerWidth - 200, 270, 100, 5, 10, 10, 0));
sliders.push(new Slider(innerWidth - 200, 295, 100, 5, 10, 10, 0));
sliders.push(new Slider(innerWidth - 200, 320, 100, 5, 10, 10, 0));

text_fields.push(new TextField(innerWidth - 290, 90, 280, 25));

text_fields.push(new TextField(innerWidth - 180, 135, 40, 20));
text_fields.push(new TextField(innerWidth - 130, 135, 40, 20));
text_fields.push(new TextField(innerWidth - 80, 135, 60, 20));

text_fields.push(new TextField(innerWidth - 180, 160, 40, 20));
text_fields.push(new TextField(innerWidth - 130, 160, 40, 20));
text_fields.push(new TextField(innerWidth - 80, 160, 60, 20));

text_fields.push(new TextField(innerWidth - 210, 206, 200, 25));

var test1 = new Member("Gaming Tim", 100, 100);
var test2 = new Member("Gaming John", 300, 100);

var buttonTest = new Button(50, 50, 100, 50, "Hello");
var sliderTest = new Slider(50, 125, 100, 5, 25, 25, 0.5);

members.push(test1);
members.push(test2);

var c = canvas.getContext('2d');

function mousePressed(event)
{
    if(event.button == 0) lmb = true;
    if(event.button == 2) rmb = true;
    
    x = event.clientX;
    y = event.clientY;

    if(lmb)
    {
        for(i = 0; i < members.length; i++)
        {
            if(members[i].isHovering(x, y))
            {
                members[i].isMoving = true;
            }
        }
    }
}

function mouseReleased(event)
{
    if(event.button == 0)
    {
        lmb = false;
        lmbClicked = true;
    }
    if(event.button == 2)
    {
        rmb = false;
        rmbClicked = true;
    }

    if(event.button == 0)
    {
        for(i = 0; i < members.length; i++)
        {
            members[i].isMoving = false;
        }
    }
}

function mouseMoved(event)
{
    mouseX = event.clientX;
    mouseY = event.clientY;
}

//Handler for key pressing events.
function keyPressed(event)
{
    if(inputMode == 0)
    {
        key = event.key;
        if(key == 'w')
        {
            moveUp = true;
        }
        if(key == 'a')
        {
            moveLeft = true;
        }
        if(key == 's')
        {
            moveDown = true;
        }
        if(key == 'd')
        {
            moveRight = true;
        }
    
        if(event.shiftKey)
        {
            gridAligning = false;
        }
    }
    else if(inputMode == 1)
    {
        key = event.key;
        if(key == "Backspace" && text_fields[selectedTextField].text.length > 0)
        {
            text_fields[selectedTextField].text =
                text_fields[selectedTextField].text.toString().substring(0, text_fields[selectedTextField].text.length - 1);
        }
        switch(key)
        {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case 'a':
            case 'b':
            case 'c':
            case 'd':
            case 'e':
            case 'f':
            case 'g':
            case 'h':
            case 'i':
            case 'j':
            case 'k':
            case 'l':
            case 'm':
            case 'n':
            case 'o':
            case 'p':
            case 'q':
            case 'r':
            case 's':
            case 't':
            case 'u':
            case 'v':
            case 'w':
            case 'x':
            case 'y':
            case 'z':
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'E':
            case 'F':
            case 'G':
            case 'H':
            case 'I':
            case 'J':
            case 'K':
            case 'L':
            case 'M':
            case 'N':
            case 'O':
            case 'P':
            case 'Q':
            case 'R':
            case 'S':
            case 'T':
            case 'U':
            case 'V':
            case 'W':
            case 'X':
            case 'Y':
            case 'Z':
            case ' ':
                text_fields[selectedTextField].text += key;
                break;
        }
    }
}

//Handler for key releasing events.
function keyReleased(event)
{
    key = event.key;
    if(key == 'w')
    {
        moveUp = false;
    }
    if(key == 'a')
    {
        moveLeft = false;
    }
    if(key == 's')
    {
        moveDown = false;
    }
    if(key == 'd')
    {
        moveRight = false;
    }

    gridAligning = true;
}

function pageScrolled(event)
{
    event.preventDefault();

    width = innerWidth / scale;
    height = innerHeight / scale;

    scalelevel += event.deltaY * 0.001;
    scalelevel = Math.min(Math.max(scalelevel, -0.5), 2);

    console.log(scalelevel);

    scale = Math.pow(scalelevel + 1, -2);

    width -= innerWidth / scale;
    height -= innerHeight / scale;

    cameraX += width / 2;
    cameraY += height / 2;
}

function loop()
{
    requestAnimationFrame(loop);

    //Canvas is resized each frame to cover the whole screen.
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    //Filling the background with a white quad to avoid overdrawing.
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, innerWidth, innerHeight);

    //Camera translation
    c.scale(scale, scale);
    c.translate(-cameraX, -cameraY);

    //Drawing the grid

    topLeftX = Math.floor(cameraX / gridSize) * gridSize;
    topLeftY = Math.floor(cameraY / gridSize) * gridSize;

    bottomRightX = Math.floor((cameraX + innerWidth / scale) / gridSize) * gridSize;
    bottomRightY = Math.floor((cameraY + innerHeight / scale) / gridSize) * gridSize;
    
    if(scalelevel < 1.5 && gridAligning)
    {
        for(x = topLeftX; x <= bottomRightX; x += gridSize)
        for(y = topLeftY; y <= bottomRightY; y += gridSize)
        {
            c.fillStyle = '#bbbbbb';
            c.fillRect(x, y, gridSize, gridSize);
            c.fillStyle = '#ffffff';
            c.fillRect(x + 1, y + 1, gridSize - 1, gridSize - 1);
        }
    }

    //Drawing the selection outlines
    if(memberSelected != -1)
    {
        fillRoundedRect(c, members[memberSelected].x - 5, members[memberSelected].y - 5, 110, 160, "#109933", 25);
        fillRoundedRect(c, members[memberSelected].x - 2, members[memberSelected].y - 2, 104, 154, "#ffffff", 22);
    }

    //Drawing and updating each member.
    for(i = 0; i < members.length; i++)
    {
        if(lmbClicked && members[i].isHovering(mouseX, mouseY))
        {
            memberSelected = i;
        }
        members[i].draw(c);
        members[i].update();
    }

    c.translate(cameraX, cameraY);
    c.scale(1 / scale, 1 / scale);

    //Moving the camera.

    if(moveUp)
    {
        cameraY -= 5 / scale;
    }
    if(moveDown)
    {
        cameraY += 5 / scale;
    }
    if(moveLeft)
    {
        cameraX -= 5 / scale;
    }
    if(moveRight)
    {
        cameraX += 5 / scale;
    }

    if(memberSelected != -1)
    {
        c.fillStyle = '#202020';
        c.fillRect(innerWidth - 300, 0, 300, innerHeight);

        c.fillStyle = '#ffffff';
        c.font = '30px sans-serif';
        c.fillText("Edit Member", innerWidth - 290, 30, 1000);

        c.font = '15px sans-serif';
        c.fillText("Name:", innerWidth - 290, 80, 1000);
        c.fillText("Date of Birth:", innerWidth - 290, 150, 1000);
        c.fillText("Date of Death:", innerWidth - 290, 175, 1000);
        c.fillText("Birthplace:", innerWidth - 290, 225, 1000);
        c.fillText("Color:", innerWidth - 290, 275, 1000);

        selectedTextField = -1;
        for(i = 0; i < text_fields.length; i++)
        {
            text_fields[i].draw(c, false);
            text_fields[i].update(lmbClicked, mouseX, mouseY);
            if(text_fields[i].selected)
            {
                selectedTextField = i;
            }
        }
        for(i = 0; i < sliders.length; i++)
        {
            sliders[i].draw(c);
            sliders[i].update(lmb, mouseX, mouseY);
        }
    }

    if(selectedTextField != -1)
    {
        inputMode = 1;
    }
    else
    {
        inputMode = 0;
    }

    buttonTest.draw(c);
    buttonTest.update(lmb, mouseX, mouseY);

    sliderTest.draw(c);
    sliderTest.update(lmb, mouseX, mouseY);

    if(lmbClicked) lmbClicked = false;
    if(rmbClicked) rmbClicked = false;
}

addEventListener('mousedown', mousePressed);
addEventListener('mouseup', mouseReleased);
addEventListener('mousemove', mouseMoved);

addEventListener('keydown', keyPressed);
addEventListener('keyup', keyReleased);

addEventListener('wheel', pageScrolled);

loop();