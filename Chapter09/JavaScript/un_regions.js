function makeRoot(items, nesting) {
    const object = {
        key: 'World',
        values: items
    };
    return makeSubtree(object, nesting);
}

/**
 *
 * @param item
 * @param nesting If true, preserves cluster nesting (all leaves at same level)
 * @returns {{id: *, data: {population: number, area: number}}}
 */
function makeSubtree(item, nesting) {
    let object = {
        id: item.key,
        data: {population: 0, area: 0},
    };
    if (item.values) {
        if (nesting) {
            if (item.values.length == 1) { // remove unnecessary nesting
                object = makeSubtree(item.values[0], nesting);
            } else {
                object.children = [];
                item.values.forEach(function (value) {
                    const subtree = makeSubtree(value, nesting);
                    object.children.push(subtree);
                    object.data.population += subtree.data.population;
                    object.data.area += subtree.data.area;
                });
            }
        } else {
            object.children = [];
            item.values.forEach(function (value) {
                const subtree = makeSubtree(value, nesting);
                object.children.push(subtree);
                object.data.population += subtree.data.population;
                object.data.area += subtree.data.area;
            });
        }
    } else if(item.value) {
        object.data = item.value[0];
    }
    return object;
}