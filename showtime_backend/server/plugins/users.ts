import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import bcrypt from "bcrypt";
export default async function userManipulate(option, username, passhash?) {
  //should be rewritten for database usage
 //storage: key=username (email usually), value=json string  
  const storage = createStorage({
    driver: fsDriver({ base: "./users/" }),
  });
  switch (option) {
    case "getpass":
      if (await storage.has(username)) {
        const raw = await storage.getItem(username);
        let str;
        if (typeof raw === "string") {
          str = JSON.parse(str);
        } else{
            str = raw;
        }
        if (str) {
          return str.password;
        }
      }
      return undefined;

    case "checkpass":
      if (await storage.has(username)) {
        const raw = await storage.getItem(username);
        let str;
        if (typeof raw === "string") {
          str = JSON.parse(str);
        } else{
            str = raw
        }
        if (str) {
          return await bcrypt.compare(passhash, str.password);
        }
      }
      return false;
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
