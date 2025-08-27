import inquirer from "inquirer"
import { bookManagement } from "../services/serviceBook"
import { memberManagement } from "../services/serviceMember"
import { borrowManagement } from "../services/borrowBook"
import { autorManagement } from "../services/autor"

export async function mainMenu() {
    while(true){
    let { list } = await inquirer.prompt([
        {
            type: "list",
            name: 'list',
            message: "Select valide option: ",
            choices: [
                {name: "Manage Authors", value: "author"},
                {name: "Manage Books", value: "book"},
                {name: "Manage Members", value: "member"},
                {name: "Borrow & Return System", value: "borrow"},
                {name: " Exit system", value: "Exit"},
            ]
        }
    ])
    switch(list){
        case "author":
             await autorManagement()
            break;
        case "book":
               await bookManagement()
            break;
        case "member":
            await memberManagement()
            break;
        case "borrow":
            await borrowManagement()
            break;
        case "Exit":
          console.log("Good bye! ");
          process.exit()
    }
    }
}