import Search from './models/Search';
import * as searchView from './views/searchView'
import { elements, renderLoader, clearLoader } from './views/base'
const search = new Search('pizza');

console.log(search);

// js engine only read function first.
search.getResults();

// global state of the app
// search object
// current recipe object
// shopping list object
// liked recipes

const state = {};

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if(query) {
        // 2) new search object and add to state
        state.search = new Search(query);
        // 3) prepare UI for results
        searchView.clearInput();
        searchView.clearResult();

        // add a spinner
        renderLoader(elements.searchRes);
        // 4) Search for recipes
        await state.search.getResults();

        // 5) render Results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e=> {
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e=> {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
    }
}
)