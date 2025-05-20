import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import bcrypt from "bcrypt";
export default async function userManipulate(option, username, passhash?) {
  //should be rewritten for database usage
 //storage: key=username (email usually), value=json string  
  const storage = createStorage({
    driver: fsDriver({ base: "./users" }),
  });
  switch (option) {
    case "getpass":
      return (await storage.has(username))?JSON.parse((await storage.getItem(username)).toString()).password:undefined

    case "checkpass":
        return (await storage.has(username))? await bcrypt.compare(JSON.parse((await storage.getItem(username)).toString()).password, passhash):false
    case "makeuser":
        const user:object= {
            password: passhash,
            
        }
        return await storage.setItem(username, JSON.stringify(user))
    case "":
        break;
    default:
      break;
  }
}
