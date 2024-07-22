async function fetchChallenges() {
  try {
      const response = await fetch('challenges.json');
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
  }
}

function createChallengeItem(challenge) {
  const listItem = document.createElement('li');
  listItem.className = 'challenge-item';
  listItem.innerHTML = `
      <h3>${challenge.name}</h3>
      <p>${challenge.solution}</p>
      ${challenge.video ? `<video controls><source src="videos/${challenge.video}" type="video/mp4"></video>` : ''}
  `;
  return listItem;
}

function displayChallenges(challengesToDisplay) {
  const list = document.getElementById('challengesList');
  list.innerHTML = '';
  challengesToDisplay.forEach(challenge => {
      const listItem = createChallengeItem(challenge);
      list.appendChild(listItem);
  });
}

function searchChallenges(challenges) {
  const input = document.getElementById('searchBox').value.toLowerCase();
  const filteredChallenges = challenges.filter(challenge => 
      challenge.name.toLowerCase().includes(input) || 
      challenge.solution.toLowerCase().includes(input)
  );
  displayChallenges(filteredChallenges);
}

document.addEventListener('DOMContentLoaded', async () => {
  const challenges = await fetchChallenges();
  displayChallenges(challenges);

  document.getElementById('searchBox').addEventListener('keyup', () => searchChallenges(challenges));
});
