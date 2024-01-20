# GitGlance
GitGlance is a simple app that lets you see all the GitHub repositories of a user. Just type in a GitHub username, and GitGlance shows you a list of all their repos. It's great for anyone who wants to quickly check out someone's coding projects on GitHub.

## 🛠 Skills
HTML5, CSS3, Bootstrap, and JavaScript

## Running the Project
If you've cloned the GitGlance repository and want to run it on your local machine, follow these steps to set up a GitHub Personal Access Token. This token is necessary for GitGlance to interact with GitHub's API.

### Setting Up a GitHub Personal Access Token
1. **Go to Your GitHub Account:** Log into your GitHub account and navigate to your account settings.

2. **Access Developer Settings:** In your settings, look for a section on the left side called 'Developer settings' — it's usually at the bottom of the list.

3. **Personal Access Tokens:** Inside the Developer settings, find and click on 'Personal access tokens'. This is where you can manage tokens that allow applications to authenticate on behalf of your GitHub account.

4. **Fine-Grained Tokens:** Look for an option labeled 'Fine-grained tokens' and click on it.

5. **Generate New Token:** Click on 'Generate new token'. You'll need to provide details like the token description and select the scopes or permissions you want to grant this token. For GitGlance, you might need basic repo access.

6. **Copy the Token:** Once the token is generated, make sure to copy it immediately as GitHub won't show it again for security reasons.

7. **Update the Script:** Open the `script.js` file in the GitGlance codebase. Find the variable designated for the token (usually named something like `token`) and paste your copied token there.

   ```javascript
   const token = 'YOUR_COPIED_TOKEN';
