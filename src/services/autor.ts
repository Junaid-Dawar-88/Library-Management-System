import inquirer from "inquirer"
import { Author } from "../models/model";
import { mainMenu } from "../menu/menu"
import  db  from "../database/data"

let author: Author[] = []
type menuAction = "add" | "update" | "delete" | "list_book" | "Exit"
export async function autorManagement() {
    while (true) {
        console.log("------- AUTHOR LIBRARY --------- ");
        let { bookList } = await inquirer.prompt<{ bookList: menuAction }>([
            {
                type: "list",
                name: "bookList",
                message: "Select following option: ?",
                choices: [
                    { name: "add Author", value: 'add' },
                    { name: "update Author", value: 'update' },
                    { name: "delete Author", value: 'delete' },
                    { name: "show Author list", value: 'list_author' },
                    { name: "Exit", value: 'Exit' }
                ]
            }
        ])
        switch (bookList) {
            case "add":
                await addAuthor()
                break;
            case "update":
                await updateAuthor()
                break;
            case "delete":
                await deleteAuthor()
                break;
            case "list_book":
                await listAuthor()
                break;
            case "Exit":
                await mainMenu()
                break
        }
    }

}
async function addAuthor() {
    console.log("------- ADD AUTHOR ---------")
    let {authorName , country } = await inquirer.prompt([
        {
            type: "input",
            name: "authorName",
            message: "add author name"
        },
        {
            type: "input",
            name: "country",
            message: "add author country"
        }
    ])
     const insertInto = db.prepare("INSERT INTO author(name , country) VALUES (?, ?)");
    const result = insertInto.run(authorName , country);

    console.log('DATA ADDED SUCCESSFULLY!');
    console.table(result);
}

async function updateAuthor() {
      console.log("----- UPDATE AUTHOR -----")
    let  authorId  =  db.prepare("SELECT * FROM author").all()
   let updateResult = authorId.map((author: any) => ({
    name: `${author.id} ${author.name}`, 
    value: author.id
}));

    let { update } = await inquirer.prompt([
        {
            type: 'list',
            name: "update",
            message: "Select id to update: ",
            choices: updateResult
        }
    ])
      let { authorName } = await inquirer.prompt([
        {
            type: 'input',
            name: "authorName",
            message: "Enter new title:"
        }
    ]);
 let result = db.prepare("UPDATE author SET name = ? WHERE id = ?")
result.run(authorName , update)
}

async function deleteAuthor() {
      console.log("----- DELETE AUTHOR ------")
    let selectAll = db.prepare("SELECT * FROM author").all()
     
    let deleteItem = selectAll.map((author: any) => ({
        name: `id: ${author.id} ${author.name}`,
        value: author.id
    }))
    let { deleteSelectItem } = await inquirer.prompt([
        {
            type: "list",
            name: 'deleteSelectItem',
            message: "Select any one to delete: ",
            choices: deleteItem
        }
    ])
    
    let { confirm } = await inquirer.prompt([
        {
            type: "input",
            name: "confirm",
            message: "Are you sure you want to delete (yes/no): ",
            choices: ['NO' , 'YES']
        }
    ])
     if(confirm.toLowerCase() == "yes"){

        let result = db.prepare("DELETE FROM author WHERE id = ?")
        result.run(deleteSelectItem);
        console.log("Author deleted successfully! ")
    }else if(confirm.toLowerCase() == "no"){
        return autorManagement()
    }
}

async function listAuthor() {
    console.log("----- AUTHOR LIST ------");
    let authors = db.prepare("SELECT * FROM author").all();

    let list = authors.map((auth: any) => ({
        id: auth.id,
        name: auth.name,
        country: auth.country
    }));
    console.log(list);
    
}

