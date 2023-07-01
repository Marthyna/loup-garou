#!/bin/bash
(cd server
npm install
npm run start 
npm run test &
cd ../client
npx expo export:web
cd web-build
npx serve &
cd ..
npx cypress run 
kill -9 $(ps | grep node | awk '{print $1}')
)