const $ = API("DataFlow");
const account = {
  user: "0354353735",
  pass: "1234qwer",
};

var body = "account=" + account.user + "&build_code=2020.4.15.2&cmnd=&device_id=00000000-0000-0000-0000-000000000000&device_name=duy&keyDeviceAcc=xxx&os_type=ios&os_version=13.600000&password=" + account.pass + "&version_app=4.3.4";

var apiloginmobile = {
  url: 'https://apivtp.vietteltelecom.vn:6768/myviettel.php/loginMobile',
  headers: {},
  body: body,
};

async function launch() {
  await loginmobile();
}
launch()

function loginmobile() {
  $.post(apiloginmobile, function (error, response, data) {
    if (error) {
      //console.log('error');
    } else {
      //console.log(data);
      if (response.status == 200) {
        let obj = JSON.parse(data);
        if (obj["errorCode"] === "0") {
          var token = obj["data"]["data"]["token"];
          getdataremain(token);
        }
        else {
          $.notify("Data Flow acount user/pass false‼️", "", "");
          //console.log(data);
        }
      }
    }
    $.done();
  });
}

function getdataremain(token) {
  var body = "build_code=2020.4.15.2&device_id=00000000-0000-0000-0000-000000000000&device_name=duy&os_type=ios&os_version=13.600000&token=" + token + "&version_app=4.3.4";
  var dataremain = {
    url: 'https://apivtp.vietteltelecom.vn:6768/myviettel.php/getDataRemain',
    headers: {},
    body: body,
  };
  $.post(dataremain, function (error, response, data) {
    if (error) {
      //console.log('error');
    } else {
      //console.log(data);
      if (response.status == 200) {
        let obj = JSON.parse(data);
        if (obj["errorCode"] === "0") {
          var data = obj["data"][0];
          $.notify("Data Flow: " + data["pack_name"], "", "Remain: " + data["remain"] + "( ~" + Math.round(data["remain_mb"] / 1024) + " GB)\nExpiredate: " + data["expireDate"]);
        }
        else {
          $.notify("Data Flow token expired‼️", "", "Try to login again in app My Viettel");
        }
      }
    }
    $.done();
  });
}

// prettier-ignore
/*********************************** API *************************************/
function ENV(){const e="undefined"!=typeof $task,t="undefined"!=typeof $loon,s="undefined"!=typeof $httpClient&&!this.isLoon,o="function"==typeof require&&"undefined"!=typeof $jsbox;return{isQX:e,isLoon:t,isSurge:s,isNode:"function"==typeof require&&!o,isJSBox:o}}function HTTP(e,t){const{isQX:s,isLoon:o,isSurge:i}=ENV();const n={};return["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"].forEach(r=>n[r.toLowerCase()]=(n=>(function(n,r={...t,...r}){(r="string"==typeof r?{url:r}:r).url=e?e+r.url:r.url;const h=r.timeout;let u=null;return u=s?$task.fetch({method:n,...r}):new Promise((e,t)=>{(i||o?$httpClient:require("request"))[n.toLowerCase()](r,(s,o,i)=>{s?t(s):e({statusCode:o.status||o.statusCode,headers:o.headers,body:i})})}),h?Promise.race([u,new Promise((e,t)=>{setTimeout(t,h,`${n} URL: ${r.url} exceeded timeout ${h} ms!`)})]):u})(r,n))),n}function API(e="untitled",t=!1){const{isQX:s,isLoon:o,isSurge:i,isNode:n,isJSBox:r}=ENV();return new class{constructor(e,t){this.name=e,this.debug=t,this.http=HTTP(),this.env=ENV(),this.node=(()=>{if(n){return{fs:require("fs")}}return null})(),this.initCache();Promise.prototype.delay=function(e){return this.then(function(t){return((e,t)=>new Promise(function(s){setTimeout(s.bind(null,t),e)}))(e,t)})}}initCache(){if(s&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(o||i)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),n){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache);s&&$prefs.setValueForKey(e,this.name),(o||i)&&$persistentStore.write(e,this.name),n&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},e=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},e=>console.log(e)))}write(e,t){this.log(`SET ${t}`),-1!==t.indexOf("#")?(t=t.substr(1),i&o&&$persistentStore.write(e,t),s&&$prefs.setValueForKey(e,t),n&&(this.root[t]=e)):this.cache[t]=e,this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:(e=e.substr(1),i&o?$persistentStore.read(e):s?$prefs.valueForKey(e):n?this.root[e]:void 0)}delete(e){this.log(`DELETE ${e}`),delete this.cache[e],-1!==e.indexOf("#")?(e=e.substr(1),i&o&&$persistentStore.write(null,e),s&&$prefs.setValueForKey(null,e),n&&delete this.root[e]):this.cache[e]=data,this.persistCache()}notify(e,t="",h="",u={}){const c=u["open-url"],l=u["media-url"],a=h+(c?`\n点击跳转: ${c}`:"")+(l?`\n多媒体: ${l}`:"");if(s&&$notify(e,t,h,u),i&&$notification.post(e,t,a),o&&$notification.post(e,t,h,c),n)if(r){require("push").schedule({title:e,body:(t?t+"\n":"")+a})}else console.log(`${e}\n${t}\n${a}\n\n`)}log(e){this.debug&&console.log(e)}info(e){console.log(e)}error(e){console.log("ERROR: "+e)}wait(e){return new Promise(t=>setTimeout(t,e))}done(e={}){s||o||i?$done(e):n&&!r&&"undefined"!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.body=e.body)}}(e,t)}
/*****************************************************************************/