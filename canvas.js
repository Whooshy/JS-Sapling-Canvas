const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

var lmb = false;
var mouseX, mouseY;

var cameraX = 0;
var cameraY = 0;

var scale = 1;
var scalelevel = 0;

var gridSize = 40;

var moveUp = false;
var moveLeft = false;
var moveDown = false;
var moveRight = false;

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

    update()
    {
        if(this.isMoving)
        {
            if(this.offsetX == -1 && this.offsetY == -1)
            {
                this.offsetX = mouseX / scale + cameraX - this.x;
                this.offsetY = mouseY / scale + cameraY - this.y;
            }
            this.x = mouseX / scale + cameraX - this.offsetX;
            this.y = mouseY / scale + cameraY - this.offsetY;
        }
        else
        {
            this.offsetX = -1;
            this.offsetY = -1;
        }
    }
}

const members = [];

var test1 = new Member("Gaming Tim", 100, 100);
var test2 = new Member("Gaming John", 300, 100);

var buttonTest = new Button(50, 50, 100, 50, "Hello");
var sliderTest = new Slider(50, 125, 100, 5, 25, 25, 0.5);

members.push(test1);
members.push(test2);

var c = canvas.getContext('2d');

function mousePressed(event)
{
    lmb = true;
    
    x = event.clientX;
    y = event.clientY;

    for(i = 0; i < members.length; i++)
    {
        if(x > members[i].x * scale - cameraX * scale && x < members[i].x * scale + 100 * scale - cameraX * scale && y > members[i].y * scale - cameraY * scale && y < members[i].y * scale + 150 * scale - cameraY * scale)
        {
            members[i].isMoving = true;
        }
    }
}

function mouseReleased()
{
    lmb = false;
    for(i = 0; i < members.length; i++)
    {
        members[i].isMoving = false;
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
}

function pageScrolled(event)
{
    event.preventDefault();

    scalelevel -= event.deltaY * 0.01;
    scalelevel = Math.min(Math.max(scalelevel, -0.5), 2);

    scale = Math.pow(scalelevel + 1, -2);
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

    topLeftX = Math.floor(cameraX * scale / gridSize) * gridSize;
    topLeftY = Math.floor(cameraY * scale / gridSize) * gridSize;
    
    if(scalelevel < 1)
    {
        for(x = topLeftX; x < (cameraX + innerWidth + gridSize) / scale; x += gridSize)
        for(y = topLeftY; y < (cameraY + innerHeight + gridSize) / scale; y += gridSize)
        {
            c.fillStyle = '#bbbbbb';
            c.fillRect(x, y, gridSize, gridSize);
            c.fillStyle = '#ffffff';
            c.fillRect(x + 1, y + 1, gridSize - 1, gridSize - 1);
        }
    }

    //Drawing and updating each member.
    for(i = 0; i < members.length; i++)
    {
        members[i].draw(c);
        members[i].update();
    }

    c.translate(cameraX, cameraY);
    c.scale(1 / scale, 1 / scale);

    //Moving the camera.

    if(moveUp)
    {
        cameraY -= 5;
    }
    if(moveDown)
    {
        cameraY += 5;
    }
    if(moveLeft)
    {
        cameraX -= 5;
    }
    if(moveRight)
    {
        cameraX += 5;
    }

    buttonTest.draw(c);
    buttonTest.update(lmb, mouseX, mouseY);

    sliderTest.draw(c);
    sliderTest.update(lmb, mouseX, mouseY);
}

addEventListener('mousedown', mousePressed);
addEventListener('mouseup', mouseReleased);
addEventListener('mousemove', mouseMoved);

addEventListener('keydown', keyPressed);
addEventListener('keyup', keyReleased);

addEventListener('wheel', pageScrolled);

loop();