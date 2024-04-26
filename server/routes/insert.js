import express from 'express'
import { getConnection } from '../server.js'
import * as tfn from '@tensorflow/tfjs-node'
import { Storage } from '@google-cloud/storage';

const storage = new Storage({ keyFilename: './key.json' });
const bucketName = 'clippy_bird-2';

const router = express.Router()

const bin_model_path = "./js_models/binary_model/model.json"
const mult_model_path = "./js_models/multi_model/model.json"

const createImageQuery = `
    INSERT INTO IMAGE (USER_ID, GCS_OBJECT_URL, DATE_TIME, IMAGE_LOCATION, IMAGE_NAME, SPECIES) 
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
    const { GCS_OBJECT_URL, DATE_TIME, IMAGE_LOCATION, IMAGE_NAME } = req.body;
    
    try {
        let SPECIES = "";

        class L2 {
            static className = 'L2';
        
            constructor(config) {
               return tfn.regularizers.l1l2(config)
            }
        }

        tfn.serialization.registerClass(L2);

        const userExists = await checkUserExists(USER_ID);
        if (!userExists) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        async function loadModel(model_path) {
            const handler = tfn.io.fileSystem(model_path);
            const model = await tfn.loadLayersModel(handler);
            return model;
        }

        async function classifyImage(model_type, model, image_name) {
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(IMAGE_NAME);
            const imageBuffer = await file.download();
            const tensorImage = tfn.node.decodeImage(imageBuffer[0]);
            const resizedImage = tfn.image.resizeBilinear(tensorImage, [224, 224]); // resizes to proper size of 224, 224, 3
            const normalizedImage = resizedImage.toFloat().div(tfn.scalar(255));
            const reshapedImage = normalizedImage.expandDims(0);
            const prediction = await model.predict(reshapedImage).dataSync();
            console.log(`The ${model_type} model's prediction of image ${image_name}: ${prediction}`)
            return prediction;
        }

        const bin_model = await loadModel(bin_model_path);

        const bin_prediction = await classifyImage('binary', bin_model, IMAGE_NAME);

        if (bin_prediction >= 0.5) {
            SPECIES = "Bird"
        } else {
            return res.status(422).json({
                message: "Image does not contain a bird"
            })
        }

        const mult_model = await loadModel(mult_model_path);
        const mult_prediction = await classifyImage('multiclass', mult_model, IMAGE_NAME);
        const maxIndex = mult_prediction.indexOf(Math.max(...mult_prediction));
    
        if(mult_prediction[maxIndex] >= 0.5) {
            switch (maxIndex) {
                case 0:
                    SPECIES = "Goldfinch";
                    break;
                case 1:
                    SPECIES = "Robin";
                    break;
                case 2:
                    SPECIES = "Baltimore Oriole";
                    break;
                case 3:
                    SPECIES = "Starling";
                    break;
                case 4:
                    SPECIES = "Crested Nuthatch";
                    break;
                case 5:
                    SPECIES = "Crow";
                    break;
                case 6:
                    SPECIES = "Downy Woodpecker";
                    break;
                case 7:
                    SPECIES = "Finch";
                    break;
                case 8:
                    SPECIES = "Sparrow";
                    break;
                case 9:
                    SPECIES = "Mourning Dove";
                    break;
                case 10:
                    SPECIES = "Cardinal";
                    break;
                case 11:
                    SPECIES = "Red-Headed Woodpecker";
                    break;
                case 12:
                    SPECIES = "Titmouse";
                    break;
                case 13:
                    SPECIES = "Black-Capped Chickadee";
                    break;
            }
        } else {
            SPECIES = "Unknown"
        }

        console.log(SPECIES)

        // opens connection to the database, inserts image, then releases connection
        const connection = await getConnection();
        const [result] = await connection.execute(
            createImageQuery,
            [USER_ID, GCS_OBJECT_URL, DATE_TIME, IMAGE_LOCATION, IMAGE_NAME, SPECIES]
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