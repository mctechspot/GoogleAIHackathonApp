# Jenna - Intelligent Content Generator

<p align="center">
  <img
  src="https://github.com/thelearner411/GoogleAIHackathonApp/blob/main/google-ai-hackathon-app/public/assets/banner.gif"
  alt="GitHub Profile Banner"
  width="450"
  height="auto"
  style="display: block; margin: auto;"
  />
</p>

<p>
  This project is a full-stack web application called Jenna, made as a submission for the 2024 Google AI Hackathon. The name "Jenna" is a play on the term GenAI or Generative Artificial Intelligence. The application uses user prompts to produce literature and art content.
</p>

<p>
  For literature content, the user has the option to enter either a sole text prompt or a combiantion of a text prompt and image alongside a selected content type - story, play, poem or song - in order to generate text content.
</p>

<p>
  For art content, the user may enter a text prompt as well as an art style - photography, oil, acrylic, watercolour, digital or sketch - and an image ration - square, portrait or landscape - in order to generate up to 3 images.
</p>

<p>The user also has the option to authenticate a browser session with a Google account so that their content is saved.</p>


## Project Setup
<ul>
  <li>Create a Google Cloud Project <a href="https://console.cloud.google.com/projectcreate">here</a>.</li>
  <li>Make sure to copy the project ID and location for later use.</li>
  <li>Create a <a href="https://console.cloud.google.com/iam-admin/serviceaccounts">service account key</a> in JSON format for the Google project. Encode the JSON content as a base 64 string. You can learn how to do so with the function found <a href="https://github.com/thelearner411/GoogleAIHackathonApp/blob/main/google-ai-hackathon-app/app/utils/DataParsing.tsx">here</a>. You will need this output string later.</li>
  <li>Go to the Google <a href="https://console.cloud.google.com/apis/credentials">credentials</a> page to geenrate an OAuth 2.0 Client ID for Google authentication in the Next.js application. For this credentials, add an entry under the authorised redirect URIs setting it to "http://localhost:3000/api/auth/callback/google". Copy the client ID and client secret of this credential sofr later use.</li>
  <li>Create a <a href="https://aistudio.google.com/app/apikey">Google Gemini API Key</a>. (** Gemini is not available in all locations, so you might need to connect to a VPN to make the application work)</li>
  <li>Request access to <a href="https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview">Imagen</a> on Google Vertex AI.</li>
  <li>In your Google Cloud Project, create a <a href="https://console.cloud.google.com/storage">Storage Bucket</a> and save the name of this bucket for later use. This bucket is important to save image used in prompts as well as generated images.</li>
  <li>Install <a href="https://www.pgadmin.org/">pgAdmin</a> on your device and create a database with credentials to store user content metadata</li>
  <li>Install <a href="https://dbeaver.io/">DBeaver</a> to connect to the database using the database credentials created in the previous step.</li>
  <li>Generate a </li>
</ul>

<p>Now that all essential variables are created, it is time to set up the environment files. Create a .env file in the google-ai-hackathon-app folder and add the following variables.</p>
<p>DB_URL="Place the PostgreSQL database url here"</p>
<p>DOMAIN="http://localhost:3000"</p>
<p>GCP_CONTENT_RESULTS_BUCKET="Paste the name of the Google Cloud Storage bucket here"</p>
<p>GCP_LOCATION="Paste your GCP project location here"</p>
<p>GCP_PROJECT_ID="Paste your Google Cloud Project ID here"</p>
<p>GCP_SA_KEY_STRING="Paste your base64 string of the service account JSON here"</p>
<p>GEMINI_API_KEY="Paste your Gemini API key here"</p>
<p>GOOGLE_ID="Paste your OAuth 2.0 Client secret here"</p>
<p>GOOGLE_SECRET="Paste your OAuth 2.0 Client secret here"</p>
<p>NEXTAUTH_SECRET="Paste your Next authentication secret here"</p>
<p>NEXTAUTH_URL="http://localhost:3000"</p>


