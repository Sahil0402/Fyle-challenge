const githubBaseURL = "https://api.github.com";
let userName = "freeCodeCamp";
const token = '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';

const avatarURL = document.getElementById('userImage');
const userDetails = document.querySelector('.user-details');
const avatarContainer = document.querySelector('.avatar-container');
const locationCon = document.querySelector('.location');
const githubCon = document.querySelector('.githubCon');
const profileCard = document.querySelector('.profile-card');
const userNamePlaceHolder = document.getElementById('userName');;
const userBio = document.getElementById('userBio');
const userLocation = document.getElementById('userCountry');;
const userTwitterHandle = document.getElementById('twitterHandle');
const githubURL = document.getElementById('githubURL');
const repoCountSelection = document.getElementById('repoCountSelection');

const row = document.querySelector('.row');
let currentPage = 1;

const inputUserName = document.getElementById('inputField');
const inputFrom = document.getElementById('inputFrom');
inputFrom.addEventListener("submit", (e) => {
    e.preventDefault();
    userName = inputUserName.value;
    fetchAllData();
});

function fetchUserDetails() {
    return fetch(`${githubBaseURL}/users/${userName}`, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
        .then(response => response.json());
}

function fetchRepositories(page = 1, perPage = 10) {
    return fetch(`${githubBaseURL}/users/${userName}/repos?page=${page}&per_page=${perPage}`, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
        .then(response => response.json());
}

function fetchRepoLanguages(repoName) {
    return fetch(`${githubBaseURL}/repos/${userName}/${repoName}/languages`, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
        .then(response => response.json());
}


function setUserDetails(userData) {

    document.querySelector('.skeleton-loader').style.display = 'none';
    userDetails.style.display = 'block';
    avatarContainer.style.display = 'block';
    githubCon.style.display = 'block';
    locationCon.style.display = 'block';
    repoCountSelection.style.display = 'block';


    avatarURL.src = userData.avatarUrl;
    userNamePlaceHolder.textContent = userData.username;
    userBio.textContent = userData.bio;
    userLocation.innerHTML = userData.location;
    const twitterData = 'Twitter: https://twitter.com/' + userData.twitter_username;
    userTwitterHandle.textContent = twitterData
    userTwitterHandle.href = twitterData;

    const githubData = userData.github_link;
    githubURL.textContent = githubData
    githubURL.href = githubData;
}
function createRepoCard(repoName, repoDescription, tags) {

    const colDiv = document.createElement('div');
    colDiv.className = 'col-12 col-sm-6';

    const repoDiv = document.createElement('div');
    repoDiv.className = 'repo';

    const repoNameElement = document.createElement('h3');
    repoNameElement.id = 'repoName';
    repoNameElement.textContent = repoName;
    repoDiv.appendChild(repoNameElement);

    const repoDescriptionElement = document.createElement('p');
    repoDescriptionElement.id = 'repoDescription';
    repoDescriptionElement.className = 'description';

    if (repoDescription) {
        repoDescriptionElement.textContent = repoDescription;
        repoDiv.appendChild(repoDescriptionElement);
    } else {
        repoDescriptionElement.textContent = 'No description found!';
        repoDiv.appendChild(repoDescriptionElement);
    }

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'tags';

    if (tags && tags.length > 0) {
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag.toLowerCase();
            tagsDiv.appendChild(span);
        });
    } else {
        const noTagsSpan = document.createElement('span');
        noTagsSpan.className = 'tag';
        noTagsSpan.textContent = 'No topics found!';
        tagsDiv.appendChild(noTagsSpan);
    }

    repoDiv.appendChild(tagsDiv);
    colDiv.appendChild(repoDiv);

    return colDiv;
}

function setRepos(reposData) {
    row.innerHTML = '';
    reposData.forEach(repo => {
        const card = createRepoCard(repo.name, repo.description, repo.languages);
        row.appendChild(card);
    });
}

function createPagination(totalRepos) {
    const perPage = parseInt(document.getElementById('repoCountDropdown').value);
    const pageCount = Math.ceil(totalRepos / perPage);
    const paginationDiv = document.getElementById('pagination'); // Ensure this div exists in your HTML
    paginationDiv.innerHTML = ''; // Clear existing pagination controls

    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = "pageBtns";
        pageButton.textContent = i;
        if(i===1){
            pageButton.classList.add('active');
        }
        pageButton.onclick = () => fetchPageData(i, perPage);
        paginationDiv.appendChild(pageButton);
    }
}
function updateActiveButton(page) {

    const buttons = document.querySelectorAll('.pageBtns');

    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = buttons[page - 1];
    if (activeButton) {
        activeButton.classList.add('active');
    }

}

async function fetchPageData(page) {
    updateActiveButton();
    const perPage = parseInt(document.getElementById('repoCountDropdown').value);
    try {
        const repos = await fetchRepositories(page, perPage);
        const reposData = await Promise.all(repos.map(async repo => {
            const languages = await fetchRepoLanguages(repo.name);
            return {
                name: repo.name,
                description: repo.description,
                languages: Object.keys(languages)
            };
        }));

        setRepos(reposData);
        updateActiveButton(page);
    } catch (error) {
        console.error("Error fetching page data:", error);
    }
}

document.getElementById('repoCountDropdown').addEventListener('change', function () {
    currentPage = 1;
    fetchAllData();
});

async function fetchAllData() {

    avatarContainer.style.display = 'none';
    githubCon.style.display = 'none';
    userDetails.style.display = 'none';
    document.getElementById('pagination').style.visibility = 'hidden';
    repoCountSelection.style.display = 'none';
    row.innerHTML = '';

    document.querySelector('.skeleton-loader').style.display = 'block';
    const perPage = parseInt(document.getElementById('repoCountDropdown').value);
    try {
        const userDetails = await fetchUserDetails();
        const repos = await fetchRepositories(1, perPage);

        const reposData = await Promise.all(repos.map(async repo => {
            const languages = await fetchRepoLanguages(repo.name);
            return {
                name: repo.name,
                description: repo.description,
                languages: Object.keys(languages)
            };
        }));

        const userData = {
            avatarUrl: userDetails.avatar_url,
            username: userDetails.name || userDetails.login,
            bio: userDetails.bio || 'This user prefers to keep an air of mystery about them.',
            location: userDetails.location || '🌏 Earth',
            twitter_username: userDetails.twitter_username,
            github_link: userDetails.html_url,
            repositories: reposData
        };

        setUserDetails(userData);
        setRepos(reposData);
        createPagination(userDetails.public_repos, perPage);
        document.getElementById('pagination').style.visibility = 'visible';

    } catch (error) {
        console.error("Error fetching data:", error);
        document.querySelector('.skeleton-loader').style.display = 'none';
    }
}

fetchAllData();
