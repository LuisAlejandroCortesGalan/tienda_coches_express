async function logIn(req, res) {
    
}

async function register(req, res) {
    console.log("authenthication clg", req.body);
    const user = req.body.nombre;
    const password = req.body.password;
    const email = req.body.email;
    if (!user || !password || !email){
        res.status(400).send({status: "Error", mensaje: "Los campos estan incompletos"
        })
    }
}

module.exports = {
    logIn,
    register
};