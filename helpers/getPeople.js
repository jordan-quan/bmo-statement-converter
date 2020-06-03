const sql = require('mssql');

//returns a promise containing the list of people from the query
function getPeople(theQuery, codes){
    var queryString = getQuery(theQuery, codes);
    sql.close();
    var peopleList = sql.connect("").then(() => {
        return sql.query(queryString);
    }).then(result => {
        //extract list of people from query
        var people = result.recordset;
        sql.close();
        //return formatted query
        return people.map(({firstname, lastname, preferredname})=>{
            if(preferredname != null){
                preferredname = preferredname.trim();
            }
            return [firstname.trim(), lastname.trim(), preferredname];
       });
    }).catch(err => {
        console.log(err);
    })
    return peopleList;
}

//Creates the query string based on the audience given in the queryList parameter
function getQuery(queryList, codes){
    var final="";
    var nums = queryList.map(name => { 
        return codes[name] 
    });
    for(i in nums){ final += nums[i] +","}
    final = final.substring(0, final.length - 1);

    if(nums.includes(undefined)){
        console.log("Query Error");
    }

    var queryString = ``
    return queryString;
}

module.exports = getPeople;












 


 
