const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile('/home/willchakur/Documentos/TO-DO-APP/register/index.html');
})

module.exports = router;