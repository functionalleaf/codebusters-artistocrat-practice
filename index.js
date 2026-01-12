const englishFreq={
'E':12.51,'T':9.25,'A':8.04,'O':7.60,'I':7.26,'N':7.09,'S':6.54,'R':6.12,
'H':5.49,'L':4.14,'D':3.99,'C':3.06,'M':2.53,'F':2.30,'P':2.00,'G':1.96,
'W':1.92,'Y':1.73,'B':1.54,'V':0.99,'K':0.67,'X':0.19,'J':0.16,'Q':0.11,
'Z':0.09,'U':2.71
}

const spanishFreq={
'E':14.08,'A':12.16,'O':9.20,'S':7.20,'N':6.83,'R':6.41,'I':5.98,'L':5.24,
'U':4.69,'D':4.67,'T':4.60,'C':3.87,'M':3.08,'P':2.89,'B':1.49,'H':1.18,
'Q':1.11,'V':1.05,'G':1.00,'Y':1.09,'F':0.69,'J':0.52,'Z':0.47,'Ñ':0.17,
'X':0.14,'K':0.11,'W':0.04
}

let substitutions={},answerMap={},quotes=[],lastQuote=''

for(let i=65;i<=90;i++)substitutions[String.fromCharCode(i)]=''
substitutions['Ñ']=''

fetch('quotes.tsv').then(r=>r.text()).then(t=>{
const lines=t.trim().split('\n')
const h=lines.shift().split('\t')
const qi=h.indexOf('Quote Text')
lines.forEach(l=>{
const c=l.split('\t')
if(c[qi])quotes.push(c[qi])
})
})

const ri=document.getElementById('replacementInputs')
for(let i=65;i<=90;i++){
const l=String.fromCharCode(i)
ri.innerHTML+=`<div><label>${l}</label><input class="replacement-input" maxlength="1" data-letter="${l}"></div>`
}
ri.innerHTML+=`<div><label>Ñ</label><input class="replacement-input" maxlength="1" data-letter="Ñ"></div>`

document.querySelectorAll('.replacement-input').forEach(i=>{
i.addEventListener('input',e=>{
substitutions[e.target.dataset.letter]=e.target.value.toUpperCase()
updateMessage()
})
})

function calculateFrequency(text){
const f={}
text=text.toUpperCase().replace(/[^A-ZÑ]/g,'')
for(let i=65;i<=90;i++)f[String.fromCharCode(i)]=0
f['Ñ']=0
for(const c of text)f[c]++
let h='<table><tr><th>Letter</th><th>%</th></tr>'
for(const k in f){
h+=`<tr><td>${k}</td><td>${text.length?((f[k]/text.length)*100).toFixed(2):0}</td></tr>`
}
return h+'</table>'
}

function updateMessage(markWrong=false){
const text=document.getElementById('ciphertext').value
let out=''
for(let i=0;i<text.length;i++){
const c=text[i],u=c.toUpperCase()
if(substitutions[u]){
let cls='blue'
if(markWrong && lastQuote){
const p=lastQuote[i]?.toUpperCase()
if(p){
if(substitutions[u]===p)cls='green'
else cls='red'
}
}
out+=`<span class="${cls}">${substitutions[u]}</span>`
}else out+=c
}
document.getElementById('decodedMessage').innerHTML=out
document.getElementById('freqAnalysis').innerHTML=calculateFrequency(text)
}

function randomSubstitution(){
const a='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const b=[...a].sort(()=>Math.random()-0.5)
const m={}
a.forEach((l,i)=>m[l]=b[i])
return m
}

function generateCipher(){
if(!quotes.length)return
lastQuote=quotes[Math.floor(Math.random()*quotes.length)].toUpperCase()
answerMap=randomSubstitution()
let c=''
for(const ch of lastQuote)c+=/[A-Z]/.test(ch)?answerMap[ch]:ch
document.getElementById('ciphertext').value=c
for(const k in substitutions)substitutions[k]=''
document.querySelectorAll('.replacement-input').forEach(i=>i.value='')
updateMessage()
}

function checkAnswer(){updateMessage(true)}

function showAnswer(){
for(const k in answerMap){
substitutions[answerMap[k]]=k
const i=document.querySelector(`[data-letter="${answerMap[k]}"]`)
if(i)i.value=k
}
updateMessage()
}

const fc=document.getElementById('freqComparison')
for(let i=65;i<=90;i++){
const l=String.fromCharCode(i)
fc.innerHTML+=`<tr><td>${l}</td><td>${englishFreq[l]||'-'}</td><td>${spanishFreq[l]||'-'}</td></tr>`
}
fc.innerHTML+=`<tr><td>Ñ</td><td>-</td><td>${spanishFreq['Ñ']}</td></tr>`

document.getElementById('ciphertext').addEventListener('input',()=>updateMessage())
