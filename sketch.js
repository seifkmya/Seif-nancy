let botIsResponding = false;
let botBubble;
let humanBubble;
let logo;
let HumanText;
let BotText;
let inp;
let sendBtn;
let navigateBtn;
let speachBtn;
let talkBtn;
let mode=0;
var myVoice;

let speechRec;
function setup() {
    createCanvas(windowWidth, windowHeight);
    
    //RiveScript
    bot = new RiveScript(); //load library
    
    loadBot(); //call function to load the rivescript bot

    imageMode(CENTER);             //adjust image mode
    //Using a call back function to load first image
    loadImage('logo-proj2.png', logo => {
    image(logo, width / 2, height / 2 - 200, 500, 400);
    });
    
    //name
    fill("white");
    textSize(40);
    textStyle(BOLD);
    text("Nutrition and Fitness",width / 2 - 180, height / 2 + 50);
    
    
    //draw input field
    //textSize(30);
    //text("Enter Here: ",50, height-320)
    inp = createInput('');
    inp.attribute('placeholder',"Please enter your question here!")
    inp.position(50, height-70);
    inp.size(windowWidth-350,25);
    inp.input(HumanInputEvent);

    //draw button
    sendBtn = createButton('Send');
    sendBtn.position(width-160, height-70);
    sendBtn.size(120,30);
    sendBtn.mousePressed(submitQuestion);
    sendBtn.style('background-color', "#004ada");
    sendBtn.style('color', "white");
    
    //navigation button
    navigateBtn = createButton('Use Sound');
    navigateBtn.position(width-150, 300);
    navigateBtn.size(100);
    navigateBtn.mousePressed(navigate);
    
    
    //speak button
    speachBtn = createButton('Speak');
    speachBtn.position(width-150, 400);
    speachBtn.size(100);
    speachBtn.mousePressed(gotSpeech);
    
    //talk button
    talkBtn = createButton('Talk');
    talkBtn.position(width-150, 400);
    talkBtn.size(100);
    talkBtn.mousePressed(talk);
    
    
    //call variable and set up library here(or in a function)
    //don't forget to look for a call back function
    speechRec = new p5.SpeechRec('en-us', gotSpeech);
    
     //configure speech rec mode
        let continuous = true;
        let interimResults = false;
        speechRec.start(continuous, interimResults);
    
    gotSpeech();
    
    //my Voice
     myVoice = new p5.Speech(); // new P5.Speech object
     myVoice.speak("say something");
    
     const iconContainer = document.querySelector('.icon-container');

      // Create a new <i> element
      const icon = document.createElement('i');

      // Add the Font Awesome classes to the element
      icon.classList.add('fas', 'fa-solid', 'fa-circle-user');

      // Append the element to the container in your HTML
      iconContainer.appendChild(icon);


}


async function loadBot() {
 
//  await bot.loadFile('botbrain.rive.txt'); // wait for promise to resolve then loadfile
  await bot.loadFile('rashed.rive.txt'); 
}


function HumanInputEvent() {
  console.log('you are typing: ', this.value());
//    HumanText = this.value();
}

function navigate(){
    console.log("navigate");
    console.log("mode: "+mode);
    if(mode == 0){
        mode =1;
    }
    else{
        mode = 0;
    }
    
}

function submitQuestion(){
    setTimeout( () =>{
    console.log("inp.value: "+inp.value());
    console.log("Mouse is pressed!");
    HumanText = inp.value();
        getResponse();
    }, 0.5000);
    
    const humanText = inp.value();

  // Append/update the bot text within the chat bubble
  appendChatBubbleBot(BotText, 'chat__bubble--sent');

  // Append/update the human text within the chat bubble
  appendChatBubbleHuman(humanText, 'chat__bubble--rcvd');
}


