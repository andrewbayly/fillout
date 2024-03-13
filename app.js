const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

//routes:
app.get("/:formId/filteredResponses", filteredResponses);

const server = app.listen(port, () => console.log(`Listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;


/**
  Helper function which is directly called by the route
  and translates the call into a direct function call.
**/
async function filteredResponses(req, res){ 

  const result = await getSubmissions(req)

  res.type('json').send(result)
}

/**
Helper function which processes a (back-end) server request.
  formId: the formId to hit.
  request: an object whose properties are URL params for the request.
**/
async function processServerRequest(formId, request){ 

  var paramList = [] 
  Object.keys(request).forEach(paramName => {
    const paramValue = request[paramName]
    paramList.push(`${paramName}=${paramValue}`)
  })  

  const baseURL = 'https://api.fillout.com'
  var url = `/v1/api/forms/${formId}/submissions`

  if(paramList.length > 0){ 
    url = url + '?' + paramList.join('&') 
  }

  const res = await fetch(baseURL + url, {

    headers : { 
      "Authorization" : "Bearer sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912"
    }

  })
  
  const content = await res.json()
  
  return content
}

/**
 Function which performs main business logic for the request: 
   - get all the responses from the back-end ( maybe over the course of multiple requests to the back-end )
   - filter the responses
   - assemble the result object with the pageCount and totalResponses properties
   - using offset and limit, select only the requested responses and add them to the result object
   - return the result object
**/
async function getSubmissions(req){ 


  //get responses from back-end: 
  
  const formId = req.params.formId
  
  const queryParamNames = ['afterDate', 'beforeDate', 'status', 'includeEditLink', 'editLink', 'sort']

  var request = {}
  queryParamNames.forEach(name => {
    if(name in req.query)
      request[name] = req.query[name]
  })

  request.limit = 150

  var res = await processServerRequest(formId, request)

  const totalResponses = res.totalResponses
  
  var responses = res.responses
  
  while(responses.length < totalResponses ){
    request.offset = responses.length 
    res = await processServerRequest(formId, request)
    responses = responses.concat(res.responses)
  }


  //apply filters: 
  
  var filters = []
  
  if('filters' in req.query){ 
    filters = JSON.parse( req.query.filters )
    
    responses = applyFilters(responses, filters)
  }
  
  
  //start building result: 
  
  var result = {}
  result.totalResponses = responses.length
  
  var limit = 150
  if('limit' in req.query){ 
    limit = req.query.limit - 0 
  }
  
  result.pageCount = Math.ceil( responses.length / limit )

  var offset = 0
  if('offset' in req.query){ 
    offset = req.query.offset - 0
  }
  
  
  //add the selected responses to the result object:
  
  result.responses = responses.slice(offset, offset + limit)
  
  
  //return result:

  return result
}

/**
 Apply the filters to the array of responses, 
 thus returning only the responses which match.
**/
function applyFilters(responses, filters){ 
  
  responses = responses.filter(response => {

    var bChoose = true
  
    filters.forEach(f => {
      
      const question = response.questions.find(q => q.id == f.id)
        
      if(!question || 
          (f.condition == 'equals' && question.value != f.value)||
          (f.condition == 'does_not_equal' && question.value == f.value)||
          (f.condition == 'greater_than' && question.value <= f.value)||
          (f.condition == 'less_than' && question.value >= f.value)
        ){
        bChoose = false
      }
      
    }) 

    return bChoose
  
  })

  return responses
}













