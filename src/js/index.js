import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements , renderLoader, clearLoader } from './views/base';
// Global state of the app
// - Search object
// - Current recipe object
// - Shopping list object
// - liked recipes

const state = {};

const controlSearch = async () => {
    //  get query from view
    // const query = searchView.getInput();
    const query = 'pizza';

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
    console.log(btn);
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
    console.log(id);
    
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
            console.log(state.recipe);
            // render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch(err) {
            alert(err);
        }
        
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// handlung recipe button clicks
elements.recipe.addEventListener('click', e => {
    // .btn-decrease * means that any click happens inside of the element that has .btn-decrease class will be included.
    console.log(e.target.matches('.btn-decrease, .btn-decrease *'));
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
    }
    console.log(state.recipe);
})