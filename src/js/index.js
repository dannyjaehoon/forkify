import Search from './models/Search';
import Recipe from './models/Recipe';
import List from "./models/List";
import Like from "./models/Like";
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likeView';
import { elements , renderLoader, clearLoader } from './views/base';
import Likes from './models/Like';
// Global state of the app
// - Search object
// - Current recipe object
// - Shopping list object
// - liked recipes

const state = {};
window.state = state;
const controlSearch = async () => {
    //  get query from view
    const query = searchView.getInput();


    if(query) {
        // new search object and add to state
        state.search = new Search(query);

        // prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            await state.search.getQuery();

            // render results on UI
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch(err) {
            alert("something wrong with the search");
        }
        //  Search for recipes

    }
}

// execute when a user clicks the Search button
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})
window.addEventListener('load', e => {
    e.preventDefault();
    controlSearch();
})
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
})


/**
 * Recipe Controller
 */

//  !!! hash change by clicking each item on the food list? -> #${recipe.recipe_id}
const controlRecipe = async () => {
    // Get the ID from URL
    const id = window.location.hash.replace("#", "");

    
    if(id) {
        // prepare UI for changes
        // create new recipe object
        state.recipe = new Recipe(id);
        recipeView.clearRecipe();

        // highlight the selected item
        // if(state.search) means there is a search or not
        if (state.search) searchView.highlightSelected(id);

        // testing purpose
        // window.r = state.recipe;


        renderLoader(elements.recipe);
        try {
            // get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // render recipe
            clearLoader();
            console.log(state.likes.isLiked(id));
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch(err) {
            alert(err);
        }
        
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// list controller
const controlList = () => {
    // create a new list if there is none
    if(!state.list) state.list = new List();

    // Add each ingredient to the list & UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

// handling delete and update list item events
elements.shopping.addEventListener("click", e => {
    const id = e.target.closest(".shopping__item").dataset.itemid;

    // 
    if(e.target.matches(".shoping__delete, .shopping__delete *")) {
        // delete from state
        state.list.deleteItem(id);

        // delete from ui
        listView.deleteItem(id);
    } else if(e.target.matches(".shoping__count-value")) {
        const val = parseFloat(e.target.value, 10);    
        state.list.updateCount(id, val);
    }
})

// like controller

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);
    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', e=> {
    state.likes = new Likes();
    state.likes.readStorage();

    // toggle like menu button 
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})

// handlung recipe button clicks
elements.recipe.addEventListener('click', e => {
    // .btn-decrease * means that any click happens inside of the element that has .btn-decrease class will be included.

    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // dec button is clicked
        
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.undateServingsIngredients(state.recipe);
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // inc button is clicked
        state.recipe.updateServings('inc');
        recipeView.undateServingsIngredients(state.recipe);
    } else if(e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
        controlList();
    } else if(e.target.matches(".recipe__love, .recipe__love *")) {
        // like controller
        controlLike();
    }

})


