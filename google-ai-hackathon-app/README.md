# JENNA

### Functionality
<p>Jenna is an intelligent creative content generator submitted as a contestant for the 2024 Google AI Hackathon. The name Jenna is a play on the term Generative AI or GenAI for short. The application fosters the integration of technology and the arts by generating both literary and artistic content with the help of AI and a user input prompts.</p>

<p>A user may enter a text prompt or a combination of a text and image prompt in order to generate a literare content of their choice, having the option to choose a story, play, poem or song.</p>

<p>Likewise, a use may enter a text prompt in order to generate up to three artistic images in a style of their choice, having the option to choose photography, oil painting, acrylic, watercolor, digital art or a sketch.</p>

<p>The application uses a combination of the Google Vertex AI API and the Google Gemini API to deliver the necessary content. VertexAI is used to generate literature with solely text prompts as well as artistic images with solely text prompts. Gemini is used for multimodal prompts, specifically literature content that uses both text and image prompts.</p>

<p>Once you have generated your content, you can copy the literature produced or right click on the artistic images to download them.</p>

### Google Authentication
<p>Jenna comes with the feature to store your generated content in a database once it has been generated so long as a user has an authenticated Google Session. This is acheived with the help of NextAuth and PostreSQL.</p>


### Google Cloud Project Setup
You will need to configure a Google Cloud Project in order to run Jenna.
<p>Go to the Google Cloud Console to create a project and copy the project Id.</p>
<p>Go the IAM tab to create a service account JSON. You need to encode this JSON file as a base 64 string.</b>
<p>

### Next.js Environment Setup
<p>Create a .env file and add the followin variables</p>

<p>NEXTAUTH_URL=</p>
<p>DOMAIN=</p>
<p>GOOGLE_ID=</p>
<p>GOOGLE_SECRET=</p>
<p>NEXTAUTH_SECRET=</p>
<p>NEXTAUTH_SECRET=</p>
<p>GCP_LOCATION=</p>
<p>GCP_PROJECT_ID=</p>
<p>GCP_SA_KEY_STRING=</p>
<p>GCP_CONTENT_RESULTS_BUCKET=</p>
<p>DB_URL=</p>
<p>GEMINI_API_KEY=</p>

### Steps to running the application
<p>Make sure you have Visual Studio code and Git installed on your device.</p>
<p>Create a folder in your computer where you want to run the project. Open Visual Studio Code and direct to this folder. </p>
<p>Copy this repository's url and and clone it in the terminal with the command git clone $url.</p>
<p>From the terminal cd into the project with the commmand cd google-ai-hackathon-app</p>
<p>Run the command npm install in order to intall all dependencies.</p>
<p>Run the command npm run dev to start the application. </p>
<p>The terminal will usually indicate that the app has started at localhost:3000. There are cases where the application will start at another port if port 3000 is busy, so check the terminal to get the corect port.</p>
<p>Go to a browser and type locahost:3000 in the url in order to run the application.</p>
<p>Have fun using Jenna!</p>

