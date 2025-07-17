// const fs = require('fs');
// const readline = require('readline');
// const express = require('express');
// const cors = require('cors');
// const { graphqlHTTP } = require('express-graphql');
// const {
//   GraphQLSchema,
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLList,
//   GraphQLInt,
//   GraphQLNonNull,
// } = require('graphql');

// const app = express();
// const PORT = 3000;

// app.use(cors());

// // Simulated auth middleware
// app.use((req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token || token !== 'Bearer test-token') {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
//   next();
// });

// const contextCategoryMap = {
//   Lifestyle: [
//     "GOOD NEWS",
//     "ENTERTAINMENT",
//     "COMEDY",
//     "WELLNESS",
//     "STYLE & BEAUTY",
//     "FOOD & DRINK",
//     "STYLE",
//     "TASTE",
//     "HEALTHY LIVING",
//     "WEDDINGS",
//     "TRAVEL",
//     "HOME & LIVING",
//     "QUEER VOICES",
//     "LATINO VOICES",
//     "BLACK VOICES",
//     "WOMEN",
//     "PARENTS",
//     "PARENTING",
//     "COLLEGE"
//   ],
//   CurrentAffairs: [
//     "POLITICS",
//     "BUSINESS",
//     "WORLD NEWS",
//     "U.S. NEWS",
//     "SCIENCE",
//     "ENVIRONMENT",
//     "EDUCATION",
//     "CRIME",
//     "RELIGION",
//     "MONEY",
//     "IMPACT",
//     "DIVORCE",
//     "MEDIA",
//     "THE WORLDPOST",
//     "WORLDPOST"
//   ],
//   TechnologyAndScience: [
//     "TECH",
//     "SCIENCE",
//     "GREEN"
//   ],
//   Weird: [
//     "WEIRD NEWS"
//   ],
//   ArtsAndCulture: [
//     "ARTS & CULTURE",
//     "ARTS",
//     "FIFTY"
//   ],
// };


// let newsData = [];

// async function loadNewsData() {
//   const rl = readline.createInterface({
//     input: fs.createReadStream('./backend/News_Category_Dataset_v3.json'),
//     crlfDelay: Infinity,
//   });

//   for await (const line of rl) {
//     try {
//       const obj = JSON.parse(line);
//       newsData.push(obj);
//     } catch (e) {
//       console.error('Skipping invalid JSON line:', e);
//     }
//   }
// }

// // Define GraphQL NewsArticle type
// const NewsArticleType = new GraphQLObjectType({
//   name: 'NewsArticle',
//   fields: {
//     title: { type: GraphQLString, resolve: (article) => article.headline || article.title },
//     category: { type: GraphQLString },
//     short_description: { type: GraphQLString },
//     link: { type: GraphQLString },
//   },
// });

// // Define root query type
// const RootQueryType = new GraphQLObjectType({
//   name: 'Query',
//   fields: {
//     news: {
//       type: new GraphQLList(NewsArticleType),
//       args: {
//         context: { type: GraphQLString },
//         limit: { type: GraphQLInt },
//       },
//       resolve: (parent, args) => {
//         let filteredNews = newsData;

//         if (args.context) {
//           const safeContext = args.context.toLowerCase().replace(/[^a-z]/g, '');
//           const categories = contextCategoryMap[safeContext];
//           if (categories) {
//             filteredNews = newsData.filter((article) =>
//               categories.includes(article.category)
//             );
//           }
//         }

//         const limit = args.limit || 10;
//         return filteredNews.slice(0, limit);
//       },
//     },
//   },
// });

// // Create GraphQL schema
// const schema = new GraphQLSchema({
//   query: RootQueryType,
// });

// // Mount GraphQL middleware at /news
// app.use(
//   '/news',
//   graphqlHTTP({
//     schema,
//     graphiql: true, // enable GraphiQL UI at /news for testing
//   })
// );

// function printUniqueCategories() {
//   const uniqueCategories = [...new Set(newsData.map(article => article.category))];
//   console.log('Unique Categories:');
//   uniqueCategories.forEach(category => {
//     console.log(category);
//   });
// }

// // Load data then start server
// loadNewsData()
//   .then(() => {
//     console.log(`Loaded ${newsData.length} articles`);
//     app.listen(PORT, () => {
//       console.log(`Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Failed to load news data:', err);
//   });

const fs = require('fs');
const readline = require('readline');
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require('graphql');

const app = express();
const PORT = 3000;

app.use(cors());

// Simulated auth middleware
app.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (!token || token !== 'Bearer test-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

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

let newsData = [];

async function loadNewsData() {
  const rl = readline.createInterface({
    input: fs.createReadStream('./backend/News_Category_Dataset_v3.json'),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      newsData.push(obj);
    } catch (e) {
      console.error('Skipping invalid JSON line:', e);
    }
  }
}

const NewsArticleType = new GraphQLObjectType({
  name: 'NewsArticle',
  fields: {
    title: { type: GraphQLString, resolve: (article) => article.headline || article.title },
    category: { type: GraphQLString },
    short_description: { type: GraphQLString },
    link: { type: GraphQLString },
  },
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    news: {
      type: new GraphQLList(NewsArticleType),
      args: {
        context: { type: GraphQLString },
        limit: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        let filteredNews = newsData;

        if (args.context && contextCategoryMap[args.context]) {
          const categories = contextCategoryMap[args.context];
          filteredNews = newsData.filter((article) =>
            categories.includes(article.category)
          );
        }

        const limit = args.limit || 10;
        return filteredNews.slice(0, limit);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  '/news',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

function printUniqueCategories() {
  const uniqueCategories = [...new Set(newsData.map(article => article.category))];
  console.log('Unique Categories:');
  uniqueCategories.forEach(category => console.log(category));
}

loadNewsData()
  .then(() => {
    console.log(`Loaded ${newsData.length} articles`);
    printUniqueCategories(); // Optional: comment this out if not needed
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to load news data:', err);
  });

