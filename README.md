# RESTful Users API Documentation

A very basic implementation of the Users REST API which serves as a proof of concept and opportunity to explore new technologies.


## Getting started
	
Ensure `Docker` is running before launching as it is used to run a `mongo` instance. The Community Edition of `Docker` can be found [here](https://www.docker.com/community-edition#/download).
```
  git clone <this repo>
  npm install
  npm run dev
```
## Running tests
  * For `Travis CI` as it is called automatically during build. 

    `npm test`
  
  * For local testing.

    `npm run local-test`

## API documentation

There are two implementations of the API. 

The first implementation uses `/api/users` and `/api/users/:id` endpoints to implement the REST API and tests. See [API.md](API.md) for details.

The second implementation uses the endpoints `/users` and `/users/:id` in an attempt to create a front-end to the API. This is a messy workaround to allow the endpoints to return JSON using `res.json()` and render a webpage using`res.render()`.

## SonarQube
SonarQube was used to analyse and evaluate the code. It was useful in identifying possible bugs, redundant variable declarations and `console.log()` statements which should not be part of production code. 

Below is a screenshot of the SonarQube dashboard;

![sonarqube](http://i67.tinypic.com/302ui55.png)

## Travis CI and Heroku

`Travis CI` was used to build the project each time a commit was pushed to GitHub. After each build, `Travis CI` automatically deploys to `Heroku`. The deployed app can be found [here](http://usersapi-private.herokuapp.com/). 

Below is a screenshot of the build history on `Travis CI`;

![sonarqube](http://i65.tinypic.com/5mzihc.png)

## Issues

  * Front-end is not fully functional.
    * Not able to `UPDATE` and `DELETE` as forms on the front-end do not allow for `PUT` and `DELETE`. 
  * Creating a user is not fully functional.
    * `POST` requests from the front-end only update the outer key values of the user. Nested values are not updated. 
