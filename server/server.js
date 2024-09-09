const app = require("./app");

const PORT = process.env.PORT;
console.log(PORT);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
