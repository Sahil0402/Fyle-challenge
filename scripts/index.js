const githubBaseURL = "https://api.github.com";
let userName = "freeCodeCamp";
const token = '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';

const avatarURL = document.getElementById('userImage');
const userDetails = document.querySelector('.user-details');
const avatarContainer = document.querySelector('.avatar-container');
const locationCon = document.querySelector('.location');
const githubCon = document.querySelector('.githubCon');
const userNamePlaceHolder = document.getElementById('userName');;
const userBio = document.getElementById('userBio');
const userLocation = document.getElementById('userCountry');;
const userTwitterHandle = document.getElementById('twitterHandle');
const githubURL = document.getElementById('githubURL');
const repoCountSelection = document.getElementById('repoCountSelection');

const row = document.querySelector('.row');
let currentPage = 1;
let totalRepos;

/* It will take the input from user like username */
const inputUserName = document.getElementById('inputField');
const inputFrom = document.getElementById('inputFrom');
inputFrom.addEventListener("submit", (e) => {
    e.preventDefault();
    userName = inputUserName.value;
    fetchAllData();
});

// Fetches the GitHub user details from the GitHub API using the provided username
function fetchUserDetails() {
    return fetch(`${githubBaseURL}/users/${userName}`, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
        .then(response => response.json());
}

// Retrieves a list of repositories for a given user, with pagination support.
function fetchRepositories(page = 1, perPage = 10) {
    return fetch(`${githubBaseURL}/users/${userName}/repos?page=${page}&per_page=${perPage}`, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
        .then(response => response.json());
}

// Fetches programming languages used in a specific repository.
function fetchRepoLanguages(repoName) {
    return fetch(`${githubBaseURL}/repos/${userName}/${repoName}/languages`, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
        .then(response => response.json());
}

// Updates the DOM with the user's details, such as avatar, name, bio, location, and GitHub links.
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

// Creates and returns a new DOM element representing a repository card with name, description, and tags.
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

// Clears the current repositories displayed and sets new ones from the provided data.
function setRepos(reposData) {
    row.innerHTML = '';
    reposData.forEach(repo => {
        const card = createRepoCard(repo.name, repo.description, repo.languages);
        row.appendChild(card);
    });
}

// Generates pagination buttons based on the total number of repositories and items per page.
function createPagination(totalRepos) {
    const perPage = parseInt(document.getElementById('repoCountDropdown').value);
    const pageCount = Math.ceil(totalRepos / perPage);
    const paginationNumbersDiv = document.getElementById('pageNumbers');
    paginationNumbersDiv.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = "pageBtns";
        pageButton.textContent = i;
        if(i === 1){
            pageButton.classList.add('active');
        }
        pageButton.onclick = () => fetchPageData(i, perPage);
        paginationNumbersDiv.appendChild(pageButton);
    }
}

// Updates the active state of pagination buttons based on the current page.
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

// Fetches and displays data for a specific page of repositories.
async function fetchPageData(page) {
    updateActiveButton(page);
    currentPage = page;
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

document.getElementById('olderBtn').addEventListener('click', function() {
    if (currentPage > 1) {
        fetchPageData(--currentPage);
    }
});

document.getElementById('newerBtn').addEventListener('click', function() {
    const perPage = parseInt(document.getElementById('repoCountDropdown').value);
    const maxPages = Math.ceil(totalRepos / perPage);
    if (currentPage < maxPages) {
        fetchPageData(++currentPage);
    }
});

document.getElementById('repoCountDropdown').addEventListener('change', function () {
    currentPage = 1;
    fetchAllData();
});

// Initializes the application by fetching and displaying all necessary data like user details and repositories.
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
        totalRepos = userDetails.public_repos;

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
