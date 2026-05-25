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
        console.log('записываю');
        let description = req.body.description;
        console.log(req.body.description);
        const result = pool.query('INSERT INTO notes (description) VALUES($1) RETURNING *', [description]);
        console.log('отработал');
        return res.json(result)
    });
//* создание новой заметки
    app.post('/api/data/createnote', async (req, res) => {
        console.log('создаю');
        let nameNote = req.body.name;
        console.log(req.body.name);

        try {
            console.log('создаю notes');
            const queryNotes = `CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                name VARCHAR,
                description VARCHAR
            )`;
            await pool.query(queryNotes); 
            console.log('создал notes');  
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ошибка при создании таблицы notes', details: error.message });
        }
        console.log('создаю заметку');
        const result = pool.query('INSERT INTO notes (name, description) VALUES($1,$2) RETURNING *', [nameNote, "text is none"]);
        res.status(200).json({ message: `Заметка ${nameNote} успешно создана!` });
        console.log('создал');
        return res.json(result)
    });
//* получение списка заметок
    app.get('/api/data/getlistnotes', async(req, res) => {
        try {
            console.log("получаю список");
            const result = await pool.query('SELECT * from notes');
            console.log("result", result);

            const indef = result.rows;

            console.log("indef", indef);
            
            res.json(indef);
            res.status(200).json({ message: `Список заметок - получен` });

        } catch (error) {
            console.error("Ошибка:", error);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    });

    app.patch('/api/data/changeNote/:id', (req, res) => {
        try {
            const idDataReq = req.params.id;
            const newInfo = req.body;
            let result = pool.query('UPDATE notes SET description=$1 WHERE id=$2 RETURNING *', [req.body.description, idDataReq])
            res.json(result);
            res.status(200).json({ message: `заметка перезаписана!` });
        } catch (error) {
            console.error("Ошибка:", error);
            res.status(500).json({ error: "Ошибка сервера при перезаписи" });
        }
    })
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