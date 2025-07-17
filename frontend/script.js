// const contextSelect = document.getElementById('context-select');
// const limitSelect = document.getElementById('limit-select');
// const fetchBtn = document.getElementById('fetch-news');
// const feedDiv = document.getElementById('feed');

// // Default load: fetch news with no context filter and limit 10
// window.addEventListener('DOMContentLoaded', () => {
//   fetchNews('', 10);  // empty context means no filter
// });

// // Fetch news on button click
// fetchBtn.addEventListener('click', () => {
//   const context = contextSelect.value;  // can be empty string
//   const limit = parseInt(limitSelect.value) || 10;

//   fetchNews(context, limit);
// });

// function fetchNews(context, limit) {
//   // Build GraphQL query with provided context and limit
//   const query = `
//     query {
//       news(context: "${context}", limit: ${limit}) {
//         title
//         category
//         short_description
//         link
//       }
//     }
//   `;

//   fetch('http://localhost:3000/news', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer test-token'
//     },
//     body: JSON.stringify({ query })
//   })
//     .then(res => res.json())
//     .then(data => {
//       const articles = data.data.news;
//       displayNews(articles);
//     })
//     .catch(error => {
//       console.error(error);
//       feedDiv.innerHTML = '<p>Failed to fetch news. Please check your connection or try again later.</p>';
//     });
// }

// function displayNews(articles) {
//   feedDiv.innerHTML = '';

//   if (!articles || articles.length === 0) {
//     feedDiv.innerHTML = '<p>No news articles for this context.</p>';
//     return;
//   }

//   articles.forEach(article => {
//     const articleDiv = document.createElement('div');
//     articleDiv.className = 'card';

//     articleDiv.innerHTML = `
//       <h3>${article.title}</h3>
//       <p>${article.short_description}</p>
//       <p><em>Category: ${article.category}</em></p>
//       ${article.link ? `<a href="${article.link}" target="_blank">Read more</a>` : ''}
//     `;

//     feedDiv.appendChild(articleDiv);
//   });
// }

// // Theme toggle
// const themeToggle = document.getElementById('theme-toggle');
// themeToggle.addEventListener('change', () => {
//   document.body.className = themeToggle.value === 'dark' ? 'dark' : '';
// });

const contextSelect = document.getElementById('context-select');
const limitSelect = document.getElementById('limit-select');
const fetchButton = document.getElementById('fetch-news');
const feedDiv = document.getElementById('feed');
const themeToggle = document.getElementById('theme-toggle');

// Updated context-to-tag mapping
const contextCategoryMap = {
  Lifestyle: [
    "GOOD NEWS", "ENTERTAINMENT", "COMEDY", "WELLNESS",
    "STYLE & BEAUTY", "FOOD & DRINK", "STYLE", "TASTE",
    "HEALTHY LIVING", "WEDDINGS", "TRAVEL", "HOME & LIVING",
    "QUEER VOICES", "LATINO VOICES", "BLACK VOICES",
    "WOMEN", "PARENTS", "PARENTING", "COLLEGE"
  ],
  CurrentAffairs: [
    "POLITICS", "BUSINESS", "WORLD NEWS", "U.S. NEWS",
    "SCIENCE", "ENVIRONMENT", "EDUCATION", "CRIME",
    "RELIGION", "MONEY", "IMPACT", "DIVORCE",
    "MEDIA", "THE WORLDPOST", "WORLDPOST"
  ],
  TechnologyAndScience: [
    "TECH", "SCIENCE", "GREEN"
  ],
  Weird: [
    "WEIRD NEWS"
  ],
  ArtsAndCulture: [
    "ARTS & CULTURE", "ARTS", "FIFTY"
  ],
};

// Function to fetch and display news
async function fetchNews() {
  const context = contextSelect.value;
  const limit = parseInt(limitSelect.value);

  const query = `
    query GetNews($context: String, $limit: Int) {
      news(context: $context, limit: $limit) {
        title
        category
        short_description
        link
      }
    }
  `;

  try {
    const res = await fetch('http://localhost:3000/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({
        query,
        variables: { context, limit },
      }),
    });

    const json = await res.json();
    const data = json.data.news;

    feedDiv.innerHTML = '';
    data.forEach(post => {
      const article = document.createElement('article');
      article.className = 'post';
      article.innerHTML = `
        <h2><a href="${post.link}" target="_blank">${post.title}</a></h2>
        <p>${post.short_description || ''}</p>
        <small>${post.category}</small>
      `;
      feedDiv.appendChild(article);
    });
  } catch (err) {
    console.error('Error fetching news:', err);
    feedDiv.innerHTML = '<p>Failed to load news. Please try again later.</p>';
  }
}


// Theme toggle
themeToggle.addEventListener('change', () => {
  const selectedTheme = themeToggle.value;
  document.body.className = selectedTheme;
});

// Fetch news on button click
fetchButton.addEventListener('click', fetchNews);

// Optional: Fetch news on page load
window.addEventListener('DOMContentLoaded', fetchNews);