function appendChatBubbleHuman(text, className) {
  const chatContainer = document.querySelector('.chat');

  // If human bubble already exists, update its content
  if (humanBubble) {
    const p = humanBubble.querySelector('p');
    p.textContent = text;
    return;
  }

  // Create a new list item element
  const li = document.createElement('li');
  li.classList.add('chat__bubble', className);

  // Create a new paragraph element for the text
  const p = document.createElement('p');
  p.textContent = text;

  // Append the paragraph element to the list item
  li.appendChild(p);

  // Append the list item to the chat container
  chatContainer.appendChild(li);
    
    // Position the chat bubble
  li.style.position = 'absolute';
  li.style.left = `${width / 15}px`;
  li.style.top = `${height - 200}px`;

  // Set the humanBubble variable to the created bubble
  if (className === 'chat__bubble--rcvd') {
    humanBubble = li;
  }
}

function appendChatBubbleBot(text, className) {
  const chatContainer = document.querySelector('.chat');

  // If bot bubble already exists, update its content
  if (botBubble) {
    const p = botBubble.querySelector('p');
    p.textContent = text;
    return;
  }

  // Create a new list item element
  const li = document.createElement('li');
  li.classList.add('chat__bubble', className);

  // Create a new paragraph element for the text
  const p = document.createElement('p');
  p.textContent = text;

  // Append the paragraph element to the list item
  li.appendChild(p);

  // Position the chat bubble
  li.style.position = 'absolute';
  li.style.left = `${windowWidth - 400}px`;
  li.style.top = `${height - 160}px`;

  // Append the list item to the chat container
  chatContainer.appendChild(li);

  // Set the botBubble variable to the created bubble
  if (className === 'chat__bubble--sent') {
    botBubble = li;
  }
}


function gotSpeech(){
    console.log("gotSpeech")
    if (speechRec.resultValue) {
        let said = speechRec.resultString;
    
        // display user input
        console.log(said);
    
        }
}

function talk(){
         setTimeout( () =>{
             myVoice.speak(BotText);
        }, 2000);
   
}

async function getResponse(){
    
    //--------------------bot response----------------------     
    //sort replies before running the bot
    bot.sortReplies();
    //wait for the promise to be returned(?)before loading the reply
    let response = await bot.reply('local-user', HumanText);
    //display response
    console.log(response);
    
    // Append bot's response to chat bubbles
    appendChatBubbleBot(response, 'chat__bubble--rcvd');
    
    BotText = response;
    
}


function draw() {
    if(mode == 0 ){ 
        inp.show();
        sendBtn.show();  
        
        speachBtn.hide();
        
//        speechRec.pause();
        
    }
    else if(mode == 1){
        inp.hide();
        sendBtn.hide();      
        
        speachBtn.show();
        
        if (speechRec.resultValue) {
            let said = speechRec.resultString;
            HumanText = said;
            // display user input
            console.log(said);
    
        }

        
    }
    
    
    //draw an empty textbox
    let rectX = width / 2;
    let rectY = height - 125;
    fill("black");
    rectMode(CENTER);
    rect(rectX, rectY, windowWidth - 50, 200, 20);
    
    //Human Text
    textSize(20);
    textAlign(LEFT);
    fill("white");
    if(HumanText == undefined)
        HumanText = "";
    
    /*text("> Human Text: "+HumanText,(width/15) ,height-200); //draw Human Text within a box*/
    
    
//    if(BotText == undefined)
//        BotText = "";
    if(HumanText.includes("weight is 80"))
        {
          BotText = "Hello There!";
        }
    else if(HumanText.includes("good morning"))
        BotText = "Good Morning Sir!";
    
    //draw Bot text inside the box
    let padding = 20;
    textSize(20);
    textAlign(RIGHT);
    strokeWeight(1);
    stroke(20);
    /*text(BotText+" : Bot Respond <", rectX - padding, rectY + (3*padding), windowWidth - 75, 190); //draw Bot Text within a box*/
    
    

  //gotSpeech();
}
