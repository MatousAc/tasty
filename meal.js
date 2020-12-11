// functionality for the builf a meal page

// defining globals
let selected_categories = []; let meal = []

// page load
async function loadForm(content) {
    let response = await ring(`/${content}`)
    let categories = response["data"]
    console.log("Categories", categories)
    for (let category of categories) {
        btn(category, dq("#categories"), false, "add")
    }
    dq("#categories").innerHTML += `<button class="build" onclick="build();">Build New Meal</button>`
}

// adding/removing categories to the selected list
function add(id, button) {
    selected_categories.push(id)
    button.classList = "added"; button.setAttribute("onclick", `remove(${id}, this)`)
}
function remove(id, button) {
    let index = selected_categories.indexOf(id);
    selected_categories.splice(index, 1)
    button.classList = "add"; button.setAttribute("onclick", `add(${id}, this)`)
}

// building and displaying
async function build() {
    meal = []
    for (let category_id of selected_categories) {
        let response = await ring(`/categories/${category_id}`)
        let recipes = response["data"][1]
        console.log("Recipes", recipes, "Length", recipes.length)
        let recipe = recipes[getRandomInt(0, recipes.length)]
        console.log("Recipe", recipe)
        meal.push(recipe)
    }
    updateSession()
    displayMeal()
}
async function displayMeal() {
    console.log("Time to display!")
    let meal_temp = JSON.parse(sessionStorage.getItem("meal"))
    if (meal_temp == null)
        return
    meal = meal_temp
    console.log(meal)
    await wait_on_load()
    let grid = dq(".grid")
    grid.innerHTML = ''
    for (let recipe of meal) {
        flexbox(recipe, grid, true)
    }
}

// session storage
function updateSession() {
    sessionStorage.setItem("meal", JSON.stringify(meal))
}