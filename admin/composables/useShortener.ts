export default function (link: string) {
    if (link) {
        const length = link.length;
        let first = link.slice(0, 5);
        let last = link.slice(length - 5, length);
        return first + '*****' + last;
    }
    return link;
}
