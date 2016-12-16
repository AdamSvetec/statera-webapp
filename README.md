# Statera Web Application

Repo containing source code for running Statera web site at http://statera-us.com

## Server

Server.js handles all POST and GET requests and specifically queries db for information pertaining to company user has searched for.

## Templates

Jade code defining page layout and elements.

## Stylesheets

All code containing information on how each template is formatted is contained in the stylesheets/ directory. When built, the 'stylus' command compiles these sources and transforms them into css files so that our templates can be formatted.

## Static

Contains css/ and js/ directories which hold respective file types.

## Build

In order to clean and compile stylesheets, execute the command 'npm run build'.

## Start Web Server

In order to fire up the web server, execute the command 'npm run start'.


