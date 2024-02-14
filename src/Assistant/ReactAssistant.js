// Import necessary dependencies and styles
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useEffect, useState } from 'react';
import "./ReactAssistant.css"
import "./MediaQuery.css"
import video1 from "../Videos/video1.mp4";


// Main Speech component
const Speech = () => {

  // Initialize speech recognition hooks
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  
  // Start listening when the component mounts
  useEffect(() => {
    if (SpeechRecognition.browserSupportsSpeechRecognition()) {
      SpeechRecognition.startListening({ continuous: false });
      console.log("Started listening..");
    } else {
      console.error("Speech recognition not supported in this browser.");
    }
  }, []);

  // Handle actions when listening state changes
  useEffect(() => {
    if (!listening) {
      handleSendButtonClick();
    }
  }, [listening]);

  // Initialize speech synthesis support
  const [speechSynthesisSupported] = useState('speechSynthesis' in window);
  const recognition = SpeechRecognition || SpeechRecognition();

  // Function to speak the provided text
  const speak = (text) => {
    try {
      if (speechSynthesisSupported) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Speech synthesis not supported in this browser.');
      }
    } catch (error) {
      alert('Error during speech synthesis:', error);
    }
  }

  // Function to stop the current speech synthesis
  const stopSpeaking = () => {
    if (speechSynthesisSupported) {
      window.speechSynthesis.cancel();
    }
  };


  // State variables for user, message, link, acknowledgment response, and speech mode
  const [user, setUser] = useState("User");
  const [msg, setMsg] = useState("");
  const [link, setLink] = useState("");
  const [ackrep, setackrep] = useState([]);
  const [responseMsg, setResponseMsg] = useState("Talking..")
  const [speackMode, setSpeackMode] = useState(false)

  // Function to toggle speech mode
  const setTalkMode = () => {
    setSpeackMode(!speackMode);
    speackMode ?
      speak("Jarvis is not enable to talk with you")
      : speak("jarvis initializing, jarvis is excited to tallking with you")
  }

  // Function to start listening for user input
  const startListening = (ev) => {
    if (ev) {
      ev.preventDefault();
    }
    recognition.startListening();
    setUser("User");
    resetTranscript();
    setLink("")

  }


  // Function to handle user button click for sending the message
  const handleSendButtonClick = (ev) => {
    if (ev) {
      ev.preventDefault();
    }
    setUser(" Jarvis");
    if (msg === "") {
      takeCommand(transcript.toLowerCase());
    } else {
      takeCommand(msg.toLowerCase());
      transcript.toLowerCase();
    }
    setMsg("")
  };


  // Function to fetch acknowledgment response from a search API
  const fetchackrep = async (message) => {
    try 
    {
      const YOUR_API_KEY = ""
      const CONTEXT_KEY = "53e70605537939003";
      const term = message;
      const resp = await fetch(`https://www.googleapis.com/customsearch/v1?key=${YOUR_API_KEY}&cx=${CONTEXT_KEY}&q=${term}`);
      const ackrep = await resp.json();
      setackrep(ackrep)
      console.log(ackrep);

      if (ackrep?.items && ackrep.items.length > 0) 
      {
        (speackMode ? speak : setResponseMsg)
          ("I Provide information according to "
            + ackrep.items[0].displayLink + " this information which is found at "
            + ackrep.items[0].snippet + " read more information by using this below link : "
          );
        setLink(ackrep.items[0].link)
      } 
      else {
        console.log("No ackrep available");
        if (message === "") 
        {
          speak("")
        }
        else 
        {
          speak("Sorry, I couldn't find any relevant information.");
        }
      }
    } 
    catch (error) 
    {
      console.error("Error fetching ackrep:", error);
    }
  }

  // Function to handle different commands based on user input
  function takeCommand(message) {
    let myWindow;

    if (message.includes('hey') || message.includes('hello')) {
      const finalText = "Hello Sir, How May I Help You";
      (speackMode ? speak : setResponseMsg)(finalText);
    }
    else if (message.includes("open google")) {
      myWindow = window.open("https://google.com", "_blank");
      speak("Opening Google...")

    }
    else if (message.includes("open youtube")) {
      myWindow = window.open("https://youtube.com", "_blank");
      speak("Opening Youtube...")

    }
    else if (message.includes("open hotstar")) {
      window.open("https://hotstar.com", "_blank");
      speak("Opening hotstar...")

    }
    else if (message.includes("open telegram")) {
      myWindow = window.open("https://telegram.com", "_blank");
      speak("Opening telegram...")
    }
    else if (message.includes("open facebook")) {
      myWindow = window.open("https://facebook.com", "_blank");
      speak("Opening Facebook...")
    }

    else if (message.includes('your name')) {
      const finalText = "My name is Jarvis, I am a fictional artificial intelligence that first appeared in the Marvel Cinematic Universe1.I created by Tony Stark to manage his home and laboratory1. However, there are many real-life projects named after J.A.R.V.I.S. that aim to create personal assistants, chatbots, and more using Python, JavaScript, and other languages and libraries ";
      (speackMode ? speak : setResponseMsg)(finalText);
    }
    else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
      window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
      const finalText = "This is what i found on internet regarding " + message;
      speak(finalText);
    }
    else if (message.includes('wikipedia')) {
      window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
      const finalText = "This is what i found on wikipedia regarding " + message;
      speak(finalText);
    }
    else if (message.includes('time')) {
      const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" })
      const finalText = time;
      (speackMode ? speak : setResponseMsg)(finalText);
    }
    else if (message.includes('date')) {
      const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" })
      const finalText = date;
      (speackMode ? speak : setResponseMsg)(finalText);
    }
    else if (message.includes('calculator')) {
      window.open('Calculator:///')
      const finalText = "Opening Calculator";
      speak(finalText);
    }
    else if (message.includes('thank you') || message.includes('meet you')) {
      const finalText = "You're welcome! If you have any more questions or if there's anything else I can help you with, feel free to ask. Happy coding!";
      (speackMode ? speak : setResponseMsg)(finalText);
    }
    else {
      fetchackrep(message);
    }
  }

