const Clarifai = require("clarifai");

const app = new Clarifai.App({
    apiKey: process.env.API_KEY
   });

const handleApiCall = (req, res) => {
    let faceBoxes = null;
    let concepts = null;

    // face dectection
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.inputField)
    .then(data => {
        faceBoxes = data['outputs'][0]['data'];

        // image prediction
        app.models.predict(Clarifai.GENERAL_MODEL, req.body.inputField)
        .then(response => {
            concepts = response['outputs'][0]['data']['concepts'];
            res.json({faceBoxes, concepts});
        })
        .catch(err => res.status(400).json("unable to get API image prediction"))
    })
    .catch(err => res.status(400).json("unable to get API face dectection"))
}

const handleImage = (req, res, db) => {

    db('users').where('id', '=', req.body.id)
    .increment("entries", req.body.entries)
    .returning("entries")
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json("unable to get entries"));

}

module.exports = {
    handleImage,
    handleApiCall
}