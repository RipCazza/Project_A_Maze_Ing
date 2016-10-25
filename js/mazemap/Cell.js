class cell
{   
    constructor(i,j)
    {
        this.positionx = i;
        this.positiony = j;
        this.unvisited = true;
        this.walls = [true,true,true,true];
    }
}