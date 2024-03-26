import express from 'express'
import { getConnection } from '../server.js';

const router = express.Router()

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

        // ML model will go here
        // Classifies species contained in newly created image, if image species is classified
        // as "not a bird", then the image will not be inserted into the database
        const pythonModel = (FILE_LOCATION, IMAGE_NAME) => {
            const image = FILE_LOCATION + IMAGE_NAME;
            
            if (image == "../images/notbird.jpg") {
                SPECIES = "not a bird";
            } else if (image == "../images/mayber.jpg") {
                SPECIES = "possible bird";
            } else {
                SPECIES = "bird"
            }

            console.log(`MODEL OUTPUT: ${SPECIES}`)
        }
        
        // calls the classification method
        pythonModel(FILE_LOCATION, IMAGE_NAME)

        // returns 422 code if species is not classified as a bird
        if (SPECIES == "not a bird") {
            console.log(`IMAGE SENT BY BIRD BOX WAS NOT INSERTED`)

            return res.status(422).json({
                message: "Image does not contain a bird"
            });
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
        res.status(500).json({ error: "Internal Server Error"});
    }
});

const checkUserExists = async (userId) => {
    const connection = await getConnection();
    const [result] = await connection.execute(
        userExistsQuery,
        [userId]
    );
    connection.release();

    return result[0].userExists > 0; 
}

export default router;