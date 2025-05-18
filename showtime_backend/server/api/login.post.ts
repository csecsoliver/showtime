import bcrypt from "bcrypt";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";


// server/routes/login.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const storage = createStorage({
    driver: fsDriver({ base: "./store" }),
    });
  let token: number;
  let hash = await bcrypt.hash(body.password, 10);
  switch (body.option) {
    case "register":
        storage.setItem(body.username, hash);
        return 
        break;
    case "login":
        if (await storage.getItem(body.username) === hash){
            
        }
        break;
    default:
        return;
        break;
  }
  
  return { sessionToken: token };
});

