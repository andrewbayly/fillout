const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

async function filteredResponses(req, res){ 

  const result = await getSubmissions(req)

  res.type('json').send(result)
}

async function getSubmissions(req){ 

  const formId = req.params.formId

  const baseURL = 'https://api.fillout.com'
  const url = `/v1/api/forms/${formId}/submissions`

  const response = await fetch(baseURL + url, {

    headers : { 
      "Authorization" : "Bearer sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912"
    }

  })
  
  const content = await response.json()
  
  return content
}

/**
async function main(){ 
  console.log('Hello World')
  
  const baseURL = 'https://api.fillout.com'
  const url = '/v1/api/forms/cLZojxk94ous/submissions'
  
  const response = await fetch(baseURL + url, {

    headers : { 
      "Authorization" : "Bearer sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912"
    }

  })
  
  const content = await response.text()
  
  console.log(JSON.parse(content))
    
}

main()
**/


app.get("/:formId/filteredResponses", filteredResponses);

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;




/**
 TODO: 
 ----
   - print "hello world" to the console on server start-up. - DONE!
   - access api.fillout.com and print out sample data to the console. - DONE!
   - implement a test end-point which calls the above method to get the data.
   - test the end-point by calling the server from a test.js app
   
   
   
 NOTES:
 -----  
   - NOTE: There is no type information on the filter value so if the value is a 
     string then we have to infer if it should be treated a date or a string. 
     I chose to do this as follows: 
       if condition is greater_than or less_than then assume it's a date
       if condition is equals or does_not_equal then assume it's a string      
   
     That's just one approach. The ideal solution is to add the type. Failing that
     we could infer the type by the formatting of the string - if it looks like 
     a date then it's a date. However this is messy and involves building a 
   
**/




