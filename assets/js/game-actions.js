const GLOBAL_ACTION_COOLDOWN_SECONDS = 1200;

const GAME_ACTIONS = [
    {
        id:"taxi_drive",
        companyTypes:["firma"],
        shortNames:["Taxi"],
        title:"Fahrt abgeschlossen",
        pointsMin:5,
        pointsMax:15,
        energyCost:15,
        cooldown:GLOBAL_ACTION_COOLDOWN_SECONDS
    },
    {
        id:"taxi_delivery",
        companyTypes:["firma"],
        shortNames:["Taxi"],
        title:"Lieferung abgeschlossen",
        pointsMin:10,
        pointsMax:25,
        energyCost:25,
        cooldown:GLOBAL_ACTION_COOLDOWN_SECONDS
    },
    {
        id:"md_patient",
        companyTypes:["behoerde"],
        shortNames:["MD", "LSMD"],
        title:"Patient behandelt",
        pointsMin:8,
        pointsMax:18,
        energyCost:20,
        cooldown:GLOBAL_ACTION_COOLDOWN_SECONDS
    },
    {
        id:"pd_patrol",
        companyTypes:["behoerde"],
        shortNames:["PD", "LSPD"],
        title:"Streife beendet",
        pointsMin:6,
        pointsMax:14,
        energyCost:15,
        cooldown:GLOBAL_ACTION_COOLDOWN_SECONDS
    },
    {
        id:"workshop_repair",
        companyTypes:["werkstatt"],
        shortNames:["Werkstatt", "Bennys", "Benny's"],
        title:"Fahrzeug repariert",
        pointsMin:7,
        pointsMax:20,
        energyCost:20,
        cooldown:GLOBAL_ACTION_COOLDOWN_SECONDS
    },
    {
        id:"restaurant_order",
        companyTypes:["restaurant"],
        shortNames:["Burger Shot", "Hookies", "Pearls"],
        title:"Bestellung abgeschlossen",
        pointsMin:6,
        pointsMax:16,
        energyCost:15,
        cooldown:GLOBAL_ACTION_COOLDOWN_SECONDS
    }
];

function getActionsForCompany(company){

    if(!company){
        return [];
    }

    return GAME_ACTIONS.filter(action => {

        const typeMatch =
            action.companyTypes.includes(company.type);

        const shortNameMatch =
            action.shortNames.includes(company.short_name);

        return typeMatch || shortNameMatch;
    });
}