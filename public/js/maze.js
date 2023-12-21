const WIDTH = 50
const HEIGHT = 50
const light_red =  "#ef233c";
let destination = Math.floor(Math.random()*2500);
let start = Math.floor(Math.random()*2500);
let grid = []

const moves = [top_wall,left_wall,right_wall,bottom_wall];
const opposite_moves = [bottom_wall,right_wall,left_wall,top_wall];
const get_move_dir = [-WIDTH,-1,1,WIDTH]
const inverse_move = [3,2,1,0]

function set_grid(id)
{
    const maze_html = document.getElementById(id);
    for (let i=0;i<HEIGHT;i++)
    {
        //init normal line
        const line_html = document.createElement("div")
        line_html.className="line_maze"
        line_html.classList.add(`line_square${i}`);
        for (let j=0;j<WIDTH;j++)
        {
            //init normal square
            const square = document.createElement("div");
            square.classList.add(""+(i*WIDTH+j));
            square.classList.add("square");
            line_html.appendChild(square);
        }
        maze_html.appendChild(line_html);
    }
}

function get_random(possibilities_number)
{
    return Math.floor(Math.random()*possibilities_number)
}

function top_wall(index, html_grid)
{
    html_grid.getElementsByClassName(index-WIDTH)[0].style.borderBottomColor = light_red;
    html_grid.getElementsByClassName(index)[0].style.borderTopColor = light_red;
}
function bottom_wall(index, html_grid)
{
    html_grid.getElementsByClassName(index+WIDTH)[0].style.borderTopColor = light_red;
    html_grid.getElementsByClassName(index)[0].style.borderBottomColor = light_red;

}
function left_wall(index, html_grid)
{
    html_grid.getElementsByClassName(index-1)[0].style.borderRightColor = light_red;
    html_grid.getElementsByClassName(index)[0].style.borderLeftColor = light_red;
}
function right_wall(index, html_grid)
{
    html_grid.getElementsByClassName(index+1)[0].style.borderLeftColor = light_red;
    html_grid.getElementsByClassName(index)[0].style.borderRightColor = light_red;
}


//get the possible moves for the maze generator
function get_moves(index, grid)
{
    //moves = 0000 in bin
    let all_moves = 0;
    //up
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
function play_random_move(index, all_moves, grid, html_grids)
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
    for (let i=0;i<html_grids.length;i++)moves[move](index, html_grids[i]);
    for (let i=0;i<html_grids.length;i++)opposite_moves[move](index+get_move_dir[move], html_grids[i]);
    return move;
}

function change_color(index, color, grid, html_grid){
    square = html_grid.getElementsByClassName(index)[0]
    if (square.style.backgroundColor==="black" || square.style.backgroundColor==="white")return;
    square.style.backgroundColor = color;
    if (grid[index] & 1)square.style.borderTopColor=color;
    if (grid[index] & 2)square.style.borderLeftColor=color;
    if (grid[index] & 4)square.style.borderRightColor=color;
    if (grid[index] & 8)square.style.borderBottomColor=color;
}

