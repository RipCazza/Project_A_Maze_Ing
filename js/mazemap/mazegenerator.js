//--- MAZE GENERATOR----
//the cells of the maze
var cells = [];
var size = 20;
for (i = 0; i < size; i++)
{
    for (j = 0; j < size; j++)
        {
            cells.push(new cell(j,i));
        }
}

cells[((size*size)/2)].unvisited = false;
var route = [cells[((size*size)/2)]];
var currentcell = ((size*size)/2);
var steps = [-size, 1, size,-1];
var seed = 7359;
movedirection(currentcell);

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
                route.push(cells[newcurrentcellnr]);
                movedirection(newcurrentcellnr);
            }
            directions = RemoveElement(directions,direction);  
        }
        route.pop();
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