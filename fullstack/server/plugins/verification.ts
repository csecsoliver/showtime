import crypto from "crypto";
interface TokenData {
  user: string;
  expiry: number;
}

const tokens: { [key: string]: TokenData } = {
  exampletoken: {
    user: "admin",
    expiry: Date.parse("2026-05-18T00:00:00.000Z"),
  },
};
export default function verification(option: string, param: string) {
  switch (option) {
    case "gen": {
      const token = crypto.randomBytes(32).toString("hex");
      tokens[token] = {
        user: param,
        expiry: Date.now() + 30 * 60 * 1000,
      };
      return token;
    }
    case "check": {
      const data = tokens[param];
      if (data && data.expiry > Date.now()) {
        return data;
      }
      return null;
    }

    default:
      break;
  }
}

