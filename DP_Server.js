const http = require('http');

const hostname = 'localho.st';
// const hostname = '172.31.31.9';
const port = 8080;

const API_KEY = process.env.OPENAI_API_KEY;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: API_KEY
});

const openai = new OpenAIApi(configuration);


const server = http.createServer((req, res) => {
    if(req.method == 'POST') {

        req.on('data', function(data) { //DATA INPUT

            let messages = JSON.parse(""+data);

            let dp_response = getCompletion(messages)
            dp_response.then(result => {
                let dp_response = result.data.choices[0].message.content;
                console.log(dp_response);
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(dp_response);
            }).catch(e => {
                console.error(e);
            });

        });
        // req.on('end', function() { //DATA OUTPUT
        //     res.writeHead(200, {'Content-Type': 'text/plain'});
        //     res.end('POST RECEIVED');
        // });

    }else {
        res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('DIGITAL PROPHECIES SERVER RUNNING');
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


async function getCompletion(messages) {
    return await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
    })
}