export default function (link: string, lengthVal: number = 5) {
  if (link) {
    const length = link.length;
    let first = link.slice(0, lengthVal);
    let last = link.slice(length - lengthVal, length);
    return first + "*****" + last;
  }
  return link;
}
