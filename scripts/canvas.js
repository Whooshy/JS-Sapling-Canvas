const canvas = document.querySelector('canvas');
canvas.height = innerHeight;
canvas.width = innerWidth;

//Canvas Related Variables
var topLeftX = 0;
var topLeftY = 0;
var bottomRightX = 0;
var bottomRightY = 0;
var gridAligning = true;
var gridSize = 50;
var BorderOffset = 5; 

//Camera Related Variables
var cameraX = 0;
var cameraY = 0;
var scale = 1;
var scalelevel = 0;

//Selection Variables
var relationSelected = -1;
var memberSelected = -1;

var memberRelationSelect = -1;
var relationRelationSelect = -1;

//Modes
var inputMode = 0;

//Input Variables
var mouseX = 0;
var mouseY = 0;

var lmb = false;

var movementDir = {
    "up" : false,
    "down" : false,
    "left" : false,
    "right" : false
}

const members = [];
const relations = [];

var c = canvas.getContext('2d');

createRelationButton = new Button(0, 0, 60, 40, "");

createRelationButton.colorIdle = "green";
createRelationButton.colorHover = "#139923";
createRelationButton.colorPressed = "#30ff60";

function addMember()
{
    inputMode = 1;
}

function mousePressed(event)
{
    x = event.clientX;
    y = event.clientY;

    memberSelected = -1;
    relationSelected = -1;

    if(event.button == 0) lmb = true;

    if(event.button == 0 && inputMode != 1)
    {
        for(i = 0; i < members.length; i++)
        {
            if(members[i].isHovering(x, y))
            {
                members[i].isMoving = true;
                memberSelected = i;
                if(inputMode == 2 && i != memberRelationSelect)
                {
                    relations.push(new RelationToM(members[memberRelationSelect], members[memberSelected]));
                    inputMode = 0;
                }
            }
        }
        for(i = 0; i < relations.length; i++)
        {
            if(relations[i].isHovering(x, y))
            {
                relationSelected = i;
                if(inputMode == 2)
                {
                    relations.push(new RelationToR(members[memberRelationSelect], relations[relationSelected]));
                    inputMode = 0;
                }
            }
        }
    }
    else if(event.button == 0 && inputMode == 1)
    {
        members.push(new Member("", Math.floor((x / scale + cameraX - 33) / gridSize) * gridSize, Math.floor((y / scale + cameraY - 50) / gridSize) * gridSize));
        inputMode = 0;
    }

    if(event.button == 2 && inputMode == 2)
    {
        inputMode = 0;
    }
}

function mouseMoved(event)
{
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function mouseReleased(event)
{
    if(event.button == 0)
    {
        lmb = false;

        for(i = 0; i < members.length; i++)
        {
            members[i].isMoving = false;
        }
    }
}

//Handler for key pressing events.
function keyPressed(event)
{
    key = event.key;

    if(key == 'w')
    {
        movementDir.up = true;
        moveUp = true;
    }
    if(key == 'a')
    {
        movementDir.left = true;
        moveLeft = true;
    }
    if(key == 's')
    {
        movementDir.down = true;
        moveDown = true;
    }
    if(key == 'd')
    {
        movementDir.right = true;
        moveRight = true;
    }
    if(key == 'n')
    {
        inputMode = 1;
    }
    if(key == ',' && relationSelected != -1)
    {
        if(relations[relationSelected].modeModifier == 0) relations[relationSelected].modeModifier = 1;
        else if(relations[relationSelected].modeModifier == 1) relations[relationSelected].modeModifier = 0;
    }
    if(key == "Delete")
    {
        if(memberSelected != -1)
        {
            for(i = 0; i < relations.length; i++)
            {
                if(relations[i].memberA == members[memberSelected] || relations[i].memberB == members[memberSelected])
                {
                    relations.splice(i, 1);
                }
            }
            members.splice(memberSelected, 1);
            memberSelected = -1;
        }
        if(relationSelected != -1)
        {
            relations.splice(relationSelected, 1);
            relationSelected = -1;
        }
    }
    if(event.shiftKey)
    {
        gridAligning = false;
    }
}

//Handler for key releasing events.
function keyReleased(event)
{
    key = event.key;
    movementDir.up = !(key == 'w') & movementDir.up;
    movementDir.down = !(key == 's') & movementDir.down;
    movementDir.left = !(key == 'a') & movementDir.left;
    movementDir.right = !(key == 'd') & movementDir.right;

    gridAligning = true;
}

function pageScrolled(event)
{
    width = innerWidth / scale;
    height = innerHeight / scale;

    scalelevel += event.deltaY * 0.001;
    scalelevel = Math.min(Math.max(scalelevel, -0.5), 2);

    scale = Math.pow(scalelevel + 1, -2);

    width -= innerWidth / scale;
    height -= innerHeight / scale;

    cameraX += width / 2;
    cameraY += height / 2;
}

function updateCamera()
{
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

    //Moving the camera.
    if(movementDir.up)
    {
        cameraY -= 5 / scale;
    }
    if(movementDir.down)
    {
        cameraY += 5 / scale;
    }
    if(movementDir.left)
    {
        cameraX -= 5 / scale;
    }
    if(movementDir.right)
    {
        cameraX += 5 / scale;
    }
}

function loop()
{
    requestAnimationFrame(loop);
    updateCamera();
    
    drawGrid();

    //Placing a member.
    if(inputMode == 1)
    {
        fillRoundedRect(c, Math.floor((mouseX / scale + cameraX - 33) / gridSize) * gridSize, Math.floor((mouseY / scale + cameraY - 50) / gridSize) * gridSize, 100, 150, '#c0c0c0', 20);
    }

    //Placing a relation.
    if(inputMode == 2)
    {
        line(c, members[memberRelationSelect].x + 50, members[memberRelationSelect].y + 75, (mouseX / scale) + cameraX, (mouseY / scale) + cameraY, "#999999", 25);
    }

    //Drawing and each relation.
    for(i = 0; i < relations.length; i++)
    {
        relations[i].selected = (i == relationSelected);
        relations[i].draw(c, relationSelected == i);
    }
    //Drawing and updating each member.
    for(i = 0; i < members.length; i++)
    {
        members[i].selected = (i == memberSelected);
        members[i].update();
        members[i].draw(c);
    }

    if(memberSelected != -1 && members[memberSelected].pickedRelationCreation(lmb, mouseX, mouseY))
    {
        memberRelationSelect = memberSelected;
        memberSelected = -1;
        relationSelected = -1;
        inputMode = 2;
    }

    c.translate(cameraX, cameraY);
    c.scale(1 / scale, 1 / scale);
}

function drawGrid()
{
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
}

addEventListener('mousedown', mousePressed);
addEventListener('mouseup', mouseReleased);
addEventListener('mousemove', mouseMoved);

addEventListener('keydown', keyPressed);
addEventListener('keyup', keyReleased);
addEventListener('wheel', pageScrolled);

loop();