//--- MAZE GENERATOR----
//the cells of the maze
var cells = [];

function GenerateMaze(seed, size)
{
	for (i = 0; i < size; i++)
{
    for (j = 0; j < size; j++)
        {
            cells.push(new cell(j,i));
        }
}
	
	cells[((size*size)/2)].unvisited = false;
var currentcell = ((size*size)/2);
var steps = [-size, 1, size,-1];

var temcounter = 0;
var tempcounter = 0;
movedirection(currentcell);
	
console.log ("goodthing: "  + temcounter);
console.log ("badthing: "  + tempcounter);

for (var x = 0; x < (size*size); x++)
    {
        if (cells[x].cellfunction)
            {
                console.log("cell: " + x);
            }
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
    if (traprandomizer < 0.20)
    {
       if (traprandomizer < 0.05)
       {
            temcounter++;
           cells[currentcellnr].cellfunction = 1;
       }

        else if (traprandomizer > 0.05 && traprandomizer < 0.10)
        {
            tempcounter++;
           cells[currentcellnr].cellfunction = 2;
        }
        else if ( traprandomizer >0.10 && traprandomizer <0.15){
            temcounter++;
            cells[currentcellnr].cellfunction = 3; 
        }
        else if (traprandomizer >0.15){
            temcounter++;
            cells[currentcellnr].cellfunction = 4;
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
	
}


