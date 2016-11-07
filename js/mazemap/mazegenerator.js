//--- MAZE GENERATOR----
//the cells of the maze
var cells = [];
var currentlvl;
var currentcell;
var steps;

// fills cells and activates movedirection
function GenerateMaze(seed, size, newlvl)
{
	for (i = 0; i < size; i++)
    {
        for (j = 0; j < size; j++)
        {
            cells.push(new cell(j,i));
            currentlvl = newlvl;
        }
    }
	
    cells[((size*size)/2)].unvisited = false;
    currentcell = ((size*size)/2);
    steps = [-size, 1, size,-1];

    movedirection(currentcell);
}

// Makes a route out of the cells
function movedirection(currentcellnr)
{
    // Directions ["noord","oost","zuid","west"]
    var directions = [0,1,2,3];
    for (var i = 0; i < 4; i++)
    {
        var direction = directions[Math.round(random() * (directions.length -1))];
        var newcurrentcellnr = currentcellnr + steps[direction];
            
        // Checks if not of out of range on y and x or already visited
        if (cells[newcurrentcellnr] != undefined && cells[newcurrentcellnr].unvisited && !((cells[currentcellnr].positionx % size == 0 && cells[newcurrentcellnr].positionx % size == (size -1)) || (cells[currentcellnr].positionx % size == (size -1) && cells[newcurrentcellnr].positionx % size == 0)))
        {
            if (direction < 2)
            {
                cells[newcurrentcellnr].walls[(direction +2)] = false;
            }
            else
            {
                cells[newcurrentcellnr].walls[(direction -2)] = false;
            }
            cells[currentcellnr].walls[direction] = false;
            cells[newcurrentcellnr].unvisited = false;
            movedirection(newcurrentcellnr);
        }
        directions = RemoveElement(directions,direction);  
    }
    // trap/power-up randomizer
    var traprandomizer = random();

    if (traprandomizer < 0.12 && !(currentcellnr == 0 || currentcellnr == (size - 1) || currentcellnr == (size * (size -1)) || currentcellnr == (size * size) -1))
    {
        // speed power-up
       if (traprandomizer < 0.02)
       {
           cells[currentcellnr].cellfunction = 1;
       }
        // time power-up
        else if ( traprandomizer >0.02 && traprandomizer <0.04)
        {
            cells[currentcellnr].cellfunction = 3; 
        }
        // slow trap
        else if (traprandomizer > 0.04 && traprandomizer < 0.08 && currentlvl != 3)
        {
           cells[currentcellnr].cellfunction = 2;
        }
        // dead trap
        else if (traprandomizer > 0.04 && traprandomizer < 0.08 && currentlvl == 3)
        {
            cells[currentcellnr].cellfunction = 4;
        }
        // tele trap/power-up
        else if (traprandomizer >0.08)
        {
            cells[currentcellnr].cellfunction = 5;
        }
    }
    return;
}

// Uses seed for predictable outcome
function random() 
{
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
    
    //Removes element from array
function RemoveElement(oldarray, nr)
{
    var k = [];
    for (var m = 0; m < oldarray.length; m++)
    {
        if (oldarray[m] != nr)
            {
                k.push(oldarray[m]);
            }
    }
    return k;
}	
