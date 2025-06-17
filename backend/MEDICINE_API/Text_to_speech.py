
import pyttsx3  # pip install pyttsx3
def str_to_speech(text):


    engine = pyttsx3.init()
    voices = engine.getProperty('voices')   # Returns a list of available speech voicing engines (say: english female)


    engine = pyttsx3.init()

    engine.say(text)

    engine.runAndWait()

text=input("ENTER TEXT\t")
str_to_speech(text)
