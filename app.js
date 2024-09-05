const sendChatBtn=document.querySelector("#send-btn");
const chatInput=document.querySelector(".chat-input textarea");
const chatbox=document.querySelector(".chatbox");


let userMessage;

const API_KEY="AIzaSyCnTZMfkyghjuq8yGOdV-E58cXkN8v87-M";

const API_URL=`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;


const createChatLi=(message,className)=>{
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing" ?`<p>${message}</p>`:`<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML=chatContent;
    return chatLi;
}

const generateResponse=async (incomingChatLi)=>{
    try{
        const messageElement=incomingChatLi.querySelector("p");
        const response=await fetch(API_URL,{
            method:"POST",
            headers:{"COntent-Type": "application/json"},
            body:JSON.stringify({
                contents:[{
                    role: "user",
                    parts:[{text: userMessage}]
                }]
            })
        });

        const data=await response.json();

        const apiResponse=data?.candidates[0].content.parts[0].text;

        messageElement.textContent=apiResponse;
        console.log(apiResponse);

    }catch(error){
        messageElement.textContent="Oops! Something went wrong, please try again later.";
        
    }finally{
        chatbox.scrollTo(0,chatbox.scrollHeight);
    }
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatInput.value="";

    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(()=>{
        const incomingChatLi=createChatLi(". . .","incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}


sendChatBtn.addEventListener("click",handleChat);