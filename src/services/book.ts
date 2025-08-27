import inquirer from "inquirer"
import { Author, Book } from "../models/model"
import { mainMenu } from "../menu/menu"
import  db  from "../database/data"


let books: Book[] = []

type menuAction = "add" | "update" | "delete" | "book" | "Exit"
export async function bookManagement() {
    while (true) {
        console.log("------- BOOKS LIBRARY --------- ");
        let { action } = await inquirer.prompt<{ action: menuAction }>([
            {
                type: "list",
                name: "action",
                message: "Select following option: ?",
                choices: [
                    { name: "add book", value: 'add' },
                    { name: "update book", value: 'update' },
                    { name: "delete book", value: 'delete' },
                    { name: "show book list", value: 'book' },
                    { name: "Exit", value: 'Exit' }
                ]
            }
        ])
        switch (action) {
            case "add":
                await addBook()
                break;
            case "update":
                await updateBook()
                break;
            case "delete":
                await deleteBook()
                break;
            case "book":
                await listBook()
                break;
            case "Exit":
                await mainMenu()
                break
        }
    }

}

async function addBook() {
    console.log("------- ADD BOOKS --------");

let authors = db.prepare("SELECT id, name FROM author").all()

const authorChoices = authors.map((author: any) => ({
    name: `id: ${author.id} ${author.name}`,
    value: author.id
}));
if (authorChoices.length === 0) {
  console.log(" No authors found. Please add authors first.");
  return;
}

  
    const { bookTitle, bookAuthorId, bookPublishedYear, bookAvailable } = await inquirer.prompt([
        {
            type: "input",
            name: "bookTitle",
            message: "Enter book title: ",
            validate: (input) => input.trim() ? true : "Please enter a correct book name."
        },
        {
            type: "list",  
            name: "bookAuthorId",
            message: "Select author id: ",
            choices: authorChoices
        },
        {
            type: "input",
            name: "bookPublishedYear",
            message: "Enter book Published date (YYYY-MM-DD): ",
            validate: (input: string) => {
                const regex = /^\d{4}-\d{2}-\d{2}$/;
                return regex.test(input.trim()) ? true : "Please enter date in format YYYY-MM-DD";
            }
        },
        {
            type: "input",
            name: "bookAvailable",
            message: "Is book available? (yes/no): ",
            validate: (input) => input.trim() ? true : "Please enter status."
        }
    ]);

    const insertInto = db.prepare("INSERT INTO bookTable(title, authorId, publishedYear, available) VALUES (?, ?, ?, ?)");
    const result = insertInto.run(bookTitle, bookAuthorId, bookPublishedYear, bookAvailable);

    console.log('DATA ADDED SUCCESSFULLY!');
    console.table(result);
    console.log(books);
}

async function updateBook() {
    console.log("----- UPDATE BOOK -----")
    let  bookId  =  db.prepare("SELECT * FROM bookTable").all()
   let updateResult = bookId.map((book: any) => ({
    name: `${book.id} ${book.title}`, 
    value: book.id
}));

    let { update } = await inquirer.prompt([
        {
            type: 'list',
            name: "update",
            message: "Select id to update: ",
            choices: updateResult
        }
    ])
      let { newTitle } = await inquirer.prompt([
        {
            type: 'input',
            name: "newTitle",
            message: "Enter new title:"
        }
    ]);
 let result = db.prepare("UPDATE bookTable SET title = ? WHERE id = ?")
result.run(newTitle , update)
}

async function deleteBook() {
    console.log("----- DELETE BOOK ------")
    let selectAll = db.prepare("SELECT * FROM bookTable").all()
     
    let deleteItem = selectAll.map((book: any) => ({
        name: `id: ${book.id} ${book.title}`,
        value: book.id
    }))
    let { deleteSelectItem } = await inquirer.prompt([
        {
            type: "list",
            name: 'deleteSelectItem',
            message: "Select any one to delete: ",
            choices: deleteItem
        }
    ])
    let result = db.prepare("DELETE FROM bookTable WHERE id = ?")
     result.run(deleteSelectItem);
}

async function listBook() {
    console.log("----- BOOK LIST ------")
    let listBooks = db.prepare("SELECT * FROM bookTable").all()
    let list = listBooks.forEach((ite: any) => {
        console.log("-----------------------------")
            console.log(` id: ${ite.id} , title: ${ite.title}  , authorId: ${ite.authorId}`)
       console.log("-------------------------------")     
    });
    console.log(list)
}