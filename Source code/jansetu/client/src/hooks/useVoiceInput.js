import { useState, useRef } from "react";

const useVoiceInput = (setFormData) => {
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [text, setText] = useState("");

  const recognitionRef = useRef(null);

  const startVoice = (field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    setIsListening(true);
    setActiveField(field);
    setText("");

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }

      setText(finalTranscript);

      setFormData((prev) => ({
        ...prev,
        [field]: finalTranscript,
      }));
    };

    recognition.onerror = () => stopVoice();

    recognition.onend = () => {
      setIsListening(false);
      setActiveField("");
    };

    recognition.start();
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setActiveField("");
  };

  return {
    isListening,
    activeField,
    text,
    startVoice,
    stopVoice,
  };
};

export default useVoiceInput;