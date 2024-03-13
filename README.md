# README

This repo contains the code for my Fillout coding challenge submission. 

## Deployment on Render

Render auto-updates from this repo, creating the following live endpoint:

https://fillout-ftbl.onrender.com/

## Test on Render

This repo contains a test script which is configured to test the render endpoint. 

1. Clone the repo
2. node test.mjs

## Local Deployment

The code can also be deployed locally as follows: 

1. Clone the repo
2. yarn
3. node app.js
4. Modify test.mjs to point to the local server at localhost:3001 by modifying baseURL in the code.

## Assumptions and Design

1. Regarding Pagination, I considered the following two approaches (1) Grab the requested 
number of responses from the backend, and filter the responses returned, returning the filtered
responses to the client. (2) Grab ALL the responses from the server, filter them and then pick out
the number requested based on the offset. Approach #1 is quick and easy but does not give a good user 
experience, so I chose #2. The downside of #2 is that we have to pull ALL the responses 
from the back-end regardless of which page is requested. If this became a performance issue
then I would consider a re-architecture - caching the partial responses on the middle tier in 
an in-memory db for example. 

2. Regarding the filters, at first this seems difficult since we don't appear to know if a string in a response is a 
date or just a regular string. I realized however that we can just use the comparison operator
and it will "do the right thing" whether it's a date, string or number, provided the JavaScript (string or number)
is correct. In fact this makes the filtering code very simple.  

3. During testing, I tried to exercise some code by reducing the pageSize (within getSubmissions) to 1 (from 150). The result
was that I got HTTP 429 errors (too many requests) which were reported in the payload. When 
I put the pageSize back to 150 the problem went away. With more time, I would like to 
investigate this further. 

