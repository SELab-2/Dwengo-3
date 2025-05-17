import { app } from './app';

const port = 3001;

app.listen(port, () => {
  console.log(`[SERVER] - listening on http://localhost:${port}`);
});
