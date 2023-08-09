const http = require('http');

const hostname = 'localho.st';
// const hostname = '172.31.31.9';
const port = 8080;


const server = http.createServer((req, res) => {
    if(req.method == 'POST') {

        console.log("POST");
        req.on('data', function(data) { //DATA INPUT
            let user_data = JSON.parse(""+data);
            let user_input = user_data.text;
            let id = user_data.id;
        });
        req.on('end', function() { //DATA OUTPUT
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('POST RECEIVED');
        });

    }else {
        res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('DIGITAL PROPHECIES SERVER RUNNING');
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// const API_KEY = process.env.OPENAI_API_KEY;
const API_KEY = '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';


const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: API_KEY
});

const openai = new OpenAIApi(configuration);

function createCompletion(user_input, messages, reload, activeConvoNumber) {
    messages.push({"role": "user", "content": user_input});
    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
    }).then((res) => {
        let dp_response = res.data.choices[0].message.content
        console.log(dp_response);
        messages.push({"role": "assistant", "content": dp_response});
        reload(activeConvoNumber);
    }).catch((e)=> {
        console.error("ERROR: "+e);
    });
}