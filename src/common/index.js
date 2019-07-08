//格式化当前时间
export function format(t){
  t=t | 0;
  let m= t / 60 | 0;
  let s= t % 60;
  if(s.toString().length=1){
    s="0"+s;
  }
  return `${m}:${s}`;
}


//打乱播放顺序
function getRandomInt(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
}
export function ArrRandom(arr){
  for(let i=0;i<arr.length;i++){
    let j=getRandomInt(0,i);
    let t=arr[i];
    arr[i]=arr[j];
    arr[j]=t;
  }
  return arr;
}
