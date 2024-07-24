# Decentralized User Profile
This project is a decentralized user profile based on Ceramic network
which utilizes DID to authenticate users and sharing content. Developed by Greenia
as a part of Allostasis.

## Tech Stack
- React JS
- TypeScript
- Redux Store
- Docker

## Development
- clone the master repository
- run `docker build -t allostasis .`
- run `docker run -it -v ./:/usr/src/app/ -dp 0.0.0.0:3010:3010 allostasis`
- access on `http://IP_ADDR:3010`
- Have a good development!

## Deployment
- clone the master repository
- run `npm install`
- run `npm run build`. This will make `/build` folder.
- run http server like `apache` or `nginx`
- make `/build` folder the root document of the website
- All Done!

## Bugs and Errors
Just raise an issue in the repository.

## Contributors
- Reza Shams
- Ehsan Shams
- Mahsa Karimi

## Copyright
All rights of the project is reserved for `allostasis.io`