//generate the maze html and js
async function maze_generator(index, grid, html_grids, first=false)
{
    //if (first)await sleep(1);
    for (let i=0;i<html_grids.length;i++)change_color(index, "blue", grid, html_grids[i])
    let all_moves = get_moves(index, grid)
    let move;
    while (all_moves!=0)
    {
        move = play_random_move(index, all_moves, grid, html_grids);
        //await sleep(50);
        grid[index] |= 2**move;
        grid[index+get_move_dir[move]] |= 2**inverse_move[move]
        for (let i=0;i<html_grids.length;i++)change_color(index, "green", grid, html_grids[i])
        await maze_generator(index+get_move_dir[move], grid, html_grids)
        for (let i=0;i<html_grids.length;i++)change_color(index, "blue", grid, html_grids[i])
        all_moves = get_moves(index, grid)
    }
    //await sleep(50);
    for (let i=0;i<html_grids.length;i++)change_color(index, "grey", grid, html_grids[i])
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function is_possible_move(grid, index, move){
    switch (move){
        case "up":
            return grid[index] & 1;
        case "left":
            return grid[index] & 2;
        case "right":
            return grid[index] & 4;
        case "down":
            return grid[index] & 8;
    }
}

async function dfs(grid, html_grid, start, end){
    let explored_nodes = [];
    let nun_explored_nodes = [start];
    let backtrack = [];
    let node = start;
    while (nun_explored_nodes.length>0){
        await sleep(5);
        change_color(node, "purple", grid, html_grid)
        node = nun_explored_nodes.splice(nun_explored_nodes.length-1,1)[0];
        explored_nodes.push(node)
        change_color(node, "blue", grid, html_grid)
        update(explored_nodes.length, ["explored_dfs", "path_dfs"])

        if (node===end)break;
        //up
        if (is_possible_move(grid, node, "up") && !nun_explored_nodes.includes(node-WIDTH) && !explored_nodes.includes(node-WIDTH)){
            nun_explored_nodes.push(node-WIDTH)
            backtrack[node-WIDTH] = node;
            change_color(node-WIDTH, "yellow", grid, html_grid)
        }
        //left
        if (is_possible_move(grid, node, "left") && !nun_explored_nodes.includes(node-1) && !explored_nodes.includes(node-1)){
            nun_explored_nodes.push(node-1)
            backtrack[node-1] = node;
            change_color(node-1, "yellow", grid, html_grid)
        }
        //right
        if (is_possible_move(grid, node, "right") && !nun_explored_nodes.includes(node+1) && !explored_nodes.includes(node+1)){
            nun_explored_nodes.push(node+1)
            backtrack[node+1] = node;
            change_color(node+1, "yellow", grid, html_grid)
        }
        //bottom
        if (is_possible_move(grid, node, "down") && !nun_explored_nodes.includes(node+WIDTH) && !explored_nodes.includes(node+WIDTH)){
            nun_explored_nodes.push(node+WIDTH)
            backtrack[node+WIDTH] = node;
            change_color(node+WIDTH, "yellow", grid, html_grid)
        }
    }
    let counter = 1;
    while (node!==start && node!==undefined){
        counter++;
        update(explored_nodes.length, ["explored_dfs", "path_dfs"], counter)
        await sleep(5);
        change_color(node, "green", grid, html_grid)
        node = backtrack[node];
    }
    change_color(node, "green", grid, html_grid)
}

async function bfs(grid, html_grid, start, end){
    let explored_nodes = [];
    let nun_explored_nodes = [start];
    let backtrack = [];
    let node = start;
    while (nun_explored_nodes.length>0){
        await sleep(5);
        change_color(node, "purple", grid, html_grid)
        node = nun_explored_nodes.splice(0,1)[0];
        explored_nodes.push(node)
        change_color(node, "blue", grid, html_grid)
        update(explored_nodes.length, ["explored_bfs", "path_bfs"])

        if (node===end)break;
        //up
        if (is_possible_move(grid, node, "up") && !nun_explored_nodes.includes(node-WIDTH) && !explored_nodes.includes(node-WIDTH)){
            nun_explored_nodes.push(node-WIDTH)
            backtrack[node-WIDTH] = node;
            change_color(node-WIDTH, "yellow", grid, html_grid)
        }
        //left
        if (is_possible_move(grid, node, "left") && !nun_explored_nodes.includes(node-1) && !explored_nodes.includes(node-1)){
            nun_explored_nodes.push(node-1)
            backtrack[node-1] = node;
            change_color(node-1, "yellow", grid, html_grid)
        }
        //right
        if (is_possible_move(grid, node, "right") && !nun_explored_nodes.includes(node+1) && !explored_nodes.includes(node+1)){
            nun_explored_nodes.push(node+1)
            backtrack[node+1] = node;
            change_color(node+1, "yellow", grid, html_grid)
        }
        //bottom
        if (is_possible_move(grid, node, "down") && !nun_explored_nodes.includes(node+WIDTH) && !explored_nodes.includes(node+WIDTH)){
            nun_explored_nodes.push(node+WIDTH)
            backtrack[node+WIDTH] = node;
            change_color(node+WIDTH, "yellow", grid, html_grid)
        }
    }
    let counter = 1;
    while (node!==start && node!==undefined){
        counter++;
        update(explored_nodes.length, ["explored_bfs", "path_bfs"], counter);
        await sleep(5);
        change_color(node, "green", grid, html_grid)
        node = backtrack[node];
    }
    change_color(node, "green", grid, html_grid);
}

function heuristic_insert(node, nun_explored_nodes){
    for (let i=0;i<nun_explored_nodes.length;i++){
        if (node["heuristic"]<nun_explored_nodes[i]["heuristic"]){
            nun_explored_nodes.splice(i, 0, node)
            return;
        }
    }
    nun_explored_nodes.push(node);
}

async function astar(grid, html_grid, start, end){
    let explored_nodes = [];
    let nun_explored_nodes = [{"index":start,"len_path":0,"heuristic":0}];
    let backtrack = [];
    let node = start;
    let node_i = start;
    while (nun_explored_nodes.length>0){
        await sleep(5);
        change_color(node_i, "purple", grid, html_grid)
        node = nun_explored_nodes.splice(0,1)[0];
        node_i = node["index"]
        explored_nodes.push(node_i)
        change_color(node_i, "blue", grid, html_grid)
        update(explored_nodes.length, ["explored_astar", "path_astar"])

        if (node_i===end)break;
        //up
        if (is_possible_move(grid, node_i, "up") && !nun_explored_nodes.includes(node_i-WIDTH) && !explored_nodes.includes(node_i-WIDTH)){
            heuristic_insert({"index":node_i-WIDTH,"len_path":node["len_path"]+1, "heuristic":node["len_path"]+1+get_distance(end%WIDTH,(node_i-WIDTH)%WIDTH, Math.floor(end/WIDTH), Math.floor((node_i-WIDTH)/WIDTH))}, nun_explored_nodes)
            //nun_explored_nodes.push(node-WIDTH)
            backtrack[node_i-WIDTH] = node_i;
            change_color(node_i-WIDTH, "yellow", grid, html_grid)
        }
        //left
        if (is_possible_move(grid, node_i, "left") && !nun_explored_nodes.includes(node_i-1) && !explored_nodes.includes(node_i-1)){
            heuristic_insert({"index":node_i-1,"len_path":node["len_path"]+1, "heuristic":node["len_path"]+1+get_distance(end%WIDTH,(node_i-1)%WIDTH, Math.floor(end/WIDTH), Math.floor((node_i-1)/WIDTH))}, nun_explored_nodes)
            //nun_explored_nodes.push(node-1)
            backtrack[node_i-1] = node_i;
            change_color(node_i-1, "yellow", grid, html_grid)
        }
        //right
        if (is_possible_move(grid, node_i, "right") && !nun_explored_nodes.includes(node_i+1) && !explored_nodes.includes(node_i+1)){
            heuristic_insert({"index":node_i+1,"len_path":node["len_path"]+1, "heuristic":node["len_path"]+1+get_distance(end%WIDTH,(node_i+1)%WIDTH, Math.floor(end/WIDTH), Math.floor((node_i+1)/WIDTH))}, nun_explored_nodes)
            //nun_explored_nodes.push(node+1)
            backtrack[node_i+1] = node_i;
            change_color(node_i+1, "yellow", grid, html_grid)
        }
        //bottom
        if (is_possible_move(grid, node_i, "down") && !nun_explored_nodes.includes(node_i+WIDTH) && !explored_nodes.includes(node_i+WIDTH)){
            heuristic_insert({"index":node_i+WIDTH,"len_path":node["len_path"]+1, "heuristic":node["len_path"]+1+get_distance(end%WIDTH,(node_i+WIDTH)%WIDTH, Math.floor(end/WIDTH), Math.floor((node_i+WIDTH)/WIDTH))}, nun_explored_nodes)
            //nun_explored_nodes.push(node+WIDTH)
            backtrack[node_i+WIDTH] = node_i;
            change_color(node_i+WIDTH, "yellow", grid, html_grid)
        }
    }
    let counter = 1;
    while (node_i!==start && node_i!==undefined){
        counter++;
        update(explored_nodes.length, ["explored_astar", "path_astar"], counter)
        await sleep(5);
        change_color(node_i, "green", grid, html_grid)
        node_i = backtrack[node_i];
    }
    change_color(node_i, "green", grid, html_grid)
}

function get_distance(x1, x2, y1, y2){
    let x = x1-x2;
    let y = y1-y2;
    return Math.sqrt(x*x + y*y);
}

function update(score, ids, path){
    document.getElementById(ids[0]).innerHTML = score;
    if (path)document.getElementById(ids[1]).innerHTML = path;
}

async function reset_grid(html_grids){
    for (let i=0;i<html_grids.length;i++){
        html_grids[i].innerHTML = "";
    }
    await sleep(1);
    await main(html_grids)
    update("N", ["explored_astar", "path_astar"], "N");
    update("N", ["explored_bfs", "path_bfs"], "N");
    update("N", ["explored_dfs", "path_dfs"], "N");
}

async function main(html_grids){
    grid = [];
    destination = Math.floor(Math.random()*2500);
    start = Math.floor(Math.random()*2500);
    set_grid("dfs")
    set_grid("bfs")
    set_grid("astar")
    await maze_generator(Math.floor(Math.random()*100), grid, html_grids, true)
    for (let i=0;i<html_grids.length;i++)change_color(start, "white", grid, html_grids[i])
    for (let i=0;i<html_grids.length;i++)change_color(destination, "black", grid, html_grids[i])
}
let html_grids = [document.getElementById("dfs"), document.getElementById("bfs"), document.getElementById("astar")]
main(html_grids)