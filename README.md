This is my little project i developed in a short time.
Its about guessing scrambled words in turkish, i tested with GET /word to ensure if the word is scrambled correctly and with POST /guess you can enter your guess as a plain text.
Starting the server and opening the HTML file will direct you to the simple site i made to enter your guesses and chech if its correct there.
Commit 30-05-2025 Ive changed the file structure of the code to be more readable and be organized.
Commit 31-05-2025 Ive succesfully added a database to the API

Prerequisites

-Node.js (v14 or higher recommended)

-MongoDB running locally 

-express hast to be version 4.x does not work with 5.x

Installation

-clone repo

-install dependencies

-seed the database (if you want)


Usage

-Start the server

-Open your browser and go to: http://localhost:8080

-Use the webpage to play

Testing With Postman

-GET /api/word
Returns a scrambled word.(plain text)

-POST /api/guess
Send your guess in the request body (JSON with guess field).

-GET /api/hint
Returns a hint for the current word 

Features

-Scrambled word generation

-Basic webpage that allows users to view 

-Hint system

-Guesses are saved in MongoDB for review

-You can manage words directly using MongoDB Compass

-Can handle errors

Future Features

-Admin panel to add/edit/delete words

-More advanced hints 

