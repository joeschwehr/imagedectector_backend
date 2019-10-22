const handleRegister = (req, res, db, bcrypt) => {

    if(!req.body.name || !req.body.email || !req.body.password){
        return res.status(400).json("incorrect form submission")
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(req.body.password, saltRounds);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: req.body.email,
        })
        .into('login')
        .returning('email')
        .then(returnedEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: req.body.name,
                email: req.body.email, 
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("unable to register new user"))
}

module.exports = {
    handleRegister: handleRegister
};