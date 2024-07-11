export function fillTag(tag) {
    if(Array.isArray(tag)) {
        tag.forEach((one_tag) => {
            one_tag.url = '/tag/' + btoa(one_tag.id);
            return one_tag
        })
    } else {
        tag.url = '/tag/' + btoa(tag.id);
    }
    return tag;
}