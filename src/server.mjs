import e from "express";
import env from "./config/env.mjs";
import apiRouter from "./api/inds.mjs";

const app = e();
app.use(e.json());

app.use('/', e.static('public'));

app.use('/api/v1', apiRouter);


app.get('/health',  async (request, response, next) => {
    response.status(200).end('ok');
});


app.listen(env.HTTP_PORT, () => {
    console.log(`Server listening on http://localhost:${env.HTTP_PORT}`)
});