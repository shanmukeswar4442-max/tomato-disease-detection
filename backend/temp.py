import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

response = genai.GenerativeModel("gemini-2.5-flash").generate_content("say hello")
print(response.text)