// Simple 4-level hierarchy
const simpleHierarchy = {
    id: "root",
    name:"Root Level",
    children: [
        {
            id: "group_1",
            name:"First Group",
            children: [
                {
                    id: "subg_1",
                    name:"First Subgroup",
                    children: [
                        {
                            id: "leaf_1",
                            name:"First Leaf",
                            values: [5,2]
                        },
                        {
                            id: "leaf_2",
                            name:"Second Leaf",
                            values: [1,7]
                        },
                        {
                            id: "leaf_3",
                            name:"Third Leaf",
                            values: [4,4]
                        }
                    ]
                },
                {
                    id: "subg_2",
                    name:"Second Subgroup",
                    children: [
                        {
                            id: "leaf_4",
                            name:"Fourth Leaf",
                            values: [9,3]
                        },
                        {
                            id: "leaf_5",
                            name:"Fifth Leaf",
                            values: [7,6]
                        }
                    ]
                }
            ]
        },
        {
            id: "group_2",
            name:"Second Group",
            children: [
                {
                    id: "subg_4",
                    name:"Fourth Subgroup",
                    children: [
                        {
                            id: "subsubg_1",
                            name:"First Sub-Subgroup",
                            children: [
                                {
                                    id: "leaf_13",
                                    name:"Thirteeth Leaf",
                                    values: [6,5]
                                }
                            ]
                        }
                    ]
                },
                {
                    id: "subg_3",
                    name:"Third Subgroup",
                    children: [
                        {
                            id: "leaf_6",
                            name:"Sixth Leaf",
                            values: [8,3]
                        },
                        {
                            id: "leaf_7",
                            name:"Seventh Leaf",
                            values: [1,3]
                        },
                        {
                            id: "leaf_8",
                            name:"Eighth Leaf",
                            values: [7,4]
                        },
                        {
                            id: "leaf_9",
                            name:"Ninth Leaf",
                            values: [4,9]
                        },
                        {
                            id: "leaf_10",
                            name:"Tenth Leaf",
                            values: [1,1]
                        },
                        {
                            id: "leaf_11",
                            name:"Eleventh Leaf",
                            values: [6,1]
                        },
                        {
                            id: "leaf_12",
                            name:"Twelvth Leaf",
                            values: [1,5]
                        }
                    ]
                },
                {
                    id: "leaf_14",
                    name:"Fourteenth Leaf",
                    values: [4,1]
                }
            ]
        },
        {
            id: "leaf_15",
            name:"Fifteenth Leaf",
            values: [8,8]
        },
        {
            id: "leaf_16",
            name:"Sixteenth Leaf",
            values: [3,9]
        }
    ]
};

// Simple tabular with references (can be stratified)
const refTable = `Id,Name,Context,Value1,Value2
root,Root,,,,
group_1,First Group,root,,,
group_2,Second Group,root,,,
subg_1,First Subgroup,group_1,,,
subg_2,Second Subgroup,group_1,,,
subg_3,Third Subgroup,group_2,,,
subg_4,Fourth Subgroup,group_2,,,
subsubg_1,First Sub-Subroup,subg_4,,,
leaf_1,First Leaf,subg_1,5,2
leaf_2,Second Leaf,subg_1,1,7
leaf_3,Third Leaf,subg_1,4,4
leaf_4,Fourth Leaf,subg_2,9,3
leaf_5,Fifth Leaf,subg_2,7,6
leaf_6,Sixth Leaf,subg_3,8,3
leaf_7,Seventh Leaf,subg_3,1,3
leaf_8,Eighth Leaf,subg_3,7,4
leaf_9,Ninth Leaf,subg_3,4,9
leaf_10,Tenth Leaf,subg_3,1,1
leaf_11,Eleventh Leaf,subg_3,6,1
leaf_12,Twelvth Leaf,subg_3,1,5
leaf_13,Thirteenth Leaf,subsubg_1,6,5
leaf_14,Fourteenth Leaf,group_2,4,1
leaf_15,Fifteenth Leaf,root,8,8
leaf_16,Sixteenth Leaf,root,3,9`;