let request = require("request");
let cheerio = require("cheerio");
let fs=require("fs");
let path=require("path"); 
let result="";
request("https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results", cb);
function cb(err, response, html){
    if(err){
        console.log(err);
    }else{
        extractData(html);
    }
}
function extractData(html){
    let selTool = cheerio.load(html);
    let anchor=selTool(".match-info.match-info-FIXTURES")
    let anchors=selTool("a[data-hover='Scorecard']")
    for(let i=0;i<anchor.length;i++){
        let link=selTool(anchors[i]).attr("href");
        let fullLink="https://www.espncricinfo.com"+link;
        result=selTool()
        batsmanName(fullLink);
    }
}
function dirCreator(name){
    let folderPath=path.join(__dirname, name);
    if(fs.existsSync(folderPath)==false){
        fs.mkdirSync(folderPath);
    }
}
function batsmanName(fullLink){
    request(fullLink,cb);
    function cb(error,response,html) {
        if(error){
            console.log(error);
        }else{
            extractplayer(html);
        }
    }
}
function extractplayer(html,teamName){
    let selTool = cheerio.load(html);
    let batsmanElem=selTool(".table.batsman");
    let teamNameElem=selTool(".Collapsible h5.header-title.label");
    let teamArr=[];
    for(let i=0;i<teamNameElem.length;i++){
        let teamName=selTool(teamNameElem[i]).text();
        teamName=teamName.split("INNINGS")[0];
        dirCreator(teamName);
        teamArr.push(teamName);
    }
    for(let i=0;i<batsmanElem.length;i++){
        let batsmanNameElem=selTool(batsmanElem[i]).find("tbody tr .batsman-cell");
        for(let j=0;j<batsmanNameElem.length;j++)
        {
            let name = selTool(batsmanNameElem[j]).text();
            let pathOfFile = path.join(__dirname, path.join(teamArr[i],name+".json"));
            if(fs.existsSync(pathOfFile) == false)
            {
                fs.openSync(pathOfFile,"w");
            }
        }
    }
    
}
