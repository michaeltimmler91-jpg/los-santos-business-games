const GAME_CONFIG = {
    actionEnergyCost:20,
    minPointsPerAction:5,
    maxPointsPerAction:20,
    maxEnergy:100
};

const DEFAULT_TEAMS = [
    {
        id:"red",
        name:"Red Dragons",
        color:"#ef4444",
        points:0,
        leader:null,
        members:[]
    },
    {
        id:"blue",
        name:"Blue Wolves",
        color:"#3b82f6",
        points:0,
        leader:null,
        members:[]
    },
    {
        id:"green",
        name:"Green Vipers",
        color:"#22c55e",
        points:0,
        leader:null,
        members:[]
    }
];
