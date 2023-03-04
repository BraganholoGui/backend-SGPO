const ApiPing = {
    async index(req, res) {
        let data = new Date()
        console.log("\n pong", data)
        return res.json(`{'pong', ${data}}`);
    }
};

export default ApiPing;
