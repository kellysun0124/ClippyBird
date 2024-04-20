import express from 'express'
import fs from 'fs';
import { getConnection } from '../server.js'
import path from 'path'
//import * as tf from '@tensorflow/tfjs' 
import * as tfn from '@tensorflow/tfjs-node'

const router = express.Router()

//////////////////////////////////// !!! WILL NEED TO CHANGE ONCE HOSTED!!! ///////////////////////////////////////
const model_path = "/Users/kevin/Documents/college/sp24/capstone/codebase/ClippyBird/server/js_model/model.json" //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const createImageQuery = `
    INSERT INTO IMAGE (USER_ID, FILE_LOCATION, DATE_TIME, IMAGE_LOCATION, IMAGE_NAME, SPECIES) 
    VALUES (?, ?, ?, ?, ?, ?);
`

const userExistsQuery = `
        SELECT COUNT(*) AS USER_EXISTS
        FROM USER
        WHERE USER_ID = ?;
`       

// create an image
// -> insert/{username}
router.post("/:USER_ID", async (req, res) => {
    const { USER_ID } = req.params;
    const { FILE_LOCATION, DATE_TIME, IMAGE_LOCATION, IMAGE_NAME } = req.body;
    
    try {
        let SPECIES = "";

        const userExists = await checkUserExists(USER_ID);
        if (!userExists) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        async function loadModel() {
            const handler = tfn.io.fileSystem(model_path);
            const model = await tfn.loadLayersModel(handler);
            return model;
        }

        async function classifyImage(model, directory, image_name) {
            const fileLocation = path.join(directory, image_name); // gets path to the image
            const imageBuffer = fs.readFileSync(fileLocation);
            const image = tfn.node.decodeImage(imageBuffer);
            const resizedImage = tfn.image.resizeBilinear(image, [224, 224]); // resizes to proper size of 224, 224, 3
            const normalizedImage = resizedImage.toFloat().div(tfn.scalar(255));
            const reshapedImage = normalizedImage.expandDims(0);
            const prediction = await model.predict(reshapedImage).dataSync()[0];
            console.log(`Model prediction of image ${image_name}: ${prediction}`)
            return prediction;
        }

        const model = await loadModel();

        const prediction = await classifyImage(model, FILE_LOCATION, IMAGE_NAME);

        if (prediction >= 0.5) {
            SPECIES = "Bird"
        } else {
            return res.status(422).json({
                message: "Image does not contain a bird"
            })
        }

        // opens connection to the database, inserts image, then releases connection
        const connection = await getConnection();
        const [result] = await connection.execute(
            createImageQuery,
            [USER_ID, FILE_LOCATION, DATE_TIME, IMAGE_LOCATION, IMAGE_NAME, SPECIES]
        );
        connection.release();

        // success response
        res.status(201).json({
            message: "Image created successfully",
            imageId: result.insertId
        });
    } catch (error) {
        console.error("Error creating image: ", error);
        return res.status(500).json({ error: "Internal Server Error"});
    }
});

const checkUserExists = async (userId) => {
    const connection = await getConnection();
    const [result] = await connection.execute(
        userExistsQuery,
        [userId]
    );
    connection.release();

    return result[0].USER_EXISTS > 0; 
}

export default router;