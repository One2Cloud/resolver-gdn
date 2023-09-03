export const timeIsPassed = (time: number): boolean => {
  const nowTime: number = Math.floor(Date.now()/1000); // convert to unix timestamp
  // console.log("nowTime: " + nowTime)
  return nowTime > time ? true : false;
}