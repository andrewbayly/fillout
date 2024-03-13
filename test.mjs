import {strict as assert} from 'assert'

/**
  test function.
**/
function test(name, fn){
  try{ 
    fn()
    console.log('✅', name)
  } catch (e) { 
    console.log('❌', name)
    console.log(e.stack)
  }  
}

async function main(){ 
  
  //baseURL - switch over when ready to go live!!!
  const baseURL = 'http://localhost:3001' //TEST
  //const baseURL = 'https://fillout-ftbl.onrender.com' //LIVE!
  
//when filter applied, return just one record: 

  var URL = '/cLZojxk94ous/filteredResponses?limit=5&offset=0' 
  
  var filters = [ 
   {
      id: "bE2Bo4cGUv49cjnqZ4UnkW",
      condition: "equals",
      value: "Johnny",
    } 
  ]
  
  var url = URL + '&' + 'filters=' + encodeURIComponent(JSON.stringify(filters))
  
  var response = await fetch(baseURL + url, {})
  var content = await response.json()
  
  test('when filter applied, return just one record', ()=>{
    assert.equal(
    [content.totalResponses, content.pageCount, content.responses.length].join('_'), 
    [1,1,1].join('_')
    )
  })

//with no filter, return to limit: 

  URL = '/cLZojxk94ous/filteredResponses?limit=5&offset=0'

  filters = []

  url = URL + '&' + 'filters=' + encodeURIComponent(JSON.stringify(filters))
  
  response = await fetch(baseURL + url, {})
  content = await response.json()
  
  test('with no filter, return to limit', ()=>{
    assert.equal(
    [content.totalResponses, content.pageCount, content.responses.length].join('_'), 
    [13,3,5].join('_')
    )
  })

//with filter, using less_than: 

  URL = '/cLZojxk94ous/filteredResponses?limit=150&offset=0'

  filters = [
    { 
      id: "fFnyxwWa3KV6nBdfBDCHEA",
      condition: "less_than",
      value: -4
    }
  ]

  url = URL + '&' + 'filters=' + encodeURIComponent(JSON.stringify(filters))
  
  response = await fetch(baseURL + url, {})
  content = await response.json()

  test('with filter, using less_than', ()=>{
    assert.equal(
    [content.totalResponses, content.pageCount, content.responses.length].join('_'), 
    [1,1,1].join('_')
    )
  })

//with filter, using equals

  URL = '/cLZojxk94ous/filteredResponses?limit=150&offset=0'

  filters = [
    { 
      id: "fFnyxwWa3KV6nBdfBDCHEA",
      condition: "equals",
      value: -5
    }
  ]

  url = URL + '&' + 'filters=' + encodeURIComponent(JSON.stringify(filters))
  
  response = await fetch(baseURL + url, {})
  content = await response.json()

  test('with filter, using equals', ()=>{
    assert.equal(
    [content.totalResponses, content.pageCount, content.responses.length].join('_'), 
    [1,1,1].join('_')
    )
  })


//with filter, using less_than and greater_than

  URL = '/cLZojxk94ous/filteredResponses?limit=150&offset=0'

  filters = [
    { 
      id: "fFnyxwWa3KV6nBdfBDCHEA",
      condition: "less_than",
      value: -4
    }, 
    { 
      id: "fFnyxwWa3KV6nBdfBDCHEA",
      condition: "greater_than",
      value: -6
    }    
  ]

  url = URL + '&' + 'filters=' + encodeURIComponent(JSON.stringify(filters))
  
  response = await fetch(baseURL + url, {})
  content = await response.json()

  test('with filter, using less_than and greater_than', ()=>{
    assert.equal(
    [content.totalResponses, content.pageCount, content.responses.length].join('_'), 
    [1,1,1].join('_')
    )
  })



    
}

main()


