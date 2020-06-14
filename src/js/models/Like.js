export default class Likes {
    constructor() {
        this.likes = [];
    }
    addLike(id, title, author, img) {
        const like = {id, author, title, img}
        this.likes.push(like);

        this.persistData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(e => e.id === id);
        this.likes.splice(index, 1);

        this.persistData();
    }

    isLiked(id) {
        console.log(this.likes);
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // restoring likes from the localstorage
        if(storage) this.likes = storage;
    }
}