require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/index.ts']

const doc = {
  info: {
    version: "1.0.0",
    title: "DevFinder",
    description: "DevFinder api",
  },
  host: process.env.APP_API_HOST,
  basePath: "/v1",
  schemes: ['https', 'http'],
  /*
  openapi: "3.0.0",
  servers: [
    {
      url: "http://localhost:3333",
      description: "Dev server"
    },
    {
      url: "https://devfinder-api.herokuapp.com/",
      description: "Staging server"
    }
  ],
  */
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",       // can be "header", "query" or "cookie"
      name: "authorization",  // name of the header, query parameter or cookie
      description: "Standard Authorization header using the Bearer scheme. Example: \"bearer {token}\"",
      token: "aaa"
    }
  },
  //security: { "apiKeyAuth": [] },
  definitions: {
    Dev: {
      "likes": [
        "5ee...20d",
        "5ee...b74"
      ],
      "deslikes": [
        "5ef...d86"
      ],
      "follow": [
        "5ef...2b9"
      ],
      "ignore": [
        "5ef...d7c",
        "5ef...d8f",
        "5ef...30b"
      ],
      "_id": "5f2...fd1",
      "name": "Marcelo Vilela",
      "user": "marcelovilela",
      "bio": "",
      "avatar": "https://avatars3.githubusercontent.com/u/32023347?v=4",
      "createdAt": "2020-07-30T19:40:49.524Z",
      "updatedAt": "2021-01-05T17:05:08.346Z",
      "__v": 51
    },
    ArrayOfDev: [
      { $ref: "#/definitions/Dev" }
    ],
    PaginationDev: {
      docs: { $ref: "#/definitions/ArrayOfDev" },
      total: 21,
      itemsPerPage: 30
    },
    Channel: {
      "tags": [
        "javascript",
        "react",
        "react native"
      ],
      "likes": [],
      "deslikes": [],
      "_id": "5ef...2b8",
      "name": "Rocketseat",
      "userGithub": "rocketseat",
      "link": "https://www.youtube.com/channel/UCSfwM5u0Kce6Cce8_S72olg",
      "description": "O canal da Rocketseat tá lotado de conteúdo para pessoas desenvolvedoras e ainda tem apoio da plataforma com vários conteúdos de programação gratuitos.",
      "category": "Desenvolvimento Front-End ",
      "createdAt": "2020-06-22T16:58:12.583Z",
      "updatedAt": "2020-07-24T14:28:15.541Z",
      "__v": 0,
      "avatar": "https://yt3.ggpht.com/a/AATXAJwSX58F1bJzQBZYiioJa36NuvznvNpsEVDfmc7qfg=s100-c-k-c0xffffffff-no-rj-mo"
    },
    ArrayOfChannel: [
      { $ref: "#/definitions/Channel" }
    ],
    AddChannel: {
      "link": "https://www.youtube.com/channel/UCSfwM5u0Kce6Cce8_S72olg",
      "title": "Rocketseat",
      "description": "O canal da Rocketseat tá lotado de conteúdo para pessoas desenvolvedoras e ainda tem apoio da plataforma com vários conteúdos de programação gratuitos.",
      "tags": ["javascript", "react", "react native"],
      "category": "Desenvolvimento Front-End "
    },
    ArrayOfChannelName: ["edinei.dev", "Uniday Studio"],
    Video: {
      "_id": "5f59628da399c000177530a4",
      "title": "Serverless com ReactJS e Next.js na Vercel | Code/Drops #56",
      "url": "https://www.youtube.com/watch?v=Cz55Jmhfw84",
      "channel_id": "5ef0e3248b7eac229c27e2b8",
      "channel": "Rocketseat",
      "channel_url": "https://www.youtube.com/channel/UCSfwM5u0Kce6Cce8_S72olg",
      "thumbnail": "https://i.ytimg.com/vi/Cz55Jmhfw84/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLAJKxcxvZ5M93JVuHMYkFF9KWlgnw",
      "createdAt": "2020-09-09T23:17:33.929Z",
      "updatedAt": "2020-09-09T23:17:33.929Z",
      "__v": 0
    },
    ArrayOfVideo: [
      { $ref: "#/definitions/Video" }
    ],
    PaginationVideo: {
      docs: { $ref: "#/definitions/ArrayOfVideo" },
      total: 1920,
      itemsPerPage: 30
    },
    AddVideo: {
      "title": "Serverless com ReactJS e Next.js na Vercel | Code/Drops #56",
      "url": "https://www.youtube.com/watch?v=Cz55Jmhfw84",
      "channel": "Rocketseat",
      "channel_url": "https://www.youtube.com/channel/UCSfwM5u0Kce6Cce8_S72olg",
      "thumbnail": "https://i.ytimg.com/vi/Cz55Jmhfw84/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLAJKxcxvZ5M93JVuHMYkFF9KWlgnw",
    },
    SearchResult: {
      "value": "ifNSDGgBV94",
      "label": "Mayk Brito, Student Experience at Rocketseat | Alumni 09",
      "type": "video"
    },
    ArrayOfSearchResult: [
      { $ref: "#/definitions/SearchResult" }
    ],
    AppInfo: {
      "appname": "DevFinder"
    }
  }
}

swaggerAutogen(outputFile, endpointsFiles, doc);
