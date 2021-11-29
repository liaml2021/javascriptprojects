// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks(){

        // Use this hard coded data to start and testing. Once Store object is used, remove them.
        // const StoreBooks = [
        //     // hard corded book list
        //     {
        //         title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
        //         author: 'James Clear',
        //         isbn: '0735211299'
        //     },
        //     {
        //         title: 'The Four Agreements: A Practical Guide to Personal Freedom (A Toltec Wisdom Book) ',
        //         author: 'Don Miguel Ruiz',
        //         isbn: '9781878424310'
        //     },
        //     {
        //         title: 'If Animals Kissed Good Night',
        //         author: 'Ann Whitford Paul',
        //         isbn: '0374300216'
        //     },
        // ];
        // const books = StoreBooks;

        const books = Store.getBooks();

        // Loop thru book in books array and call a method 
        // and pass the book to it
        books.forEach((book) => UI.addBookToList(book));

    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(el){
        // if(el.classList.contains('delete')){
        //     el.parentElement.parentElement.remove();
        // }
        // Same thing as above
        if (el.value ='Delete'){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert (message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // Alert dissapeared in 3 seconds, or the alert message keeps stacking
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles storage. It is stored in local browser. Not in different browser. 
// i.e. of stored in Chrome, the data is not stored in Firefox.
class Store {

    // key value pair. string version of entire array of books. 
    // You cannot store object in store.
    // You must make all objects to string before add to store
    // Then pull it out and parse it to display JSON.parse
    static getBooks(){
        let books;
        if (localStorage.getItem('books')===null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook (book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook (isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
        // Prevent actual submit
        e.preventDefault();

        // Gt form values
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const isbn = document.querySelector('#isbn').value;

        // Validate input values
        if (title==='' || author === '' || isbn ===''){
            const message = 'Please fill in all fields';
            //alert (message);
            UI.showAlert(message, 'danger')
            // Alert class: danger, success, info, etc..
        } else {
            // Instantiate book
            const book = new Book(title, author, isbn);
            //console.log(book);

            // Add Book to UI
            UI.addBookToList(book);

            // Add book to store
            Store.addBook(book);

            // Show success message
            UI.showAlert('Book Added', 'success');

            // Clear fields
            UI.clearFields();
        }
    });

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
        
        // Remove book from UI
        // e.target is the link that clicked
        UI.deleteBook(e.target);

        // Remove book from store
        // Find isbn value
        // e.target.parentElement --> <td>
        // e.target.parentElement.previousElementSibling --> the previous <td>
        // console.log(e.target.parentElement.previousElementSibling.textContent);
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

         // Show remove message
         UI.showAlert('Book Removed', 'success');

    });