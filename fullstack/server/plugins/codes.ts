const tokens: { [key: string]: string } = {
  "1": "admin"
};
// this handles the participant user's email verification codes
export default function codes(option: string, param: string) {
  switch (option) {
    case "gen": {
      const token = Math.max(...Object.keys(tokens).map(Number)) + 1 || 1; // Generate a new token based on the highest existing key
      tokens[token.toString()] = param;

      return token.toString();
    }
    case "check": {
      const data = tokens[param];

      if (data) {
        return data;
      }

      return null;
    }

    default:
      break;
  }
}

