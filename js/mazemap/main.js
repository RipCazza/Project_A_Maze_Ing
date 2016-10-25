var cells = [];
for (i = 0; i < 10; i++)
{
    for (j = 0; j < 10; j++)
        {
            cells.push(new cell(i,j));
        }
}

cells[5].univisted = false;
var route = [cells[5]];
var currentcell = 0;
var steps = [-10, 1, 10,-1];
var seed = 7359;
var directionsstrings = ["noord","oost","zuid","west"];
movedirection(currentcell,0);

for (var x = 0; x < cells.length; x++)
{
    if (cells[x].unvisited != true)
    {
        console.log(cells[x].unvisited);
    }
}


function movedirection(currentcellnr, currentroutenr)
{
    var directions = [0,1,2,3];
    for (var i = 0; i < 4; i++)
        {
            var direction = directions[Math.round(random() * (directions.length -1))];
            var newcurrentcellnr = currentcellnr + steps[direction];
            
            if (cells[newcurrentcellnr] != undefined && cells[newcurrentcellnr].unvisited && !((cells[currentcellnr].positionx % 10 == 0 && cells[newcurrentcellnr].positionx == 9) || (cells[currentcellnr].positionx % 10 == 9 && cells[newcurrentcellnr].positionx == 0)))
            {
                console.log(currentcellnr + " " + directionsstrings[direction]);
                var newcurrentroutenr = currentroutenr + 1;
                if (direction < 2)
                    {
                        cells[newcurrentcellnr].walls[(direction +2)] = false;
                    }
                else
                    {
                        cells[newcurrentcellnr].walls[(direction -2)] = false;
                    }
                cells[currentcellnr].walls[(direction)] = false;
                cells[newcurrentcellnr].unvisited = false;
                route.push(cells[newcurrentcellnr]);
                console.log(newcurrentcellnr);
                movedirection(newcurrentcellnr, newcurrentroutenr);
            }
            directions = RemoveElement(directions,direction);  
        }
        route.pop();
        console.log("NOPE! TERUG!");
        return;
}

function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


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