#### Features

These are the features in mirror

- Smaller code base and easier to maintain and clone
- Script to generate JSON files
- **eslint** integration to maintain code
- Allowing to hide a article that is in DB but not as a JSON file
- Delete article, and category (UI in [anuratha](https://github.com/shadowfalls/anuradha) doesn't support this yet, APIs are ready)

#### Working

- To start the App do
`yarn start`
- To generate the json files
`yarn prep_json`
it will remove all existing json files are will generate the new files under `/api` in the root directory
- to run eslint and fix automatically fixable code
`yarn lint -- --fix`
this will run eslint alone
`yarn lint`

#### Points to note

- You need to install and run MongDB to make the server work. I have used [this](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) article to install mongoDB
- NodeJS needs a mongoDB driver to able to connect and perform operations on MongoDB. [This](https://mongodb.github.io/node-mongodb-native/3.5/reference/ecmascriptnext/crud/) is the documentation of the driver 
- Anurath is the front-end for this, need to switch the baseURL in there to allow it to hit the server
- At the time of writing this both mirror and this repo supports images
- There will be a folder called [models](https://github.com/shadowfalls/space_mirror/tree/master/src/models) that shows the model strecture of the collections in the DB (Except for [Response](https://github.com/shadowfalls/space_mirror/blob/master/src/models/Response.js) which is not used in the DB)
- There will be a file called [createDbQueries.txt](https://github.com/shadowfalls/space_mirror/blob/master/src/core/createDbQueries.txt) that has the queries that need to be run in the mongoDB console to create the collections
