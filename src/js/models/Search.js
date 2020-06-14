import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getQuery() {
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.results = res.data.recipes;
            // can i just do this without declaring it at the constructor?
        } catch(error) {
           alert(error) 
        }
    }
}
