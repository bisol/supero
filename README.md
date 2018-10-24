# Supero interview challenge

A simple task board, with columns for pending ands completed tasks. Tasks can be moved between them wth drag and drop, or editing a task's details.
It provides a detailed view (including task modification dates), and a update view (all dates are set automatically by the backend server). 
There is a toolbar on the top, which allows for user login (admin/admin) and direct manipulation of the database.

The task list view uses a single InfinityScroll for the pendng and clompleted task lists. While this works, a better UI would have separate scrolls for these lists. It wasn't done for lack of time.

The app uses Spring Boot for the bakend and React with Bootstrap for the front end. 
It was generated with JHipster (see below), saving a lot of time configuring the toolchain and boiler plate code (maven, npm, webpack, tests...). There are a LOT of generated files. The ones manually edited where:

* SuperoTaskResource.java
* SuperoTaskRepository.java
* SuperoTaskResourceIntTest.java
* files in /supero/src/main/webapp/app/modules/supero-task/

The application will try to connect to a MariaDB server on localhosty:3306, and expects a database named 'supero' to exist. 
To change this, edit the 'datasource' entry on these files: 

    /supero/src/main/resources/config/application-prod.yml
    /supero/src/main/resources/config/application-dev.yml

## Usage

This application was generated using JHipster 5.5.0, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v5.5.0](https://www.jhipster.tech/documentation-archive/v5.5.0).
Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

    npm install

We use npm scripts and [Webpack][] as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

    ./mvnw
    npm start

You can also run the backend from eclipse with the Spring Tool Suite plug in.
The `npm run` command will list all of the scripts available to run for this project.


## Building

To build the supero application, run:

    ./mvnw -Pprod clean package

To ensure everything worked, run:

    java -jar target/*.war

## Building for production

NOTE: This may require additional development packages to be installed on your system (like )
To optimize the supero application for production, run:

    ./mvnw -Pprod clean package

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

    java -jar target/*.war

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

## Testing

To launch your application's tests, run:

    ./mvnw clean test

### Client tests

Unit tests are run by [Jest][] and written with [Jasmine][]. They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

    npm test



For more information, refer to the [Running tests page][].

### Code quality

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker-compose -f src/main/docker/sonar.yml up -d
```

Then, run a Sonar analysis:

```
./mvnw -Pprod clean test sonar:sonar
```

For more information, refer to the [Code quality page][].

## Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.

For example, to start a mariadb database in a docker container, run:

    docker-compose -f src/main/docker/mariadb.yml up -d

To stop it and remove the container, run:

    docker-compose -f src/main/docker/mariadb.yml down

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a docker image of your app by running:

    ./mvnw package -Pprod jib:dockerBuild

Then run:

    docker-compose -f src/main/docker/app.yml up -d

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.
