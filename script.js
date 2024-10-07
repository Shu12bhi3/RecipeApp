const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipes-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

const fetchRecipes = async (query) =>{
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>"
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const response = await data.json();
    //console.log(response);
    recipeContainer.innerHTML = "";
    response.meals.forEach(meals => {
        const recipeDiv = document.createElement('div')
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
        <img src=${meals.strMealThumb}>
        <h3>${meals.strMeal}</h3>
        <p><span>${meals.strArea}</span> Dish</p>
        <p>Belongs to <span>${meals.strCategory}</span> Category</p>
        `
        const button = document.createElement("button")
        button.textContent = "View Recipe"
        recipeDiv.appendChild(button);
        recipeContainer.appendChild(recipeDiv);

        //adding eventlistener to recipe button
        button.addEventListener('click', ()=>{
            openRecipePopup(meals);
        })
    });
    } catch (error) {
        recipeContainer.innerHTML = `<h2>Error in fetching the recipes...</h2>`
    }
    
}

const openRecipePopup = (meals) =>{
    recipeDetailsContent.innerHTML = `
      <h2 class="recipeName">${meals.strMeal}</h2>
      <h3>Ingredients:</h3>
      <ul class="ingredientList">${fetIngredients(meals)}</ul>
      <div class="recipeInstructions">
       <h3>Instructions:</h3> 
       <p >${meals.strInstructions}</p>
    </div>
    `
    recipeDetailsContent.parentElement.style.display = "block";
}

const fetIngredients = (meals) =>{
    let ingredientsList = "";
    for(let i=1;i<=20;i++){
        const ingredient = meals[`strIngredient${i}`]
        if(ingredient){
            const measure = meals[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`
        }else{
            break;
        }
    }
    return ingredientsList;
}

recipeCloseBtn.addEventListener('click',()=>{
    recipeDetailsContent.parentElement.style.display = "none";
})

searchBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if(!searchInput){
        recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
        return;
    }
    fetchRecipes(searchInput);
    
})