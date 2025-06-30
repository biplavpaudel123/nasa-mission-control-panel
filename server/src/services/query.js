const DEFAULT_PAGE_VALUE=0;
const DEFAULT_LIMIT_VALUE=0; 

function getPagination(query) {
    const limit = Math.abs(query.limit) || DEFAULT_LIMIT_VALUE;
    const page = Math.abs(query.page) || DEFAULT_PAGE_VALUE;
    skip = (page-1)*limit;
    return {
        skip,limit
    }
};

module.exports={
    getPagination,
}