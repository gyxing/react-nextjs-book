import request from '../utils/request'
import qs from 'qs'

export async function search(params) {
    let url = params.url;
    return request(`/api/books/reptile`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({url})
    })
}

export async function queryBooks() {
    return new Promise((resolve, reject) => {
        let res = [];
        let list = JSON.parse(localStorage.getItem('bookList')) || [];
        list.map( bookName => {
            res.push(JSON.parse(localStorage.getItem(bookName)))
        });
        resolve(res)
    })
}
export async function getBook({name}) {
    return new Promise((resolve, reject) => {
        let book = JSON.parse(localStorage.getItem(name)) || {};
        resolve(book)
    })
}
export async function addBook({book}) {
    return new Promise((resolve, reject) => {
        let list = JSON.parse(localStorage.getItem('bookList')) || [];
        list.push(book.name);
        localStorage.setItem('bookList', JSON.stringify(list));
        localStorage.setItem(book.name, JSON.stringify(book));
        resolve(book)
    })
}
export async function updateBook({book}) {
    return new Promise((resolve, reject) => {
        localStorage.setItem(book.name, JSON.stringify(book));
        resolve(book)
    })
}
export async function deleteBook({bookName}) {
    return new Promise((resolve, reject) => {
        let list = JSON.parse(localStorage.getItem('bookList')) || [];
        list = list.filter( item => item !== bookName);
        localStorage.setItem('bookList', JSON.stringify(list));
        localStorage.removeItem(bookName);
        resolve({status:true})
    })
}
export async function getChapters({bookName}) {
    return new Promise((resolve, reject) => {
        let chapters = JSON.parse(localStorage.getItem(`chapters_${bookName}`)) || [];
        resolve(chapters)
    })
}
export async function addChapters({bookName, chapters, isNew}) {
    return new Promise((resolve, reject) => {
        if(isNew){
            localStorage.setItem(`chapters_${bookName}`, JSON.stringify(chapters));
            resolve({status:true})
        }else{
            let list = JSON.parse(localStorage.getItem(`chapters_${bookName}`)) || [];
            let temp = [];
            chapters.map( chapter => {
                let arr = list.filter( item => item.name === chapter.name );
                if(arr.length === 0){
                    temp.push(chapter)
                }
            });
            list = list.concat(temp);
            localStorage.setItem(`chapters_${bookName}`, JSON.stringify(list));
            resolve({status:true})
        }
    })
}
export async function updateChapter({bookName, chapter}) {
    return new Promise((resolve, reject) => {
        let chapters = JSON.parse(localStorage.getItem(`chapters_${bookName}`));
        for(let item of chapters){
            if(item.name === chapter.name){
                item = chapter;
                break;
            }
        }
        resolve(chapter)
    })
}
export async function clearBook() {
    return new Promise((resolve, reject) => {
        let books = JSON.parse(localStorage.getItem('bookList')) || {};
        Object.keys(books).map( bookName => {
            localStorage.removeItem(`chapters_${bookName}`);
        });
        localStorage.removeItem('bookList');
        resolve()
    })
}
