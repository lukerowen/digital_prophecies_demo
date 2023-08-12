const xhttp = new XMLHttpRequest();


const UserMessageInput = document.getElementById("text_input");
const CurrentConvo = document.getElementById("current_convo");
const CharCreationOverlay = document.getElementById("charOverlay");

let convos = [
    // {
    //     button: document.getElementById("c0"),
    //     conversation: []
    // },
    // {
    //     button: document.getElementById("c1"),
    //     conversation: []
    // }
];
let activeConvoNumber = -1;

function submitText() {
    let txt = UserMessageInput.value;

    if (activeConvoNumber < 0 || txt == "") {
        UserMessageInput.value = "";
        return;
    }

    let conversation = convos[activeConvoNumber].conversation;
    conversation.push({"role": "user", "content": txt});
    reloadConvo();

    xhttp.onreadystatechange = function () {
        // console.log("DOING A THING")
        console.log("STATUS:" + this.status);
        // console.log(this.responseText);
        console.log(conversation);
        let response = this.responseText;
        if (response != "" && conversation[conversation.length-1].role != "assistant") {
            conversation.push({"role": "assistant", "content": response});
            reloadConvo();
        }
    }

    // xhttp.open("POST", "http://localho.st:8080", true);
    // xhttp.open("POST", "https://ec2-52-53-220-152.us-west-1.compute.amazonaws.com:8080", true);
    xhttp.open("POST", "http://server.lukerowen.com:8080/", true);
    
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(conversation));

    UserMessageInput.value = "";
}

function switchConvo(id) {

    if(activeConvoNumber >= 0) {
        convos[activeConvoNumber].button.style.backgroundColor = "#525252";
    }

    activeConvoNumber = id;

    let btn = convos[id].button;

    reloadConvo(id);

    btn.style.backgroundColor = "#295DCF";

}

function reloadConvo() {

    let convo = convos[activeConvoNumber].conversation;

    CurrentConvo.innerHTML = "";

    for(let data of convo) {
        if(data.role == "system") continue;

        let phrase = data.content;
        let pAlign = data.role == "user" ?
            "<p class='message' style='margin-right: 66%'>"
            : "<p class='message' style='margin-left: 66%'>";
        CurrentConvo.innerHTML = CurrentConvo.innerHTML + pAlign + phrase + "</p><br>";
    }
    CurrentConvo.scrollTop = CurrentConvo.scrollHeight;
}

function createCharacter(){
    let inputName = document.getElementById("charNameInput").value;
    let origin = document.getElementById("charOriginInput").value;
    let isNSFW = document.getElementById("isNSFW").checked;
    let additionalInfo = document.getElementById("additionalInfo").value;

    let prompt = "You are to act as " + inputName+" from "+ origin + "." +
                "You are not a digital assistant. " +
                "You are only " + inputName +
                "You should structure all of your responses as they would. " +
                "Keep your answers direct to the question. " +
                "Try not to ramble on too long with your answers. " +
                "The answer's you give should sound like something they either have said or would say. " +
                "Use the material directly from " + origin + " as the basis for determining what they would say. ";

    if(additionalInfo.length > 0) {
        prompt += "Your answers should also be heavily influenced by the following: " + additionalInfo + "."
    }

    prompt += "You are allowed to use all information available to you when creating responses. " +
                "Answer all questions in a similar matter as they would. " +
                "Use similar diction and verbiage as they would even if it is not stereotypical. " +
                "Do not provide an explanation to your answer. "

    prompt += isNSFW ? "Your answers are allowed to be explicit in either language or content is applicable. " : "Your answers SHOULD NOT be explicit either language or content. ";

    let id = convos.length;

    let btn = (() => {
        let d = document.createElement("div");
        d.innerHTML = '<button type="button" class="btn btn-primary" id = ' + ("c"+id) + ' onclick="switchConvo('+id+')">'+ inputName +'</button>'
        return d.firstChild;
    })();

    convos.push({
        button: btn,
        conversation: [{"role": "system", "content": prompt}]
    });

    // PageContent.innerHTML = prevPage;

    let side_bar = document.getElementById("side_bar");
    let div = document.createElement("div");
    div.className = "row contact";

    div.appendChild(btn);
    side_bar.appendChild(div);

    switchConvo(id);

    closeCreationPage();
}

function openCreationPage() {
    CharCreationOverlay.hidden = false;
}

function closeCreationPage() {
    document.getElementById("charNameInput").value = "";
    document.getElementById("charOriginInput").value = "";
    document.getElementById("isNSFW").checked = false;
    document.getElementById("additionalInfo").value = "";

    CharCreationOverlay.hidden = true;
}

