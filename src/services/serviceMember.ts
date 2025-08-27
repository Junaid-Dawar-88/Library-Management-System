import inquirer from "inquirer"
import { mainMenu } from "../menu/menu"
import  db  from "../database/data"

type menuAction = "add" | "update" | "delete" | "list_member" | "Exit"
export async function memberManagement() {
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
                    { name: "show Author list", value: 'list_member' },
                    { name: "Exit", value: 'Exit' }
                ]
            }
        ])
        switch (bookList) {
            case "add":
                await addMember()
                break;
            case "update":
                await updateMember()
                break;
            case "delete":
                await deleteMember()
                break;
            case "list_member":
                await listMember()
                break;
            case "Exit":
                await mainMenu()
                break
        }
    }
}

async function addMember() {
    console.log("------- ADD MEMBER ---------")
    let { memberName , memberEmail , joinDate } = await inquirer.prompt([
        {
            type: "input",
            name: "memberName",
            message: "add member name"
        },
        {
            type: "input",
            name: "memberEmail",
            message: "add member email"
        },
        {
            type: "input",
            name: "joinDate",
            message: "Enter join date date (YYYY-MM-DD): ",
            validate: (input: string) => {
                const regex = /^\d{4}-\d{2}-\d{2}$/;
                return regex.test(input.trim()) ? true : "Please enter date in format YYYY-MM-DD";
            }
        }
    ])
     const insertInto = db.prepare("INSERT INTO member(name , email , joinDate) VALUES (?, ?, ?)");
    const result = insertInto.run(memberName , memberEmail , joinDate);

    console.log('DATA ADDED SUCCESSFULLY!');
    console.table(result);
    }
async function updateMember() {
     console.log("----- UPDATE MEMBER -----")
    let  memberId  =  db.prepare("SELECT * FROM member").all()
   let updateResult = memberId.map((mem: any) => ({
    name: `${mem.id} ${mem.name}`, 
    value: mem.id
}));

    let { update } = await inquirer.prompt([
        {
            type: 'list',
            name: "update",
            message: "Select id to update: ",
            choices: updateResult
        }
    ])
      let { memberName } = await inquirer.prompt([
        {
            type: 'input',
            name: "memberName",
            message: "Enter new member name:"
        }
    ]);
 let result = db.prepare("UPDATE member SET name = ? WHERE id = ?")
result.run(memberName , update)
    }
async function deleteMember() {
        console.log("----- DELETE member ------")
    let selectAll = db.prepare("SELECT * FROM member").all()
     
    let deleteItem = selectAll.map((mem: any) => ({
        name: `id: ${mem.id} ${mem.name}`,
        value: mem.id
    }))
    let { deleteSelectItem } = await inquirer.prompt([
        {
            type: "list",
            name: 'deleteSelectItem',
            message: "Select any one to delete: ",
            choices: deleteItem
        }
    ])
    let result = db.prepare("DELETE FROM member WHERE id = ?")
     result.run(deleteSelectItem);
    }
async function listMember() {
    console.log("----- MEMBER LIST ------")
    let listBooks = db.prepare("SELECT * FROM member").all()
    let list = listBooks.forEach((ite: any) => {
        console.log("-----------------------------")
            console.log(` id: ${ite.id} , name: ${ite.name}  , joinDate: ${ite.joinDate}`)
       console.log("-------------------------------")     
    });
    console.log(list)
    }