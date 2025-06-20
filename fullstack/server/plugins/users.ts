
import fsDriver from "unstorage/drivers/fs";
import bcrypt from "bcrypt";
import { createStorage } from "unstorage";
import { Teacher } from "../types/types";
export default async function userManipulate(option: string, username: string, passhash?: string) {
  //should be rewritten for database usage
 //storage: key=username (email usually), value=json string  
  const storage = createStorage({
    driver: fsDriver({ base: "./teachers/" }),
  });
  switch (option) {
    case "getpass":
      if (await storage.has(username)) {
        const raw = await storage.getItem(username);
        let str;
        if (typeof raw === "string") {
          str = JSON.parse(raw);
        } else {
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
          str = JSON.parse(raw);
        } else{
            str = raw
        }
        if (str) {
          return await bcrypt.compare(passhash??'', str.password);
        }
      }
      return false;
    case "makeuser":
        
        return await storage.setItem(username, JSON.stringify(makeuser(username, passhash as string)));
    case "checkauth":
        break;
    default:
      break;
  }
}
function makeuser(username: string, passhash: string) {
  const user:Teacher= {
    email: username,
    workshops: [],
    password: passhash,
  }
  return user
}