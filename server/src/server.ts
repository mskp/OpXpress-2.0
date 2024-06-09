import app from "./app.js";
import { PORT } from "./config/consts";

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
