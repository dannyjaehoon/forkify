import {elements} from './base';

export const getInput = () => elements.searchInput.value
// return the value of the search input

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResList.innerHTML = "";
    elements.searchResPages.innerHTML = "";
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.likes__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`a[href*="${id}"]`).classList.add('results__link--active');
};


// 'pasta with tomato and spinach'
// split(' ') is to create an array that contains each word between the space.

// acc: 0 / acc + cur.length = 5 / newTitle = ['pasta']
// acc: 5 / acc + cur.length = 9 / newTitle = ['pasta with'];
// acc: 9 / acc + cur.length = 15 / newTitle = ['pasta with tomato']'
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    // !!! save mulitple times from the below reduce function ( how? )

    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <=limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
            // this makes acc = acc + cur.length.
        }, 0);

        return `${newTitle.join(' ')} ...`;
    } 
    return title;
}

const renderRecipe = recipe =>  {
    const markup = `
        <li>
            <a class="likes__link" href="#${recipe.recipe_id}">
                <figure class="likes__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="likes__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
}


// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page -1 : page + 1}</span>
    </button>
`
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    // Math ceil -> round up


    let button;
    if(page === 1 && pages > 1) {
        //Button to go to next page
        button = createButton(page, 'next');
    } else if(page < pages) {
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `
    } else if(page === pages && pages > 1) {
        button = createButton(page, 'prev');

    }

    elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

// recipes is an array and use the forEach function with renderRecipe callback function to show all recipes stored inside of the recipes array. 
export const renderResults = (recipes, page = 2, resPerPage = 10) => {
    // render result of current page
    const start = (page -1) * resPerPage; 
    const end = page * resPerPage;


    recipes.slice(start,end).forEach(renderRecipe);
    // return a shallow copy of a portion of an array into a new array


    // render pagination buttons
    console.log(recipes.length);
    console.log(resPerPage);
    renderButtons(page, recipes.length, resPerPage);
}
// callback function, a function that is passed as an arguement. 
// renderRecipe is a call back function.