import { elements } from './base'
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

/*
// eg, [pasta, with, tomato, and, spinach] 
acc: 0 / acc + cur.lenght = 5 / new Title = ['pasta'];
acc: 5 / acc + cur.lenght = 9 / new Title = ['pasta', 'with'];
acc: 9 / acc + cur.lenght = 15 / new Title = ['pasta', 'with', 'tomato'];
acc: 15 / acc + cur.lenght = 18 / new Title = ['pasta', 'with', 'tomato'];
acc: 18 / acc + cur.lenght = 24 / new Title = ['pasta', 'with', 'tomato'];
*/

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }

            return acc + cur.length;
        }, 0);

        // return the result
        console.log(`${newTitle}`);

        return `${newTitle.join(" ")} ...`;
    } 
    return title;
}
export const renderRecipes = recipe => {
    console.log("working!!!");
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipes_id}"">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

// type: 'prev' or 'next
const createButton = (page, type) => 
    `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page + 1}>
        <span>Page ${type === 'prev' ? page -1 : page + 1}</span>    
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    
    </button>
    `

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    // round up

    let button;
    if(page === 1 && pages > 1) {
        button = createButton(page, 'next')
        // button to go to next page
    } else if(page < pages) {
        // both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `
    } else if(page === pages && pages > 1) {
        // only button to go to prev page
        button = createButton(page, 'prev')
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    
    //render results of current page
    const start = (page - 1) * resPerPage;
    const end = 9;
   
    // start at 'start' index and "end" means number of recipes
    recipes.slice(start, end).forEach(renderRecipes);

    

    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);

}
