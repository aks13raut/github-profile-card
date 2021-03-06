class HttpJS{
    constructor(){}
    get(url){
        return new Promise(function(resolve,reject){
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.send();
        
            xhr.addEventListener('readystatechange',processRequest,false);
            xhr.onreadystatechange = processRequest;
        
            function processRequest(e){
                if(xhr.readyState == 4 && xhr.status != 404){
                    resolve(JSON.parse(xhr.responseText));
                }
                if(xhr.status == 404){
                    reject('404');
                }
            }
        })
    }
}
function compareStrings (string1, string2) {
        string1 = string1.toLowerCase();
        string2 = string2.toLowerCase();
    return string1 === string2;
}

if(document.getElementById('card') == null){console.log("please write script tag at the end of the body tag");}
let username = document.getElementById('card').getAttribute('username');
let repo = document.getElementById('card').getAttribute('repos');
let repos = repo.split(/\s*,\s*/);

let head  = document.getElementsByTagName('head')[0];
let link  = document.createElement('link');
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = 'https://saurabhdaware.github.io/github-profile-card/cardStyle.css';
link.media = 'all';
head.appendChild(link);

class Card{
    constructor(username,repos=[]){
        this.username = username;
        this.repos = repos;
    }
    create(){
        let http = new HttpJS();
        http.get('https://api.github.com/users/'+this.username).then((card)=>{
            document.getElementById('card').innerHTML = 
`
    <div class ='github-card-container'>
        <div class='github-card-header'>
            <img class='github-card-logo' src='https://magentys.io/wp-content/uploads/2017/04/github-logo-1.png'>
        </div>
        <div class='github-card-content'>
            <table class='github-card-image-text-wrap'>
                <td><img class='github-card-avatar' src='${card.avatar_url}' width=100></td>
                <td class='github-card-name'> 
                    ${card.name}<br>
                    <span style='color:#222;font-size:9pt;'>Followers: ${card.followers} | Following: ${card.following}</span><br>
                    <a target='_blank' class='github-card-button' href='${card.html_url}'>View profile</a>
                </td>
            </table>
        </div><br><br><br><br>
        <span id='github-card-repo-headline' style='font-size:9pt;color:#777font-weight:bold;margin:text-align:center'><center>Repositories</center></span>
        <div class='github-card-repos' id='github-card-repos'>
        </div>
    </div>
`;      }).then(()=>{
            if(this.repos.length == 0){
				console.log("No repostries found.please refer list beloow to correct any typos.");
				document.getElementById('github-card-repo-headline').style.display = 'none'
			}
            else{
                try{
					var reposNames = [];
                    http.get(`https://api.github.com/users/${this.username}/repos`).then((reposData)=>{
						for (var i=0; i < reposData.length; i++){
							reposNames[i] = reposData[i].name;
						}
						console.log("Your Repositories:-")
						for (var i=0; i < reposNames.length; i++){
							console.log(reposNames[i]);
						}
						for (var i=0;i < this.repos.length ; i++){
							for (var j=0; j < reposNames.length; j++){
								if (compareStrings(repos[i],reposNames[j])){
									var div = document.createElement('div');
									div.id = 'github-card-repo'+(i+1);
									div.innerHTML = "<a class='github-card-repo-headline' href="+reposData[j].html_url+"><b>"+reposData[j].name+"</b></a><br><span class='github-card-repo-desc'>"+reposData[j].description+"</span><br><span style='font-size:8pt;'>&#9733;"+reposData[j].language+"</span>";
									div.classList.add('github-card-repo');
									document.getElementById('github-card-repos').appendChild(div);
								}
							}
						}
                    }).catch((err)=>{
						var caler_line = err.stack
						console.log("Error02: "+err);
						document.getElementById('github-card-repo-headline').style.display = 'none'}
						);
                }
                catch{
					console.log("Error03");
					document.getElementById('github-card-repo-headline').style.display = 'none';
				}
			}
		}).catch((err)=>{console.log(err)});
	}
}

let card = new Card(username,repos);
card.create();