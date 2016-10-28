class cell
{   
    constructor(i,j)
    {
        this.positionx = i;
        this.positiony = j;
        // alleen voor generator
        this.unvisited = true;
        // walldirections ["noord","oost","zuid","west"]
        this.walls = [true,true,true,true];
        this.cellfunction = 0;
    }
}