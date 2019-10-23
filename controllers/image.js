const Clarifai = require("clarifai");

const app = new Clarifai.App({
    apiKey: 'ee49c6fb004c474a9dfc82e5caaca8c0'
    // apiKey: process.env.API_KEY

   });

const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.inputField)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json("unable to work with API"))
}

const handleImage = (req, res, db) => {

    db('users').where('id', '=', req.body.id)
    .increment("entries", req.body.faces)
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