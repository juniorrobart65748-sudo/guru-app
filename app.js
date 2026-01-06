let name = localStorage.getItem("name") || "Friend";
const chat = document.getElementById("chat");

function addMsg(text, cls){
  const d = document.createElement("div");
  d.className = "msg " + cls;
  d.innerText = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

function speak(text){
  const u = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(u);
}

function listen(){
  const r = new (window.SpeechRecognition||webkitSpeechRecognition)();
  r.lang="en-IN";
  r.onresult=e=>handle(e.results[0][0].transcript.toLowerCase());
  r.start();
}

function handle(cmd){
  addMsg(cmd,"user");

  if(cmd.includes("my name")){
    name = cmd.split("name")[1].trim();
    localStorage.setItem("name",name);
    reply(`Nice name! I'll call you ${name} now 😊`);
  }

  else if(cmd.includes("note")){
    let n = cmd.replace("note","").trim();
    let notes = JSON.parse(localStorage.getItem("notes")||"[]");
    notes.push(n);
    localStorage.setItem("notes",JSON.stringify(notes));
    reply("Got it 👍 Note saved.");
  }

  else if(cmd.includes("plus")){
    let n = cmd.match(/\d+/g);
    reply(`Easy 😄 Answer is ${Number(n[0])+Number(n[1])}`);
  }

  else if(cmd.includes("how are you")){
    reply("I'm good 😊 Always here for you.");
  }

  else{
    reply("Hmm… interesting 🤔 Let me think...");
    fetchOnline(cmd);
  }
}

function reply(text){
  addMsg("Guru: "+text,"guru");
  speak(text);
}

function fetchOnline(q){
  fetch("https://api.affiliateplus.xyz/api/chatbot?message="+q+"&name=Guru&owner="+name)
  .then(r=>r.json())
  .then(d=>reply(d.message))
  .catch(()=>reply("Sorry 😔 internet issue lag raha hai"));
}
