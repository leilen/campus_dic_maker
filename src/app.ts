import * as fs from 'fs';
import axios, { AxiosAdapter, AxiosResponse } from 'axios';
import { parse } from 'node-html-parser';


function readFile(filePath: string): Promise<string> {
    return new Promise(function (resolve, reject) {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
async function main(){
    let data : string;
    try{
        data = await readFile('./campus_list.txt');
    }catch(e){
        console.log(e)
        return;
    }
    const campusList = data.split('\n');

    let campusName = '가야대학교';
    let getData : AxiosResponse;
    try{
        getData = await axios.get(`https://ko.wikipedia.org/wiki/${encodeURI(campusName)}`);
    }catch(e){
        console.log(e);
        return;
    }
    const root = parse(getData.data) as any as HTMLElement;
    // console.log(root.querySelectorAll('#mw-content-text div.mw-parser-output p').length);

    let hantName = '';
    let enName = '';
    root.querySelectorAll('#mw-content-text div.mw-parser-output p').forEach((el,key) =>{
        // console.log(key,el.innerHTML)
        const nameReg = new RegExp(`<b>${campusName}</b>\\(.+\\)`)
        const matched = el.innerHTML.match(nameReg);
        if (matched){
            const originText = matched[0];
            hantName = originText.match(/(?<=\().+(?=\,)/)[0]
            enName = originText.match(/(?<=<span lang="en">).+(?=<\/span>)/)[0];
        }
    })
    console.log(campusName,hantName,enName)

}

main();