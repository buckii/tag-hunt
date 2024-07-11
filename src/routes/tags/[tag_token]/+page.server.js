import { getTag } from "$lib/db/mysql";
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	if (params.tag_token) {
        let tag_decoded = atob(decodeURIComponent(params.tag_token));
        
        // check that the decoded value is just an integer
        if(!/^\d+$/.test(tag_decoded)) {
            error(401, 'Invalid tag.');
            return {};
        }
        let tag_number = parseInt(tag_decoded);
        let tag_data = await getTag(tag_number);
        let tag = tag_data?.tag;
        let total_tags_count = tag_data?.total_tags_count;
		return {
            tag,
            total_tags_count,
            tag_number,
		};
	}

    error(404, 'Tag not found.');
}