// JSX structure for the Speech component
  return (
    <>
      <div className='wholeData' >
        <div className='heading'>
          <h4>Microphone:
            {
              listening ?
                <span style={{ color: "#0aff0a" }}>On</span>
                : <span style={{ color: "rgb(255 46 106)" }}> Mute</span>
            }
          </h4>
          <span className='speckMode'>
            {speackMode ? "Jarvis Talk with you" : "Writing Mode On"}
            <button onClick={setTalkMode}>
              <i class={speackMode ? "bi bi-toggle-on" : "bi bi-toggle-off"} ></i>
            </button>
          </span>
        </div>                                            {/*heading part end*/}

        <div className='para1'> 

            <div className="paraA">
              <span>
                <i className={user === "User" ? "bi bi-person-fill-gear" : "bi bi-robot"} ></i>
              </span>

              <span style={{ margin: "1% 0 0 2%" }}>
                <strong >{user}</strong>
                :{speackMode ? ("") : responseMsg}<br/>
                <a target='_blank' href={link} >{link}
                </a>
              </span>
            </div>                                       {/*paraA end*/}

            <div className="paraB">
              <i onClick={stopSpeaking} className="bi bi-stop-circle" title='Stop Speaking'></i>
            </div>                                      {/*paraB end*/}

          </div>


        <div className='mic_data'>
          <video width="600" height="400" autoPlay loop muted>
            <source src={video1}
              type="video/mp4" />
          </video>
        </div>                                             {/*mic_data end*/}

        <div className='bottom_data' >
          <form>
            <div className="msgContainer">
              <div className="msgOperation">

                <div className="inputMsg">
                  <input type='text' 
                         value={msg || transcript} 
                         placeholder='Enter Message..' 
                         onChange={(e) => { setMsg(e.target.value); }}
                  />
                </div>

                <div className="micOn">
                  <button onClick={(e) => startListening(e)}>
                    <i className={listening ? "bi bi-mic" : "bi bi-mic-mute"} title='Start Listening'></i>
                  </button>
                </div>

              </div>                                              {/*msgOperation end*/}                                      

              <div className="sendMsg">

                <div className="refresh">
                  <button onClick={resetTranscript}><i className="bi bi-arrow-clockwise"></i></button>
                </div>

                <div className="sendData">
                  <button onClick={(e) => handleSendButtonClick(e)} >
                    <i className="bi bi-send-check" title='Send Command' ></i>
                  </button>
                </div>

              </div>                                            {/*sendMsg end*/}          

            </div>                                              {/*msgContainer end*/}
          </form>
        
          <div className='para'> 

            <div className="paraA">
              <span>
                <i className={user === "User" ? "bi bi-person-fill-gear" : "bi bi-robot"} ></i>
              </span>

              <span style={{ margin: "1% 0 0 2%" }}>
                <strong >{user}</strong>
                :{speackMode ? ("") : responseMsg}<br/>
                <a target='_blank' href={link} >{link}
                </a>
              </span>
            </div>                                       {/*paraA end*/}

            <div className="paraB">
              <i onClick={stopSpeaking} className="bi bi-stop-circle" title='Stop Speaking'></i>
            </div>                                      {/*paraB end*/}

          </div>                                        {/*para end*/}
            <p style={{textAlign:"center",margin:"2%"}}>Its Like Google Gemini</p>
        </div>

      </div>                                            {/*whole part end*/}
    </>
  )
}
export default Speech;
