// Ac Hybl 12/09/20 for Fundamentals of Software Design
// this provides functionality

"use strict;"
const base = "http://localhost:3000/api/v1" // the base URL for the API
const fetchOptions = { method: "GET" } // for fetch
let options = window.location.href.split("?")[1] // passing info between pages
// define variables that I want accessible everywhere
let recipes, categories,category;

// universal functions
async function ring(route) {
    console.log(`Fetching ${route}`);
    let response = await fetch(base + route, fetchOptions);
    return await response.json();
}

function display(data, points) {
    for (let point of points) {
        let element = dq('#' + point); element.innerHTML = data[point]
    }
}

function btn(point, parent, isRecipe) {
    let b = dc("button"); b.innerHTML = point["name"]
    b.setAttribute("onclick", `redirect("category.html", ${point["id"]})`)
    parent.appendChild(b)
}

function flexbox(point, parent, isRecipe) { // works for recipes and categories
    let box = dc("div"); box.classList.add("flexbox")
    let title = dc("p"); title.innerHTML = isRecipe ? point["title"] : point["name"]
    let titlediv = dc("div"); titlediv.classList.add("titlediv"); titlediv.appendChild(title)
    let img = dc("img"); img.src = (isRecipe && point["imageURL"]) ? point["imageURL"] : "https://cobaltfitness.co.uk/wp-content/uploads/2020/06/ingredients-for-spring-vegetable-buddha-bowl-royalty-free-image-656873420-1558126238.jpg"; 
    box.append(titlediv, img)
    if (isRecipe) {
        let desc = dc("p"); desc.classList.add("description"); 
        desc.innerHTML = point["description"]; box.appendChild(desc)
        box.setAttribute("onclick", `redirect("recipe.html", ${point["id"]})`)
    }
    else {
        box.setAttribute("onclick", `redirect("category.html", ${point["id"]})`)
    }
    parent.appendChild(box)
}

function redirect(page, id) {
    sessionStorage.setItem("id", JSON.stringify(id))
    let URLlist = window.location.href.split("/")
    URLlist[URLlist.length -1] = page //+ "?id=" + id
    window.location.replace(URLlist.join("/"))
}

// pageload functions
async function loadGrid(content) {
    let response = await ring(`/${content}`)
    datapoints = response["data"]
    console.log (datapoints)
    for (let datapoint of datapoints) {
        flexbox(datapoint, dq(".grid"), content == "recipes")
    }
}

async function loadRecipe() {
    // get the data
    let id = JSON.parse(sessionStorage.getItem("id"))
    let response = await ring(`/recipes/${id}`)
    recipe = response["data"][0]
    categories = response["data"][1]
    console.log (recipe); console.log(categories)
    // display data 
    let points = ["title", "description", "timeinvest", "servings", "ingredients", 
        "instructions", "source", "created_at", "updated_at"]
    await setTimeout(function (){ // I wanna do this in a better way
        display(recipe, points)
        let image = dq("#imageURL"); image.src = (recipe["imageURL"] != "nil") ? recipe["imageURL"] : "https://cobaltfitness.co.uk/wp-content/uploads/2020/06/ingredients-for-spring-vegetable-buddha-bowl-royalty-free-image-656873420-1558126238.jpg";
        for (let category of categories) {
            btn(category, dq("#categories"), true)
        }
    }, 1000)
}

async function loadCategory() {
    // get the data
    let id = JSON.parse(sessionStorage.getItem("id"))
    let response = await ring(`/categories/${id}`)
    category = response["data"][0]
    recipes = response["data"][1]
    console.log (category); console.log(recipes)
    // display data 
    let points = ["name"]
    await setTimeout(function (){ // I wanna do this in a better way
        display(category, points)
        for (let recipe of recipes) {
            flexbox(recipe, dq(".grid"), true)
        }
    }, 1000)
}


// helpers
function dc(tag){return document.createElement(tag)}
function dq(selector){return document.querySelector(selector)}
