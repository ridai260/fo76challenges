async function fetchChallenges() {
  try {
      const basePath = location.protocol + '//' + location.host;
      console.log(basePath +'/challenges.json');
      const response = await fetch(basePath +'/challenges.json');
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
  const basePath = location.protocol + '//' + location.host;
  const listItem = document.createElement('li');
  listItem.className = 'challenge-item';
  listItem.innerHTML = `
      <h3>${challenge.name}</h3>
      <p>${challenge.solution}</p>
      ${challenge.video ? `<video controls><source src="${basePath}/videos/${challenge.video}" type="video/mp4"></video>` : ''}
  `;
  return listItem;
}

function displayChallenges(challengesToDisplay) {
  if (!challengesToDisplay) {
    // Prevent console error
    return;
  }

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

/* Minerva fun */
function isMinervaAround() {
  const now = new Date();
  const currentDay = now.getUTCDay(); // Get the current day in UTC
  const currentHour = now.getUTCHours(); // Get the current hour in UTC

  // Convert US Eastern time to UTC time offset
  const easternOffset = -4; // EDT is UTC-4 during Daylight Saving Time (change to -5 for EST)
  
  // Correcting UTC to US Eastern time
  const easternTime = new Date(now.getTime() + easternOffset * 60 * 60 * 1000);
  const easternDay = easternTime.getUTCDay();
  const easternHour = easternTime.getUTCHours();

  // Start date of the known cycle (pick a known Monday noon, this needs to be updated if it's far in the past)
  const knownCycleStartDate = new Date(Date.UTC(2023, 6, 3, 16, 0)); // July 3, 2023, at noon US Eastern Time (16:00 UTC)
  
  // Calculate the difference in weeks from the known cycle start date
  const msInAWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSinceStart = Math.floor((now.getTime() - knownCycleStartDate.getTime()) / msInAWeek);
  const currentCycleWeek = (weeksSinceStart % 4) + 1;

  // Determine if Minerva is around today
  if (currentCycleWeek === 4) {
      // Week 4: Minerva's Big Sale, Thursday noon to Monday noon
      if (easternDay === 4 && easternHour >= 12) return true;
      if (easternDay > 4 && easternDay < 7) return true;
      if (easternDay === 0 && easternHour < 12) return true;
      return false;
  } else {
      // Week 1, 2, 3: Minerva's Emporium, Monday noon to Wednesday noon
      if (easternDay === 1 && easternHour >= 12) return true;
      if (easternDay === 2) return true;
      if (easternDay === 3 && easternHour < 12) return true;
      return false;
  }
}

if (isMinervaAround()) {
  document.querySelector(".minerva-info").style.display = "block";
  console.log("Minerva is around today: https://www.whereisminerva.com/");
} else {
  document.querySelector(".minerva-info").style.display = "none";
  console.log("Minerva is not around today");
}