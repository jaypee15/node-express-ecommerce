require("dotenv").config();
const app = require("./index");
const mongoose = require("mongoose");

const { PORT, CONNECTION_STRING } = process.env;
mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("DB connected succesfully"))
  .catch((err) => console.log(err));

app.listen(PORT || 5000, () => {
  console.log(`server running on port ${PORT || 5000}`);
});
