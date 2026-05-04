import {
    createRequire
} from "module";
import { arrayBuffer } from "stream/consumers";
const require = createRequire(
    import.meta.url);

const pool = require('../../data/db.cjs');
//const data = require('../../data/data.json');
//
//import { updateJsonFile } from "../helpers/_updateJsonFiles.js";
//import { searchIndexObjectDataParamId, searchObjectDataParamId } from "../helpers/_searchDatabase.js";

export const dataApiPattern = (app) => {

    ////* get-запрос data
    //app.get('/api/data/', (req, res) => {
    //    return res.json(data.dataTest);
    //});
    //
    ////* get-запрос по id
    //app.get('/api/data/:id', (req, res) => {
    //    const idDataReq = req.params.id;
    //    console.log('start request id: ' + idDataReq);
    //
    //    const dataResponse = searchObjectDataParamId(idDataReq, data.dataTest);
    //
    //    if (!dataResponse) {
    //        console.log('No id: ' + idDataReq);
    //        return res.status(404).send("Data not found");
    //    } else {
    //        res.json(dataResponse);
    //    }
    //});
    //* get-запрос data


    app.get('/api/data/noteget', async(req, res) => {
        try {
            console.log("получаю");
            const result = await pool.query('SELECT * from notes');
            console.log("result", result);

            const indef = result.rows;

            console.log("indef", indef);
            res.json(indef);

        } catch (error) {
            console.error("Ошибка:", error);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    });
    //* post-запрос
    app.post('/api/data/note', (req, res) => {
        console.log('зашёл');
        let description = req.body.description;
        console.log(req.body.description);
        const result = pool.query('INSERT INTO notes (description) VALUES($1) RETURNING *', [description]);
        console.log('отработал');
        return res.json(result)
    });
    // * put-запрос
    // app.put('/api/data/:id', (req, res) => {
    // console.log('change data for id: ' + req.params.id);
    // const idDataReq = req.params.id;
    // const updatedData = req.body; //! Не сработает без - app.use(express.json());
    // 
    // let indexDataTest = searchIndexObjectDataParamId(idDataReq, data.dataTest);
    // 
    // if (indexDataTest === -1) {
    // console.log('No id: ' + idDataReq);
    // return res.status(404).send("Data not found");
    // } else {
    // const newElement = {
    // id: Number(idDataReq),
    // name: updatedData.name,
    // age: updatedData.age
    // }
    // 
    // data.dataTest[indexDataTest] = newElement;
    // updateJsonFile('data.json', data);
    // res.json(data.dataTest[indexDataTest]);
    // console.log("completed change data");
    // }
    // })
    // * delete-запрос
    // app.delete('/api/data/:id', (req, res) => {
    // console.log(`Delete ${req.params.id} ...`);
    // 
    // const filterArray = data.dataTest.filter((item) => item.id !== +req.params.id);
    // 
    // data.dataTest = filterArray;
    // 
    // updateJsonFile('data.json', data);
    // 
    // console.log(`Delete ${req.params.id} completed`);
    // return res.status(204).send(`Delete ${req.params.id} completed`);
    // })
}