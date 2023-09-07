export const timeIsPassed = (time: number): boolean => {
  const nowTime: number = Math.floor(Date.now()/1000); // convert to unix timestamp
  return nowTime > time ? true : false;
}