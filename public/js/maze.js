const WIDTH = 11
const HEIGHT = 11
const light_red =  "#ef233c";

const moves = [top_wall,left_wall,right_wall,bottom_wall];
const opposite_moves = [bottom_wall,right_wall,left_wall,top_wall];
const get_move_dir = [-WIDTH,-1,1,WIDTH]
const inverse_move = [3,2,1,0]

function set_grid()
{
    const maze_html = document.getElementById("maze");
    for (let i=0;i<HEIGHT;i++)
    {
        //init normal line
        const line_html = document.createElement("div")
        line_html.className="line_maze"
        line_html.id=`line_square${i}`
        for (let j=0;j<WIDTH;j++)
        {
            //init normal square
            const square = document.createElement("div")
            square.id = ""+(i*WIDTH+j)
            square.classList.add("square")
            line_html.appendChild(square)
        }
        maze_html.appendChild(line_html)
    }
}

function get_random(possibilities_number)
{
    return Math.floor(Math.random()*possibilities_number)
}

function top_wall(index)
{
    document.getElementById(index-WIDTH).style.borderBottomColor = light_red;
    document.getElementById(index).style.borderTopColor = light_red;
}
function bottom_wall(index)
{
    document.getElementById(index+WIDTH).style.borderTopColor = light_red;
    document.getElementById(index).style.borderBottomColor = light_red;

}
function left_wall(index)
{
    document.getElementById(index-1).style.borderRightColor = light_red;
    document.getElementById(index).style.borderLeftColor = light_red;
}
function right_wall(index)
{
    document.getElementById(index+1).style.borderLeftColor = light_red;
    document.getElementById(index).style.borderRightColor = light_red;
}


//get the possible moves for the maze generator
function get_moves(index, grid)
{
    if (index==0 || index==WIDTH-1 || index==WIDTH*(HEIGHT-1) || index==WIDTH*HEIGHT-1)
    {
        return 0;
    }
    //moves = 0000 in bin
    let all_moves = 0;
    //up
    console.log(index, grid)
    if (index >= WIDTH && grid[index-WIDTH]==undefined)
    {
        all_moves |= 1;
    }
    //left
    if (index%WIDTH!=0 && grid[index-1]==undefined)
    {
        all_moves |= 2;
    }
    //right
    if (index%WIDTH!=WIDTH-1 && grid[index+1]==undefined)
    {
        all_moves |= 4;
    }
    //down
    if (index < (HEIGHT-1)*WIDTH && grid[index+WIDTH]==undefined)
    {
        all_moves |= 8;
    }
    return all_moves;
}

//maze generator
function play_random_move(index, all_moves, grid)
{
    //get the random move
    let nb_moves = 0;
    for (let i=0;i<4;i++)
    {
        if (all_moves & 2**i)
        {
            nb_moves++;
        }
    }
    let move = get_random(nb_moves);

    //get the move
    nb_moves = 0;
    for (let i=0;i<4;i++)
    {
        if (all_moves & 2**i)
        {
            if (nb_moves==move)
            {
                move = i;
                break;
            }
            nb_moves++;
        }
    }

    //play the move on the html grid
    grid[index+get_move_dir[move]] = 0;
    moves[move](index)
    opposite_moves[move](index+get_move_dir[move])
    return move;
}

function change_color(index, color, grid){
    square = document.getElementById(index)
    square.style.backgroundColor = color;
    if (grid[index] & 1)square.style.borderTopColor=color;
    if (grid[index] & 2)square.style.borderLeftColor=color;
    if (grid[index] & 4)square.style.borderRightColor=color;
    if (grid[index] & 8)square.style.borderBottomColor=color;
}

//generate the maze html and js
async function maze_generator(index, grid, first=false)
{
    if (first)await sleep(1000);
    change_color(index, "blue", grid)
    let all_moves = get_moves(index, grid)
    let move;
    while (all_moves!=0)
    {
        move = play_random_move(index, all_moves, grid);
        await sleep(100);
        grid[index] |= 2**move;
        grid[index+get_move_dir[move]] |= 2**inverse_move[move]
        change_color(index, "green", grid)
        await maze_generator(index+get_move_dir[move], grid)
        change_color(index, "blue", grid)
        all_moves = get_moves(index, grid)
    }
    await sleep(100);
    change_color(index, "grey", grid)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

set_grid()

let grid = []
maze_generator(1, grid, true)