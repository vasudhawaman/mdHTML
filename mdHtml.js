const fs = require('fs');
const path =require('path');
function mdHTML (userinput){
let document =[];

function Image(str,i){
     str = str.slice(1);
     str =str.split('[');
     let initial = str[0];
     str = str[1].split(']');
     let alt =str[0];
     str = str[1].split('(');
        str =str[1].split(')');
        let href = str[0];
        let final =str[1];
        arr[i] = initial +`<img src="${href}" alt="${alt}" />`+ final +`\n`;
     
}
function Link(str,i){
    str =str.split('[');
    let initial = str[0];
    str = str[1].split(']');
    let alt =str[0];
    str = str[1].split('(');
    if(str[1].indexOf('"') !== -1){
        str =str[1].split(' ');
        let href = str[0];
        str =str[1].split(')');
        let title =str[0];
        let final = str[1];
        arr[i]  = initial +`<a href="${href}" title=${title}>${alt}</a>`+ final + `\n`;
                
     }else{
        str =str[1].split(')');
        let href = str[0];
        let final =str[1];
        arr[i] = initial +`<a href="${href}">${alt}</a>`+ final +`\n`;
     }
}
function Font(str,i){
    str = str.split('*');
  if (str.length ===5) arr[i] =`${str[0]}` +`<b>${str[2]}</b>` +`${str[4]}`;
  else if(str.length ===3)  arr[i] =`${str[0]}` +`<i>${str[1]}</i>` +`${str[2]}`;
}

function Heading(str, i){
    let n =0;
  for( let j=0;j<6;j++){
    if( str.charAt(j) ==='#') n++;
  }
  str = str.slice(n,str.length); // works
  if(str.charAt(n) ===' ') document.push(`<h${n}>${str}</h${n}>\n`);

  
}
function Blockquote(str,i){
 
  if(str.charAt(1) !== '>'){
      
      //check for further nested blockquotes 
      let k=i;
      let t=1;
      let end;
      while(k++){
        if( arr[k].charAt(t) !== '>') {
          end =t;
          break
        };
        t++;
      }
     console.log(end);
      
      let string ="";
      let j;
       for(  j=1; j<=end ; j++){
         let s =arr[i-1+j].split('>');
         
        //  console.log(k);
          let v = s[j];
          console.log(s);
          let s1=`<blockquote>`;
          let s2 =`</blockquote>`;
          let t1 ="",t2 ="";
             for( k=j-1; k>=0;k--){
                 t1 +=s1;
                 t2 +=s2;
             }
        
          string += t1 +v + t2;
         
       }
      
      arr[i] = `${string}`;
      for( let t=1;t<end;t++){
          arr[i+t] ='';
      }
  }
  

}

// Use fs.readFile() method to read the file
const data = fs.readFileSync( './sample.md', 'utf8');

let arr = data.split("\n");
arr.push('');
let pbreak =[];
let l= arr.length;
arr.forEach((element ,i)=>{
   if(element.indexOf('>') !== -1) Blockquote(element,i);
    else if(element.indexOf('#') !== -1) Heading(element );
    
    else if(element.indexOf('[') !== -1) {

      if(element.indexOf('!') !== -1) Image(element,i);
      else Link(element,i);
  }
  else if(element.indexOf('*') !== -1) Font(element,i);
  
  else if (element.length ===0 || element === '\r') pbreak.push(i); // finding out paragraph and line breaks 
});
 
    
   
// finding out if list or paragraph 
pbreak.forEach((pb,i)=>{
  
      if( i< pbreak.length -1){
        let str ="";
        let lbr="";
        let li ="";
        if((pbreak[i+1] -pb) >2){
             for( let j= pb+2; j<pbreak[i+1] ; j++){
                  if(arr[j].charAt(0) !== '-'){
                    lbr +=`<br>${arr[j]}\n`;
                  }
                  else{
                     li +=`<li>${arr[j].slice(1)}</li> \n`;
                  }    
             }
             if( lbr.length !==0)document.push(`<p>${arr[pb+1]}${lbr}</p>\n`);
             else{
                if(arr[pb+1].charAt(0) ==='-')  document.push(`<ul><li>${arr[pb+1].slice(1)}</li>${li}</ul>`);
                else document.push(`<p>${arr[pb+1]}<ul>${li}</ul></p>\n`);
             }
        }else{
            if(arr[pb+1].charAt(0) !=='-')document.push(`<p>${arr[pb+1]}</p>\n`);
            else document.push(`<p><ul><li>${arr[pb+1]}</li></ul></p>\n`)
        }
      }
    
})
console.log(arr);
console.log(document);

 let body ="";
 document.forEach((doc)=>{
        body += doc;
 });

 let html =`<!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Document</title>
 </head>
 <body>
     ${body}
 </body>
 </html>`;
 fs.writeFileSync( path.join(__dirname,'../new.html'),html);

}
module.exports =mdHTML;