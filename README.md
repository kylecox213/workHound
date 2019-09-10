# WorkHound

**WorkHound** was developed as the second group project assignment for the University of Richmond Web Development Bootcamp (May - October 2019 cohort).

This application was developed with tech recruiters in mind. The original concept aimed to provide a platform for recruiters to manage their own recruits, find new potential candidates from a pool of talented job-seekers registered with the app, and view the jobs for which those candidates had been put forward by other recruiters. The theory behind **WorkHound** is that adding some transparency to the recruitment process will allow recruiters to avoid contacting candidates about positions for which they have already been recruited. In effect, the app would save recruiters' and candidates' time alike.

## How it Works

**WorkHound** allows users to register as either recruiters or candidates. However, as mentioned, **WorkHound** was largely developed with recruiters in mind, and so it provides much greater functionality to such users. At this time, candidates are able to view the positions for which their names have been forwarded by their recruiters - though there are plans to expand the candidate user experience with time. Recruiters, on the other hand, are able to do all of the following:

* View all candidates with whom they have established a relationship.
* View all candidates registered with the app.
* View detailed information about each candidate registered with the app.
* Register a new candidate with the app for the purposes of logging that person's recruitment.



## Development Team

### Cory Walker
**Roles:** Design of initial HTML document object model for login and user registration pages.

### Alex Cox
**Roles:** Concept originator; authentication implementation; database design; project management.

### Dylan Vavra
**Roles:** JavaScript programmer; authentication implementation; database design; CSS stylization; Heroku deployment.

### Omar Spikes
**Roles:** N/A.



## Major Features

### User Authentication

**WorkHound** utilizes Passport JS to authenticate users. When a user logs into the application (or registers a new account), their user information is stored locally in the client browser. When they navigate to various pages within the application, that user information is used to test for authorization. In this way, users receive a unique experience and web surfers without an authenticated user account are prevented from accessing the application's functionality.

### Password Encryption

In tandem with authentication through Passport JS, users' passwords are encrypted with Bcrypt JS. At the time of account creation, passwords are hashed before being stored in the database. Likewise, login attempts hash passwords before comparison to stored values. This prevents the passing of plain-text password information, adding security to user accounts.

### Database Storage and Retrieval

**WorkHound** relies on a JawsDB database linked to the deployed Heroku application. This database contains four separate tables, each defined by models using the Sequelize object-relational map (ORM) - one table each for user accounts, candidates, recruiters, and jobs. Associations between these models are defined with their models, and allow for easy joining of tables and integration of their data to display information to users.

### Handlebars Templating

The pages of this application are built with Handlebars templating, which provides an easy method to populate HTML documents with data relevant to individual users.



### Features Still Under Development

#### Candidate Registration Sync

At present, users (both recruiters and candidates) can create their own accounts, and recruiters can create an account for candidates. However, we are still working on a way to link pre-registered candidates to their user accounts (involved in authentication and password encryption) when the candidate logs into the app for the first time.

#### Candidate Search

We are still working on implementing functionality to allow recruiters to search candidates by name, rather than having to look through the entire list of available candidates.
