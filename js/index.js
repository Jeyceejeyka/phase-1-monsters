const URL_PREFIX = 'http://localhost:3000/';
let page = 1; // Starting page for monsters
const monstersPerPage = 50; // Number of monsters to fetch per page

// Fetch monsters and display them
const getMonsters = (pageNumber = 1) => {
  console.log('Fetching monsters for page', pageNumber);
  fetch(URL_PREFIX + `monsters/?_limit=${monstersPerPage}&_page=${pageNumber}`)
    .then(response => response.json())
    .then(monsters => {
      document.querySelector('#monster-container').innerHTML = ''; // Clear previous list

      // If no monsters are found, display a message
      if (monsters.length === 0) {
        document.querySelector('#monster-container').innerHTML = '<p>No more monsters!</p>';
      } else {
        monsters.forEach(monster => {
          createMonsterCard(monster); // Create a card for each monster
        });
      }
      
      // Show or hide the 'back' button based on the current page
      document.querySelector('#back').style.display = pageNumber > 1 ? 'inline' : 'none';
    })
    .catch(error => console.error('Error fetching monsters:', error));
};

// Create a card for each monster
const createMonsterCard = (monster) => {
  let card = document.createElement('div');
  let name = document.createElement('h2');
  let age = document.createElement('h4');
  let description = document.createElement('p');

  name.innerHTML = `${monster.name}`;
  age.innerHTML = `Age: ${monster.age}`;
  description.innerHTML = `Bio: ${monster.description}`;

  card.appendChild(name);
  card.appendChild(age);
  card.appendChild(description);

  document.querySelector('#monster-container').appendChild(card);
};

// Create the monster form
const createMonsterForm = () => {
  const form = document.createElement('form');
  const nameInput = document.createElement('input');
  const ageInput = document.createElement('input');
  const descriptionInput = document.createElement('input');
  const submitButton = document.createElement('button');

  form.id = 'monster-form';
  nameInput.id = 'name';
  ageInput.id = 'age';
  descriptionInput.id = 'description';
  nameInput.placeholder = 'Name...';
  ageInput.placeholder = 'Age...';
  descriptionInput.placeholder = 'Description...';
  submitButton.innerHTML = 'Create Monster';

  form.appendChild(nameInput);
  form.appendChild(ageInput);
  form.appendChild(descriptionInput);
  form.appendChild(submitButton);

  document.getElementById('create-monster').appendChild(form);

  addSubmitEventListener();
};

// Add event listener for form submission
const addSubmitEventListener = () => {
  document.querySelector('#monster-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = getFormData();
    postNewMonster(formData); // Send the new monster to the API
    clearForm(); // Clear the form after submission
  });
};

// Get the data from the form
const getFormData = () => {
  let name = document.querySelector('#name');
  let age = document.querySelector('#age');
  let description = document.querySelector('#description');
  return {
    name: name.value,
    age: parseFloat(age.value),
    description: description.value
  };
};

// Post the new monster to the API
const postNewMonster = (monsterData) => {
  const url = URL_PREFIX + 'monsters';
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(monsterData)
  };

  fetch(url, config)
    .then(response => response.json())
    .then(newMonster => {
      console.log('New monster added:', newMonster);
      getMonsters(page); // Refresh the list after adding a new monster
    })
    .catch(error => console.error('Error adding monster:', error));
};

// Clear the form after submission
const clearForm = () => {
  document.querySelector('#monster-form').reset();
};

// Add event listeners for pagination buttons
const addNavListeners = () => {
  let backButton = document.querySelector('#back');
  let forwardButton = document.querySelector('#forward');

  backButton.addEventListener('click', () => {
    if (page > 1) {
      page--;
      getMonsters(page);
    }
  });

  forwardButton.addEventListener('click', () => {
    page++;
    getMonsters(page);
  });
};

// Initialize the app
const init = () => {
  getMonsters(page); // Load the first page of monsters
  createMonsterForm(); // Create the monster creation form
  addNavListeners(); // Add event listeners for pagination buttons
};

document.addEventListener('DOMContentLoaded', init);
