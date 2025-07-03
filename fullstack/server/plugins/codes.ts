const tokens: { [key: string]: string } = {
  "87": "admin"
};
// this handles the participant user's email verification codes
export default function codes(option: string, param: string) {
  switch (option) {
    case "gen": {
      const token = Object.keys(tokens).length + Math.round(Math.random()*100); // Generate a new token based on the highest existing key
      tokens[token.toString()] = param;
      Object.entries(tokens).forEach(([key, value]) => {
        if (key !== token.toString() && value === param) {
          tokens[key] = ""; // Remove any previous token for the same email
        }
      });
      return token.toString();
    }
    case "check": {
      const data = tokens[param];

      if (data) {
        tokens[param] = ""; // Clear the token after checking
        // This is to prevent reusing the same token
        return data;
      }

      return null;
    }

    default:
      break;
  }
}

